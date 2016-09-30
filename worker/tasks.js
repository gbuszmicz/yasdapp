var filename = 'worker/tasks.js';
var config = require('../env/'+process.env.NODE_ENV+'.json') || {};
var mongoose = require('mongoose');
var ipInfo = require("ipinfo");
var Message = mongoose.model('Message');
var Stat = mongoose.model('Stat');
var logger = require('../helpers/logger');
var deleteFiles = require('../helpers/s3').deleteFiles;
var mailgun = require('mailgun-js')({ apiKey:config.email.api_key, domain:config.email.domain });

/**
 * Para eliminar files de S3
 */
exports.removeS3Files = function(data) {
	logger.debug("#--- Executing removeS3Files")
	var files = data.files;
	if(files.length == 0) return logger.error("No files to remove from S3")
	if(files.length > 0)
	deleteFiles(files, function(err, count) {
		if(err) return logger.error("Error removing files from S3", {file:filename, err:err})
		if(count) return logger.info("Files removed from S3", {count:count})
	})
}

/**
 * Para enviar correo con enlace a docs
 */
exports.sendEmail = function(data) {
	logger.debug("#--- Executing sendEmail...", {to:data.to, link:data.link, lang:data.lang});
	var link = config.app.domain+data.link
	var twitterLink ='https://twitter.com/Yasdapp';
	var subject = 'We have some files for you!';
	var body = 'Follow the link to access the files. You will need a passphrase to decrypt them. The same person who has sent you this email should provide you with the passphrase. Have fun!\r\n'+link+'\r\n\r\n\r\nThe team at Yasdapp\r\n'+twitterLink
	// Locales
	if(data.lang == 'es') {
		subject = '¡Tenemos unos archivos para vos!';
		body = 'Haz click en el link más abajo para acceder a los archivos. Vas a necesitar una contraseñas para descifrarlos. La personas que te los envió seguramente ya te la ha pasado. De no ser así deberías pedírsela. ¡Que te diviertas!\r\n'+link+'\r\n\r\n\r\nEl equipo de Yasdapp\r\n'+twitterLink
	}

	var email = {
	  from: config.email.full_account,
	  to: data.to,
	  subject: subject,
	  text: body
	};
	mailgun.messages().send(email, function (error, body) {
		if(error) return logger.error(error)
	  logger.info(body);
		return Message.update({ shortId:data.mid }, { $set: { status: 'Sent' }}).exec();
	});
}

/**
 * Para actualizar las estadisticas
 * de uso de la plataforma
 */
exports.updateStats = function(data) {
	logger.debug("#--- Executing updateStats", {files:data.count, email:1, ip:data.ip})
	if(data.ip) {
		ipInfo(data.ip, function (err, cLoc) {
			if(err) return logger.error(err)
			Stat.findOne({ city:cLoc.city, country:cLoc.country, region:cLoc.region }).exec(function(err, doc) {
        if(err) return logger.error(err)
        if(doc) doc.fileCount = doc.fileCount + data.count;
        if(!doc) {
          doc = new Stat();
          doc.fileCount = data.count;
          doc.country = cLoc.country;
          doc.region = cLoc.region;
          doc.city = cLoc.city;
        }
        doc.save(function(err) {
          if(err) return logger.error(err)
          if(!err) logger.info("#--- Stats updated!")
        });
      });
    });
	}
  if(!data.ip) return logger.error("No data.ip found", {func:"updateStas"})
}