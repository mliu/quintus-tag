var Q = Quintus({audioSupported: [ 'wav','mp3' ]})
      .include('Sprites, Scenes, Input, 2D, Anim, Touch, UI, Audio')
      .setup({ maximize: true })
      .enableSound()
      .controls().touch();

Q.gravityY = 0;

//Source other game objects
var objectFiles = [
  './src/player'
];

require(objectFiles, function () {
  Q.scene('arena', function (stage) {
    stage.insert(new Q.Repeater({ asset: '/images/background.png' }));
    stage.collisionLayer(new Q.TileLayer({ dataAsset: '/maps/arena.json', sheet: 'tiles' }));

    var player = stage.insert(new Q.Player({ x: 100, y: 100 }));
    stage.add('viewport').follow(player);
  });

  //Source game files
  var files = [
    '/images/background.png',
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
