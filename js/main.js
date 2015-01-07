$(document).ready(function(){
  //var $clock = $('canvas#clock');
  var clock = document.getElementById('clock');
  if (clock.getContext) {
    var ctx = clock.getContext("2d");


    function Hand(center, clockSize, outset) {
      this.step = null;
      this.scale = 60;
      this.outset = clockSize/-20;
      this.end = null;
      this.thickness = clockSize/100;
      this.color = '#111';
      this.center = {};
      this.center.x = center.x;
      this.center.y = center.y;
      this.offset = Math.PI * 75;
      this.halfScale = this.scale/2;
      this.stepPI = this.step * Math.PI;
    }

    Hand.prototype.getX = function(start, stop) {
      var stepPI = (this.step * Math.PI);
      var ret = start + stop * Math.cos((stepPI - this.offset)/this.halfScale);
      return ret;
    }

    Hand.prototype.getY = function(start, stop) {
      var stepPI = (this.step * Math.PI);
      var ret = start + stop * Math.sin((stepPI - this.offset)/this.halfScale);
      return ret;
    }

    Hand.prototype.draw = function(config) {

        for(option in config) {
          this[option] = config[option];

          if(option == 'step') {
            this.stepPI = this.step * Math.PI;
          }

          if(option == 'scale') {
            this.halfScale = this.scale/2;
          }
        }

        ctx.strokeStyle = this.color;
        ctx.lineWidth = this.thickness;
        ctx.beginPath();          
        var new_x = this.getX(this.center.x, this.outset);
        var new_x_2 =  this.getX(this.center.x, this.end);
        var new_y = this.getY(this.center.y, this.outset);
        var new_y_2 =  this.getY(this.center.y, this.end);

        ctx.moveTo( new_x, new_y );
        ctx.lineTo( new_x_2, new_y_2 );
        ctx.stroke();
    };


    function Clock(centerX, centerY) {
      this.size = 600;// px square

      if(centerX === undefined) {
        centerX = this.size/2;
      }
      if(centerY === undefined) {
        centerY = this.size/2;
      }
      this.log = false;
      this.center = {x:centerX, y:centerY};
    }

    

    Clock.prototype.init = function() {
      // body...
    };
      
    Clock.prototype.draw = function() {
      this.drawCenterCircle(this.size/2 - this.size/50);        
      
      this.drawTicks();
      this.drawCenterCircle(this.size/3);
      this.drawCenterCircle(this.size/30, 'red');
      this.drawCenterCircle(this.size/50);
    };

    Clock.prototype.run = function() {
        var that = this;
        window.setInterval(function(){
              ctx.clearRect(that.center.x - that.size/2, that.center.y - that.size/2, that.size, that.size);
              that.draw();
              var time = new Date();
              var seconds = (time.getMilliseconds()/1000)+time.getSeconds();
              var minutes = time.getMinutes()+(seconds/60);
              var hours = (time.getHours()%12)+(minutes/60);
              var secondsHand = new Hand(that.center, that.size);
              var minutesHand = new Hand(that.center, that.size, -25);
              var hoursHand = new Hand(that.center, that.size);
              
              minutesHand.draw({step: minutes, end: that.size*.45, thickness: that.size/50});
              hoursHand.draw({scale: 12,step: hours, end: that.size*.2, thickness: that.size/50});
              secondsHand.draw({step: seconds, outset: that.size/-20, end: that.size/3 + that.size/30, thickness: that.size/150, color: 'red'});
              
              if(that.log) {
                console.log('H:M:S '+hours+':'+minutes+':'+seconds);
              }
                
          }, 100);
    };

    Clock.prototype.drawTicks = function() {
      var tickLength = (this.size / 10) - (this.size/100);
      var tickOutset = this.size / 3;
      var tickEnd = tickLength + tickOutset;
      var width = this.size/30;
      var color = '#555';
      var num_ticks = 12;
      var hourTicks = new Hand(this.center, this.size);
      var minuteTicks = new Hand(this.center, this.size);

      for(var q = 0; q < num_ticks; q++) {
        minuteTicks.draw({step: q, scale: num_ticks, outset: tickOutset, end: tickEnd, width: width, color: color});
      }

      for(var q = 0; q < 60; q++) {
        if(q%5 == 0) continue;
        hourTicks.draw({step: q, outset: tickOutset, end: tickEnd, width: this.size/300, color: '#ccc'});
      }
    };

    Clock.prototype.drawCenterCircle = function(size, color) {
      this.drawCircle(this.center.x, this.center.y, size, color);
    }

    Clock.prototype.drawCircle = function(x, y, diameter, color) {
       if(color === undefined) {
          color = 'steelblue';
        }

        ctx.lineWidth = this.size/150;
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.arc(x,y,diameter,0,Math.PI*2,true);
        ctx.stroke();
    };

    Clock.prototype.setLog = function(set){
      this.log = set;
    };

    var clock1 = new Clock();
    clock1.init();
    clock1.run();
  }
});