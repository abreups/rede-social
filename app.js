var express = require('express');
var app = express();
var nodemailer = require("nodemailer");
var MemoryStore = require("connect").session.MemoryStore;
var dbPath = 'mongodb://localhost/nodebackbone';

// Importa a camada de dados
var mongoose = require("mongoose");
var config = {
	mail: require('./config/mail')
};

// Importa as contas (os modelos)
var models = {
	Account: require('./models/Account')(config, mongoose, nodemailer)
};

app.configure(function() {
	app.set('view engine', 'jade');
	app.use(express.static(__dirname + '/public'));
	app.use(express.limit('1mb')); // proteção básica contra DDOS
	app.use(express.bodyParser());
	// session é um middleware do Express para lidar com sessões(e.g. autenticado ou não)
	// cookieParser é tbém um middleware do Express e é requisito para se usar session.
	app.use(express.cookieParser());
	// MemoryStore is the built-in session store of Express. Has performance restrictions...
	app.use(express.session({ 
		secret: "SocialNet secret Key", 
		store: new MemoryStore()
   	}));
	mongoose.connect(dbPath, function onMongooseError(err) {
		if (err) throw err;
	});
});

// Trata acesso à página raiz do site
app.get('/', function(req, res){
	console.log("Express GET acionado para /");
	// index.jade chama SocialNet.initialize() que testa se usuário está autenticado
	// e redireciona para /#login ou /#index.
	// res.render("index.jade", {layout:true}); // na pág 120 e no github a opçãolayout foi retirada
	// Aparentemente a opção de ligar ou desligar o layout não existe mais no Express 3.0+
	res.render("index.jade") // https://github.com/visionmedia/jade/issues/801
});

// Trata acesso à página de login
app.post('/login', function(req, res) {
	console.log("Login request em app.js. Express POST acionado para /login");
	var email = req.param('email', null);
	var password = req.param('password', null);
	if ( null == email || email.length < 1 || null == password || password.length < 1) {
		res.send(400); // 400 == bad request / solicitação incorreta
		return;
	}

	models.Account.login(email, password, function(account) {
		if ( !account ) {
			console.log('login attempt failed in login');
			console.log("req.session.loggedIn = " + req.session.loggedIn);
			res.send(401); // 401 == 
			return;
		}
		console.log('login was successful in POST /login');
		// seta a variável loggedIn na session store do Express para true == usuário está logado.
		req.session.loggedIn = true;
		req.session.accountId = account._id;
		console.log("req.session.loggedIn = " + req.session.loggedIn);
		res.send(200); // 200 == OK
	});
});

// Trata acesso à página de registro
app.post('/register', function(req, res) {
	console.log("Express POST acionado para /register");
	var firstName = req.param('firstName', '');
	var lastName = req.param('lastName', '');
	var email = req.param('email', null);
	var password = req.param('password', null);

	if ( null == email || email.length < 1 || null == password || password.length < 1 )  {
		console.log('Attempt to register with blank/short email or password em POST /register');
		res.send(400); // 400 == bad request / solicitação incorreta
		return;
	}

	models.Account.register(email, password, firstName, lastName);
	res.send(200); // Atenção: enviado sem que se saiba se a ação anterior teve sucesso
});

// Responde se usuário já se autenticou
app.get('/account/authenticated', function(req, res) {
	console.log("Express GET acionado para /account/authenticated");
	console.log("req.session.loggedIn = " + req.session.loggedIn);
	if ( req.session.loggedIn ) {
		res.send(200); // 200 == OK
	} else {
		res.send(401); // 401 == not authorized
	}
});


// Note que é igual a: 
// app.get('/accounts/:id/status', function(req, res) {
app.get('/accounts/:id/activity', function(req, res) {
	var accountId = req.params.id == 'me'
		? req.session.accountId
		: req.params.id;
	models.Account.findById(accountId, function(account) {
		res.send(account.activity);
	});
});


// Obtém uma lista de status
app.get('/accounts/:id/status', function(req, res) {
	var accountId = req.params.id == 'me'
		? req.session.accountId
		: req.params.id;
	// ATENÇÃO: se a conta não existir, o node reportará um erro.
	// Precisa colocar alguns testes antes de fazer o find().
	models.Account.findById(accountId, function(account) {
		res.send(account.status);
	});
});

// ATENÇÃO: não há nenhuma autenticação para os manipuladores de status,
// o que significa que qualquer pessoa que possa adivinhar o ID de uma
// conta poderá postar nela ao seu bel prazer. (Será solucionado em 
// capítulos futuros com o Express).
app.post('/accounts/:id/status', function(req, res) {
	var accountId = req.params.id == 'me'
		? req.session.accountId
		: req.params.id;
	models.Account.findById(accountId, function(account) {
		status = {
			name: account.name,
			status: req.param('status', '')
		};
		account.status.push(status);

		// Envia o status para todos os amigos
		account.activity.push(status);
		account.save(function(err) {
			if (err) {
				console.log('Error saving account: ' + err + "em POST /accounts/:id/status");
			}
		});
	});
	res.send(200); // 200 == OK
});


app.get('/accounts/:id', function(req, res) {
	var accountId = req.params.id == 'me'	// if this is true
		? req.session.accountId		// then assign this value
		: req.params.id;		// else assign this value
	models.Account.findById(accountId, function(account) {
		res.send(account);
		// ATENÇÃO: brecha de segurança, pois retorna todo
		// o record da conta, incluindo a senha criptografada!
	});
});


// Trata acesso à página de senha esquecida
app.post('/forgotpassword', function(req, res) {
	console.log("Express POST acionado para /forgotpassword");
	var hostname = req.headers.host;
	// Prepara a URL a ser usada no reset da senha
	var resetPasswordUrl = 'http://' + hostname + '/resetPassword';
	var email = req.param('email', null);
	if ( null == email || email.length < 1 ) {
		console.log('Email em branco ou muito curto em POST /forgotpassword');
		res.send(400);
		return;
	}

	models.Account.forgotPassword(email, resetPasswordUrl, function(success) {
		if (success) {
			res.send(200);
		} else {
			console.log('email or password not found in POST /forgotpassword');
			res.send(404);
		}
	});
});

// Trata reset de senha

// 1. GET
app.get('/resetPassword', function(req, res) {
	var accountId = req.param('account', null); // 'account' vem da URL
	console.log("app.js; /resetPassword com GET; accountId = " + accountId);
	// res.render('resetPassword.jade', {locals:{accountId: accountId}}); // resetPassword.jade chama /resetPassword com POST e nova senha
	// Não se usa mais a palavra reservada 'locals' na passagem dos parâmetros a partid do Express 3.0.0
	// Veja: http://stackoverflow.com/questions/10199400/expressjade-local-variable-not-available-in-view/10205586#10205586
	res.render('resetPassword.jade', {accountId: accountId}); // resetPassword.jade chama /resetPassword com POST e nova senha
});

// 2. POST
app.post('/resetPassword', function(req, res) {
	var accountId = req.param('accountId', null);
	console.log("app.js; /resetPassword com POST; accountId = " + accountId);
	var password = req.param('password', null);
	console.log("app.js; /resetPassword com POST; password = " + password);
	if ( null != accountId && null != password ) {
		models.Account.changePassword(accountId, password);
	}
	res.render('resetPasswordSuccess.jade');
	console.log('reset password successful in app.js /resetPassword with POST');
	// ATENÇÃO: Me parece que nesse ponto session.loggedIn deveria ser setado para false...
	// Senão, mesmo com a senha mudada, a página de index pode ser acessada com #index
});


app.listen(8080);
console.log('Escutando na porta 8080');

