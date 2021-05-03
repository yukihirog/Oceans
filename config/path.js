const path_base = {
  dist : 'dist/',
  dest : 'dest/'
};

const path = {
  dist : {
    css      : path_base.dist + '**/*.scss',
    js       : [
      path_base.dist + '**/*.js'
    ]
  },
  dest : {
    css      : path_base.dest,
    js       : path_base.dest
  }
};

module.exports = {
  path_base: path_base,
  path: path
};