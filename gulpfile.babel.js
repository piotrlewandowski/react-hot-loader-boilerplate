import PATHS, { webpackConfig } from './config';
import gulp from 'gulp';
import gutil from 'gulp-util';
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
  runSequence('html', 'webpack:build', done);
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

gulp.task('browser-sync', ['html'], () => {
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

gulp.task('serve', done => {
  runSequence('clean', 'browser-sync', done);
});

gulp.task('default', ['serve']);
