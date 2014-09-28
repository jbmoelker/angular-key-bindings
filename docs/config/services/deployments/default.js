module.exports = function defaultDeployment() {
    return {
        name: 'default',
        baseUrl: (function(){
            if(process.env.TRAVIS_REPO_SLUG) {
                var repoSlug = process.env.TRAVIS_REPO_SLUG.split('/');
                var username = repoSlug[0];
                var reponame = repoSlug[1];
                var baseUrl = 'http://' + username + '.github.io/' + reponame;
                console.log('set app baseUrl to ', baseUrl);
                return baseUrl;
            }
            return '';
        }()),
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