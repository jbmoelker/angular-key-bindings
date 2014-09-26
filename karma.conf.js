module.exports = function(config) {
    config.set({
        frameworks: ['jasmine'],
        browsers: ['Chrome', 'Firefox', 'PhantomJS']
    });

    if(process.env.TRAVIS){
    	console.log('setting Travis specific config for Karma');
    	config.set({
    		customLaunchers: {
				Chrome_travis_ci: {
					base: 'Chrome',
					flags: ['--no-sandbox']
				}
			},
    		browsers: ['Firefox', 'PhantomJS', 'Chrome_travis_ci'],
    		// preprocessors & coverageReporter are set dynamically in gulp task
    		//preprocessors: { 'src/**/*.js': ['coverage'] },
    		//coverageReporter: { type : 'lcovonly', dir : 'test_out/coverage/' },
    		reporters: ['progress', 'coverage']
    	});
  	}
};