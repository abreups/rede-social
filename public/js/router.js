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
	'views/profile', 'views/contacts', 'models/Account', 'models/StatusCollection',
	'views/addcontact', 'models/ContactCollection'
	], 
	function( IndexView, RegisterView, LoginView, ForgotPasswordView,
			ContactsView, ProfileView, Account, StatusCollection, AddContactView,
			ContactCollection ) {

	var SocialRouter = Backbone.Router.extend({
		currentView: null,

		routes: {
			"addcontact": "addcontact", // roda a função em 'addcontact:' qdo a página acessada é /#addcontact
			"index": "index", // roda a função em 'index:' qdo a página acessada é /#index
			"login": "login", // roda a função em 'login:' qdo a página acessada é /#login
			"register": "register", // roda a função em 'register:' qdo a página acessada é /#register
			"forgotpassword": "forgotpassword", // roda a função em 'forgotpassword:' qdo a página acessada é /#forgotpassword
			"profile/:id": "profile", // roda a função 'profile:' quando a página acessada é /#profile:<id>
			"contacts/:id": "contacts"
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

		addcontact: function() {
			console.log("Chamando changeView(AddContactView) a partir de addcontact: em router.js");
			this.changeView(new AddContactView());
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
		},

		contacts: function(id) {
			var contactId = id ? id : 'me';
			var contactsCollection = new ContactCollection();
			contactsCollection.url = '/accounts/' + contactId + '/contacts';
			this.changeView(new ContactsView({
				collection: contactsCollection
			}));
			contactsCollection.fetch();
		}
	});

	return new SocialRouter();

});

