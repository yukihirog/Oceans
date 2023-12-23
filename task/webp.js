import TaskWebp from './modules/webp.js';
import config from '../config.js';

const task = new TaskWebp(config);
// ウォッチモードの振り分け
const isWatch = process.argv.includes('--watch');
if (isWatch) {
  task.watch();
} else {
  task.build();
}
