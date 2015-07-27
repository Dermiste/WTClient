var socket = io.connect('http://localhost:8081/status');
  socket.on('rpiConnectionsUpdated', function (data) {
      $.each(data, function( key, value ) {
      	console.log("value :"+value);
        if (value == true){
        	console.log("true here");
        	$("#"+key+" .onlineStatus").html("online");
        	$("#"+key+" .statusBackground").addClass("bg-success").removeClass("bg-danger");
        } else { 
        	console.log("false here");
        	$("#"+key+" .onlineStatus").html("offline");
        	$("#"+key+" .statusBackground").addClass("bg-danger").removeClass("bg-success");
        }
  	});
  });

  socket.on('disconnect',function(data){
    console.log('disconnected ');
    $(".onlineStatus").html("offline");
    $(".statusBackground").addClass("bg-danger").removeClass("bg-success");
  });
  