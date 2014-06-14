define(['SocialNetView', 'text!templates/index.html',
	'views/status', 'models/Status'], 
function(SocialNetView, indexTemplate, StatusView, Status) {
	var indexView = SocialNetView.extend({
		el: $('#content'),

		events: {
			"submit form": "updateStatus"
		},

		initialize: function() {
			this.collection.on('add', this.onStatusAdded, this);
			this.collection.on('reset', this.onStatusCollectionReset, this);
		},

		onStatusCollectionReset: function(collection) {
			var that = this;
			collection.each(function (model) {
				that.onStatusAdded(model);
			});
		},

		onStatusAdded: function(status) {
			console.log("Entrou em onStatusAdded de index.js");
			console.log("status = " + status);
			var x = new StatusView({model:status});
			console.log("x = " + x);
			statusHtml = x.render().el;
			// var statusHtml = (new StatusView({ model : status})).render().el;
			// console.log("statusHtml em index.js onStatusAdded = " + statusHtml);
			$(statusHtml).prependTo('.status_list').hide().fadeIn('slow');
		},

		// updateStatus é uma função disparada pelo evento 'submit form' (acima).
		// A função updateStatus coleta as informações fornecidas pelo usuário, posta essas informações no backend do Express,
		// gera um novo objeto 'status' e adiciona esse objeto ao objeto de coleção da visão.
		// O objeto de coleção é uma instância de 'StatusCollection'
		updateStatus: function() {
			var statusText = $('input[name=status]').val();
			var statusCollection = this.collection;
			$.post('/accounts/me/status', {
				status: statusText
			}, function(data) {
				statusCollection.add(new Status({status:statusText}));
			});
			return false;
		},

		render: function() {
			console.log("entrou em render de index.js");
			console.log("indexTemplate = " + indexTemplate);
			this.$el.html(indexTemplate);
		}
	});

	return indexView;
});

