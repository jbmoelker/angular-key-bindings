var gulp = require('gulp');
var karma = require('gulp-karma');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rimraf = require('gulp-rimraf');
var rename = require('gulp-rename');
var Dgeni = require('dgeni');

var concatName = 'angular-key-bindings.js';

var path = {
    deps: [
        'bower_components/angular/angular.js',
        'bower_components/mousetrap/mousetrap.js'
    ],
    src: ['src/**/*.js'],
    output: 'dist',
    outputDocs: 'dist/docs'
};

path.test = path.deps.concat(path.src, [
    'bower_components/angular-mocks/angular-mocks.js',
    'test/**/*.js'
]);

gulp.task('default', ['build_source']);

gulp.task('build_source', function() {
    return gulp.src(path.src)
        .pipe(concat(concatName))
        .pipe(gulp.dest(path.output))
        .pipe(uglify())
        .pipe(rename({extname: '.min.js'}))
        .pipe(gulp.dest(path.output));
});

gulp.task('build_docs', function() {
    var dgeni = new Dgeni([require('./docs/config')]);
    return dgeni.generate().catch(function(error) {
        process.exit(1);
    });
});

gulp.task('rimraf', function() {
    return gulp.src(path.output, {read: false}).pipe(rimraf());
});

gulp.task('test_run', testTask({action: 'run', configFile: 'karma.conf.js'}));
gulp.task('test_watch', testTask({action: 'watch', configFile: 'karma.conf.js'}));

function testTask(karmaConfig) {
    return function() {
        return gulp.src(path.test)
            .pipe(karma(karmaConfig))
            .on('error', function(error) {
                throw error;
            });
    }
}