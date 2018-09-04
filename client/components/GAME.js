
var streamCheckInterval;
var caughtUp = false;
var intervalReload;

score = 0

actionAvailable = 1

Template.game.onCreated(function() {

  //subscribe à la collection representations
  this.autorun(() => {
    this.subscribe('allRepresentations');
    this.subscribe('allContenusEcran');
    this.subscribe('allLoteries');
  });

});


Template.game.onRendered(function () {


  this.autorun(() => {
    let ready = Template.instance().subscriptionsReady();
    if (!ready){ return; }
    let contnus = ContenusEcran.find().fetch();
    console.log("contnus", contnus, data);
    // data = ContenusEcran.findOne({name: "ce_jeudi_no_comment"}).data
    data = ContenusEcran.findOne({name: "data_test"}).data
    console.log('srt spectacle game rendered');
    console.log('data ?', data);
    console.log('ContenusEcran ?', ContenusEcran.find().fetch());
    if(data) {
      catchUpWithTheShow();
    }

    //
    // rawTextToJson();
  // console.log(Template.instance());
    // zoupageJSON(dataFromDB, data);
    // autonext(2000);
  });


  $(document.body).addClass('game');

  function catchUpWithTheShow(){
    console.log('catchUpWithTheShow caughtUp?', caughtUp);
    if(!caughtUp) {
      caughtUp = true;
      console.log("checking compteur", compteur, "cookie.compteur", cookies.get('compteur'), modeSpectacle);
      //si on est en mode spectacle, que l'admin a le pouvoir
      var isPowerToThePeople = getSuperGlobal('powerToThePeople');
      if(modeSpectacle && !isPowerToThePeople) {
        //et si il y a un compteur enregistré
        var compteurAdmin = getSuperGlobal('compteurAdmin');
        console.log("checking compteurAdmin", compteurAdmin);

        if(null !== compteurAdmin) compteur = parseInt(compteurAdmin);
        if(compteur != -1) {
          //revenir où on était dans le spectacle
          next();
        }

        //ambiance?
        var whichAmbiance = getSuperGlobal("whichAmbiance", "");
        if(whichAmbiance != "") { //il y a une ambiance en cours
          //passons à cette ambiance
          var newAmbiance = ambiances.findOne({name: whichAmbiance});
          if(newAmbiance) {
            console.log("set Ambiance", newAmbiance.value)
            changeImg(newAmbiance.value)
          }
        }
      }
      
    }

  }

  em.addListener('salmtheoneshow', showTheOneButtons);
  em.addListener('salmtheonehide', hideTheOneButtons);

  function showTheOneButtons(){

    // if(Roles.userIsInRole(Meteor.user(), "jacky_one")==true) {
      console.log('showTheOneButtons');
      $('<button id="oui" class="button">oui</button><button id="non" class="button">non</button><button id="euh" class="button">euh</button>').appendTo('#sacbouttons');
    $("#sacbouttons").css("opacity", "1")
    // }

  }


  function hideTheOneButtons(){
    $("#sacbouttons").css("opacity", "0")
      delayedEmpty = setTimeout(function(){
      $("#sacbouttons").empty()
      },333)

    //$('#sacbouttons').clear();
  }

// });
  function showMeTheButtons(){

      // if(Roles.userIsInRole(Meteor.user(), "jacky_one")==true) {
    console.log('showMeTheButtons');
    $('<button id="oui" class="button">oui</button><button id="non" class="button">non</button><button id="euh" class="button">euh</button>').appendTo('#sacbouttons');
    $("#sacbouttons").css("opacity", "1")
      // }

  }


  em.addListener('salmnext', function(what) {
    console.log('salm next!', what);
    // compteur = what.compteur;
    //enregistrons le compteur dans un cookie
    // if(what.compteur && cookies.get('compteur') != what.compteur) cookies.set('compteur', what.compteur);
    // var SUPERinterrupt = superGlobals.findOne({ SUPERinterrupt: { $exists: true}});
    // var isSUPERinterrupt = (SUPERinterrupt) ? SUPERinterrupt.SUPERinterrupt : [];
    var isSUPERinterrupt = getSuperGlobal("SUPERinterrupt", []);
    var userRoles = Roles.getRolesForUser(Meteor.user());
    if(userRoles.length == 0) userRoles.push("salm");
    console.log("salm next : isSUPERinterrupt", isSUPERinterrupt, userRoles);
    var found = jQuery.inArray(userRoles[0], isSUPERinterrupt);
    if (found >= 0) {
      //ce role est dans le parking !
    } else {
      //ce role n'est pas dans le parking, faisons un next
      console.log('pas dans le parking, faisons un next')
      window.clearTimeout(autonextcontainer) //clear auto next
      // compteur += 1;
      compteur = what.compteur; //changer le compteur depuis l'évènement admin (rattraper le spectacle)
      next();
    } 
  }); 

  em.addListener('salmForceGoTo', function(what) {
    console.log('salm salmForceGoTo!', what);
    // compteur = what.compteur;
    gotobookmark(what.bookmark);
  }); 

  em.addListener('salmrefreshpage', function(what) {
    console.log('salm refresh page!', what);
    location.reload();
  }); 
  
  // var streamStarted = Meteor.superGlobals.findOne({}, {fields: {name: 1, _id: 0}}).name;
  Meteor.call('isTheStreamStarted', function(result){
    console.log(result);
  });


  em.addListener('salmpoweradmin', function(what) {
    console.log('salm admin has the power!', what);
    console.log("le pouvoir est aux mains de l'admin", streamCheckInterval);
    //faire des trucs quand l'admin prend le pouvoir
    startTheStream();
    //lancer le check du stream à interval régulier
    console.log("streamCheckInterval?", streamCheckInterval);

    if (!streamCheckInterval) {
        console.log("starting streamCheckInterval 1");
        streamCheckInterval = setInterval(function(){checkTheStream();}, 5000); 
        console.log("starting streamCheckInterval 2", streamCheckInterval);
    }
  });
  em.addListener('salmpowerpeople', function(what) {
    console.log('salm people have the power!', what);
      console.log("le pouvoir est aux mains du peuple", streamCheckInterval);
      //arretons le check du stream à interval régulier
      console.log("stopping streamCheckInterval 1", streamCheckInterval);
      clearInterval(streamCheckInterval); 
      streamCheckInterval = null;
      console.log("stopping streamCheckInterval 2", streamCheckInterval);
  }); 
  em.addListener('salmUnStop', function(what) {
    console.log('salm unstop', what);
    console.log('salm unstop - interrupt?', interrupt);
    unstop();
  }); 


  em.addListener('salmGetMessage', function(what) {
    console.log('salm get message', what);
    if(what.name != "") { //checkons le nom de la loterie
      var lotteryCookie = cookies.get(what.name);
      if(lotteryCookie) { //le cookie de cette loterie est bien là
        console.log('salm get message lotteryCookie', lotteryCookie);
        Meteor.call('retrieveMessage', what._id, lotteryCookie, function(error, result) {
          // 'result' is the method return value
          if(error) console.log("error", error);
          if(result) {
            console.log("result", result);
            var resultParsed = result.replace(/(\w+)\(?.*/, '$1');
            console.log("resultParsed", resultParsed);
            switch(resultParsed) {
              case 'showMeTheButtons':
                showMeTheButtons();
                break;
              case 'addCuppasButtons':
                addCuppasButtons();
                break;
              case 'displayPhoneNumbers':
                console.log("DISPLAY PHONE NUMBERS");
              default:
                break;
            }
          }
        });
      }
    }
  }); 
  // console.log()
  // superGlobals.find({});
    //   {},{fields: {'source':"SourceOne", 'currency': "USD"}}
    // ));

  //streaming janus
  var server = null;
  // if(window.location.protocol === 'http:')
  //     server = "http://" + window.location.hostname + ":8088/janus";
  // else
  //     server = "https://" + window.location.hostname + ":8089/janus";

  // var host = window.location.hostname == "localhost" ? "www.on-appuiera-sur-espace-une-fois-rendu-a-la-page-d-accueil.com" : window.location.hostname;
  // var host = window.location.hostname == "localhost" ? "www.on-appuiera-sur-espace-une-fois-rendu-a-la-page-d-accueil.com" : window.location.hostname;
  var host = "www.on-appuiera-sur-espace-une-fois-rendu-a-la-page-d-accueil.com";
  var server = null;
  if(window.location.protocol === 'http:')
      server = "http://" + host + ":8088/janus";
  else
      server = "https://" + host + ":8089/janus";

  var janus = null;
  // var streaming = null;
  streaming = null;
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
              //si le pouvoir est déjà aux mains de l'admin lancons le stream au chargement de la page
              // var powerToThePeople = superGlobals.findOne({ powerToThePeople: { $exists: true}});
              // var isPowerToThePeople = (powerToThePeople) ? powerToThePeople.powerToThePeople : true;
              var isPowerToThePeople = getSuperGlobal("powerToThePeople", false); // par défaut false, admin a le pouvoir -> donc lancer le stream (?)
              if(!isPowerToThePeople) {
                console.log("le pouvoir est déjà aux mains de l'admin lancons le stream au chargement de la page");
                startTheStream();
              }

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
        console.log("ERROR !!! :"+error);
        // var body = { "request": "stop" };
        // streaming.send({"message": body});
        // streaming.hangup();
        //TODO setTimeout hangup + setTimeout request watch à nouveau? à tester en régie avec lieven
        // bootbox.alert(error, function() {
        //   window.location.reload();
        // });
        /* no reload on error stream audio for videoproj */
        /*
        var waitBeforeReload = 10 //secondes;
        $('#stream-error').append("Il semble que la connection avec le serveur a été perdue. La page va se recharger dans <span>"+waitBeforeReload+" secondes</span>. (<a href=\"javascript:void(0);\" class=\"reload\" title=\"Annuler le rechargement\">Recharger maintenant</a> ou <a href=\"javascript:void(0);\" class=\"cancel\" title=\"Annuler le rechargement\">Annuler</a>)");
        $('#stream-error a.reload').click(function(){
          console.log("Manual page reload.");
          window.location.reload();
        });
        $('#stream-error a.cancel').click(function(){
          console.log("cancelling auto page reload.");
          clearInterval(intervalReload);
          $('#stream-error').empty(); //vider l'élément d'erreur
        });
        var count = waitBeforeReload;
        intervalReload = setInterval(function(){
          $('#stream-error').find('span').text(count == 1 ? count+" seconde" : count+" secondes");
          count -= 1;
          if (count === 0){
            clearInterval(intervalReload); // Stopping the counter when reaching 0.
            console.log("Stream error reloading");
            window.location.reload();
          }
        }, 1000);
        */
      },
      destroyed: function() {
        console.log("destroyed");
        window.location.reload();
      }
    });
  }});

