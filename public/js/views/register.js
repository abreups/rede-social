define(['text!templates/register.html'], function(registerTemplate) {
	var registerView = Backbone.View.extend({
		el: $('#content'), // essa div está em index.jade

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
				console.log("Retorno de POST /register = " + data);
				// Depois de registrar, vá pra index
				// https://github.com/plorent/book-node-mongodb-backbone/commit/d8d2330b40dc36c24729648c978b03f71b6243bc
				//window.location.hash = 'index';
				// Não vá para index, vá para login, pois o ambiente com as variáveis de session
				// têm que ser devidamente arrumados.
				window.location.hash = 'login';
			});

			// "Retorna false para desabilitar a funcionalidade de formulário padrão,
			// a qual dispararia um recarregamento da página. Você não precisa recarregar
			// a página porque negociou a comunicação do servidor nos bastidores
			// utilizando o comando post.
			return false;
		},

		render:function() {
			this.$el.html(registerTemplate);
		}

	});

	return registerView;

});

