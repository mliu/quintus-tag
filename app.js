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
  setTimeout(function () {
    if (!tagged) {
      socket.emit('connected', { playerCount: playerCount, playerId: id, tagged: true });
    } else {
      socket.emit('connected', { playerCount: playerCount, playerId: id });
    }
  }, 1000);
  
  socket.on('disconnect', function () {
    playerCount--;
    io.emit('disconnected', { playerCount: playerCount });
  });
  
  socket.on('update', function (data) {
    if (data['tagged']) {
      tagged = true;
    }
    socket.broadcast.emit('updated', data);
  });
  
  socket.on('tag', function (data) {
    io.emit('tagged', data);
  });
});

setInterval(function () {
  tagged = false;
}, 3000);

server.listen(80);
console.log("Multiplayer app listening on port 80");