next = function(){
  console.log('next', compteur, data[compteur]);
  var currentData = data[compteur]
  var type = currentData["type"]
  var params = currentData["text"]

  while(data[compteur]["type"]!="text"){
      // tant que data[compteur] est une balise, ben continue à executer les instructions s'il te plaît
      action(type, params)
      if((data[compteur]["type"]!="text")||(data[compteur]["text"]=="")){
        // euh alors ça je sais pas pourquoi ça marche mais ça permet d'éviter des situations où, arrivé à un bookmark
        // il sautait deux lignes au lieu d'une
        compteur+=1;
        next();
      }
    }

    if((type=="text")&&(params!="")){
      //document.getElementById("srt").innerHTML = params
        if(params=="***"){
        // ça c'est pour caler des blancs
        //document.getElementById("srt").innerHTML = ""

       // VERSION MTL MON GARS
        //   $('#srt').append($('<ul/>').html("<small class='index'>"+ compteur + "</small>\ \ \ \ \ \ \ \ "))
        //   $('#srt').scrollTop($('#srt')[0].scrollHeight);
        // }else{
        //   $('#srt').append($('<ul/>').html("<small class='index'>"+ compteur + "</small>\ \ \ \ \ \ \ \ " + params))
        //   $('#srt').scrollTop($('#srt')[0].scrollHeight);
        // }
       // END MTL

          // version game hédé
          // $('#srt').append($('<ul/>').html(params))
          // $('#srt').scrollTop($('#srt')[0].scrollHeight);

          // version avignon du cul mon gars
          $('#srt').append($('<ul/>').html("\ \ \ \ \ "))
          $('#srt').scrollTop($('#srt')[0].scrollHeight);
        }else{
          $('#srt').append($('<ul/>').html(params))
          $('#srt').scrollTop($('#srt')[0].scrollHeight);
        }
        // }
      // pis si la balise c'est pas une action et pas une balise de texte vide, met a jour le texte
      // bon ben c'est ici qu'il faudrait faire un truc
    }
  };

  
  $(document.body).on('keyup', function(e) {

    e = e || window.event


    // KEYCODE 32 IS SPACEBAR
    // KEYCIODE 78 IS "n"
    if(e.keyCode == '32') nextEvent();
  });

  var alternanceStorm = false;
  var balayeur

  em.addListener('new_ambiance_client', function() {
    // var ambiance = superGlobals.findOne({ whichAmbiance: { $exists: true}});
    // var whichAmbiance = (ambiance) ? ambiance.whichAmbiance : "e41";
    var whichAmbiance = getSuperGlobal("whichAmbiance", "e41");
    var newAmbiance = ambiances.findOne({name: whichAmbiance});
    console.log("ambiance?", newAmbiance);
    if(newAmbiance){
      console.log("new Ambiance", newAmbiance.value)
      changeImg(newAmbiance.value)
    }
  });

  em.addListener('ca_va_peter_client', function(/* client */) {
        if(alternanceStorm){
          clearTimeout(balayeur)
          $( ".eclair" ).remove();
          $('#gcontainer').prepend('<div class="eclair2"></div>');
          alternanceStorm = false;
        }else{
          clearTimeout(balayeur)
          $( ".eclair2" ).remove();
          $('#gcontainer').prepend('<div class="eclair"></div>');
          alternanceStorm = true;
        }
        balayeur = setTimeout(balayeurfunc,2500)
    });

    alternanceImg = false;

  function changeImg(params){

    if($("#imgcontainerBACK").hasClass( "invisible")){
      $('#imgcontainerBACK').removeClass('invisible');
      $('#imgcontainerBACK').addClass('visible');
    }

    if (alternanceImg==true) {
      $("#imgcontainerFRONT").css("background-image", "url(/img/"+params+".jpg");  
      $('#imgcontainerFRONT').removeClass('invisible');
      $('#imgcontainerFRONT').addClass('visible');
    }else{
      $("#imgcontainerBACK").css("background-image", "url(/img/rain3.jpg");  
      $('#imgcontainerFRONT').addClass('invisible');
      $('#imgcontainerFRONT').removeClass('visible');
    }
    alternanceImg =! alternanceImg
  }


  // $("#login").click(function(e) { 
  //     if (!interval) {
  //         interval = setInterval(function(){myFunction();}, 2000); 
  //     }
  // });

  // $("#logout").click(function(e) { 
  //     clearInterval(interval); 
  //     interval = null;
  // });

  em.addListener('salmstartstream', startTheStream);

  function startTheStream(what) {

    console.log('salm startstream!', what, streaming);
    if(streaming) {
      var body = { "request": "watch", id: parseInt(1) };
      streaming.send({"message": body});
    }

    if (!streamCheckInterval) {
        streamCheckInterval = setInterval(function(){checkTheStream();}, 30000); 
    }
    // if($('#streamFrame').length == 0) {

    //   $('<iframe>', {
    //   'src': 'http://www.on-appuiera-sur-espace-une-fois-rendu-a-la-page-d-accueil.com/stream/',
    //    id:  'streamFrame',
    //    frameborder: 0,
    //    scrolling: 'no'
    //   }).appendTo('#stream-ifr');


    //   setTimeout(function(){
    //     console.log('streamFrame', $("#streamFrame").contents().find('#start'));
    //     var startButton = $("#streamFrame").contents().find('#start');
    //     if(startButton.length > 0) {
    //       startButton.trigger('click');
    //     }
    //   }, 2000);
    //   // $('streamFrame').on('load', function(){
    //   //   console.log('streamFrame loaded');
    //   // });
    //   // console.log('streamFrame added');
    //   // $('streamFrame').attr();
    //   // console.log('streamFrame src', $('streamFrame').attr('src'));
    // }



  }

  function checkTheStream(){
    console.log('checkTheStream!');
    if(!Janus.initDone || !streaming) Janus.init();
    if(null != streaming && !streaming.webrtcStuff.started) startTheStream();
  }

});

