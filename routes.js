
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
var logger = require('./helpers/logger');
var ctrl = require('./controllers/messages');

module.exports = function(app) {

	app.get('*', function(req, res, next) {		
		// Esto es por requests headless (sin encabezado)
		if(typeof req.headers["accept-language"] == 'undefined') req.locale = 'en';
		if(typeof req.locale == 'undefined' || (req.locale !== 'en' && req.locale !== 'es')) req.locale = 'en';
		if(req.useragent.isCurl) req.locale = 'en';
		req.setLocale(req.locale);
		next('route');
	});

	app.param('msgid', function(req, res, next, msgid) {
		var regex = new RegExp(/^[a-zA-Z0-9_-]{7,14}$/);
		regex.test(msgid) ? next() : next('route');
	});
	
	// Index
	app.get('/', ctrl.getEncryptPage);
	
	// Sign S3 upload request
	app.get('/sign-upload/:filename', ctrl.signS3UploadRequest);
	// app.post('/sign-upload', ctrl.postSignS3UploadRequest);

	app.post('/new', jsonParser, ctrl.createMessage);										// Create
	app.get('/m/:msgid', ctrl.getMessage);															// Get (query)
	app.post('/m/:msgid', jsonParser, ctrl.validatePassphrase);					// Validate passphrase
	app.post('/m/:msgid/update', jsonParser, ctrl.updateMessage);				// Update
	app.post('/m/:msgid/remove', jsonParser, ctrl.removeMessage);				// Remove
};
