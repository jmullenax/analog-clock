$(document).ready(function(){
  //var $clock = $('canvas#clock');
  var clock = document.getElementById('clock');
  if (clock.getContext) {
    var ctx = clock.getContext("2d");


    function Hand(center, clockSize, outset) {
      this.step = null;
      this.scale = 60;
      this.outset = (outset === undefined) ? -15 : outset;
      this.end = null;
      this.thickness = 5;
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

        console.log(new_x);
        console.log(new_y);

        ctx.moveTo( new_x, new_y );
        ctx.lineTo( new_x_2, new_y_2 );
        ctx.stroke();
    };


    function Clock(centerX, centerY) {
      this.size = 300;// px square

      if(centerX === undefined) {
        centerX = this.size/2;
      }
      if(centerY === undefined) {
        centerY = this.size/2;
      }
      this.log = false;
      this.center = {x:centerX, y:centerY};
      
      //this.center.x = centerX;
      //this.center.y = centerY;
    }

    

    Clock.prototype.init = function() {
      // body...
    };
      
    Clock.prototype.draw = function() {
      this.drawCenterCircle(125);        
      this.drawCenterCircle(3);
      this.drawTicks();
      this.drawCenterCircle(100);
      this.drawCenterCircle(10, 'red');
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
              //console.log('begin drawing');
              
              minutesHand.draw({step: minutes, end: 115});
              hoursHand.draw({scale: 12,step: hours, end: 65});
              secondsHand.draw({step: seconds, outset: 20, end: 95, thickness: 2, color: 'red'});
              //console.log('end drawing');


              if(that.log) {
                console.log('H:M:S '+hours+':'+minutes+':'+seconds);
              }
                
          }, 100);
    };

    Clock.prototype.drawTicks = function() {
      var tickLength = 40;
      var tickOutset = 75;
      var tickEnd = tickLength + tickOutset;
      var width = 10;
      var color = '#555';
      var num_ticks = 12;
      var hourTicks = new Hand(this.center, this.size);
      var secondTicks = new Hand(this.center, this.size);

      for(var q = 0; q < num_ticks; q++) {
        secondTicks.draw({step: q, scale: num_ticks, outset: tickOutset, end: tickEnd, width: width, color: color});
      }

      for(var q = 0; q < 60; q++) {
        if(q%5 == 0) continue;
        hourTicks.draw({step: q, outset: tickOutset, end: tickEnd, width: 1, color: '#999'});
      }
    };

    Clock.prototype.drawCenterCircle = function(size, color) {
      this.drawCircle(this.center.x, this.center.y, size, color);
    }

    Clock.prototype.drawCircle = function(x, y, diameter, color) {
       if(color === undefined) {
          color = 'steelblue';
        }

        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.arc(x,y,diameter,0,Math.PI*2,true);
        ctx.stroke();
    };

    Clock.prototype.setLog = function(set){
      this.log = set;
    };

    var clock1 = new Clock();
//
    //clock1.setLog(true);
    clock1.init();
    clock1.run();

    //var clock2 = new Clock(300, 150);
    ////clock2.setLog(true);
    //clock2.init();
    //clock2.run();
////
    //var clock3 = new Clock(150, 300);
    ////clock3.setLog(true);
    //clock3.init();
    //clock3.run();
  }
});