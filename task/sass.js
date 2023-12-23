import TaskSass from './modules/sass.js';
import config from '../config.js';

const task = new TaskSass(config);
// ウォッチモードの振り分け
const isWatch = process.argv.includes('--watch');
if (isWatch) {
  task.watch();
} else {
  task.build();
}
