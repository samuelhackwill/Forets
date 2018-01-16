//TODO
// BLOQUEUR DE SPRINT && CLOCHE-PIEDS

// INTERRUPT DE LA NUIT

// JACOB EST LA PYRALE DES CHOCO BISSON

var streamCheckInterval;
var caughtUp = false;
var intervalReload;
journeyStarted = false;
getSvgPos = 0;
SvgPos =0;

whichKey1='32'
whichKey2='32'
// pour avancer dans le texte c'est la barre espace au début
// puis ça sera la touche directionelle gauche & droite

getNmbr = new RegExp('[0-9]+');

Template.jacky.onCreated(function() {

  //subscribe à la collection representations
  this.autorun(() => {
    this.subscribe('allRepresentations');
    this.subscribe('allContenusEcran');
    this.subscribe('allLoteries');
  });
});


Template.jacky.onRendered(function () {


  this.autorun(() => {
    let ready = Template.instance().subscriptionsReady();
    if (!ready){ return; }
    let contnus = ContenusEcran.find().fetch();
    console.log("contnus", contnus, data);
    // data = ContenusEcran.findOne({name: "ce_jeudi_no_comment"}).data
    data = ContenusEcran.findOne({name: "data_test"}).data
    console.log('srt spectacle jacky rendered');
    console.log('data ?', data);
    console.log('ContenusEcran ?', ContenusEcran.find().fetch());
       autonext(3000);
    if(data) {
      catchUpWithTheShow();
    }

    //
    // rawTextToJson();
  // console.log(Template.instance());
    // zoupageJSON(dataFromDB, data);
  });
  localIp="Local"
  findIp(addIp);
  // ça c'est un petit hack webRTC pour chopper l'adresse IP des gens
  // might not work on safari et tout
  document.getElementById("MAMAN").style.transform="translateY(0px)"
  // ça c'est pour que par ensuite le défileur puisse lire les propriétés de maman

  function catchUpWithTheShow(){
    // console.log('catchUpWithTheShow caughtUp?', caughtUp);
    // if(!caughtUp) {
    //   caughtUp = true;
    //   // console.log("checking compteur", compteur, "cookie.compteur", cookies.get('compteur'), modeSpectacle);
    //   //si on est en mode spectacle, que l'admin a le pouvoir
    //   var isPowerToThePeople = getSuperGlobal('powerToThePeople');
    //   if(modeSpectacle && !isPowerToThePeople) {
    //     //et si il y a un compteur enregistré
    //     var compteurAdmin = getSuperGlobal('compteurAdmin');
    //     // console.log("checking compteurAdmin", compteurAdmin);

    //     if(null !== compteurAdmin) compteur = parseInt(compteurAdmin);
    //     if(compteur != -1) {
    //       //revenir où on était dans le spectacle
    //       next();
    //     }

    //     //ambiance?
    //     var whichAmbiance = getSuperGlobal("whichAmbiance", "");
    //     if(whichAmbiance != "") { //il y a une ambiance en cours
    //       //passons à cette ambiance
    //       var newAmbiance = ambiances.findOne({name: whichAmbiance});
    //       if(newAmbiance) {
    //         // console.log("set Ambiance", newAmbiance.value)
    //         changeImg(newAmbiance.value)
    //       }
    //     }
    //   }
      
    // }

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

  // window.document.body.addEventListener('keyup', function(){console.log("nique")})
  
  bodyEvent = function(e){
    if (e.target.id=="formulaire") {
      return
    }

    // console.log(e.originalEvent.path[0].id)
    // KEYCODE 32 IS SPACEBAR
    // KEYCIODE 78 IS "n"
    if(e.keyCode == whichKey1 || e.keyCode == whichKey2){
      console.log("keypressed was ", e.keyCode)
      nextEvent(e.keyCode);
    }
  };
  
  $(document.body).on('keyup', function(e) {
    e = e || window.event
    // console.log(e.target)

    bodyEvent(e)
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

});

var nextEvent = function(foot){

  // var isItPowerToThePeople = superGlobals.findOne({ powerToThePeople: { $exists: true}}).powerToThePeople;
  var isItPowerToThePeople = getSuperGlobal("powerToThePeople", true);
  console.log('spectacle keyup compteur = ', compteur, 'interrupt = ', interrupt, 'isItPowerToThePeople = ', isItPowerToThePeople);
  
  if(compteur < data.length-1 && interrupt==false && isItPowerToThePeople == true){
    window.clearTimeout(autonextcontainer)
    compteur +=1
    next();
    if(journeyStarted && isItNight==false){
      randonnee(foot)
    }

    console.log("keyup, ", compteur)
    // ça c'est pour virer le autonext si il y en avait un en cours (c'est quand
    // ça avance tout seul avec un délai)
  }
}

Template.jacky.events({

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