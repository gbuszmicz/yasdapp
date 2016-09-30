var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');
var shortid = require('shortid');

var files = new mongoose.Schema({
	name					: { type: String, required: false },  // Nombre del archivo
	hashName			: { type: String, required: false },  // MD5 hash del archivo
  type	 				: { type: String, required: false },  // Tipo de archivo: PDF, DOC, XLS, etc
  timestamp			: { type: String, required: false },  // Unixtime
  size					: { type: String, required: false },  // Tamaño en bytes
	url					  : { type: String, required: false }	  // URL de Amazon por ahora
});

var records = new mongoose.Schema({
	action	: { type: String, required: false },  								// What. Que se trato de hacer
  date	 	: { type: Date, required: true, default: Date.now },  // When. Fecha de la accion
	ip			: { type: String, required: false }	  								// Who. Direccion IP
});

var schema = new mongoose.Schema({
  shortId				  : { type: String, unique: true, 'default': shortid.generate, index: true }, // Id
  status	   			: { type: String, required: true, default: 'Empty' },  // Ver comentario Estados mas abajo 
  seed	   			  : { type: String, required: false },  // random generated en el servidor
  secret					: { type: String, required: false },  // seed cifrado con AES y passphrase del usuario
  locationText		: { type: String, required: false },  // i.e. Rosario, Santa Fe Province, Argentina
	files						: [ files ],  // Archivos asociados
	activity				: [ records ],  // Actividad del documento. Se va a definir si alguien trato de abrir el archivo con una pass incorrecta por ejemplo, si ya se descargó, etc
	email						: { type: String, required: false } // A quien le enviamos el link
});
schema.set('autoIndex', false);
schema.plugin(timestamps);
module.exports = Message = mongoose.model('Message', schema);

/**
 * Posibles estados
 *
 *  Empty: sin archivos asocialdos aun. Esto puede ser por un error (se creo el doc pero no se cancelo el upload), o porque esta en uso
 *  Sending: enviando correo
 *  Sent: se envio exitosamente el correo al destinatario
 *  Error: hubo un error con el envio del correo
 *
 */
