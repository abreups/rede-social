// Métodos (funções):
//		findById
//		register
//		forgotPassword
//		changePassword
//		login
//		Account
//



module.exports = function(config, mongoose, Status, nodemailer) {
	var crypto = require('crypto');

	var Status = new mongoose.Schema({
		name: {
			first: { type: String },
			last: { type: String }
		},
		status: {type: String}
	});

	var AccountSchema = new mongoose.Schema({
		email: { type: String, unique: true }, // o campo de e-mail tem que ser único (unique)
		password: { type: String },
		name: {
			first: { type: String },
			last: { type: String }
		},
		birthday: {
			day: { type: Number, min: 1, max: 31, required: false },
			month: { type: Number, min: 1, max: 12, required: false },
			year: { type: Number }
		},
		photoUrl: { type: String },
		biography: { type: String },
		status: [Status], // Apenas minhas próprias atualizações de status
		activity: [Status] // Todas as atualizações de status, incluindo amigos
	});

	var Account = mongoose.model('Account', AccountSchema);

	var registerCallback = function(err) {
		if (err) {
			return console.log(err);
		};
		return console.log('Account was created');
	};

	var changePassword = function(accountId, newpassword) {
		var shaSum = crypto.createHash('sha256'); // cria um hash criptográfico usando o algoritmo 'sha256'
		shaSum.update(newpassword); // updates the hash content with the given data (i.e. newpassword)
		var hashedPassword = shaSum.digest('hex'); // essa operação é: newpassword -> hash() -> digest, e o digest é armazenado
		console.log("Account.js; changePassword; accountId = " + accountId);
		Account.update(
			{_id:accountId}, 
			// O comando $set do MongoDB altera um único valor no registro da conta
			// em vez de o documento inteiro.
			{$set: {password:hashedPassword}}, 
			// A definição de upsert como false significa que a consulta vai 
			// funcionar apenas em um documento que exista no banco de dados;
			// ela não vai criar uma conta nova.
			{upsert:false},
			function changePasswordCallback(err) {
				// TO-DO: colocar um teste de sucesso ou não.
				console.log("err = " + err);
				console.log('Change password done for account ' + accountId);
			}
		);
	};

	// A função forgotPassword envia um e-mail para o proprietário da conta
	// instruindo-o a redefinir a senha
	var forgotPassword = function(email, resetPasswordUrl, callback) {
		console.log("Chamou a função forgotPassword em models/Account.js");
		var user = Account.findOne( {email: email}, function findAccount(err, doc) {
			if (err) {
				// Endereço de email não é um usuário válido
				callback(false);
			} else {
				// var smtpTransport = nodemailer.createTransport('SMTP', config.mail);
				// SMTP alterado para SES para usar produto AWS SES para e-mails
				// Arquivo /config/mail.js alterado apropriadamente
				// Veja http://www.nodemailer.com/docs/ses
				var smtpTransport = nodemailer.createTransport('SES', config.mail);
				console.log("resetPasswordUrl = " + resetPasswordUrl);
				resetPasswordUrl += '?account=' + doc._id;
				console.log("resetPasswordUrl = " + resetPasswordUrl);
				console.log("doc.email = " + doc.email);
				smtpTransport.sendMail({
					from: 'abreups@gmail.com', // precisa testar com AWS SES
					to: doc.email,
					subject: 'Mestre Cuca Password Request',
					text: 'Click here to reset your password: ' + resetPasswordUrl
				}, function forgotPasswordResult(err) {
					if (err) {
						console.log("Erro: " + err);
						callback(false);
					} else {
						callback(true);
					}
				});
			}
		});
	};

	//
	// As funções login e register usam conceitos de 'digest'.
	// Um bom artigo para entender esse conceito é esse:
	// http://www.unixwiz.net/techtips/iguide-crypto-hashes.html
	//
	// "A função de login consulta o MongoDB e retorna um sinalizador (flag)
	// de verdadeiro ou falso indicando se foi ou não capaz de encontrar um usuário cujo
	// endereço de e-mail e senha hasheada correspondem às credenciais de login
	// fornecidas pelo Node.js. Se nenhuma conta tiver sido encontrada no banco de dados
	// a variável doc será nula; do contrário, ela será preenchida a partir do MongoDB.
	//
	var login = function(email, password, callback) {
		var shaSum = crypto.createHash('sha256'); // cria um hash criptográfico usando o algoritmo 'sha256'
		shaSum.update(password); // updates the hash content with the given data (i.e. password)
		Account.findOne({email:email, password:shaSum.digest('hex')}, function(err, doc) {
			// callback(null!=doc); // pág 76 do livro
			callback(doc); // pág 116 do livro e github em Junho 2014
		});
	};

	var findById = function(accountId, callback) {
		Account.findOne({_id:accountId}, function(err, doc) {
			callback(doc);
		});
	};

	var register = function(email, password, firstName, lastName) {
		var shaSum = crypto.createHash('sha256'); // cria um hash criptográfico usando o algoritmo 'sha256'
		shaSum.update(password); // updates the hash content with the given data (i.e. password)

		console.log('Registering ' + email);
		var user = new Account({
			email: email,
			name: {
				first: firstName,
				last: lastName
			},
			password: shaSum.digest('hex') // essa operação é: senha -> hash() -> digest, e o digest é armazenado
		});
		user.save(registerCallback);
		// TO-DO?: testar se houve erro?
		console.log("registerCallback: " + registerCallback);
		console.log('Save command was sent');
	};

	return {
		findById: findById,
		register: register,
		forgotPassword: forgotPassword,
		changePassword: changePassword,
		login: login,
		Account: Account
	}

} // fim