var nextEvent = function(){

  // var isItPowerToThePeople = superGlobals.findOne({ powerToThePeople: { $exists: true}}).powerToThePeople;
  var isItPowerToThePeople = getSuperGlobal("powerToThePeople", true);
  console.log('spectacle keyup compteur = ', compteur, 'interrupt = ', interrupt, 'isItPowerToThePeople = ', isItPowerToThePeople);
  if(compteur < data.length-1 && interrupt==false && isItPowerToThePeople == true){
    window.clearTimeout(autonextcontainer)
    compteur +=1
    next();
    console.log("keyup, ", compteur)
    // ça c'est pour virer le autonext si il y en avait un en cours (c'est quand
    // ça avance tout seul avec un délai)
  }
}


Template.game.events({

  'mousemove' : function(pos){
      document.getElementById("workforce").style.left = pos.pageX+"px"
      document.getElementById("workforce").style.top = pos.pageY+"px"
      document.getElementById("score").style.left = pos.pageX+"px"
      document.getElementById("score").style.top = pos.pageY+"px"
  },

  'click .clickable' : function(e){
    startWork(e.target.id)
  },

  'click #cuppasInc': function(){
  //Meteor.call('setSuperGlobal', {name: 'cuppasCount', value: +=1});
  Meteor.call('setSuperGlobal', {name: 'cuppasInc'});
  },

  'click #cuppasDec': function(){
    Meteor.call('setSuperGlobal', {name: 'cuppasDec'});
  },

  'click #finishCuppa': function(){
    Meteor.call('setSuperGlobal', {name: 'finishCuppa'});
  },
  'click #oui': function(){
    console.log('salmclick oui', moment().format('YYYYMMDD-HH:mm:ss.SSS'));
    em.setClient({ reponse: 'oui', mode: 'singlePlayer' });
    em.emit('salmclick');
    console.log('salmclick emmited');
    console.log('salmclick emmited oui', moment().format('YYYYMMDD-HH:mm:ss.SSS'));
  },
  'click #non': function(){
    console.log('salmclick non', moment().format('YYYYMMDD-HH:mm:ss.SSS'));
    em.setClient({ reponse: 'non', mode: 'singlePlayer' });
    em.emit('salmclick');
    console.log('salmclick emmited non', moment().format('YYYYMMDD-HH:mm:ss.SSS'));
  },
  'click #euh': function(){
    console.log('salmclick euh', moment().format('YYYYMMDD-HH:mm:ss.SSS'));
    em.setClient({ reponse: 'euh', mode: 'singlePlayer' });
    em.emit('salmclick');
    console.log('salmclick emmited euh', moment().format('YYYYMMDD-HH:mm:ss.SSS'));
  },
  'click #ouiMP': function(){
    console.log('salmclick oui', moment().format('YYYYMMDD-HH:mm:ss.SSS'));
    em.setClient({ reponse: 'oui', mode: 'multiPlayer' });
    em.emit('salmclick');
    console.log('salmclick emmited');
    console.log('salmclick emmited oui', moment().format('YYYYMMDD-HH:mm:ss.SSS'));
  },
  'click #nonMP': function(){
    console.log('salmclick non', moment().format('YYYYMMDD-HH:mm:ss.SSS'));
    em.setClient({ reponse: 'non', mode: 'multiPlayer' });
    em.emit('salmclick');
    console.log('salmclick emmited non', moment().format('YYYYMMDD-HH:mm:ss.SSS'));
  },
  'click #euhMP': function(){
    console.log('salmclick euh', moment().format('YYYYMMDD-HH:mm:ss.SSS'));
    em.setClient({ reponse: 'euh', mode: 'multiPlayer' });
    em.emit('salmclick');
    console.log('salmclick emmited euh', moment().format('YYYYMMDD-HH:mm:ss.SSS'));
  },

  'touchstart #gcontainer': function(){
    // alert('touchstart #gcontainer');
    nextEvent();
  }

})

