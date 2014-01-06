module.exports = function(config, mongoose, nodemailer) {
	var crypto = require('crypto');

	var AccountSchema = new mongoose.Schema({
		email: { type: String, unique: true },
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
		biography: { type: String }
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
				console.log('Change password done for account ' + accountId);
			}
		);
	};

	// A função forgotPassword envia um e-mail para o proprietário da conta
	// instruindo-o a redefinir a senha
	var forgotPassword = function(email, resetPasswordUrl, callback) {
		var user = Account.findOne( {email: email}, function findAccount(err, doc) {
			if (err) {
				// Endereço de email não é um usuário válido
				callback(false);
			} else {
				var smtpTransport = nodemailer.createTransport('SMTP', config.mail);
				resetPasswordUrl += '?account=' + doc._id;
				smtpTransport.sendMail({
					from: 'thisapp@example.com',
					to: doc.email,
					subject: 'SocialNet Password Request',
					text: 'Click here to reset your password: ' + resetPasswordUrl
				}, function forgotPasswordResult(err) {
					if (err) {
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
			callback(null!=doc);
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
		console.log('Save command was sent');
	};

	return {
		register: register,
		forgotPassword: forgotPassword,
		changePassword: changePassword,
		login: login,
		Account: Account
	}

} // fim
