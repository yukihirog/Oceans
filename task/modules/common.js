import { glob } from 'glob';
import chokidar from 'chokidar';
import TaskAbstract from './abstract.js';

/**
 * その他ファイルを出力ディレクトリにコピー
 */
export default class TaskCommon extends TaskAbstract {
  // タスク名
  static taskName = 'common';

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
