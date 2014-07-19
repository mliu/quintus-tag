require([], function () {
  Q.Sprite.extend('Actor', {
    init: function (p) {
      this._super(p);

      this.add('animation');
    }
  });

  Q.Sprite.extend('Player', {
    init: function (p) {
      this._super(p, {
        sheet: 'player',
        tagged: false,
        invincible: false,
        vyMult: 1
      });
      this.add('2d, platformerControls, animation');

      this.addEventListeners();
    },
    addEventListeners: function () {
      this.on('hit', function (collision) {
        if (this.p.tagged && !collision.obj.p.tagged && !collision.obj.p.invincible) {
          console.log("tag " + collision.obj.p.playerId);
          this.p.socket.emit('tag', { playerId: collision.obj.p.playerId });
          this.p.invincible = true;
          this.p.opacity = 0.5;
          this.p.speed = 300;
          this.p.vyMult = 1.5;
          var temp = this;
          setTimeout(function () {
            temp.p.invincible = false;
            temp.p.opacity = 1;
            temp.p.speed = 200;
            temp.p.vyMult = 1;
          }, 3000);
        }
      });

      this.on('join', function () {
        this.p.invincible = true;
        this.p.opacity = 0.5;
        this.p.speed = 300;
        this.p.vyMult = 1.5;
        var temp = this;
        setTimeout(function () {
          temp.p.invincible = false;
          temp.p.opacity = 1;
          temp.p.speed = 200;
          temp.p.vyMult = 1;
        }, 3000);
      });
    },
    step: function (dt) {
      if (Q.inputs['up']) {
        this.p.vy = -200 * this.p.vyMult;
      } else if (Q.inputs['down']) {
        this.p.vy = 200 * this.p.vyMult;
      } else if (!Q.inputs['down'] && !Q.inputs['up']) {
        this.p.vy = 0;
      }
      this.p.socket.emit('update', { playerId: this.p.playerId, x: this.p.x, y: this.p.y, sheet: this.p.sheet, opacity: this.p.opacity, invincible: this.p.invincible, tagged: this.p.tagged });
    }
  });
});
