var gulp = require('gulp');
var karma = require('gulp-karma');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rimraf = require('gulp-rimraf');
var rename = require('gulp-rename');
var Dgeni = require('dgeni');
var webserver = require('gulp-webserver');
var jshint = require('gulp-jshint');
var coveralls = require('gulp-coveralls');

var concatName = 'angular-key-bindings.js';

var path = {
    coverage: 'test_out/coverage',
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

gulp.task('default', ['build_source']);

gulp.task('build_source', function() {
    return gulp.src(path.src)
        .pipe(concat(concatName))
        .pipe(gulp.dest(path.output))
        .pipe(uglify())
        .pipe(rename({extname: '.min.js'}))
        .pipe(gulp.dest(path.output));
});

gulp.task('build_docs', ['build_docs_assets', 'build_docs_dgeni']);

gulp.task('build_docs_dgeni', function() {
    var dgeni = new Dgeni([require('./docs/config')]);
    return dgeni.generate().catch(function() {
        process.exit(1);
    });
});
gulp.task('build_docs_assets', ['build_source'], function() {
    return gulp.src(path.docsAssets)
        .pipe(gulp.dest(path.outputDocs + '/assets'));
});

gulp.task('rimraf', function() {
    return gulp.src(path.output, {read: false}).pipe(rimraf());
});
gulp.task('rimraf_docs', function() {
    return gulp.src(path.outputDocs, {read: false}).pipe(rimraf());
});

gulp.task('test_coverage', ['test_run'], testCoverageTask);
gulp.task('test_run', testTask({action: 'run', configFile: 'karma.conf.js'}));
gulp.task('test_watch', testTask({action: 'watch', configFile: 'karma.conf.js'}));

function configureCoverage(karmaConfig) {
    karmaConfig.preprocessors = karmaConfig.preprocessors || {};
    path.src.forEach(function(pattern){
        karmaConfig.preprocessors[pattern] = karmaConfig.preprocessors[pattern] || [];
        karmaConfig.preprocessors[pattern].push('coverage');
    });
    console.log('preprocessors', karmaConfig);
    karmaConfig.coverageReporter = {
        type: 'lcovonly',
        dir: path.coverage
    };
    return karmaConfig;
}

function testCoverageTask() {
    return gulp.src(path.coverage + '/**/lcov.info')
        .pipe(coveralls());
}

function testTask(karmaConfig) {
    karmaConfig = configureCoverage(karmaConfig);
    return function() {
        return gulp.src(path.test)
            .pipe(karma(karmaConfig))
            .on('error', function(error) {
                throw error;
            });
    };
}

gulp.task('serve_docs', function() {
    gulp.src('dist/docs')
        .pipe(webserver({
            open: true
        }));
});

gulp.task('jshint_src', function() {
    return gulp.src(path.src)
        .pipe(jshint('src/.jshintrc'))
        .pipe(jshint.reporter(require('jshint-stylish')));
});

gulp.task('jshint_node', function() {
    return gulp.src(['*.js', 'docs/**/*.js', 'test/**/*.js'])
        .pipe(jshint('.jshintrc'))
        .pipe(jshint.reporter(require('jshint-stylish')));
});

gulp.task('jshint', ['jshint_src', 'jshint_node']);