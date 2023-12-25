import TaskAbstract from './abstract.js';

export default class TaskBuild extends TaskAbstract {
  // タスク名
  static taskName = 'build';

  /**
   * 設定
   */
  initConfig(config) {
    super.initConfig(config);

    // 設定全体
    this.configAll = config;
  }

  /**
   * タスクグループの実行
   */
  doTaskGroup(i = 0, method = 'build') {
    return new Promise(async (resolveAll, rejectAll) => {
      const subTasks = this.getConfig('subTasks');

      let taskGroup = subTasks[i];
      if (!taskGroup) {
        resolveAll();
        return;
      }
  
      if (typeof taskGroup === 'string') {
        taskGroup = [taskGroup];
      }
  
      // 個別タスクを読み込んで実行し、グループが終了するのを待つ
      const promises = taskGroup.map((taskName) => {
        return new Promise(async (resolve, reject) => {
          import(`./${taskName}.js`)
            .then(task => {
              (new task.default(this.configAll))[method]().finally(resolve);
            })
            .catch(reject)
          ;
        });
      })

      Promise.allSettled(promises).then(() => {
        this.doTaskGroup(i + 1, method);
      });
    });
  };

  async build() {
    return new Promise(async (resolveAll, reject) => {
      this.message(`Started ${this.taskName}`);
      this.doTaskGroup(0, 'build').then(() => {
        this.message(`Finished ${this.taskName}`);
        resolveAll();
      });
    });
  }

  async watch() {
    return new Promise(async (resolveAll, reject) => {
      this.doTaskGroup(0, 'watch').then(() => {
        resolveAll();
      });
    });
  }
}
