/*
    BABY MONITOR
    Use Cases:
        1. Real-time monitor (movement chart and movement identification statement)
        2. Notification(message user when abnormal activity such as fell from the bed happend)
 */
process.env.PORT = 8101;
process.env.NODE_URL = '0.0.0.0';

var five = require("johnny-five");
var twilio = require('twilio');
var board = new five.Board();
var io;
var chartPointsAcceleration = [0,0,0,0,0,0,0,0,0,0];
var chartPointsRoll = [0,0,0,0,0,0,0,0,0,0];
var chartPointsZo = [0,0,0,0,0,0,0,0,0,0];
var mostRecentTime = 0;
var awake = "Lily is active.";
var lay = "Lily is laying on bed.";
var turn = "Lily is turning over.";
var action = "";
var accountSid = 'my accountSid';
var authToken = 'my authToken';
var client = new twilio(accountSid, authToken);

var sendMessage = function( msg ) {
  client.messages.create({
    body: msg,
    to: '+myNumber',
    from: '+myTwilioNumber'
  }).then(function(message){
    console.log(message.sid);
    console.log('message sent');
  }, function(err) {
    console.log(err);
  });
};

board.on("ready", function() {
  var accelerometer = new five.Accelerometer({
    controller: "ADXL335",
    pins: ["A0", "A1", "A2"]
  });
  accelerometer.on("acceleration", function() {
    if(this.acceleration < 0.8){
      sendMessage("Alert: Lily fell from bed!")
      console.log("Message sent");
    }
    if( io ) {
      if(this.z < 0){
        action = turn;
      } else if(this.acceleration < 2 && this.acceleration > 1
        && this.roll > 8 && this.roll < 10 && this.z < 2 && this.z > 1) {
        action = lay;
      } else{
        action = awake;
      }
      var d = new Date();
      if (d.getTime() - mostRecentTime >= 500) {
        mostRecentTime = d.getTime();

        chartPointsAcceleration.push( this.acceleration.toFixed(2) );
        chartPointsRoll.push( this.roll.toFixed(2) );
        chartPointsZo.push( this.z.toFixed(2) );

        chartPointsAcceleration.shift();
        chartPointsRoll.shift();
        chartPointsZo.shift();
      }
      else {
        return;
      }
      io.sockets.emit('event:accelerometer', chartPointsAcceleration.join(), chartPointsRoll.join(), chartPointsZo.join(), action);
    }
  });
  require('mahrio').runServer(process.env, __dirname)
    .then(function (server) {
      io = require('socket.io').listen(server.listener);
    });
});