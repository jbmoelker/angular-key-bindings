var path = require('canonical-path');
var packagePath = __dirname;

var Package = require('dgeni').Package;

module.exports = new Package('angular-key-bindings', [
    require('dgeni-packages/ngdoc')
])
    .factory(require('./inline-tag-defs/link'))

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

    })

    .config(function(computePathsProcessor, computeIdsProcessor) {

        computePathsProcessor.pathTemplates.push({
            docTypes: ['provider', 'service', 'directive', 'input', 'object', 'function', 'filter', 'type' ],
            pathTemplate: '${area}/${module}/${docType}/${name}',
            outputPathTemplate: '${area}/${module}/${docType}/${name}/index.html'
        });
        computePathsProcessor.pathTemplates.push({
            docTypes: ['module' ],
            pathTemplate: '${area}/${name}',
            outputPathTemplate: '${area}/${name}/index.html'
        });
        computePathsProcessor.pathTemplates.push({
            docTypes: ['componentGroup'],
            pathTemplate: '${area}/${moduleName}/${groupType}',
            outputPathTemplate: '${area}/${moduleName}/${groupType}/index.html'
        });

        computePathsProcessor.pathTemplates.push({
            docTypes: ['overview'],
            getPath: function(doc) {
                var docPath = path.dirname(doc.fileInfo.relativePath);
                if (doc.fileInfo.baseName !== 'index') {
                    docPath = path.join(docPath, doc.fileInfo.baseName);
                }
                return docPath;
            },
            getOutputPath: function(doc) {
                return doc.path + '/index.html';
            }
        });

        computeIdsProcessor.idTemplates.push({
            docTypes: ['overview'],
            getId: function(doc) {
                return doc.fileInfo.baseName;
            },
            getAliases: function(doc) {
                return [doc.id];
            }
        });
    })

    .config(function(templateFinder) {
        templateFinder.templateFolders.unshift(path.resolve(packagePath, 'templates'));
    });