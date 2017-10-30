var socket = io();
var code = document.getElementById("code").value;
socket.emit("TC");
socket.emit("TC_POPUP");

socket.emit("request_game", code);
socket.on("game_sent", function(game){
	var game = game;
	handleGameStates(game);
	
});

function handleGameStates(game){
	if(game.in_progress){
	
	}
	
}