function startWork(where){

  document.getElementById("megaLoad").style.width="100%"


  if (actionAvailable<1) {
    console.log("no one available to do the job")
    return
  }else{
    console.log("start work on ",where)

    actionAvailable -= 1
    document.getElementById("workforce").innerHTML = actionAvailable

    switch(where){
      case "E0":
      case "E1":
      case "E2":
        delay = 15000
      break;

      case "M0":
      case "M1":
      case "M2":
      case "M3":
        delay = 4000
      break;
    }

    workDone = setTimeout(function(){
      finishWork(where)
    }, delay)
  }
};

function finishWork(where){
    console.log(where, " work done here!")
    actionAvailable += 1
    document.getElementById("workforce").innerHTML = actionAvailable

    switch(where){
      case "E0":
      case "E1":
      case "E2":
        document.getElementById(where).innerHTML = "HUTTE"
        document.getElementById(where).classList.remove("clickable")
        console.log("hut made at ", where)
        actionAvailable += 1
        document.getElementById("workforce").innerHTML = actionAvailable
      break;

      case "M0":
      case "M1":
      case "M2":
      case "M3":
      case "M4":
        randomBonus = Math.floor(Math.random()*2)
        score += 1
        document.getElementById("score").innerHTML = score


        maxSlicer = document.getElementById(where).innerHTML.length
        randomSlicer = Math.floor(Math.random() * maxSlicer);
        SlicerEnd = randomSlicer+1

        console.log("maxSlicer ", maxSlicer, " /Slicer ", randomSlicer, " /SlicerEnd ", SlicerEnd)

        initString = document.getElementById(where).innerHTML
        newString = initString.substring(-1,randomSlicer)+' '+initString.substring(SlicerEnd, maxSlicer);
        console.log("sliced string, ",newString)

        document.getElementById(where).innerHTML = newString

        console.log("maïs ready to be harvested at ", where)
      break;
      }
};

  function balayeurfunc(){
          $( ".eclair" ).remove();
          $( ".eclair2" ).remove();
  }
