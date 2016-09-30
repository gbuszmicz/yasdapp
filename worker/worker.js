var logger = require('../helpers/logger');
// var mongoose = require('mongoose');
var taskman = require('node-taskman');
process.env.NODE_ENV = process.env.NODE_ENV || 'development';
var config = require('../env/'+process.env.NODE_ENV+'.json') || {};
if(process.env.NODE_ENV === 'development') {
  logger.info('-------------------------------------------------------------');
  logger.info('----------------------|| WORKER DEV ||-----------------------');
  logger.info('-------------------------------------------------------------');
}
if(process.env.NODE_ENV === 'production') {
  logger.info('-------------------------------------------------------------');
  logger.info('----------------------|| WORKER PROD ||----------------------');
  logger.info('-------------------------------------------------------------');
}

require('../db');
require('../models/messages');
require('../models/stats');

var workerTasks = require('./tasks');
var agenda = require('./schedule.js');
var worker = taskman.createWorker('queue', {
  batch: 2,
  name: 'taskman',
  redis: {
    port:config.redis.port,
    host:config.redis.host,
    'auth_pass': config.redis.pass
  }
});

worker.on('job failure', function (task, error) {
  logger.error(error, { task:task, source:filename });
});

worker.on('error', function (error) {
  logger.error(error, {source:filename});
});

worker.process(function(tasks, done) {
  for(var i=0; i<tasks.length; i++) {
    if(tasks[i] !== null) {
      var todo = tasks[i];
      if(todo.task === 'send email') workerTasks.sendEmail(todo);
			if(todo.task === 'sum email') logger.info("sum email task")  // TODO. Eliminar
			if(todo.task === 'sum files') logger.info("sum files task", {files:todo.count}) // TODO. Eliminar
      if(todo.task === 'update stats') workerTasks.updateStats(todo) // actualizo las stats de uso de la app
			if(todo.task === 'remove s3 files') workerTasks.removeS3Files(todo)
    }
  }
  done();
});


