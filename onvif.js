var onvif  = require('onvif');
var Cam    = onvif.Cam;
 


onvif.Discovery.probe(function(err, cams) {
	console.log(cams);
    if (err) { throw err; }

    /*cams.forEach(function(cam) {
        cam.username = "admin";
        cam.password = "tlJwpbo6";
        cam.connect(function(){
        	console.log("Connected ... ?");
        	this.getStreamUri({protocol:'RTSP'}, function(err, stream) {
				if (err) console.log(err);
				else console.log(stream);

			});
        });
    });*/
}); 


/*
new Cam({
  hostname: "192.168.1.6",
  username: "admin",
  password: "tlJwpbo6",
  port : "8899",
  path : "/onvif/device_service"
}, function(err) {
	if (err) console.log(err);
	else console.log(this);
});*/