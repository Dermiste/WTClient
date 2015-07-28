var onvif               = require('onvif');
var childProcess        = require('child_process');
var onvif               = require('onvif');
var witouch             = require('witouch-mainserver');
var clientCookie        = require('client-cookie-utils');
var curl                = require('curlrequest');
var Cam                 = onvif.Cam;

var config              = require('config');


var ff;

exports.camList = function(req, res){
    var finalCamList = [];
    var feedList = clientCookie.getCams();

    var result;

	onvif.Discovery.probe(function(err, cams) {
            console.log(cams);
            if (err) { throw err; }


            // list disconnected cams
            cams.forEach(function(cam) {
                result = feedList.filter(function(o){
                    return (o.hostname == cam.hostname)
                });
                if (result.length > 0){
                    result[0].state = "in use";
                    finalCamList.push(result[0]);
                } else {
                    finalCamList.push(cam);
                    cam.name = " - ";
                    cam.state = "free";
                }
            });

            res.json(finalCamList);
        });
};

exports.feedLookup = function(req, res){
        stopFFmpeg();

		var regexp = require('node-regexp')
        var re = regexp().start('frame=').anything().find('fps=').toRegExp();

        var cam = JSON.parse(JSON.stringify(req.body));
        var data = {};
        data.cam = cam;
        data.stream = {};

        console.log('Config object');

        new Cam(cam, function(err) {
            if (err){
                console.error(err);
                data.message = "Error ...";
                data.success = false;  
                res.json(data);
            } else {
                //console.log(this); 
            } 
        
        this.getStreamUri({protocol:'RTSP'}, function(err, stream) {
            if (err){
                console.error(err);
                data.message = "Error ...";
                data.success = false;  
                res.json(data);
            } else {
                data.stream = stream;
                var rtmpUri = config.get('Stream.baseUrl')+clientCookie.getNewFeedName();

                var rtspUri = data.stream.uri;
                ff = childProcess.spawn("ffmpeg", ["-re","-rtsp_transport","tcp","-i",rtspUri,"-c:v","copy","-c:a","copy","-f","flv",rtmpUri]);
        
                ff.stdout.on('data', function (data) {
                  //console.log('stdout: ' + data);
                });
                ff.stderr.on('data', function (data) {
                  if (re.test(data)){
                    res.json({"message":"Success",success:true,rtmpUri:rtmpUri,rtspUri:rtspUri});
                  }
                }); 
                ff.on('close', function (code) {
                  if (code == 1)
                    res.json({"message":"Failed",success:false,uri:""});
                });     
            }
          });
        });
};

exports.stopFFmpeg = function(req,res){
    if (stopFFmpeg()){
        res.json({success:true,message:"Process stoped"});
    } else {
        res.json({success:false,message:"FFmpeg was not running"});
    }
};

exports.addCam = function(req,res){
    console.log("addCam :: body");
    console.log(req.body);
    // first add online
    var opt     = {};
    opt.url     = config.get('Server.api')+"registerCam";
    opt.method  = "POST";
    opt.data    = {"email":clientCookie.getClientCookie().email, "name":req.body.name,"rtmpUri":req.body.rtmpUri};
    curl.request(opt, function(err, resData){
        var data = JSON.parse(resData);
        if (data.success == true){
            if (clientCookie.addCam(req.body)){
                res.json({success:true,message:"Added successfully"});
            } else {
                res.json({success:false,message:"Some error occurred"});
            }
        } else {
            res.json({success:false,message:data.message});
        }
    });
};

exports.removeCam = function(req,res){
    console.log("camController : removeCam");

    var opt     = {};
    opt.url     = config.get('Server.api')+"removeCam";
    opt.method  = "POST";
    opt.data    = {"email":clientCookie.getClientCookie().email, "name":req.body.name,"rtmpUri":req.body.rtmpUri};
    curl.request(opt, function(err, resData){
        var data = JSON.parse(resData);
        console.log(data);
        if (data.success == true){
            if (clientCookie.removeCam(req.body)){
                res.json({success:true,message:"Deleted successfully"});
            } else {
                res.json({success:false,message:"Some error occurred"});
            }
        } else {
            res.json({success:false,message:data.message});
        }
    });
};


function stopFFmpeg(){
    if (ff){
        ff.kill('SIGHUP');
        return true;
    } else {
        return false;
    }
}