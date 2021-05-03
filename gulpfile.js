'use strict';

const gulp         = require('gulp'),
    plumber        = require('gulp-plumber'),
    sourcemaps     = require('gulp-sourcemaps'),
    concat         = require('gulp-concat'),
    sass           = require('gulp-sass'),
    sassGlob       = require('gulp-sass-glob'),
    uglify         = require('gulp-uglify'),
    babel          = require('gulp-babel'),
    changed        = require('gulp-changed'),
    browserSync    = require('browser-sync').create(),
    pathConfig     = require('./config/path.js'),
    path_base      = pathConfig.path_base,
    path           = pathConfig.path,
    bsConfigBase   = require('./config/browsersync.base'),
    bsConfigUser   = require('./config/browsersync.user')
;



gulp.task('uglify', function (done) {
  gulp
    .src(path.dist.js)
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(babel({ presets: ['@babel/env'] }))
    .pipe(concat('Oceans.js'))
    .pipe(
      uglify(
        {
          output: {
            comments: "@license"
          }
        }
      )
    )
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(path.dest.js))
  ;
  done();
});

gulp.task('uglify:watch', function (done) {
  gulp.watch(path.dist.js, gulp.series('uglify'));
  done();
});



gulp.task('sass', function (done) {
  gulp.src(path.dist.css)
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(sassGlob())
    .pipe(sass({noCache: true, outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(path.dest.css))
  ;
  done();
});

gulp.task('sass:watch', function (done) {
  gulp.watch(path.dist.css, gulp.series('sass'));
  done();
});



gulp.task('browser-sync', function (done) {
  browserSync.init(
    Object.assign(
      bsConfigBase,
      bsConfigUser
    )
  );
  done();
});

gulp.task('browser-sync-reload', function (done) {
  browserSync.reload();
  done();
});



gulp.task('browser-sync:watch', function (done) {
  gulp.watch(
    [
      path_base.dest + '**/*'
    ],
    gulp.series('browser-sync-reload')
  );
  done();
});



gulp.task(
  'process',
  gulp.series(
    'uglify',
    'sass',
    'browser-sync'
  )
);

gulp.task(
  'watch',
  gulp.series(
    'uglify:watch',
    'sass:watch',
    'browser-sync:watch'
  )
);

gulp.task(
  'default',
  gulp.series(
    'process',
    'watch'
  )
);
