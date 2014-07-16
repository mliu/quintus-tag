require([], function () {
  Q.Sprite.extend('Actor', {
    init: function (p, hash) {
      this._super(p, hash);

      this.addEventListeners();
    },
  });

  Q.Actor.extend('Player', {
    init: function (p) {
      this._super(p, {
        sheet: 'player',
        tagged: false
      });

      this.className = 'Player';
      this.add('2d, platformerControls, animation');
    },
    step: function (dt) {
      if (Q.inputs['up']) {
        this.p.vy = -200;
      } else if (Q.inputs['down']) {
        this.p.vy = 200;
      } else if (!Q.inputs['down'] && !Q.inputs['up']) {
        this.p.vy = 0;
      }
    }
  });
});
