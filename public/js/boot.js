require.config({
	paths: {
		jQuery: '/js/libs/jquery',
		Underscore: '/js/libs/underscore',
		Backbone: '/js/libs/backbone',
		text: '/js/libs/text',
		templates: '../templates'
	},

	shim: {
		'Backbone': ['Underscore', 'jQuery'],
		'SocialNet': ['Backbone']
	},

	// default é 7. Tentativa de resolver problema de "object is not a function"
	// Veja: http://stackoverflow.com/questions/10959095/intermittent-requirejs-load-error
	waitSeconds: 15
});

require(['SocialNet'], function(SocialNet) {
	SocialNet.initialize();
});

