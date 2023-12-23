import imageminWebp from 'imagemin-webp';
import TaskImage from './image.js';

/**
 * 画像ファイルを圧縮してwebpにしてコピー
 */
export default class TaskWebp extends TaskImage {
  // タスク名
  static taskName = 'webp';

  // imageminプラグイン
  static plugins = [imageminWebp()];

  /**
   * ベースディクレトリ名を出力先に変換
   */
  getOutputPath(file) {
    const outputPath = super.getOutputPath(file).replace(/\.\w+?$/, '.webp');
    return outputPath;
  }
}
