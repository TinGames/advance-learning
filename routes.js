module.exports = function(app) {
	
var path = require('path');
app.get('/join', function(request, response) {
  response.render('client_pages/join.ejs', {});
});
app.get('/styles', function(request, response) {
  response.sendFile(path.join(__dirname, '/client_pages/styles.css'));
});
app.get('/font', function(request, response) {
  response.sendFile(path.join(__dirname, '/client_pages/carton.ttf'));
});
app.get('/loading_img', function(request, response) {
  response.sendFile(path.join(__dirname, '/client_pages/loading.png'));
});
app.get('/reload', function(request, response) {
  response.sendFile(path.join(__dirname, '/client_pages/reload.png'));
});
app.get('/ex', function(request, response) {
  response.sendFile(path.join(__dirname, '/client_pages/ex.png'));
});



//temporary






}