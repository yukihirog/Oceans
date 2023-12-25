import path from 'node:path';
import fs from 'node:fs';
import jsonc from 'jsonc-parser';
import { glob } from 'glob';
import * as ejs from 'ejs';
import chokidar from 'chokidar';
import { minimatch } from 'minimatch';
import TaskAbstract from './abstract.js';

/**
 * その他ファイルを出力ディレクトリにコピー
 */
export default class TaskEjs extends TaskAbstract {
  // タスク名
  static taskName = 'ejs';

  // データ
  data = null;

  // データファイルの場所
  get dataPath() {
    const dataFile = this.getConfig('data');
    return dataFile ? path.resolve(this.inputBaseDir, dataFile.replace(/^\//, '')) : '';
  }

  // パーツ等の格納ディレクトリ
  get viewDirs() {
    let viewDirs = this.getConfig('views');
    if (typeof viewDirs === 'string') {
      viewDirs = [viewDirs];
    }
    return viewDirs.map(dir => path.resolve(this.inputBaseDir, dir.replace(/^\//, '')));
  }

  /**
   * ベースディクレトリ名を出力先に変換
   */
  getOutputPath(file) {
    const outputPath = super.getOutputPath(file).replace(/\.\w+?$/, '.html');
    return outputPath;
  }

  /**
   * ファイル追加
   */
  async process(file) {
    // ベースのディクレトリ名を出力先に変換
    const outputPath = this.getOutputPath(file);

    // 埋め込み用の変数読み込み
    const dataFile = this.dataPath;
    const data = Object.assign(
      {
        random: Date.now(),
        title: '',
        path: outputPath.replace(this.outputBaseDir, '').replace(/index\.html$/, ''),
      },
      this.data = this.data || dataFile ? jsonc.parse(fs.readFileSync(dataFile, { encoding: 'utf8' })) : {}
    );
    const options = {
      filename: file,
      root: this.inputBaseDir,
      views: [this.inputBaseDir + '/', ...this.viewDirs]
    };

    // レンダリングして書き出し
    const promise = new Promise(async (resolve, reject) => {
      ejs.renderFile(file, data, options, async (err, str) => {
        if (err) {
          reject(err);
        } else {
          this.writeFile(outputPath, str)
            .then(() => {
              this.message(`${this.taskName}:process `, file);
              resolve();
            })
            .catch(reject)
          ;
        }
      });
    });
    return promise;
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

    // ページファイル
    const pageFiles = this.getInputGlobs();

    // パーツやデータ
    const partsFiles = [...(this.viewDirs.map(dir => path.resolve(dir, '**/*.ejs'))), this.dataPath];

    // ページファイル判定
    const _isPage = (file) => {
      // 除外ファイル判定
      const isIgnored = this.getConfig('ignores').some((ignorePattern) => {
        return minimatch(file, ignorePattern);
      });

      // ページファイル判定
      return !isIgnored && pageFiles.some((globPattern) => {
        return minimatch(file, globPattern);
      });
    };

    // add,changeの処理は、ページの場合は個別書き出し、パーツやデータの場合は全体ビルド
    const _onChange = (file) => {
      if (_isPage(file)) {
        this.process(file);
      } else {
        this.build();
      }
    };

    // unlinkの処理は、ページの場合のみ
    const _onUnlink = (file) => {
      if (_isPage(file)) {
        this.unlink(file);
      }
    };

    // watch
    chokidar
      .watch(pageFiles.concat(partsFiles), {
        ignoreInitial: true
      })
      .on('add', _onChange)
      .on('change', _onChange)
      .on('unlink', _onUnlink)
    ;
  }
}
