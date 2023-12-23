import TaskImage from './modules/image.js';
import config from '../config.js';

const task = new TaskImage(config);
// ウォッチモードの振り分け
const isWatch = process.argv.includes('--watch');
if (isWatch) {
  task.watch();
} else {
  task.build();
}
