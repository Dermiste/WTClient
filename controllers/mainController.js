
var curl                = require('curlrequest');
var fs                  = require('fs');
var witouch             = require('witouch-mainserver');
var clientCookie        = require('client-cookie-utils');
var config              = require('config');


exports.home = function (req, res){
	var u = clientCookie.getClientCookie();//JSON.parse(fs.readFileSync('./config/client.json'));
    u.isOnline = witouch.isConnected;
    res.render('home.ejs', {tagline:"Home",user:u}); 
};

exports.setup = function (req, res){
	res.render('setup.ejs', {message:"Some message",tagline:"Setp" }); 
};

exports.login = function (req, res){
	res.render('login.ejs', {message:req.flash('loginMessage'),tagline:"Login" }); 
};

exports.signup = function (req, res){
	res.render('signup.ejs', {message:req.flash('signupMessage'),tagline:"Signup" }); 
};


exports.ipCamList = function(req,res){
	res.render('ipCamList.ejs', {tagline:"Cam List",user:clientCookie.getClientCookie()});
};

exports.post = {},
exports.post.login = function(req,res){
	var opt     = {};
	opt.url     = config.get('Server.api')+"login";
	opt.method  = "POST";
	opt.data    = {"email":req.body.email,"password":req.body.password};
	curl.request(opt, function(err, resData){
        var data = JSON.parse(resData);
        if (data.success == true){
            clientCookie.writeClientCookie(data.user);
            //fs.writeFileSync('./../config/client.json',JSON.stringify(data.user));
            witouch.attemptStart();
            res.redirect('/');
        } else {
            req.flash('loginMessage',data.message);
            res.redirect('/login');
        }
	});
};

exports.post.signup = function (req,res){
        var opt     = {};
        opt.url     = config.get('Server.api')+"signup";
        opt.method  = "POST";
        opt.data    = {"email":req.body.email,"password":req.body.password,"name":req.body.name};
        curl.request(opt, function(err, resData){
            console.log("mainController :: signup :");
            var data = JSON.parse(resData);
            console.log(data);
            if (data.success == true){
                clientCookie.writeClientCookie(data.user);
                witouch.attemptStart();
                res.redirect('/');
            } else {
                req.flash('loginMessage',data.message);
                res.redirect('/signup');
            }
        });
    };




