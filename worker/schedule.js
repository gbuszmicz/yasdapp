var filename = 'worker/schedule.js';
var logger = require('../helpers/logger');
var jobs = require('./jobs');
var config = require('../env/'+process.env.NODE_ENV+'.json') || {};
var Agenda = require('agenda');

var agenda = new Agenda({db: { address: config.mongodb.uri, collection: 'jobs' }});

function ignoreErrors() {
	logger.debug("Ignore errors function executing")
}

logger.info('##----- Scheduling jobs...');

// Si falla por algo alguna tarea se ejecuta esta funcion
agenda.on('fail', function(err, job) {
	return logger.error('Job failed with error', {err:err.message, where:filename});  
});

agenda.on('error', function() {
  logger.error("Error connecting agenda with mongodb")
});

agenda.on('ready', function() {
	// Defino los trabajos
	agenda.define('Delete empty messages', { priority:'normal' }, jobs.deleteEmpty);
	agenda.define('Delete old messages', { priority:'normal' }, jobs.deleteOld);
	agenda.define('Send status email', { priority:'normal' }, jobs.sendStatusEmail);
	
	// Defino los tiempos de actualizacion de cada trabajo
	agenda.every('12 hours', 'Delete empty messages');
	agenda.every('7 hours', 'Delete old messages');
	agenda.every('24 hours', 'Send status email');
	
  agenda.start();
});

// Para apagar correctamente los servicios de Agenda
function graceful() {
	logger.debug('Closing agenda....');
  agenda.stop(function() {
    process.exit(0);
  });
}
process.on('SIGTERM', graceful);
process.on('SIGINT' , graceful);

module.exports = agenda;