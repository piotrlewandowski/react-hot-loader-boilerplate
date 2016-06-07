import PATHS, { webpackConfig } from './config';
import gulp from 'gulp';
import gutil from 'gulp-util';
import gnotify from 'gulp-notify';
import gulpif from 'gulp-if';
import sass from 'gulp-sass';
import minifyCss from 'gulp-minify-css';
import autoprefixer from 'gulp-autoprefixer';
import sourcemaps from 'gulp-sourcemaps';
import eslint from 'gulp-eslint';
import del from 'del';
import path from 'path';
import runSequence from 'run-sequence';
import _ from 'lodash';

import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';

import { create as browserSyncCreate } from 'browser-sync';
const browserSync = browserSyncCreate();

browserSync.use({
  plugin() {},
  hooks: {
    'client:js': '___browserSync___.socket.on("disconnect", window.close.bind(window));'
  }
});

gulp.task('clean', () => del.sync(PATHS.build));

gulp.task('build', ['clean'], done => {
  runSequence('html', 'sass', 'webpack:build', done);
});

gulp.task('webpack:build', done => {
  const compiler = webpack(_.assign({}, webpackConfig.common, webpackConfig.prod));

  compiler.run((err, stats) => {
    if (err) throw new gutil.PluginError('webpack', err);
    gutil.log('[webpack]', stats.toString({
      colors: true
    }));
    done();
  });
});

gulp.task('html', () => {
  return gulp.src(path.join(PATHS.source, '*.html'))
    .pipe(gulp.dest(PATHS.build));
});

gulp.task('sass', () => {
  return gulp.src(path.join(PATHS.source, 'sass/**/*.scss'))
    .pipe(gulpif(!process.env.NODE_ENV, sourcemaps.init()))
    .pipe(sass({
        outputStyle: 'expanded',
        includePaths: ['scss']
      })
        .on('error', sass.logError)
    )
    .on('error', gnotify.onError({
      title: 'Sass Error',
      message: 'Error in file <%= error.message %>'
    }))
    .pipe(autoprefixer({
      browsers: ['> 1%', 'IE >= 9']
    }))
    .pipe(gulpif(!process.env.NODE_ENV, sourcemaps.write()))
    .pipe(gulpif(process.env.NODE_ENV, minifyCss({
      // CSS animations on IE/Edge seem to need units on zero.
      compatibility: '-properties.zeroUnits'
    })))
    .pipe(gulp.dest(PATHS.build))
    .pipe(gulpif(!process.env.NODE_ENV, browserSync.reload({ stream: true })));
});

gulp.task('lint', () => {
  return gulp.src('src/js/**/*.js*(x)')
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

gulp.task('browser-sync', ['html', 'sass'], () => {
  const bundler = webpack(_.assign({}, webpackConfig.common, webpackConfig.dev));
  browserSync.init({
    server: {
      baseDir: PATHS.build,
      middleware: [
        webpackDevMiddleware(bundler, {
          contentBase: '.',
          inline: true,
          watch: true,
          hot: true,
          stats: {
            chunks: false,
            version: false,
            colors: true
          }
        }),
        webpackHotMiddleware(bundler)
      ]
    }
  });
});

gulp.task('watch', () => {
  gulp.watch(path.join(PATHS.source, 'sass/**/*.scss'), ['sass']);
});

gulp.task('serve', done => {
  runSequence('clean', 'browser-sync', 'watch', done);
});

gulp.task('default', ['lint']);
