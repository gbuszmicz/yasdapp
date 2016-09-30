var filename = 'worker/jobs.js';
var mongoose = require('mongoose');
var Message = mongoose.model('Message');
var logger = require('../helpers/logger');
var queue = require('../queue-manager').queue; // Para volver a encolar trabajos

/**
 * Job para eliminar mensajes con estado Empty
 * y viejos, es decir, que no se están actualizando ahora
 */
exports.deleteEmpty = function(job, done) {
	logger.info('## -------- Checking for empty messages to remove');
	var cutoff = new Date();
	cutoff.setDate(cutoff.getDate()-2);
	Message.find({ 
		status:'Empty', 
		modificationDate: { $lt: cutoff }
	}).exec(function(err, docs) {
		if(err) return logger.error(err, {source:filename});
		if(!docs || docs.length == 0) return logger.info('!#######---------- No empty messages');
		if(docs && docs.length > 0) {
			logger.info('!$$$$$$$---------- '+docs.length+' empty objects to remove');
			for(var i=0; i<docs.length; i++) {
				docs[i].remove();
			}
		}
	})
	done();
}

/**
 * Job para eliminar mensajes mayores a 30 días
 * Se eliminan adicionalmente los archivos de S3
 */
exports.deleteOld = function(job, done) {
	logger.info('## -------- Checking for old messages to remove');
	var cutoff = new Date();
	cutoff.setDate(cutoff.getDate()-30);
	Message.find({ 
		modificationDate: { $lt: cutoff }
	}).exec(function(err, docs) {
		if(err) return logger.error(err, {source:filename});
		if(!docs || docs.length == 0) return logger.info('!#######---------- No old messages');
		if(docs && docs.length > 0) {
			logger.info('!$$$$$$$---------- '+docs.length+' old objects to remove');
			for(var i=0; i<docs.length; i++) {
				var item = docs[i];
				var files = [];
				for(var j=0; j<item.files.length; j++) {
					var file = 'files/'+item.shortId+'/'+item.files[j].hashName
					files.push({Key: file})
				}
				queue.push({ task:'remove s3 files', files:files });
				item.remove();
				files.length = 0;
			}
		}
	})
	done();
}

// TODO. Bueno, toda la funcion
exports.sendStatusEmail = function(job, done) {
	logger.info('## -------- Sending email status to mua');
	done();
}

