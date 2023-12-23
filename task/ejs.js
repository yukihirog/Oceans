import TaskEjs from './modules/ejs.js';
import config from '../config.js';

const task = new TaskEjs(config);
// ウォッチモードの振り分け
const isWatch = process.argv.includes('--watch');
if (isWatch) {
  task.watch();
} else {
  task.build();
}
