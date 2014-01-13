define(['router'], function(router) {

	var initialize = function() {
		checkLogin(runApplication);
	};

	var checkLogin = function(callback) {
		// $.ajax é uma função do jQuery.
		$.ajax("/account/authenticated", {
			method: "GET", // na documentação jQuery method == type
			success: function() {
				return callback(true); // o usuário está autenticado
			},
			error: function(data) {
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
			console.log("Usuário não autenticado");
			window.location.hash = 'login'; // se não está autenticado ajusta URL para: #login
		} else {
			console.log("Usuário está autenticado");
			window.location.hash = 'index'; // se está autenticado ajusta URL para: #index
		}
		Backbone.history.start();
	};

	return {
		initialize: initialize
	};
});

