var curl                = require('curlrequest');
var http                = require('http');
var querystring         = require('querystring');
var fs                  = require('fs');
var scanner             = require('node-libnmap');
var childProcess        = require('child_process');
var onvif               = require('onvif');
var clientCookie        = require('client-cookie-utils');
var Cam                 = onvif.Cam;


var camController       = require('./controllers/camController.js');
var mainController      = require('./controllers/mainController.js');

module.exports = function(app){
	app.get('/setup',                 mainController.setup);
    app.get('/',          isLoggedIn, mainController.home);

    app.get('/login',                 mainController.login);
    app.post('/login',                mainController.post.login);

    app.get('/signup',                mainController.signup);
    app.post('/signup',               mainController.post.signup);

    app.get('/ipCamList', isLoggedIn, mainController.ipCamList);    

    //ffmpeg -re -rtsp_transport tcp  -i rtsp://:@192.168.1.6/user=admin_password=tlJwpbo6_channel=1_stream=0.sdp?real_stream -c:v copy -c:a copy -f flv rtmp://5.196.89.139/live/EDALL_LIVE
    app.post('/camList',              camController.camList);
    app.post('/feedLookup',           camController.feedLookup);
    app.post('/stopFFmpeg',           camController.stopFFmpeg);

    app.post('/addCam',               camController.addCam);
    app.post('/removeCam',            camController.removeCam); 
};

function isLoggedIn(req, res, next) {
    if (clientCookie.isClientCookiePresent()){
	  next();
	} else {
	  res.redirect('./setup');
	}
}