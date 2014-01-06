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
		var shaSum = crypto.createHash('sha256');
		shaSum.update(newpassword);
		var hashedPassword = shaSum.digest('hex');
		Account.update(
			{_id:accountId}, 
			{$set: {password:hashedPassword}}, 
			{upsert:false},
			function changePasswordCallback(err) {
				console.log('Change password done for account ' + accountId);
			}
		);
	};

}

