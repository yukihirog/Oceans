import imagemin from 'imagemin-keep-folder';
import chokidar from 'chokidar';
import TaskAbstract from './abstract.js';

/**
 * 画像ファイルを圧縮してコピー
 */
export default class TaskImage extends TaskAbstract {
  // タスク名
  static taskName = 'image';

  // imageminプラグイン
  static plugins = [];

  /**
   * ファイル追加
   */
  async process(file) {
    // ベースのディクレトリ名を出力先に変換
    const src = [file];
    return imagemin(
      src,
      {
        replaceOutputDir: this.getOutputPath.bind(this),
        use: this.constructor.plugins
      }
    ).then(files => {
      this.message(`${this.taskName}:process `, file);
    });
  }

  /**
   * ビルド
   */
  async build() {
    this.message(`Started ${this.taskName}:build`);

    const src = this.getInputGlobs();
    const ignores = (this.getConfig('ignores') || []).map(str => '!' + str);
    return imagemin(
      src.concat(ignores),
      {
        replaceOutputDir: this.getOutputPath.bind(this),
        use: this.constructor.plugins
      }
    ).then(files => {
      files.forEach(file => {
        this.message(`${this.taskName}:process `, file.path);
      });
      this.message(`Finished ${this.taskName}:build`);
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
