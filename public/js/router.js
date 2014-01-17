define(['views/index', 'views/register', 'views/login', 'views/forgotpassword'], 
	function(IndexView, RegisterView, LoginView, ForgotPasswordView) {

	var SocialRouter = Backbone.Router.extend({
		currentView: null,

		routes: {
			"index": "index", // roda a função em 'index:' qdo a página acessada é http://localhost:8080/#index
			"login": "login", // roda a função em 'login:' qdo a página acessada é http://localhost:8080/#login
			"register": "register", // roda a função em 'register:' qdo a página acessada é http://localhost:8080/#register
			"forgotpassword": "forgotpassword" // roda a função em 'forgotpassword:' qdo a página acessada é http://localhost:8080/#forgotpassword
		},
		
		changeView: function(view) {
			if ( null != this.currentView ) {
				// "Quando uma visão é modificada, diz-se para a visão 
				// antiga (currentView) que pare de escutar eventos de
				// uma página web por meio de undelegateEvents."
				this.currentView.undelegateEvents();
			}
			this.currentView = view;
			this.currentView.render();
		},

		index: function() { // função executada qdo a página acessada é http://localhost:8080/#index
			console.log("IndexView = " + IndexView);
			this.changeView(new IndexView());
		},

		login: function() { // função executada qdo a página acessada é http://localhost:8080/#login
			console.log("LoginView = " + LoginView);
			this.changeView(new LoginView());
		},

		forgotpassword: function() { // função executada qdo a página acessada é http://localhost:8080/#forgotpassword
			console.log("ForgotPasswordView = " + ForgotPasswordView );
			this.changeView(new ForgotPasswordView());
		},

		register: function() { // função executada qdo a página acessada é http://localhost:8080/#register
			console.log("RegisterView = " + RegisterView);
			this.changeView(new RegisterView());
		}
	});

	return new SocialRouter();

});

