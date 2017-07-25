$(document).ready(function(){

  function addProperties(el, attributes) {

    for (let [key, value] of Object.entries(attributes)) {

      if(key == 'style') {
        for (let [style_key, style_value] of Object.entries(value)) {
          el.style[style_key] = style_value;
        }
        
      } else{
        el.setAttribute(key, value);
      }
    }
  }

  // returns the height of the element, minus the px
  function getHeight(el) {
    return el.style.height.slice(0, -2);
  }
  
  var container = document.querySelector('.analog-clock-container');
  container.style.position = 'relative';
  container.style.height = container.style.width = (width = container.getAttribute('data-clock-size')) ? width + 'px' : '600px';

  var clockHandsLayer = document.createElement('canvas');
  var clockFaceLayer = document.createElement('canvas');  

  container.appendChild(clockHandsLayer);
  container.appendChild(clockFaceLayer);

  addProperties(clockHandsLayer, {
    id: 'clockHandsLayer',
    height: container.getAttribute('data-clock-size'),
      width: container.getAttribute('data-clock-size'),
    style: {
      
      'background-color': 'transparent',
      position: 'relative',
      'z-index': '2'
    }
  });

  addProperties(clockFaceLayer, {
    id: 'clockFaceLayer',
    height: container.getAttribute('data-clock-size'),
      width: container.getAttribute('data-clock-size'),
    style: {
      
      'background-color': 'transparent',
      position: 'absolute',
      top: '0',
      left: '0'
    }
  });

  var children = container.childNodes;

  var clockHandsLayerElement = children[0];// container.getElementById('clockHandsLayer');
  var clockFaceLayerElement = children[1];// container.getElementById('clockFaceLayer');
  
  // make sure that the 2 elements are in the DOM
  if (clockHandsLayerElement.getContext && clockFaceLayerElement.getContext) {
    
    var clockHandsLayer = clockHandsLayerElement.getContext("2d");
    var clockFaceLayer = clockFaceLayerElement.getContext("2d");

    function Hand(center, clockSize, outset) {

      this.step = null;
      this.scale = 60; // the distance around the face that the hands are apart, must be set to 60
      this.outset = clockSize/-10; // how far the hand is drawn in the opposite direction
      this.end = null;
      this.thickness = clockSize/100; // thickness of the ticks
      this.color = '#111'; // color of the hands
      this.center = {
        x: center.x,
        y: center.y
      };
      
      this.offset = Math.PI * 75;
      this.halfScale = this.scale/2;
      this.stepPI = this.step * Math.PI;
      this.drawInterval = 100;// in milliseconds
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

    Hand.prototype.draw = function(context, config) {

        for(option in config) {
          this[option] = config[option];

          if(option == 'step') {
            this.stepPI = this.step * Math.PI;
          }

          if(option == 'scale') {
            this.halfScale = this.scale/2;
          }
        }

        context.strokeStyle = this.color;
        context.lineWidth = this.thickness;
        context.beginPath();          
        var new_x = this.getX(this.center.x, this.outset);
        var new_x_2 =  this.getX(this.center.x, this.end);
        var new_y = this.getY(this.center.y, this.outset);
        var new_y_2 =  this.getY(this.center.y, this.end);

        context.moveTo( new_x, new_y );
        context.lineTo( new_x_2, new_y_2 );
        context.stroke();
    };


    function Clock(container_el, centerX, centerY) {
      this.size = getHeight(container_el);// remove the px at the end
      console.log(this.size);

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
     
    // here is where the actual design of the clock is handled. We could swap out "skins" here  
    Clock.prototype.draw = function(context) {

      this.drawCenterCircle(context, this.size/2 - this.size/50);     
      this.drawTicks(context);
      this.drawCenterCircle(context, this.size/3);
      this.drawCenterCircle(context, this.size/30, 'red');
      this.drawCenterCircle(context, this.size/50);

    };

    Clock.prototype.run = function() {
        var that = this;
        var hands = clockHandsLayer;
        var face = clockFaceLayer;

        that.draw(face);

        window.setInterval(function(){
              hands.clearRect(that.center.x - that.size/2, that.center.y - that.size/2, that.size, that.size);
              
              var time = new Date();
              var seconds = (time.getMilliseconds()/1000)+time.getSeconds();
              var minutes = time.getMinutes()+(seconds/60);
              var hours = (time.getHours()%12)+(minutes/60);

              // draw 3 hands
              var secondsHand = new Hand(that.center, that.size);
              var minutesHand = new Hand(that.center, that.size, -25);
              var hoursHand = new Hand(that.center, that.size);
              
              minutesHand.draw(hands, {step: minutes, end: that.size*.45, thickness: that.size/50});
              hoursHand.draw(hands, {scale: 12,step: hours, end: that.size*.2, thickness: that.size/50});
              secondsHand.draw(hands, {step: seconds, outset: that.size/-20, end: that.size/3 + that.size/30, thickness: that.size/150, color: 'red'});
              
              if(that.log) {
                console.log('H:M:S '+hours+':'+minutes+':'+seconds);
              }                
          }, this.drawInterval);
    };

    Clock.prototype.drawTicks = function(context) {
      var tickLength = (this.size / 10) - (this.size/100);
      var tickOutset = this.size / 3;
      var tickEnd = tickLength + tickOutset;
      var width = this.size/30;
      var color = '#555';
      var num_ticks = 12;
      var hourTicks = new Hand(this.center, this.size);
      var minuteTicks = new Hand(this.center, this.size);

      for(var q = 0; q < num_ticks; q++) {
        minuteTicks.draw(context, {step: q, scale: num_ticks, outset: tickOutset, end: tickEnd, width: width, color: color});
      }

      for(var q = 0; q < 60; q++) {
        if(q%5 == 0) continue;
        hourTicks.draw(context, {step: q, outset: tickOutset, end: tickEnd, width: this.size/300, color: '#ccc'});
      }
    };

    // a wrapper for drawCircle that sets the center to the center of the element
    Clock.prototype.drawCenterCircle = function(context, size, color) {
      this.drawCircle(context, this.center.x, this.center.y, size, color);
    }

    Clock.prototype.drawCircle = function(context, x, y, diameter, color) {
       if(color === undefined) {
          color = 'steelblue';
        }

        context.lineWidth = this.size/150;
        context.beginPath();
        context.strokeStyle = color;
        context.arc(x,y,diameter,0,Math.PI*2,true);
        context.stroke();
    };

    Clock.prototype.setLog = function(set){
      this.log = set;
    };

    var clock = new Clock(container);//document.querySelector('.analog-clock-container'));
    clock.init();
    clock.run();
  }
});