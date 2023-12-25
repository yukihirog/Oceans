import fs from 'node:fs';
import fsPromises from 'node:fs/promises';
import path from 'node:path';

/**
 * その他ファイルを出力ディレクトリにコピー
 */
export default class TaskAbstract {
  // タスク名
  static taskName = '';

  // 入力対象ディレクトリの末尾を落としておく
  inputBaseDir = '';
  // 出力先
  outputBaseDir = '';
  // 設定
  config = {};

  constructor(config) {
    this.initConfig(config);
  }

  // タスク名
  get taskName() {
    return this.constructor.taskName;
  }

  /**
   * 設定
   */
  initConfig(config) {
    // 入力対象ディレクトリの末尾を落としておく
    this.inputBaseDir = config.path.input.replace(/\/$/, '');

    // 出力先
    this.outputBaseDir = config.path.output;

    // コンフィグファイル
    this.config = config.task[this.taskName] || {};
  }

  /**
   * 設定取得
   */
  getConfig(prop) {
    return this.config[prop];
  }

  /**
   * 設定取得
   */
  getInputGlobs() {
    let globs = this.getConfig('glob');
    if (typeof globs === 'string') {
      globs = [globs];
    }
    return globs.map(glob => path.resolve(this.inputBaseDir, glob.replace(/^\//, '')));
  }

  /**
   * 色付きでメッセージ出力
   */
  message(string, after) {
    if (!this.getConfig('isSilent')) {
      console.log('[' + (new Date).toLocaleTimeString() + '] ' + '\x1b[35m' + string + '\x1b[39m' + (after || ''));
    }
  }

  /**
   * 色付きでメッセージ出力
   */
  errorMessage(string, after) {
    console.error('\x1b[31m' + string + '\x1b[39m' + (after || ''));
  }

  /**
   * ベースディクレトリ名を出力先に変換
   */
  getOutputPath(file) {
    const outputDir      = path.dirname(file).replace(this.inputBaseDir, this.outputBaseDir);
    const outputFilename = path.basename(file);
    const outputPath     = path.resolve(outputDir, outputFilename);
    return outputPath;
  }

  /**
   * ファイル書き込み（ディレクトリを強制作成）
   */
  async writeFile(file, data, options) {
    const dir = path.dirname(file);

    return new Promise((resolve, reject) => {
      function _writeFile() {
        return fsPromises.writeFile(file, data, options)
          .then(resolve)
          .catch(reject)
        ;
      };

      fsPromises.stat(dir)
        .then(_writeFile)
        .catch(() => {
          return fsPromises.mkdir(dir, { recursive: true })
            .then(_writeFile)
            .catch(reject)
          ;
        })
      ;
    });
  }

  /**
   * ファイル追加
   */
  async process(file) {
    // ベースのディクレトリ名を出力先に変換
    const outputPath = this.getOutputPath(file);

    // ファイルコピー
    const promise = new Promise(async (resolve, reject) => {
      fs.cp(file, outputPath, { recursive: true }, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve(file);
        }
      });
    });
    promise.then(() => {
      this.message(`${this.taskName}:process `, file);
      return promise;
    });
    return promise;
  }

  /**
   * ファイル削除
   */
  async unlink(file) {
    // ベースのディクレトリ名を出力先に変換
    const outputPath = this.getOutputPath(file);

    // rmの時のオプション
    const rmOptions = { force: true, recursive: true };

    const promise = new Promise(async (resolve, reject) => {
      // ファイルコピー
      fs.rm(outputPath, rmOptions, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve(file);
        }
      });
    });
    promise.then(() => {
      this.message(`${this.taskName}:unlink `, file);
      return promise;
    });
    return promise;
  };

  /**
   * ビルド
   */
  async build() {
    return new Promise((resolve, reject) => {
      this.message(`Started ${this.taskName}:build`);
      this.message(`Finished ${this.taskName}:build`);
      resolve();
    });
  };

  /**
   * ファイル監視
   */
  watch() {
    this.message(`${this.taskName}:watch`);
  }
}
