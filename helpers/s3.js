var mongoose = require('mongoose');
var aws = require('aws-sdk');
// var config = require('../config.json');
var config = require('../env/'+process.env.NODE_ENV+'.json') || {};
var logger = require('./logger');

// Variables, constantes y configuraciones iniciales
aws.config.update({ accessKeyId: config.s3.accessKey, secretAccessKey: config.s3.secretKey });

/*
  Firmar urls para que el usuario pueda subir un objeto a Amazon
  desde su navegador.
*/
exports.getSignedUrl = function(object, type, callback) {
  var s3 = new aws.S3();
  var params = {
    Bucket: config.s3.bucket,
    Key: object,
    Expires: 600, // 10 min
		ContentType: type,
    ACL: 'public-read'
  };
  s3.getSignedUrl('putObject', params, function(err, data) {
    if(err) return callback(err, null);
    var url = config.s3.bucketUrl+'/'+object;
    var return_data = {
        signed_request: data,
        url: url
    };
    callback(null, return_data);
  });
};

/**
 * Funcion para eliminar todos los archivos de un directorio
 * Se utiliza desde el worker para eliminar un mensajes de S3
 */
exports.deleteFiles = function(files, callback) {
	var s3 = new aws.S3();
	var params = {
    Bucket: config.s3.bucket,
    Delete: { 
	    Objects: files
	  }
  };
  s3.deleteObjects(params, function(err, data) {
	  if(err) return callback(err, null);
		callback(null, data.Deleted.length);
	});
};
