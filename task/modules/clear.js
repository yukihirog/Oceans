import fs from 'node:fs';
import TaskAbstract from './abstract.js';

/**
 * 出力ディレクトリに削除して再作成
 */
export default class TaskClear extends TaskAbstract {
  // タスク名
  static taskName = 'clear';

  /**
   * ビルド
   */
  async build() {
    return new Promise((resolve, reject) => {
      this.message(`Started ${this.taskName}`);

      const outputDir = this.outputBaseDir;
      fs.rmSync(outputDir, { recursive: true, force: true });
      fs.mkdirSync(outputDir, { recursive: true });
      fs.chmodSync(outputDir, 0o777);
  
      this.message(`Finished ${this.taskName}`);
      resolve();
    });
  }

  /**
   * ファイル監視
   */
  async watch() {
    await this.build();
  }
}
