require([], function () {
  Q.Sprite.extend('Actor', {
    init: function (p) {
      this._super(p, {
        tagged: false
      });

      this.add('animation');
    }
  });

  Q.Sprite.extend('Player', {
    init: function (p) {
      this._super(p, {
        sheet: 'player',
        tagged: false,
        invincible: false
      });
      this.add('2d, platformerControls, animation');

      this.addEventListeners();
    },
    addEventListeners: function () {
      this.on('hit', function (collision) {
        if (this.p.tagged && !collision.obj.p.tagged && !collision.obj.p.invincible) {
          collision.obj.p.tagged = true;
          this.p.tagged = false;
          this.p.invincible = true;
          this.p.opacity = 0.5;
          this.p.speed = 400;
          setTimeout(function () {
            this.p.invincible = false;
            this.p.opacity = 1;
            this.p.speed = 200;
          }, 3000);
        }
      });
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
