import TaskBuild from './modules/build.js';
import config from '../config.js';

const task = new TaskBuild(config);
// ウォッチモードの振り分け
const isWatch = process.argv.includes('--watch');
if (isWatch) {
  task.watch();
} else {
  task.build();
}
