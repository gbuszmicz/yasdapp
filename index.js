var http = require('http');
var compression = require('compression');
var favicon = require('serve-favicon');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var express = require('express');
var app = express();
var ejs = require('ejs');
var useragent = require('express-useragent');
var locale = require("locale");
var i18n = require('i18n');
var logger = require('./helpers/logger');

// Seteo el environment
process.env.NODE_ENV = process.env.NODE_ENV || 'development';
if(process.env.NODE_ENV === 'development') {
	app.use(morgan('dev')); // Morgan hace los pedidos GET, POST, PUT y etc de colores, muy muy lindos!
  logger.info('-------------------------------------------------------------');
  logger.info('------------------------|| WEB DEV ||------------------------');
  logger.info('-------------------------------------------------------------');
}
if(process.env.NODE_ENV === 'production') {
  logger.info('-------------------------------------------------------------');
  logger.info('-----------------------|| WEB PROD  ||-----------------------');
  logger.info('-------------------------------------------------------------');
}
app.set('json spaces', 2);
app.use(compression({
  filter: function(req, res) {
    return (/json|text|javascript|css/).test(res.getHeader('Content-Type'));
  },
  level: 9
}));

app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));
app.use(favicon(__dirname + '/public/img/favicon.ico'));
app.set('views', __dirname + '/views');
app.engine('.html', ejs.__express);
app.set('view engine', 'html');

app.use(bodyParser.urlencoded({
  extended: true,
	limit: '5mb'
}));
// app.use(bodyParser.json({ limit: '5mb' }));
app.use(methodOverride());

i18n.configure({
  locales: ['en', 'es'], // locales:['en'],
  defaultLocale: 'en',
  objectNotation: true,
  directory: __dirname + '/locales',
  cookie: 'lang',  // sets a custom cookie name to parse locale settings from
});

// i18n init parses req for language headers, cookies, etc.
app.use(i18n.init);
app.use(locale(['en', 'es'], 'en')); 
app.use(useragent.express());

// Este helper lo utilizo en la vista decrypt
app.locals.fileSizeIEC = function(a,b,c,d,e) {
 return (b=Math,c=b.log,d=1024,e=c(a)/c(d)|0,a/b.pow(d,e)).toFixed(2)
 +' '+(e?'KMGTPEZY'[--e]+'iB':'Bytes')
}

require('./db');
require('./models/messages');
require('./routes')(app);

var server = http.createServer(app);
server.listen(app.get('port'), function(req, res) {
  logger.debug('La aplicacion funciona en el puerto: '+app.get('port'));
});

// app.listen(app.get('port'), function() {
//   console.log('Node app is running on port', app.get('port'));
// });


