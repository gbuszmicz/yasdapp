var mongoose = require('mongoose');
var config = require('./env/'+process.env.NODE_ENV+'.json') || {};
var logger = require('./helpers/logger');

var options = {
  db: { 
		native_parser:true, 
		retryMiliSeconds:5000, 
		numberOfRetries:50 
	},
  server: { 
		socketOptions: { 
			keepAlive: 1, 
			connectTimeoutMS: 12000 
		}, 
		auto_reconnect: true 
	}
};

mongoose.connect(config.mongodb.uri, options, function(err, res) {
  if(err) logger.error('// ---- Error connecting to MongoDB', {error: err, source:filename});
});

mongoose.connection.on('open', function() {
  logger.info('## -------- Connected to MongoDB successfully!');
});

module.exports = mongoose.connections[0];
