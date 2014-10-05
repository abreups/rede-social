define(['SocialNetView', 'text!templates/contact.html'], 
function(SocialNetView, contactTemplate) {
	var contactView = SocialNetView.extend({
		addButton: false,
		removeButton: false,
		tagName: 'li',

		events: {
			"click .addbutton": "addContact",
			"click .removebutton": "removeContact"
		},

		addContact: function() {
			var $responseArea = this.$('.actionarea'); // não tem que ser '.actionarea' ? BUG ??
			$.post('/accounts/me/contact',
				{contactId: this.model.get('_id')},
				function onSuccess() {
					$responseArea.text('Contato adicionado');
				}, function onError() {
					$responseArea.text('Não foi possível adicionar o contato');
				}
			);
		},

		// Remove contato
		removeContact: function() {
			var $responseArea = this.$('.actionarea');
			$responseArea.text('Removendo contato...');
			$.ajax({
				url: '/accounts/me/contact',
				type: 'DELETE',
				data: {
					contactId: this.model.get('accountId')
					}}).done(function onSuccess() {
						$responseArea.text('Contato removido');
					}).fail(function onError() {
						$responseArea.text('Não foi possível remover o contato');
					});
		},

		initialize: function() {
			// Define a variável addButton caso ela tenha sido incluída no construtor
			if ( this.options.addButton ) {
				this.addButton = this.options.addButton;
			}
			if ( this.options.removeButton ) {
				this.removeButton = this.options.removeButton;
			}
		},

		render: function() {
			$(this.el).html(_.template(contactTemplate, {
				model: this.model.toJSON(),
				addButton: this.addButton,
				removeButton: this.removeButton
			}));
		}
	});
	return contactView;
});

