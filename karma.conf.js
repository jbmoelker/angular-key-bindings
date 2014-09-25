module.exports = function(config) {
    config.set({
        frameworks: ['jasmine'],
        browsers: ['Chrome', 'Firefox', 'PhantomJS']
    });

    if(process.env.TRAVIS){
    	console.log('setting Travis specific config for Karma');
    	config.set({
    		'browsers': ['Firefox', 'PhantomJS']
    	});
  	}
};