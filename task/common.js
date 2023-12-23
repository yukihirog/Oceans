import TaskCommon from './modules/common.js';
import config from '../config.js';

const task = new TaskCommon(config);
// ウォッチモードの振り分け
const isWatch = process.argv.includes('--watch');
if (isWatch) {
  task.watch();
} else {
  task.build();
}
