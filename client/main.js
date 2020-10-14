Template.registerHelper('clientBrowserSupportsWebRTC', function() {
  return Janus.isWebrtcSupported();
});


Meteor.startup(function () {

});

Template.home.onCreated(function () {
  //subscribe à la collection representations
  this.autorun(() => {
    this.subscribe('allRepresentations');
    this.subscribe('allContenusEcran');
  });


});

Template.srt.events({


})
Template.srt.helpers({

  doYouHavePower:function(){
    var powerToThePeople = superGlobals.findOne({ powerToThePeople: { $exists: true}});
    console.log(powerToThePeople);
    return powerToThePeople.powerToThePeople ? 'powerToThePeople' : 'powerToTheAdmin';
  },
  listRepresentations:function(){
    console.log("listRepresentations??", representations.find().fetch());
    return representations.find();
  }
});

Template.home.onRendered(function () {


  this.autorun(() => {
    let ready = Template.instance().subscriptionsReady();
    if (!ready){ return; }
    let contnus = ContenusEcran.find().fetch();
    console.log("contnus", contnus);
    data = ContenusEcran.findOne({name: "text-inscription"}).data
    console.log('srt home rendered');
    console.log('data ?', data);
    console.log('ContenusEcran ?', ContenusEcran.find().fetch());
    // rawTextToJson();
  // console.log(Template.instance());
    // zoupageJSON(dataFromDB, data);
    console.log("doYouHavePower", doYouHavePower());
    autonext(2000);
  });


  /*$.getScript("/janus.js", function( data, textStatus, jqxhr ) {
    console.log( data ); // Data returned
    console.log( textStatus ); // Success
    console.log( jqxhr.status ); // 200
    console.log( "Load was performed." );
    */


  console.log('cookies', cookies.get('user_represent'));

  // Initialize the library (all console debuggers enabled)
  console.log(window.Janus, this.Janus, Janus);
  var host = "www.on-appuiera-sur-espace-une-fois-rendu-a-la-page-d-accueil.com";
  var server = null;
  if(window.location.protocol === 'http:')
      server = "http://" + host + ":8088/janus";
  else
      server = "https://" + host + ":8089/janus";

  var janus = null;
  var streaming = null;
  var started = false;
  var spinner = null;

  var selectedStream = null;

  // Initialize the library (all console debuggers enabled)
  Janus.init({debug: "all", callback: function() {
    
    console.log('Janus initiated.');

    // Use a button to start the demo
    // $('#start').click(function() {
    if(started)
      return;
    started = true;

    // $(this).attr('disabled', true).unbind('click');
    // Make sure the browser supports WebRTC
    if(!Janus.isWebrtcSupported()) {
      console.log("No WebRTC support... ");
      return;
    }
    console.log('WebRTC is supported.');
    console.log('Creating Janus Session...');
    // Create session
    janus = new Janus({
      server: server,
      success: function() {
        // Attach to streaming plugin
        janus.attach({
          plugin: "janus.plugin.streaming",
          success: function(pluginHandle) {
            // $('#details').remove();
            streaming = pluginHandle;
            Janus.log("Plugin attached! (" + streaming.getPlugin() + ", id=" + streaming.getId() + ")");
            console.log("Plugin attached! (" + streaming.getPlugin() + ", id=" + streaming.getId() + ")");
            // Setup streaming session
            // $('#update-streams').click(updateStreamsList);
            // updateStreamsList();
            //janus.destroy();

          },
          error: function(error) {
            Janus.error("  -- Error attaching plugin... ", error);
            console.log("Error attaching plugin... " + error);
          },
          onmessage: function(msg, jsep) {
            Janus.debug(" ::: Got a message :::");
            Janus.debug(JSON.stringify(msg));
            var result = msg["result"];
            if(result !== null && result !== undefined) {
              if(result["status"] !== undefined && result["status"] !== null) {
                var status = result["status"];
                if(status === 'starting')
                  console.log("Message : Starting, please wait...");
                  // $('#status').removeClass('hide').text("Starting, please wait...").show();
                else if(status === 'started')
                  console.log("Message : Started");
                  // $('#status').removeClass('hide').text("Started").show();
                else if(status === 'stopped')
                  stopStream();
              }
            } else if(msg["error"] !== undefined && msg["error"] !== null) {
              console.log("Message : "+msg["error"]);
              stopStream();
              return;
            }
            if(jsep !== undefined && jsep !== null) {
              Janus.debug("Handling SDP as well...");
              Janus.debug(jsep);
              // Answer
              streaming.createAnswer({
                jsep: jsep,
                media: { audioSend: false, videoSend: false },  // We want recvonly audio/video
                success: function(jsep) {
                  Janus.debug("Got SDP!");
                  Janus.debug(jsep);
                  var body = { "request": "start" };
                  streaming.send({"message": body, "jsep": jsep});
                  // $('#watch').html("Stop").removeAttr('disabled').click(stopStream);
                },
                error: function(error) {
                  Janus.error("WebRTC error:", error);
                  console.log("WebRTC error... " + JSON.stringify(error));
                }
              });
            }
          },
          onremotestream: function(stream) {
            Janus.debug(" ::: Got a remote stream :::");
            console.log(" ::: Got a remote stream :::");
            console.log(JSON.stringify(stream));
            Janus.debug(JSON.stringify(stream));
            // if($('#remotevideo').length === 0)
            //   $('#stream').append('<video class="rounded centered hide" id="remotevideo" width=320 height=240 autoplay/>');
            // Show the stream and hide the spinner when we get a playing event
            // $("#remotevideo").bind("playing", function () {
            //   $('#waitingvideo').remove();
            //   $('#remotevideo').removeClass('hide');
            //   if(spinner !== null && spinner !== undefined)
            //     spinner.stop();
            //   spinner = null;
            // });
            // Janus.attachMediaStream($('#remotevideo').get(0), stream);
            console.log($('#stream-video'), $('#stream-video').get(0));
            Janus.attachMediaStream($('#stream-video').get(0), stream);
          },
          oncleanup: function() {
            Janus.log(" ::: Got a cleanup notification :::");
            // $('#waitingvideo').remove();
            // $('#remotevideo').remove();
          }
        });
      },
      error: function(error) {
        Janus.error(error);
        console.log(error);
        // bootbox.alert(error, function() {
        //   window.location.reload();
        // });
      },
      destroyed: function() {
        console.log("destroyed");
        window.location.reload();
      }
    });
  }});

  });


Template.srt.onRendered(function () {



  $(document.body).on('keyup', function(e) {

    e = e || window.event


    // KEYCODE 32 IS SPACEBAR
    // KEYCIODE 78 IS "n"

    if(e.keyCode =='32' && compteur < data.length-1 && interrupt==false){
      window.clearTimeout(autonextcontainer)
      compteur +=1
      next();
      console.log("keyup, ", compteur)
      // ça c'est pour virer le autonext si il y en avait un en cours (c'est quand
      // ça avance tout seul avec un délai)
    }
  });

});

