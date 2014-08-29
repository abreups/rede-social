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

		},

		removeContact: function() {

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

