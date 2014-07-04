// addcontact.js
// View da inclusão de amigo
define(['SocialNetView', 'models/Contact', 'views/Contact', 'text!templates/addcontact.html'],
	function(SocialNetView, Contact, ContactView, addcontactTemplate) {
		var addcontactView = SocialNetView.extend({
			el: $('#content'),

			events: {
				"submit form": "search"
			},

			search: function () {
				var view = this;	
				$.post('/contacts/find',
					this.$('form').serialize(), function(data) {
						view.render(data);
					}).error(function() {
						$("#results").text('Nenhum contato encontrado.');
						$("#results").slideDown();
					});
					return false;
			},

			render: function(resultList) {

			}

		});
	
});
