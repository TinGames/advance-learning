var socket = io();
document.getElementById("login").style.display = "none";


socket.emit("TC");


function create_popup_game(){
	socket.emit("create_game", {type:"popup"});
}
socket.on("redirect_to_code", function(code){
	console.log("working");
	var redirect = document.getElementById("redir");
	document.getElementById("code").value = code;
	redirect.submit();
});


socket.on("your_games", function(games){
	document.getElementById("current_games").innerHTML = "";
	for(var i = 0; i < games.length; i++){
		var elem = document.createElement("div");
		elem.style= "width: 95%; height: 50px; background: white; border-left: 5px solid var(--color_1); box-shadow: 0px 5px 5px black; margin-bottom: 5px;";
		elem.innerHTML = "<h1 style='color: var(--color_1);'> " + games[i].subject+ " - "  + games[i].game_type + "</h1>";
		var orm = document.createElement("form");
		orm.action = "/game_control";
		orm.method = "POST";
		orm.innerHTML = "<input type='hidden' id='code'>";
		elem.appendChild(orm);
		document.getElementById("current_games").appendChild(elem);
		elem.onclick = function(){
			orm.submit();
		};
	}

});


