var scanner = require('node-libnmap');
var socketioClient    = require('socket.io-client');
var fs                = require('fs');
var flash             = require('connect-flash');
var express           = require('express');        // call express
var session           = require('express-session');
var app               = express();                 // define our app using express
var port              = 3333;

var witouch           = require('witouch-mainserver');
var feedManager       = require('feed-manager');


var cookieParser      = require('cookie-parser');
var bodyParser        = require('body-parser');

var config 			  = require('config');

app.use(cookieParser()); 
app.use(bodyParser());
app.set('view engine', 'ejs');
app.set('views', __dirname+'/views');
app.use(session({ secret: 'ilovescotchscotchyscotchscotch' }));
app.use(flash());

var router = express.Router();

require('./routes')(router);
app.use('/', router);

app.use('/static', express.static(__dirname + '/public'));
var port = config.get("WebManager.port");
app.listen(port);
console.log("Web Manager started on port "+port);

witouch.attemptStart();

feedManager.killAllExisting();
