import path from 'node:path';
import fsPromises from 'node:fs/promises';
import { glob } from 'glob';
import * as sass from 'sass';
import chokidar from 'chokidar';
import TaskAbstract from './abstract.js';

/**
 * その他ファイルを出力ディレクトリにコピー
 */
export default class TaskSass extends TaskAbstract {
  // タスク名
  static taskName = 'sass';

  /**
   * ベースディクレトリ名を出力先に変換
   */
  getOutputPath(file) {
    const outputPath = super.getOutputPath(file).replace(/\.\w+?$/, '.css');
    return outputPath;
  }

  /**
   * ベースディクレトリ名を出力先に変換
   */
  getSourceMapPath(file) {
    const outputPath = this.getOutputPath(file) + '.map';
    return outputPath;
  }

  /**
   * ファイル追加
   */
  async process(file) {
    // ベースのディクレトリ名を出力先に変換
    const outputPath = this.getOutputPath(file);

    const promise = new Promise(async (resolveAll, rejectAll) => {
      // コンパイル
      sass
        .compileAsync(file, Object.assign({
          'noStopOnError': true
        }, this.config))
        .then(async (result) => {
          const promises = [];

          // mapファイル作成
          if (result.sourceMap) {
            const sourceMapPath = this.getSourceMapPath(file);
            const sourceMapFileName = path.basename(sourceMapPath);

            result.sourceMap.sources = result.sourceMap.sources.map(path => path.replace('file://' + this.inputBaseDir, ''));

            promises.push(this.writeFile(sourceMapPath, JSON.stringify(result.sourceMap), {
              encoding: 'utf8',
              mode: 0o777
            }));

            result.css += `\n/*# sourceMappingURL=${sourceMapFileName} */`;
          }

          // CSSファイル作成
          promises.push(this.writeFile(outputPath, result.css, {
            encoding: 'utf8',
            mode: 0o777
          }));

          // Promiseまとめ
          const allPromise = Promise.allSettled(promises);
          allPromise
            .finally(() => {
              this.message(`${this.taskName}:process `, file);
              resolveAll();
            })
          ;
        })
        .catch((err) => {
          // Sassのコンパイルエラー時、メッセージを出しつつwatchは継続する
          console.error('');
          this.errorMessage(`An Error Occured on Sass: ${file}`);
          console.error(err.message);
          console.error('');
          return err;
        })
      ;
    });
    return promise;
  }

  /**
   * ファイル削除
   */
  async unlink(file) {
    const cssPromise = super.unlink(file);
    const sourceMapPromise = new Promise((resolve, reject) => {
      const sourceMapPath = this.getSourceMapPath(file);
      fsPromises.stat(sourceMapPath)
        .then(() => {
          fsPromises.unlink(sourceMapPath)
            .then(resolve)
            .catch(reject)
          ;
        })
        .catch(resolve)
      ;
    });
    return Promise.allSettled([cssPromise, sourceMapPromise]);
  }

  /**
   * ビルド
   */
  async build() {
    return new Promise(async (resolve, reject) => {
      this.message(`Started ${this.taskName}:build`);

      // globで対象ファイル取得
      const promise = glob(this.getInputGlobs(), {
        ignore: this.getConfig('ignores'),
        nodir: true,
        dot: true
      });

      // 非同期でファイルコピー
      promise
        .then(async (files) => {
          const promises = Promise.allSettled(files.map(this.process.bind(this)));
          promises.finally(() => {
            this.message(`Finished ${this.taskName}:build`);
            resolve();
          });
        })
      ;
    });
  };

  /**
   * ファイル監視
   */
  watch() {
    this.message(`${this.taskName}:watch`);

    chokidar
      .watch(this.getInputGlobs(), {
        ignored: this.getConfig('ignores'),
        ignoreInitial: true
      })
      .on('add', this.process.bind(this))
      .on('change', this.process.bind(this))
      .on('unlink', this.unlink.bind(this))
    ;
  }
}
