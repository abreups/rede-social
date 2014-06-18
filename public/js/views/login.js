define(['text!templates/login.html'], function(loginTemplate) {
	var loginView = Backbone.View.extend({
		el: $('#content'),

		events: {
			"submit form": "login"
		},

		login: function() {
			$.post('/login', {
				email: $('input[name=email]').val(),
				// ATENÇÃO: a senha é enviada sem nenhuma criptografia (plain text!!)
				password: $('input[name=password]').val()
			}, function(data) {
				// Depois de logar, vá pra index
				// https://github.com/plorent/book-node-mongodb-backbone/commit/d8d2330b40dc36c24729648c978b03f71b6243bc
				window.location.hash = 'index';
				console.log("Resultado de login foi 'data' = " + data);
			}).error(function(){
				$("#error").text('Unable to login em login.js. Usuário ou senha incorretos.');
				$("#error").slideDown();
			});
			return false;
		},

		render: function() {
			console.log("Dentro de render em /views/login.js");
			this.$el.html(loginTemplate);
			$("#error").hide();
		}
	});

	return loginView;

});
