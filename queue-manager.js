var filename = 'worker-manager.js';

var taskman = require('node-taskman');
var config = require('./env/'+process.env.NODE_ENV+'.json') || {};
var logger = require('./helpers/logger');

var REDIS_PORT = config.redis.port;
var REDIS_HOST = config.redis.host;
var REDIS_PASS = config.redis.pass;

// Creo la cola para las tareas del worker
var queueName = 'queue';
var queue = taskman.createQueue(queueName, {
  redis: {
    port:REDIS_PORT,
    host:REDIS_HOST,
    'auth_pass': REDIS_PASS
    }
  });

exports.queue = queue;

function checkQueueLength() {
	queue.redis.llen('queue:queue', function(err, count) {
  	if(err) return logger.error(err, {source:filename});
		return logger.info("Queue ", {count:count});
  });
}

// Cada 5 minutos (300000) actualizo el estado de las colas
// setInterval(function() { checkQueueLength(); }, 60000);
