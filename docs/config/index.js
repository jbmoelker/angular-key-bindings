var path = require('canonical-path');
var packagePath = __dirname;

var Package = require('dgeni').Package;

module.exports = new Package('angular-key-bindings', [
    require('dgeni-packages/ngdoc')
])
    .config(function(dgeni, log, readFilesProcessor, writeFilesProcessor) {

        dgeni.stopOnValidationError = true;
        dgeni.stopOnProcessingError = true;

        log.level = 'info';

        readFilesProcessor.basePath = path.resolve(__dirname, '../..');
        readFilesProcessor.sourceFiles = [
            { include: 'src/**/*.js', basePath: 'src' },
            { include: 'docs/content/**/*.ngdoc', basePath: 'docs/content' }
        ];

        writeFilesProcessor.outputFolder = 'dist/docs';

    });