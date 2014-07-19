var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
  res.render('/index.html');
});

var playerCount = 0;
var id = 0;

io.on('connection', function (socket) {
  playerCount++;
  id++;
  socket.emit('connected', { playerCount: playerCount, playerId: id });
  socket.on('disconnect', function () {
    playerCount--;
    io.emit('disconnected', { playerCount: playerCount });
  });
  socket.on('update', function (data) {
    socket.broadcast.emit('update', data);
  });
});

server.listen(8080);
console.log("Multiplayer app listening on port 80");
