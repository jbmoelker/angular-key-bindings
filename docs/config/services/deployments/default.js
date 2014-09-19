module.exports = function defaultDeployment() {
    return {
        name: 'default',
        examples: {
            commonFiles: {
                scripts: [
                    '../../assets/angular.min.js',
                    '../../assets/mousetrap.min.js',
                    '../../assets/angular-key-bindings.min.js'
                ],
                stylesheets: [
                    '../../assets/css/bootstrap.min.css'
                ]
            },
            dependencyPath: '../../assets/'
        }
    };
};