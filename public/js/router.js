// router.js (roda no browser)
//
// Rotas:
//   /#index
//   /#login
//   /#register
//   /#forgotpassword
//   /#profile/:id

define(
	[
	'views/index', 'views/register', 'views/login', 'views/forgotpassword',
	'views/profile', 'models/Account', 'models/StatusCollection'
	], 
	function( IndexView, RegisterView, LoginView, ForgotPasswordView,
			ProfileView, Account, StatusCollection ) {

	var SocialRouter = Backbone.Router.extend({
		currentView: null,

		routes: {
			"index": "index", // roda a função em 'index:' qdo a página acessada é http://localhost:8080/#index
			"login": "login", // roda a função em 'login:' qdo a página acessada é http://localhost:8080/#login
			"register": "register", // roda a função em 'register:' qdo a página acessada é http://localhost:8080/#register
			"forgotpassword": "forgotpassword", // roda a função em 'forgotpassword:' qdo a página acessada é http://localhost:8080/#forgotpassword
			"profile/:id": "profile" // roda a função 'profile:' quando a página acessada é http://localhost:8080/#profile:<id>
		},
		
		// changeView é a função que chama render da View em questão (da view que foi invocada).
		changeView: function(view) {
			if ( this.currentView != null ) {
				// "Quando uma visão é modificada, diz-se para a visão 
				// antiga (currentView) que pare de escutar eventos de
				// uma página web por meio de undelegateEvents."
				this.currentView.undelegateEvents();
			}
			this.currentView = view; // Pega a view que foi invocada.
			console.log("Vai executar render() em changeView de router.js");
			this.currentView.render(); // Chama render() da view invocada.
		},

		// index "é responsável por manipular a lista de atividades".
		index: function() { // função executada qdo a página acessada é http://localhost:8080/#index
			console.log("Backbone entrou no tratamento da rota /#index");
			var statusCollection = new StatusCollection();
			console.log("Acaba de criar um new StatusCollection");
			statusCollection.url = '/accounts/me/activity';
			console.log("statusCollection.url = " + statusCollection.url);
			var x = new IndexView({ collection: statusCollection });
			console.log("Acaba de criar uma nova IndexView e vai chamar changeView");
			this.changeView(x); // a view em questão é a "IndexView"
			// "Fetches the default set of models for this collection from the server,
			// setting them on the collection when they arrive.
			// Note that fetch is intended for lazily-loading models for interfaces
			// that are not needed immediately."
			console.log("Vai chamar statusCollection.fetch()");
			// "The server handler for fetch() requests should return a JSON
			// array of models."
			statusCollection.fetch();
		},

		login: function() { // função executada qdo a página acessada é http://localhost:8080/#login
			// console.log("login: LoginView = " + LoginView);
			console.log("Chamando changeView(LoginView) a partir de login: em router.js");
			this.changeView(new LoginView()); // a view em questão é a "LoginView"
		},

		forgotpassword: function() { // função executada qdo a página acessada é http://localhost:8080/#forgotpassword
			//console.log("ForgotPasswordView = " + ForgotPasswordView );
			console.log("Chamando changeView(ForgotPasswordView) a partir de register: em router.js");
			this.changeView(new ForgotPasswordView()); // a view em questão é a "ForgotPasswordView"
		},

		register: function() { // função executada qdo a página acessada é http://localhost:8080/#register
			//console.log("RegisterView = " + RegisterView);
			console.log("Chamando changeView(RegisterView) a partir de register: em router.js");
			this.changeView(new RegisterView()); // a view em questão é a "RegisterView"
		},

		profile: function(id) {
			var model = new Account({id:id});
			console.log("Chamando changeView(ProfileView) a partir de profile: em router.js");
			this.changeView(new ProfileView({model: model})); // a view em questão é a "ProfileView"
			model.fetch();
		}

	});

	return new SocialRouter();

});

