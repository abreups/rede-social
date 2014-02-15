define(['text!templates/register.html'], function(registerTemplate) {
	var registerView = Backbone.View.extend({
		el: $('#content'),

		events: {
			"submit form": "register"
		},

		register: function() {
			$.post('/register', {
				firstName: $('input[name=firstName]').val(),
				lastName: $('input[name=lastName]').val(),
				email: $('input[name=email]').val(),
				password: $('input[name=password]').val()
			}, function(data) {
				console.log(data);
				// Depois de registrar, vá pra index
				// https://github.com/plorent/book-node-mongodb-backbone/commit/d8d2330b40dc36c24729648c978b03f71b6243bc
				window.location.hash = 'index';
			});
			return false;
		},

		render:function() {
			this.$el.html(registerTemplate);
		}

	});

	return registerView;

});

