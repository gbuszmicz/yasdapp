var config = require('./config.json');
var mongoose = require('mongoose');
var Message = mongoose.model('Message');

var logger = require('./helpers/logger');
var s3 = require('./helpers/s3');
var queue = require('./worker-manager').queue;

exports.signS3UploadRequest = function(req, res) {
	var raw_object = req.query.s3_object_name;
  var mime_type = req.query.s3_object_type;

  var file_name = req.params.filename;
  var overrideType = "application/octet-stream";
  // var file_name = fn.substr(0, fn.lastIndexOf(".")) + ".encrypted"; // file_name.encrypted

  var object_name = 'files/'+raw_object.toString()+'/'+file_name;
	// var mime_type = "data/encrypted";
	// console.log(file_name.toString())
	// console.log(raw_object.toString())
	// console.log(mime_type.toString())
  
  s3.getSignedUrl(object_name, overrideType, function(err, return_data) {
    if(err) {
			logger.error(err);
			// TODO - Devolverle algo al usuario
		}
    res.write(JSON.stringify(return_data));
    return res.end();
  });
};

// exports.postSignS3UploadRequest = function(req, res) {
// 	// console.log(req)
// 	var file_name = req.body.name;
// 	var type = req.body.type;
// 	var size = req.body.size;
// 	
// 	console.log("Name: "+file_name);
// 	console.log("Type: "+type);
// 	console.log("Size: "+size);
// 	
// 	var object_name = 'files/as3dasas3/'+file_name;
// 	console.log("Url: "+object_name);
// 
//   s3.signS3(object_name, function(err, return_data) {
//     if(err) {
// 			logger.error(err);
// 			// TODO - Devolverle algo al usuario
// 		}
//     res.write(JSON.stringify(return_data));
//     return res.end();
//   });
// };

exports.createMessage = function(req, res) { // TODO: validate!!
	var data = req.body;
	var md5Hash = data.hash;
	
	var msg = new Message({
		status: 'Empty',
		hash: md5Hash
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
exports.updateMessage = function(req, res) { // TODO: validate!!
	var data = req.body;
	var msgid = req.params.msgid;
	
	Message.findOne({ shortId:msgid }).exec(function(err, msg) {
    if(!msg) return res.send({ status:'error', msg:'404 - Message not found' })
		if(msg.hash !== data.hash) return res.send({ status:'error', msg:'401 Unauthorized' })
		if(msg.status !== "Empty") return res.send({ status:'error', msg:'403 - Forbidden. Message cannot be edited' })
		
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
			console.log("Sending email....")
			var link = '/m/'+msg.shortId
			return_data = { status:'success', link:link }
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
 */
exports.getMessage = function(req, res) {
	var msgid = req.params.msgid;
	var queryFields = "shortId files._id files.size";
	
	Message.findOne({ shortId:msgid }, queryFields).lean().exec(function(err, msg) {
    if(!msg) return res.send({ status:'error', msg:'404 - Message not found' })
		return res.render('pages/decrypt', { files:msg.files, msgid:msg.shortId });
	})
}

/**
 * Esta funcion se ejecuta cuando el usuario ingresa una contraseña
 * para descifrar un mensaje.
 * Si la contraseña ingresada es correcta se devuele la info de los archivos
 */
exports.validatePassphrase = function(req, res) { // TODO. Validate!!!
	var msgid = req.params.msgid;
	var hash = req.body.hash;
	var queryFields = "shortId hash files";
	
	
	Message.findOne({ shortId:msgid }, queryFields).lean().exec(function(err, msg) {
    if(!msg) return res.send({ status:'error', msg:'404 - Message not found' })
		if(msg.hash !== hash) return res.send({ status:'error', msg:'401 Unauthorized. Passphrase is incorrect' })
		return res.send({ status:'success', files:msg.files });
	})
}
