var express = require('express');
var app = express();

app.configure(function() {
	app.set('view engine', 'jade');
	app.use(express.static(__dirname + '/public'));
});

// Trata acesso à página raiz do site
app.get('/', function(req, res){
	res.render("index.jade", {layout:false});
});

app.get('/account/authenticated', function(req, res) {
	if ( req.session.loggedIn ) {
		res.send(200); // 200 == OK
	} else {
		res.send(401); // 401 == not authorized
	}
});

// Trata acesso à página de registro
app.post('/register', function(req, res) {
	var firstName = req.param('firstName', '');
	var lastName = req.param('lastName', '');
	var email = req.param('email', null);
	var password = req.param('password', null);

	if ( null == email || null == password)  {
		res.send(400); // 400 == bad request / solicitação incorreta
		return;
	}
	Account.register(email, password, firstName, lastName);
	res.send(200); // Atenção: enviado sem que se saiba se a ação anterior teve sucesso
});

// Trata acesso à página de login
app.post('/login', function(req, res) {
	console.log('login request');
	var email = req.param('email', null);
	var password = req.param('password', null);
	if ( null == email || email.length < 1 || null == password || password.length < 1) {
		res.send(400); // 400 == bad request / solicitação incorreta
		return;
	}

	Account.login(email, password, function(success) {
		if ( !success ) {
			res.send(401);
			return;
		}
		console.log('login was successful');
		res.send(200);
	});
});

// Trata acesso à página de senha esquecida
app.post('/forgotpassword', function(req, res) {
	var hostname = req.headers.host;
	// Prepara a URL a ser usada no reset da senha
	var resetPasswordUrl = 'http://' + hostname + '/resetPassword';
	var email = req.param('email', null);
	if ( null == email || email.length < 1 ) {
		res.send(400);
		return;
	}

	Account.forgotPassword(email, resetPasswordUrl, function(success) {
		if (success) {
			res.send(200);
		} else {
			// Nome de usuário ou senha não encontrado
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
});


app.listen(8080);
console.log('Escutando na porta 8080');

