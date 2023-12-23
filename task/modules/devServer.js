import browserSync from 'browser-sync';
import TaskAbstract from './abstract.js';

/**
 * 出力ディレクトリに削除して再作成
 */
export default class TaskServer extends TaskAbstract {
  // タスク名
  static taskName = 'devServer';

  // サーバー
  server = null;

  /**
   * ビルド
   */
  build() {
    this.server = browserSync.create();
    this.server.init(Object.assign({
      server: this.outputBaseDir
    }, this.config));
  };

  /**
   * ファイル監視
   */
  watch() {
    this.build();
  }
}
