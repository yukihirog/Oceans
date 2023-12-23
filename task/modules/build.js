import TaskAbstract from './abstract.js';
import TaskClear from './clear.js';

export default class TaskBuild extends TaskAbstract {
  // タスク名
  taskName = 'build';

  // サブタスク
  subTasks = [
    'ejs',
    'sass',
//      'webp',
    'image',
    'common'
  ];

  /**
   * 設定
   */
  initConfig(config) {
    // 入力対象ディレクトリの末尾を落としておく
    this.inputBaseDir = config.path.input.replace(/\/$/, '');

    // 出力先
    this.outputBaseDir = config.path.output;

    // コンフィグファイル
    this.config = config;
  }

  build() {
    this.message(`Started ${this.taskName}`);

    (new TaskClear(this.config)).build();

    this.subTasks.forEach(taskName => {
      import(`./${taskName}.js`).then(task => {
        (new task.default(this.config)).build();
      });
    });

    this.message(`Finished ${this.taskName}`);
  }

  watch() {
    this.subTasks.forEach(taskName => {
      import(`./${taskName}.js`).then(task => {
        (new task.default(this.config)).watch();
      });
    });
  }
}
