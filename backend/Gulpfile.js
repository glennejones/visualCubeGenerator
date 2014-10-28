'use strict';
var gulp    = require('gulp'),
    bower   = require('gulp-bower'),
    jshint  = require('gulp-jshint'),
    refresh = require('gulp-livereload'),
    // notify  = require('gulp-notify'),
    plumber = require('gulp-plumber'),
    client  = require('tiny-lr')(),
    nodemon = require('gulp-nodemon'),
    lr_port = 35729,
    sass   = require('gulp-sass'),
    mocha = require('gulp-spawn-mocha'),
    exec = require('child_process').exec,
    env = require('node-env-file'),
    ngconstant = require('./gulp-config.js');

var paths = {
  scripts: ['!client/lib/**/*.js', 'client/**/*.js'],
  views: ['!client/lib/*.html', 'client/**/*.html', 'client/index.html'],
  styles: {
    css: ['!client/lib/**/*.css', 'client/styles/css/*.css', 'client/**/*.css'],
    sass: ['client/styles/sass/*.scss', 'client/**/*.scss'],
    dest: 'client/styles/css'
  },
  tests: ['server/test/**/*.spec.js']
};

var build = ['sass', 'css', 'lint'];

if (process.env.NODE_ENV === 'development') {
  env(__dirname + '/env/development.env');
}

gulp.task('sass', function () {
  return gulp.src(paths.styles.sass)
    .pipe(plumber())
    .pipe(sass())
    .pipe(gulp.dest(paths.styles.dest))
    .pipe(refresh(client));
    // .pipe(notify({message: 'Sass done'}));
});


gulp.task('bowerInstall', function  () {
  bower()
  .pipe();
});

gulp.task('html', function () {
  return gulp.src(paths.views)
    .pipe(plumber())
    .pipe(refresh(client));
    // .pipe(notify({message: 'Views refreshed'}));
});

gulp.task('css', function () {
  return gulp.src(paths.styles.css)
    .pipe(plumber())
    .pipe(refresh(client));
    // .pipe(notify({message: 'CSS refreshed'}));
});

gulp.task('lint', function () {
  return gulp.src(paths.scripts)
    .pipe(plumber())
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
    // .pipe(refresh(client));
    // .pipe(notify({message: 'Lint done'}));
});

gulp.task('serve', function () {
  nodemon({script: 'server/server.js', ignore: ['node_modules/**/*.js']})
    .on('restart', function () {
      refresh(client);
    });
});

gulp.task('live', function () {
  client.listen(lr_port, function (err) {
    if (err) {
      return console.error(err);
    }
  });
});

gulp.task('watch', function () {
  gulp.watch(paths.styles.sass, ['sass']);
  gulp.watch(paths.views, ['html']);
  gulp.watch(paths.scripts, ['lint']);
});

gulp.task('testBackend', function () {
    return gulp.src(paths.tests, {read: false})
        .pipe(mocha({reporter: 'spec'}));
});

gulp.task('mongo', function () {
  var dataFolder = process.cwd() + '/data';
  console.log(dataFolder);
  exec('mongod --dbpath ' + dataFolder, console.log);
})

gulp.task('build', build);

gulp.task('default', ['build', 'testBackend', 'live', 'serve', 'watch']);
