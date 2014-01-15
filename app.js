var express = require('express');
var app = express();
var nodemailer = require("nodemailer");
var MemoryStore = require("connect").session.MemoryStore;

// Importa a camada de dados
var mongoose = require("mongoose");
var config = {
	mail: require('./config/mail')
};

// Importa as contas
var Account = require('./models/Account')(config, mongoose, nodemailer);

app.configure(function() {
	app.set('view engine', 'jade');
	app.use(express.static(__dirname + '/public'));
	app.use(express.limit('1mb')); // proteção básica contra DDOS
	app.use(express.bodyParser());
	// session é um middleware do Express para lidar com sessões(e.g. autenticado ou não)
	// cookieParser é tbém um middleware do Express e é requisito para se usar session.
	app.use(express.cookieParser());
	// MemoryStore is the built-in session store of Express. Has performance restrictions...
	app.use(express.session( { secret: "SocialNet secret Key", store: new MemoryStore() } ));
	mongoose.connect('mongodb://localhost/nodebackbone');
});

// Trata acesso à página raiz do site
app.get('/', function(req, res){
	console.log("Express GET acionado para /");
	// index.jade chama SocialNet.initialize() que testa se usuário está autenticado
	// e redireciona para /#login ou /#index.
	res.render("index.jade", {layout:true});
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

	Account.login(email, password, function(success) {
		if ( !success ) {
			console.log('login attempt failed in login');
			console.log("req.session.loggedIn = " + req.session.loggedIn);
			res.send(401);
			return;
		}
		console.log('login was successful in login');
		// seta a variável loggedIn na session store do Express para true == usuário está logado.
		req.session.loggedIn = true;
		console.log("req.session.loggedIn = " + req.session.loggedIn);
		res.send(200);
	});
});

// Trata acesso à página de registro
app.post('/register', function(req, res) {
	console.log("Express POST acionado para /register");
	var firstName = req.param('firstName', '');
	var lastName = req.param('lastName', '');
	var email = req.param('email', null);
	var password = req.param('password', null);

	if ( null == email || null == password)  {
		console.log('Attempt to register with blank email or password em register');
		res.send(400); // 400 == bad request / solicitação incorreta
		return;
	}

	Account.register(email, password, firstName, lastName);
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


// Trata acesso à página de senha esquecida
app.post('/forgotpassword', function(req, res) {
	var hostname = req.headers.host;
	// Prepara a URL a ser usada no reset da senha
	var resetPasswordUrl = 'http://' + hostname + '/resetPassword';
	var email = req.param('email', null);
	if ( null == email || email.length < 1 ) {
		console.log('Email em branco em forgotpassword');
		res.send(400);
		return;
	}

	Account.forgotPassword(email, resetPasswordUrl, function(success) {
		if (success) {
			res.send(200);
		} else {
			console.log('email or password not found in forgotpassword');
			res.send(404);
		}
	});
});

// Trata reset de senha
// 1. GET
app.get('/resetPassword', function(req, res) {
	var accountId = req.param('account', null);
	res.render('resetPassword.jade', {locals:{accountId:accountId}});
});
// 2. POST
app.post('/resetPassword', function(req, res) {
	var accountId = req.param('accountId', null);
	var password = req.param('password', null);
	if ( null != accountId && null != password ) {
		Account.changePassword(accountId, password);
	}
	res.render('resetPasswordSuccess.jade');
	console.log('reset password successful in resetPassword with POST');
});


app.listen(8080);
console.log('Escutando na porta 8080');

