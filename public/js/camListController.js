var witouchApp = angular.module('witouch-manager', []);

witouchApp.controller('CamController', function ($scope,$http) {
	$("#updateButton").button('loading');
	$http.post('./camList').success(function(data) {
	    $scope.cams = data;
	    $("#updateButton").button('reset');
	});

	$scope.updateCams = function(){
		$("#updateButton").button('loading');
		$http.post('./camList').success(function(data) {
		    $scope.cams = data;
		    $("#updateButton").button('reset');
		});
	};

	//// BUTTON ACTIONS ////
	$scope.addCam = function(cam) {
		$scope.selectedCam = cam;

		$scope.state = "feedLookup";
    };

	$scope.removeCam = function(cam){
		$scope.selectedCam = cam;

		//console.log("Selected cam");
		//console.log($scope.selectedCam);
    	$http.post('./removeCam',$scope.selectedCam).success(function(data) {
			console.log(data);

			if (data.success){
				$scope.updateCams();
			} else {

			}
		});
    }  

	//// END BUTTON ACTIONS ////

    $scope.registerCam = function(name){
		var cam = angular.copy($scope.selectedCam);
		cam.name = name;
		delete(cam.state);
    	//return;
    	$("#addButton").button('loading');
    	$http.post('./addCam', cam).success(function(data) {
		    $("#addButton").button('reset');
			console.log(data);

			if (data.success){
				$("#feedLookup").fadeTo("slow",0);
				swfobject.removeSWF("videoPlayer1");
				$scope.updateCams();
			} else {

			}
		});
    }

	  

    $scope.feedLookup = function(credentials){
    	console.log("Show credentials");
    	console.log(credentials);

    	$("#lookupButton").button('loading');

    	$scope.selectedCam.password = credentials.password;
    	$scope.selectedCam.username = credentials.username;

    	$http.post('./feedLookup',$scope.selectedCam).success(function(data, status, header, config) {
    		$scope.lookupResult = data.success;
    		$scope.lookupMessage = data.message;
    		if (data.success){
				console.log(data);
				$scope.selectedCam.rtspUri = data.rtspUri;
				$scope.selectedCam.rtmpUri = data.rtmpUri;

				var flashvars = {src:$scope.selectedCam.rtmpUri,streamType:"live"};
				var params = {wmode:"direct",allowfullscreen:"true"};
				var attributes = {};
				
				swfobject.embedSWF("/static/swf/StrobeMediaPlayback.swf", "videoPlayer1", "100%", "400px", "11.0.0", "/static/swf/expressInstall.swf",flashvars, params,attributes);
				
				$('#videoActions').fadeTo("slow",1.0);

				$scope.state = "feedValidation";
				$("#lookupButton").button('reset');
			} else {
			}	
    	});
	};
});