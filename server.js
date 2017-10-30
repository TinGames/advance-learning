// Dependencies
var express = require('express');
var http = require('http');
var path = require('path');
var mysql = require('mysql');
var socketIO = require('socket.io');
var app = express();
var server = http.Server(app);
var io = socketIO(server);
var bodyParser = require('body-parser');
var session = require('express-session');
var bcrypt = require('bcrypt');
var games = {};
require("./popup_module")({io: io, games: games});

var routes = require('./routes')(app);

var db = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: '',
	database : 'advance_users'
	
});
//connection
db.connect(function(err){
	if(err){
		throw err;
	}
	console.log("MYSQL Connected");
});

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use(session({
	secret: "HSJDHCYSNAASDKGJKDF"
}));

app.engine('.html', require('ejs').__express);
app.set('views', __dirname + '/');
app.set('view engine', 'html');

app.set('port', 5000);
app.use('/static', express.static(__dirname + '/static'));
// Routing
app.get('/', function(request, response) {
  response.sendFile(path.join(__dirname, '/client_pages/join.html'));
});
app.get('/teacher_js', function(request, response) {
  response.sendFile(path.join(__dirname, '/client_pages/teacher.js'));
});
app.get('/popup_js', function(request, response) {
  response.sendFile(path.join(__dirname, '/client_pages/popup.js'));
});
app.get('/popup_control', function(request, response) {
  response.sendFile(path.join(__dirname, '/client_pages/popup_control.js'));
});
app.get('/login', function(request, response) {
	if(!request.session.userName){
  response.render('client_pages/log_in.ejs', {
  });
	}else{
	response.redirect("/teacher_control");
}

	
});


app.post('/play', function(req, res) {
    var code_param = req.body.id;
	var name_param = req.body.name;
	if(games[code_param] != null){
   res.render('client_pages/game.ejs', {
    code: code_param,
	name: name_param,
	subject: games[code_param].subject
	});
	}else{
		res.redirect("/join");
	}
});

app.post('/verify_login', function(req, res) {
    var userName = req.body.Username;
	var password = req.body.Password;
	
	
	db.query("SELECT * FROM users WHERE username = '" + userName+"'", function(err, result){

	if(result.length > 0){
		if(bcrypt.compareSync(password, result[0].password)){
			req.session.userName = userName;
				res.redirect("/teacher_control");

		}
		}
	});
	
	
});
app.get('/teacher_control', function(request, response) {
	
		if(!request.session.userName){
			response.redirect("/login");
		}else{
  response.render('client_pages/teacher_control.ejs', { userName: request.session.userName });		
		}
});
app.post('/game_control', function(request, response) {
	var code = request.body.code;
	
	if(code != ''){
	response.render('client_pages/popup_control.ejs', {game_code: code});
	}	else{
		res.redirect('/teacher_control');
	}
});









// Starts the server.
server.listen(5000, function() {
  console.log('Starting server on port 5000');
});



//GamePlay
var sampleTerms = Array();
new createTerm("the computer", "l'ordinateur");
new createTerm("the mouse", "la souris");
new createTerm("the mouse pad", "la tapis de souris");
new createTerm("the charger", "le chargeur");
new createTerm("the monitor", "le moniteur");

function createTerm(english, language){
	this.eng = english;
	this.lang = language;
	sampleTerms.push(this);
}



io.on("connection", function(socket){
		
		socket.on("TC", function(){
			socket.on("create_game", function(data){
				var code = genCode();
				var sub_game = genSubGame(data.type);
				var g = new game(sub_game, code, data.type);
				games[code] = g;
				socket.emit("redirect_to_code", code);
			});
		});
		
		


});

function player(name, socketR){
	this.name = name;
	this.socket = socketR;
	this.team = 0;
}

function sortToTeams(players){
	shuffle(players);
	var redTeam = true;
	for(var i = 0; i < players.length; i++){
		if(redTeam){
			players[i].team = 0;
		}else{
			players[i].team = 1;
		}
		redTeam = !redTeam;
	}
}



function shuffle(a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
}


function genCode(){
	var num = Math.floor(Math.random() * 90000) + 10000;
	return num;
}

function findGames(teacherName){
	var array = new Array();
	for(var key in games){
		if(games[key].teacher === teacherName){
		array.push(games[key]);
		}
	}
	return array;
}
function genSubGame(type){
	var toReturn = null;
	if(type === "popup"){
		toReturn = new popup_game();
	}
	return toReturn;
}


function game(sub_game, code, type){
	this.sub_game = sub_game;
	this.code = code;
	this.game_type = type;
	this.in_progress = false;
}
function establishTeacherGameConnection(data){
	if(data.type === "popup"){
		data.socket.emit("request_further_connection", "popup");
	}
}

function popup_game(){
	this.currentTerm = null;
}







