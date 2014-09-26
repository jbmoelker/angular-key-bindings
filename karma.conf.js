module.exports = function(config) {
    config.set({
        frameworks: ['jasmine'],
        browsers: ['Chrome', 'Firefox', 'PhantomJS']
    });

    if(process.env.TRAVIS){
    	console.log('setting Travis specific config for Karma');
    	config.set({
    		browsers: ['Firefox', 'PhantomJS'],
    		reporters: ['progress', 'coverage'],
    		// preprocessors: { 'src/**/*.js': ['coverage'] }, // are set dynamically in gulp task
    		coverageReporter: {
		    	type : 'lcovonly',
		    	dir : 'test_out/coverage/' // @todo: set dynamically in gulp task (centralise config)?
		    }
    	});
  	}
};