streamer = new Meteor.Streamer('chat');
posTable = {}


if(Meteor.isClient) {
  sendMessage = function(message) {
    streamer.emit('message', message);
    // console.log('me: ', message);
  };

  streamer.on('message', function(message) {
    console.log('message : ', message);
    redrawPlayers(message);
  });
}

if (Meteor.isServer) {

  stepQueue = []
  timerStepsInterval = 100

  streamer.allowRead('all');
  streamer.allowWrite('all');

  streamer.on('message', function(message) {
    // console.log('message : ', message);
  });

}