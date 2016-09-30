var env = process.env.NODE_ENV || 'development';
var config = require('../env/'+process.env.NODE_ENV+'.json') || {};
var mongoose = require('mongoose');
var Message = mongoose.model('Message');
var validator = require('validator');
// var i18n = require('i18n');

var logger = require('../helpers/logger');
var s3 = require('../helpers/s3');
var randomString = require('../helpers/strings').generateRandomString;
var queue = require('../queue-manager').queue;

exports.signS3UploadRequest = function(req, res) {
	var raw_object = req.query.s3_object_name;
  var mime_type = req.query.s3_object_type;

  var file_name = req.params.filename;
  var overrideType = "application/octet-stream";
  var object_name = 'files/'+raw_object.toString()+'/'+file_name;
  s3.getSignedUrl(object_name, overrideType, function(err, return_data) {
    if(err) {
			logger.error(err);
			// TODO - Devolverle algo al usuario
		}
    res.write(JSON.stringify(return_data));
    return res.end();
  });
};

/**
 * Esta funcion se ejecuta cuando el usuario ingresa al homepage
 */
exports.getEncryptPage = function(req, res) {
	var compatibility = (req.useragent.browser !== "Chrome" && req.useragent.browser !== "Firefox") ?
		res.__('pages.compatibility') : 
		'oka';

	randomString(20, function(seed) {
		return res.render('pages/encrypt', { 
			baseUrl: config.app.domain,
			seed: seed,
			compatibility: compatibility
		})
	})
}

exports.createMessage = function(req, res) { 
	var data = req.body;
	// Check for null data
	if(validator.isNull(data.seed) || validator.isNull(data.secret) || validator.isNull(data.email)) 
		return res.send({ status:'error', msg:res.__('errors.varNull') });
	
	// Check for valid email address
	if(!validator.isEmail(data.email)) 
		return res.send({ status:'error', location:'email', msg:res.__('errors.invalidEmail') });
		
	var seed = validator.toString(data.seed);
	var secret = validator.toString(data.secret);
	var email = validator.toString(data.email);
	
	var msg = new Message({
		status: 'Empty',
		seed: seed,
		secret: secret,
		email: email
	});
	
	var remoteIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress || 'unknown';
	var log = { action:'create', ip:remoteIp };
	msg.activity.push(log);
	
	msg.save(function(err, msg) {
		if(err) {
			logger.error(err);
			return res.send({ status:'error', msg:err });
		}
		return res.send({ status:'success', msgid:msg.shortId})
	})
}

/**
 * Esta funcion se utiliza para actualizar un mensaje ya creado
 * El usuario agrega archivos o cierra el mensaje para ser enviado
 */
exports.updateMessage = function(req, res) {
	var data = req.body;
	if(validator.isNull(req.params.msgid)) return res.send({ status:'error', msg:res.__('errors.msgIdNull') })
	var msgid = validator.toString(req.params.msgid);
	
	Message.findOne({ shortId:msgid }).exec(function(err, msg) {
    if(!msg) return res.send({ status:'error', msg:res.__('errors.404msg') })
		if(msg.secret !== data.secret) return res.send({ status:'error', msg:res.__('errors.401') })
		// Esta linea esta tirando errores. Puede que el mensaje se envie antes de finalizar el agregado
	  // de archivos.
		// if(msg.status !== "Empty") return res.send({ status:'error', msg:res.__('errors.403msg') })
		
		var return_data = { status:'success' } // Por defecto es para addFile
		
		// Agrego un nuevo archivo
		if(data.action == "addFile") {
			var file = { 
				name: data.name, 
				hashName: data.hashName, 
				type: data.type, 
				timestamp: data.timestamp, 
				size: data.size,
				url: data.public_url
			}
			msg.files.push(file);
		}
		
		// Todos los archivos ya fueron agregados, cierro el mensaje y envio mail
		if(data.action == "closeMessage") {
			msg.status = "Sending"
			logger.debug("Sending email....");
			var link = '/m/'+msg.shortId
			return_data = { status:'success', link:link }
			
			queue.push({ task:'send email', to:msg.email, link:link, mid:msg.shortId, lang:req.getLocale() });  // Le envio al worker la tarea de enviar el correo
			// TODO. Stats
			var remoteIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress || 'unknown';
			var filterIp = remoteIp.split(',')[0];
			queue.push({ task: 'update stats', count: msg.files.length+1, ip:filterIp });  // Sumo archivos, email e IP
		}

		msg.save(function(err, msg) {
			if(err) {
				logger.error(err);
				return res.send({ status:'error', msg:err });
			}
			return res.send(return_data)
		})
	})
}

/**
 * Esta funcion se ejecuta cuando el usuario ingresa al link del mensaje.
 * Solamente se muestra información NO relevante
 * Ademas se pasa el "secret" para que el usuario lo descifre con su passphrase
 * y asi validarla
 */
exports.getMessage = function(req, res) {
	var msgid = validator.toString(req.params.msgid);
	var queryFields = "shortId files._id files.size secret";
	var compatibility = (req.useragent.browser !== "Chrome" && req.useragent.browser !== "Firefox") ?
		res.__('pages.compatibility') : 
		'oka';
	
	Message.findOne({ shortId:msgid }, queryFields).lean().exec(function(err, msg) {
    if(!msg) return res.send({ status:'error', msg:res.__('errors.404msg') })
		return res.render('pages/decrypt', { 
			files:msg.files, 
			msgid:msg.shortId, 
			secret:msg.secret,
			compatibility:compatibility 
		});
	})
}

/**
 * Esta funcion se ejecuta cuando el usuario ingresa una contraseña
 * para descifrar un mensaje.
 * Si la contraseña ingresada es correcta se devuele la info de los archivos
 */
exports.validatePassphrase = function(req, res) {
	var msgid = validator.toString(req.params.msgid);
	if(validator.isNull(req.body.seed)) // seed es null cuando el pass es incorrecto
		return res.send({ status:'error', msg:res.__('errors.401pass') })

	var seed = validator.toString(req.body.seed);
	var queryFields = "shortId files seed";
	var lang = req.body.lang || 'en';
	req.setLocale(lang);

	Message.findOne({ shortId:msgid }, queryFields).lean().exec(function(err, msg) {
    if(!msg) return res.send({ status:'error', msg:res.__('errors.404msg') })
		if(msg.seed !== seed) return res.send({ status:'error', msg:res.__('errors.401pass') })
		return res.send({ status:'success', files:msg.files });
	})
}

/**
 * Esta funcion se ejecuta cuando el usuario hace click en eliminar mensaje
 */
exports.removeMessage = function(req, res) { // TODO. Validate!!!
	var msgid = validator.toString(req.params.msgid);
	if(validator.isNull(req.body.seed)) return res.send({ status:'error', msg:res.__('errors.401pass') })
	var seed = validator.toString(req.body.seed);
	var queryFields = "shortId seed files files.hashName";
	var lang = req.body.lang || 'en';
	req.setLocale(lang);

	Message.findOne({ shortId:msgid }, queryFields).exec(function(err, msg) {
    if(!msg) return res.send({ status:'error', msg:res.__('errors.404msg') })
		if(msg.seed !== seed) return res.send({ status:'error', msg:res.__('errors.401pass') })
		
		var files = [];
		for(var j=0; j<msg.files.length; j++) {
			var file = 'files/'+msg.shortId+'/'+msg.files[j].hashName
			files.push({Key: file})
		}
		queue.push({ task:'remove s3 files', files:files });
		msg.remove();
		files.length = 0;
		
		return res.send({ status:'success' });
	})
}