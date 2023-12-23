/**
 * configファイルの読み込み
 */
import { resolve } from 'node:path';
import fs from 'node:fs';
import merge from 'deepmerge';
import { parse } from 'jsonc-parser';

/**
 * モード指定の配列からconfigファイルの読み込みとマージを行なって返す
 */
function getConfig(modes = []) {
  const configs = modes.map(mode => {
    return parse(fs.readFileSync(resolve(CWD, `config/${mode}.jsonc`), { encoding: 'utf8' }));
  });
  return merge.all(configs, {
    arrayMerge: (destinationArray, sourceArray, options) => sourceArray
  });
};

/**
 * パスをcwdからのパスに解決しておく
 */
function resolvePath(config = { path: {} }) {
  for (let prop of Object.keys(config.path)) {
    config.path[prop] = resolve(CWD, config.path[prop]);
  }
  return config;
};

const CWD = process.cwd();
const mode = process.env.NODE_ENV || 'development';
const modes = ['base', mode];
const config = resolvePath(getConfig(modes));

console.log(`config: ${mode}`);

export default config;
