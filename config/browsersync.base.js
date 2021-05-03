const pathConfig     = require('./path'),
      path_base      = pathConfig.path_base,
      path           = pathConfig.path
;

module.exports = {
  notify: false,
  server : {
    baseDir : path_base.dest,
    directory: true
  }
};
