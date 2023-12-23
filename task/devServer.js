import TaskDevServer from './modules/devServer.js';
import config from '../config.js';

const task = new TaskDevServer(config);
task.build();
