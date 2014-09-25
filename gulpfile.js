/* Dependencies (A-Z) */
var concat = require('gulp-concat');
var Dgeni = require('dgeni');
var gulp = require('gulp');
var karma = require('gulp-karma');
var pkg = require('./package.json');
var rename = require('gulp-rename');
var rimraf = require('gulp-rimraf');
var uglify = require('gulp-uglify');
var webserver = require('gulp-webserver');

/* Shared configuration (A-Z) */
var concatName = pkg.name + '.js';

var path = {
    src: ['src/**/*.js'],
    output: 'dist',
    outputDocs: 'dist/docs'
};

path.docsAssets = [
    'bower_components/angular/angular.js',
    'bower_components/angular/angular.min.js',
    'bower_components/angular/angular.min.js.map',
    'bower_components/mousetrap/mousetrap.min.js',
    'bower_components/bootstrap/dist/**/*.css',
    'bower_components/bootstrap/dist/**/*.css.map',
    'bower_components/bootstrap/dist/**/*.eot',
    'bower_components/bootstrap/dist/**/*.svg',
    'bower_components/bootstrap/dist/**/*.ttf',
    'bower_components/bootstrap/dist/**/*.woff',
    path.output + '/*.js'
];

path.test = [
    'bower_components/angular/angular.js',
    'bower_components/angular-mocks/angular-mocks.js',
    'bower_components/mousetrap/mousetrap.js',
    'test/**/*.spec.js'
].concat(path.src);

/* Register default & custom tasks (A-Z) */
gulp.task('default', ['build_source']);
gulp.task('build_docs', ['build_docs_assets', 'build_docs_dgeni']);
gulp.task('build_docs_assets', ['build_source'], buildDocsAssetsTask);
gulp.task('build_docs_dgeni', buildDocsDgeniTask);
gulp.task('build_source', buildSourceTask);
gulp.task('rimraf', rimrafTask(path.output));
gulp.task('rimraf_docs', rimrafTask(path.outputDocs));
gulp.task('serve_docs', serveDocsTask);
gulp.task('test_run', testTask({action: 'run', configFile: 'karma.conf.js'}));
gulp.task('test_watch', testTask({action: 'watch', configFile: 'karma.conf.js'}));

/* Tasks and utils (A-Z) */

function buildDocsAssetsTask() {
    return gulp.src(path.docsAssets)
        .pipe(gulp.dest(path.outputDocs + '/assets'))
}

function buildDocsDgeniTask() {
    var dgeni = new Dgeni([require('./docs/config')]);
    return dgeni.generate().catch(function(error) {
        process.exit(1);
    });
}

function buildSourceTask() {
    return gulp.src(path.src)
        .pipe(concat(concatName))
        .pipe(gulp.dest(path.output))
        .pipe(uglify())
        .pipe(rename({extname: '.min.js'}))
        .pipe(gulp.dest(path.output));
}

function rimrafTask(src) {
    return function(){
        gulp.src(src, {read: false})
            .pipe(rimraf());
    }
}

function serveDocsTask() {
    gulp.src('dist/docs')
        .pipe(webserver({
            open: true
        }));
}

function testTask(karmaConfig) {
    return function() {
        return gulp.src(path.test)
            .pipe(karma(karmaConfig))
            .on('error', function(error) {
                throw error;
            });
    }
}