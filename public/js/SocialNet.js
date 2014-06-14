// SocialNet.js (roda no browser)
// 
// Métodos:
//   initialize: esta função faz uma chamada AJAX do tipo GET para a URL /account/authenticated no servidor.
//               Se o resultado for OK (isto é, usuário autenticado) a URL do browser é ajustada para /#index,
//               caso contrário, a URL é ajustada para /#login (para que o login possa ser feito).
//
define(['router'], function(router) {

	var initialize = function() {
		// "Verifique o login e depois rode a aplicação"
		checkLogin(runApplication);
	};

	var checkLogin = function(callback) {
		// $.ajax é uma função do jQuery.
		$.ajax("/account/authenticated", {
			type: "GET", // na documentação jQuery method == type
			//method: "GET", // na documentação jQuery method == type  (<-- código original)
			success: function() { // função a ser chamada se request foi bem sucedido. E.g.: 200
				return callback(true); // o usuário está autenticado
			},
			error: function(data) { // função a ser chamada se request não foi bem sucedido. E.g.: 401
				return callback(false); // o usuário não está autenticado
			}
		});
	};

	var runApplication = function(authenticated) {
		if (!authenticated) {

			// The hash property sets or returns the anchor portion of a URL, including the hash sign (#).
			// Assume that the current URL is http://www.example.com/test.htm#part2
			// var x = location.hash;
			// The result of x will be: #part2
			// Tip: When you set the anchor portion, do not include the hash sign.
			window.location.hash = 'login'; // se não está autenticado ajusta URL para: #login

			console.log("Usuário não está autenticado. window.location.hash ajustado para " + window.location.hash);

		} else {
			window.location.hash = 'index'; // se está autenticado ajusta URL para: #index
			console.log("Usuário está autenticado. window.location.hash ajustado para " + window.location.hash);
		}

		// Começa a monitorar change events. Sem isso as routes do Backbone não funcionarão.
		Backbone.history.start();
	};

	return {
		initialize: initialize
	};
});

