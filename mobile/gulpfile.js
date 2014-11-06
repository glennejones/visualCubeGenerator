'use strict';
var gulp = require('gulp');
var gutil = require('gulp-util');
var bower = require('bower');
var jshint  = require('gulp-jshint');
var plumber = require('gulp-plumber');
var concat = require('gulp-concat');
var sass = require('gulp-ruby-sass');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var sh = require('shelljs');
var browserify = require('browserify');
var watchify = require('watchify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var karma = require('gulp-karma');
var del = require('del');
var runSequence = require('run-sequence');
var gulpif = require('gulp-if');
var uglify = require('gulp-uglify');
var ngAnnotate = require('gulp-ng-annotate');

var production = process.env.NODE_ENV === 'production';

var paths = {
  src: ['src/**/!(*.js)', '!src/{scss,scss/**}'],
  scripts: ['src/**/*.js'],
  sass: ['./src/scss/**/*.scss'],
  fonts: ['lib/ionic/fonts/**/*.*']
};

var libs = {
  "ionic": "./lib/ionic/js/ionic.js",
  "angular": "./lib/angular/angular.js",
  "angular-animate": "./lib/angular-animate/angular-animate.js",
  "angular-sanitize": "./lib/angular-sanitize/angular-sanitize.js",
  "angular-ui-router": "./lib/angular-ui-router/release/angular-ui-router.js",
  "ionic-angular": "./lib/ionic/js/ionic-angular.js",
  "angular-timer": "./lib/angular-timer/dist/angular-timer.js",
  "raphael": "./lib/raphael/raphael.js",
  "scramble_333": "./lib/jsss/scramble_333.js",
  "scramble_222": "./lib/jsss/scramble_222.js",
  "ng-cordova": "./lib/ngCordova/dist/ng-cordova.js"
}

gulp.task('build', ['lint', 'build-html', 'browserify-vendor', 'build-fonts', 'sass']);

gulp.task('watch', ['watch-scripts', 'watch-sass']);

gulp.task('default', function(callback) {
  runSequence('clean', 'build', 'watch');
});

gulp.task('ionic',   ['default']);

gulp.task('sass', ['build-fonts'], function(done) {
  gulp.src('./src/scss/ionic.app.scss')
    .pipe(sass())
    .pipe(gulpif(production, minifyCss({
      keepSpecialComments: 0
    })))
    .pipe(gulp.dest('./www/css/'))
    .on('end', done);
});

gulp.task('lint', function () {
  var config = {
    browserify: true,
    globals: {
      angular: true
    }
  }
  return gulp.src(paths.scripts)
    .pipe(plumber())
    .pipe(jshint(config))
    .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('watch-sass', function() {
  return gulp.watch(paths.sass, ['sass']);
});

gulp.task('install', ['git-check'], function() {
  return bower.commands.install()
    .on('log', function(data) {
      gutil.log('bower', gutil.colors.cyan(data.id), data.message);
    });
});

gulp.task('git-check', function(done) {
  if (!sh.which('git')) {
    console.log(
      '  ' + gutil.colors.red('Git is not installed.'),
      '\n  Git, the version control system, is required to download Ionic.',
      '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
      '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
    );
    process.exit(1);
  }
  done();
});

gulp.task('browserify-vendor', function() {
  var b = browserify();
  for (var lib in libs) {
    b.require(require.resolve(libs[lib]), {expose: lib});
  }
  return b.bundle().pipe(source('vendor.js'))
    .pipe(gulpif(production, buffer()))
    .pipe(gulpif(production, uglify()))
    .pipe(gulp.dest('./www/'));
})

gulp.task('browserify', function() {
  var b = browserify('./src/app/app.js');
  for (var lib in libs) {
    b.external(lib);
  }
  return b.bundle().pipe(source('bundle.js'))
    .pipe(gulp.dest('./www/'));
});

gulp.task('watch-scripts', function() {
  var b = browserify('./src/app/app.js');
  for (var lib in libs) {
    b.external(lib);
  }
  if (production) {
    return b.bundle().pipe(source('bundle.js'))
      .pipe(buffer())
      .pipe(ngAnnotate())
      .pipe(uglify())
      .pipe(gulp.dest('./www/'));
  }
  var bundler = watchify(b);
  bundler.on('update', rebundle);

  function rebundle() {
    return bundler.bundle()
      // log errors if they happen
      .on('error', gutil.log.bind(gutil, 'Browserify Error'))
      .pipe(source('bundle.js'))
      .pipe(gulp.dest('./www'));
  }

  return rebundle();
});

gulp.task('build-html', function() {
  return gulp.src(paths.src)
    .pipe(gulp.dest('www'));
});

gulp.task('build-fonts', function() {
  return gulp.src(paths.fonts)
    .pipe(gulp.dest('www/fonts'));
})

gulp.task('clean', function(done) {
  del(['www/**'], function (err) {
    if (!err) {
      console.log('Files in www/ deleted')
    };
    done(err);
  });
})

function errorHandler (error) {
  console.log(error.toString());
  this.emit('end');
}
