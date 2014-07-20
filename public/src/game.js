var Q = Quintus({audioSupported: [ 'wav','mp3' ]})
      .include('Sprites, Scenes, Input, 2D, Anim, Touch, UI, Audio')
      .setup({ maximize: true })
      .enableSound()
      .controls().touch();

Q.gravityY = 0;

require(['socket.io/socket.io.js']);

var players = [];
var selfId;
var player;
var socket = io.connect('http://localhost:80');

var objectFiles = [
  './src/player'
];

require(objectFiles, function () {
  function setUp (stage) {
    socket.on('connected', function (data) {
      selfId = data['playerId'];
      if (data['tagged']) {
        player = new Q.Player({ playerId: selfId, x: 100, y: 100, socket: socket });
        player.p.sheet = 'enemy'
        player.p.tagged = true;
        stage.insert(player);
      } else {
        player = new Q.Player({ playerId: selfId, x: 100, y: 100, socket: socket });
        stage.insert(player);
        player.trigger('join');
      }
      stage.add('viewport').follow(player);
    });

    socket.on('updated', function (data) {
      var actor = players.filter(function (obj) {
        return obj.playerId == data['playerId'];
      })[0];
      if (actor) {
        actor.player.p.x = data['x'];
        actor.player.p.y = data['y'];
        actor.player.p.sheet = data['sheet'];
        actor.player.p.opacity = data['opacity'];
        actor.player.p.invincible = data['invincible'];
        actor.player.p.tagged = data['tagged'];
        actor.player.p.update = true;
      } else {
        var temp = new Q.Actor({ playerId: data['playerId'], x: data['x'], y: data['y'], sheet: data['sheet'], opacity: data['opacity'], invincible: data['invincible'], tagged: data['tagged'] });
        players.push({ player: temp, playerId: data['playerId'] });
        stage.insert(temp);
      }
    });

    socket.on('tagged', function (data) {
      if (data['playerId'] == selfId) {
        player.p.sheet = 'enemy';
        player.p.tagged = true;
      } else {
        var actor = players.filter(function (obj) {
          return obj.playerId == data['playerId'];
        })[0];
        if (actor) {
          actor.player.p.sheet = 'enemy'
        }
      }
    });
  }

  Q.scene('arena', function (stage) {
    stage.collisionLayer(new Q.TileLayer({ dataAsset: '/maps/arena.json', sheet: 'tiles' }));

    setUp(stage);
  });

  var files = [
    '/images/tiles.png',
    '/maps/arena.json',
    '/images/sprites.png',
    '/images/sprites.json'
  ];

  Q.load(files.join(','), function () {
    Q.sheet('tiles', '/images/tiles.png', { tilew: 32, tileh: 32 });
    Q.compileSheets('/images/sprites.png', '/images/sprites.json');
    Q.stageScene('arena', 0);
  });
});
