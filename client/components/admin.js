Template.registerHelper('equals', function (a, b) {
  return a == b;
});



var refreshedUp = false;

// salut c'est sam

Template.admin.onCreated(function() {
  console.log('Template admin created.');
  //subscribe à la collection contenus écran
  this.autorun(() => {
    this.subscribe('allSuperGlobals');
    this.subscribe('allRepresentations');
    this.subscribe('allContenusEcran');
    this.subscribe('allLoteries');
  });

});

Template.showtime.onRendered(function () {
});

Template.admin.onRendered(function () {
  console.log('admin!');


  function myMIDIMessagehandler(event){

    whichEtat = "e"+event.data[1]
    console.log(whichEtat)


    if(event.data[0]==144 && (event.data[1]==49 || event.data[1]==54 || event.data[1]==58 )){
      console.log("ca_va_peter cote client")
      em.emit("ca_va_peter")
      // donc là il faut instead qu'il appelle une fonction serveur qui fasse claquer un orage chez tous 
      // les clients

      // 49
      // 54
      // 58
    }

    if(event.data[0]==144 && event.data[1]==45){
      em.setClient({ key: whichEtat });
      em.emit("new_ambiance")
    }

    // console.log(event.data)
  }

  output = null
  m = null; // m = MIDIAccess object for you to make calls on
  navigator.requestMIDIAccess().then( onsuccesscallback, onerrorcallback );

  function onsuccesscallback( access ) {
    m = access;

    // Things you can do with the MIDIAccess object:
    var inputs = m.inputs; // inputs = MIDIInputMaps, you can retrieve the inputs with iterators

    var iteratorInputs = inputs.values() // returns an iterator that loops over all inputs
    var input = iteratorInputs.next().value // get the first input


    var outputs = m.outputs; // outputs = MIDIOutputMaps, you can retrieve the outputs with iterators
    input.onmidimessage = myMIDIMessagehandler; // onmidimessage( event ), event.data & event.receivedTime are populated
    var iteratorOutputs = outputs.values() // returns an iterator that loops over all outputs
    output = iteratorOutputs.next().value; // grab first output device

    
  }

  function onerrorcallback( err ) {
    console.log( "uh-oh! Something went wrong! Error code: " + err.code );
  }

  
  $(document.body).addClass('admin');
  console.log(UserStatus);
  console.log(this.UserConnections);

  Meteor.subscribe('userStatus');
  Meteor.subscribe('allPhoneNumbers');
  Meteor.subscribe('allSuperGlobals');

  this.autorun(() => {
    console.log("showtime autorun admin", Template.instance());
    let ready = Template.instance().subscriptionsReady();
    if (!ready){ return; }
    let contnus = ContenusEcran.find().fetch();
    // console.log("showtime contnus", contnus, data);
    // data = ContenusEcran.findOne({name: "ce_jeudi_no_comment"}).data
    if(data.length == 0) {
      console.log('showtime retrieving data');
      data = ContenusEcran.findOne({name: "data_test"}).data
    }
    // console.log('showtime data ?', data);
    console.log('showtime ContenusEcran ?', ContenusEcran.find().fetch());
    // rawTextToJson();
  // console.log(Template.instance());
    // zoupageJSON(dataFromDB, data);
    // autonext(2000);
    //refresh switches
    if(!refreshedUp) {
      refreshedUp = true;
      var isItPowerToThePeople = getSuperGlobal("powerToThePeople");
      $('input#josebove').bootstrapSwitch('state', !isItPowerToThePeople, true);
      var modeSpectacle = getSuperGlobal("modeSpectacle");
      $('input#showmode').bootstrapSwitch('state', modeSpectacle, true);
      var isTheShowStarted = getSuperGlobal("spectacleStarted", false);
      $('input#startSpectacle').bootstrapSwitch('state', isTheShowStarted, true);
    }
  });



  var isItPowerToThePeople = getSuperGlobal("powerToThePeople");
  console.log("showtime isItPowerToThePeople", isItPowerToThePeople);

  //recup compteur si on est en mode spectacle (par ex si on reload la page par inadvertance
  var modeSpectacle = getSuperGlobal("modeSpectacle");
  console.log('admin! compteur', compteur, "modeSpectacle", modeSpectacle);
  if(modeSpectacle) {
    console.log('admin! mode spectacle', compteur);
    //si on était en mode prendre le pouvoir, récupérer le compteur du cookie (= reprendre ou on en était)
    if(!isItPowerToThePeople) { //pouvoir à l'admin

      var compteurAdmin = getSuperGlobal("compteurAdmin");
      if(null !== compteurAdmin && compteurAdmin != compteur) {
        console.log('admin! compteurAdmin!=compteur');
        compteur = parseInt(compteurAdmin);
        // $('#currentCompteur').text(compteur);
        console.log('admin! compteur set to', compteur);
      }
    }

  } else {
    //on est pas en mode spectacle reset compteur
    Meteor.call('setSuperGlobal', {name: 'compteurAdmin', value: parseInt(compteur)});

  }
/*
  Polls.after.update(function (userId, doc, fieldNames, modifier, options) {
    em.emit('hi', userId, doc, fieldNames, modifier, options);
    console.log('after update', userId, doc, fieldNames, modifier, options);
  }, {fetchPrevious: false});
  
  */
  console.log('em', em);


  em.addListener('salmreponseoui', function(what) {
    //console.log('salm euh!', what, moment().format('YYYYMMDD-HH:mm:ss.SSS'));
    //output.send([144, 69, 91]);
    //un_note = setTimeout(output.send([144, 52, 0]),1500)
    console.log('salm oui!', what, moment().format('YYYYMMDD-HH:mm:ss.SSS'));
    if(what.mode == 'singlePlayer') {
      //mode single - play sound
      var son = new Audio('oui.ogg');
      son.addEventListener('playing', function(){
       console.log('oui playing', moment().format('YYYYMMDD-HH:mm:ss.SSS'));
      });
      son.play();
    } else if(what.mode == 'multiPlayer') {
      //mode multi - send midi
      output.send([144, 65, 91]);
      un_note = setTimeout(function(){ output.send([144, 65, 0])},10)
    }
  }); 

  em.addListener('salmreponsenon', function(what) {
    console.log('salm non!', what, moment().format('YYYYMMDD-HH:mm:ss.SSS'));
    if(what.mode == 'singlePlayer') {
      //mode single - play sound
      var son = new Audio('non.ogg');
      son.addEventListener('playing', function(){
       console.log('non playing', moment().format('YYYYMMDD-HH:mm:ss.SSS'));
      });
      son.play();
    } else if(what.mode == 'multiPlayer') {
      //mode multi - send midi
      output.send([144, 67, 91]);
      un_note = setTimeout(function(){ output.send([144, 67, 0])},10)
    }
  }); 

  em.addListener('salmreponseeuh', function(what) {
    console.log('salm euh!', what, moment().format('YYYYMMDD-HH:mm:ss.SSS'));

    if(what.mode == 'singlePlayer') {
      //mode single - play sound
      var son = new Audio('euuuh.ogg');
      son.addEventListener('playing', function(){
       console.log('euh playing', moment().format('YYYYMMDD-HH:mm:ss.SSS'));
      });
      son.play();
    } else if(what.mode == 'multiPlayer') {
      //mode multi - send midi
      output.send([144, 69, 91]);
      un_note = setTimeout(function(){ output.send([144, 69, 0])},10)
    }
  }); 


  em.addListener('adminnext', function(what) {
    console.log('admin next!', what);
    var son = new Audio('euuuh.ogg').play();
    // console.log('SERVER HI', arguments[0].$inc, Object.keys(arguments[0].$inc)[0], _.toArray(arguments));

    // var choice = parseInt(Object.keys(arguments[0].$inc)[0].replace(/(choices\.|\.votes)/g, ''));
    // var sounds = ['oui.ogg', 'non.ogg', 'euuuh.ogg'];
    // var son = new Audio(sounds[choice]).play();
  }); 



  em.addListener('adminSUPERinterrupt', function(what) {
    console.log('admin SUPER interrupt!', what);
    console.log('changer le mode SUPERinterrupt NOT USED RIGHT NOW');
    // Meteor.call('setSuperGlobal', {name: 'SUPERinterrupt', value: what.value});
    // var son = new Audio('euuuh.ogg').play();
    // console.log('SERVER HI', arguments[0].$inc, Object.keys(arguments[0].$inc)[0], _.toArray(arguments));

    // var choice = parseInt(Object.keys(arguments[0].$inc)[0].replace(/(choices\.|\.votes)/g, ''));
    // var sounds = ['oui.ogg', 'non.ogg', 'euuuh.ogg'];
    // var son = new Audio(sounds[choice]).play();
  }); 

  em.addListener('adminFireBuche', function(what) {
    console.log('admin FIRE a buche!', what);

    var buchesArray = getSuperGlobal("buchesCount", []);
    var buchesAllumees = buchesArray.filter(function(buche){ return buche; }).length;
    console.log("buchesAllumees is ", buchesAllumees);
    // if(buchesAllumees > 0) {
    if(what.buches > 0) {
      console.log("buchesAllumees > 0 !!", buchesAllumees);
      buchesToMidi = {
        midi1: [144, 84, 127],
        midi2: [144, 85, 127],
        midi3: [144, 86, 127],
        midi4: [144, 87, 127],
        midi5: [144, 88, 127],
        midi6: [144, 89, 127]
      }
      // output.send(buchesToMidi['midi'+buchesAllumees]);
      output.send(buchesToMidi['midi'+what.buches]);
    // } else if(buchesAllumees == 0) {
    } else if(what.buches == 0) {
      console.log("buchesAllumees == 0", buchesAllumees);
      //kill buches midi
      output.send([144, 84, 0]); // full velocity note on A4 on channel zero
      output.send([144, 85, 0]); // full velocity note on A4 on channel zero
      output.send([144, 86, 0]); // full velocity note on A4 on channel zero
      output.send([144, 87, 0]); // full velocity note on A4 on channel zero
      output.send([144, 88, 0]); // full velocity note on A4 on channel zero
      output.send([144, 89, 0]); // full velocity note on A4 on channel zero

    }
    // Meteor.call('setSuperGlobal', {name: 'SUPERinterrupt', value: what.value});
    // var son = new Audio('euuuh.ogg').play();
    // console.log('SERVER HI', arguments[0].$inc, Object.keys(arguments[0].$inc)[0], _.toArray(arguments));

    // var choice = parseInt(Object.keys(arguments[0].$inc)[0].replace(/(choices\.|\.votes)/g, ''));
    // var sounds = ['oui.ogg', 'non.ogg', 'euuuh.ogg'];
    // var son = new Audio(sounds[choice]).play();
  }); 


  //prendre le pouvoir
  //transformer en joli switch
  $('input#josebove').bootstrapSwitch();
  $('input#josebove').on('switchChange.bootstrapSwitch', function (event, data) {
    console.log('jose bové ftw!');
    // event.preventDefault();
    console.log('prendre le pouvoir? ', data, $(this).val());

    // var powerToThePeople = superGlobals.findOne({ powerToThePeople: { $exists: true}});
    // console.log("le pouvoir 1 ?", powerToThePeople);
    // var isPowerToThePeople = (powerToThePeople) ? powerToThePeople.powerToThePeople : true;
    // console.log("le pouvoir 1 ?", isPowerToThePeople);
    Meteor.call('setSuperGlobal', {name: 'powerToThePeople', value: !data});

    // var powerToThePeople = superGlobals.findOne({ powerToThePeople: { $exists: true}});
    // console.log("le pouvoir 2 ?", powerToThePeople);
    // var isPowerToThePeople = (powerToThePeople) ? powerToThePeople.powerToThePeople : true;
    // console.log("le pouvoir 2 ?", isPowerToThePeople);

    em.setClient({ powerToThePeople: !data });
    em.emit('adminswitchthepower');
    if(data == true) { //power admin
      // em.setClient({ bookmark: 'spectacle' });
      // em.emit('adminForceGoTo');
      // gotobookmark('spectacle');
    } else if(data == false) { //power retourne aux SALM
      // em.setClient({ bookmark: 'fin-spectacle' });
      // em.emit('adminForceGoTo');
      em.emit('adminUnStop');
    }
  });
  //activer le mode spectacle
  //transformer en joli switch
  $('input#showmode').bootstrapSwitch();
  $('input#showmode').on('switchChange.bootstrapSwitch', function (event, data) {
    console.log('showmode ftw!');
    // event.preventDefault();
    console.log('activer le mode spectacle? ', data, $(this).val());
    Meteor.call('setSuperGlobal', {name: 'modeSpectacle', value: data});
    em.emit('adminrefreshpage');
  });
  //démarrer le spectacle
  //transformer en joli switch
  $('input#startSpectacle').bootstrapSwitch();
  $('input#startSpectacle').on('switchChange.bootstrapSwitch', function (event, data) {
    console.log('startSpectacle ftw!');
    // event.preventDefault();
    console.log('démarrer le spectacle? ', data, $(this).val());
    Meteor.call('setSuperGlobal', {name: 'spectacleStarted', value: data});
    // em.emit('adminrefreshpage');
  });

  //activer le raccrochage
  //transformer en joli switch
  $('input#forcehangup').bootstrapSwitch();
  $('input#forcehangup').on('switchChange.bootstrapSwitch', function (event, data) {
    console.log('forcehangup ftw!');
    // event.preventDefault();
    console.log('activer le raccrochage? ', data, $(this).val());
    Meteor.call('setSuperGlobal', {name: 'forceHangup', value: data});
    // em.emit('adminrefreshpage');
  });
  //activer le mode SUPERinterrupt
  //transformer en joli switch
  $('input#SUPERinterrupt').bootstrapSwitch();
  $('input#SUPERinterruptMode').on('switchChange.bootstrapSwitch', function (event, data) {
    console.log('SUPERinterruptMode ftw!');
    // event.preventDefault();
    console.log('activer le mode SUPERinterrupt', data, $(this).val());
    Meteor.call('setSuperGlobal', {name: 'SUPERinterrupt', value: data});
    // em.emit('adminrefreshpage');
  });

  $('#next').on('click', function(){

    var isItPowerToThePeople = getSuperGlobal("powerToThePeople");
    if(!isItPowerToThePeople) {
      if(compteur < data.length-1){
        // window.clearTimeout(autonextcontainer)
        // compteur +=1
        adminNext();
        console.log("click next, compteur = ", compteur);
        // ça c'est pour virer le autonext si il y en avait un en cours (c'est quand
        // ça avance tout seul avec un délai)
      }
    }
  });

  // TO DO

  // cookie quand quelqu'un arrive au bout
  // attention y'a un bug avec les boutons que j'ai pseudo-rêglé en empêchant les mouseevents quand le compteur =! x ou y

  function adminNext(){
    console.log('adminNext', compteur);
    // if(compteur >= 75) compteur = 75;

    // var currentSub = data[compteur]
    // document.getElementById("srt").innerHTML = currentSub

    // if((type=="text")&&(params!="")){
    //   document.getElementById("srt").innerHTML = params
    //   // pis si la balise c'est pas une action et pas une balise de texte vide, met a jour le texte
    //   // bon ben c'est ici qu'il faudrait faire un truc
    //   if(params=="***"){
    //     // ça c'est pour caler des blancs
    //     document.getElementById("srt").innerHTML = ""
    //   }
    // }
    // ça c'est pour virer le focus des boutons oui et non histoire de pas les activer en appuyant sur espace
    // Session.update("compteur", compteur);
    // if(compteur < data.length-1){
      window.clearTimeout(autonextcontainer)
    console.log('adminNext2', compteur);
      compteur +=1
    console.log('adminNext3', compteur);
      var modeSpectacle = getSuperGlobal("modeSpectacle");
      var isItPowerToThePeople = getSuperGlobal("powerToThePeople");
      var compteurAdmin = getSuperGlobal("compteurAdmin");
      console.log("adminNext modeSpectacle?", modeSpectacle, "isItPowerToThePeople?", isItPowerToThePeople, "compteurAdmin", compteurAdmin);
      if(modeSpectacle && !isItPowerToThePeople && parseInt(compteurAdmin) != compteur) {
        console.log("admin next compteur set compteurAdmin", compteur)
        // cookies.set('compteurAdmin', compteur);
        Meteor.call('setSuperGlobal', {name: 'compteurAdmin', value: parseInt(compteur)});
      }
      // $('#currentCompteur').text(compteur);
      em.setClient({ compteur: compteur });
      em.emit('adminnext');
      next();
    // }
  }

  document.onkeyup = function(e) {

    e = e || window.event
    /*
    pour revenir en arrière
      if(e.keyCode =='37' && compteur > 0){
        compteur -=1
        next();
      }
      */

    //  KEYCODE 32 IS SPACEBAR
    // KEYCIODE 78 IS "n"

    var isItPowerToThePeople = getSuperGlobal("powerToThePeople");
    if(!isItPowerToThePeople) {
      if(e.keyCode =='78' && compteur < data.length-1){
        // window.clearTimeout(autonextcontainer)
        // compteur +=1
        adminNext();
        console.log("keyup, ", compteur)
        // ça c'est pour virer le autonext si il y en avait un en cours (c'est quand
        // ça avance tout seul avec un délai)
      }
    }
    //CUES

    // ptin on pourrait faire comment pour override les fonctions avec du délai si le client appuie une première fois sur espace 
    // genre neuneu = false

    /*
    if(compteur==5){
      toggle = false;
      document.getElementById("pagu").style.cursor = "pointer"
    }
    */
  }

});

Template.admin.helpers({
  usersOnline:function(){
    return Meteor.users.find();
  },
  usersOnlineCount:function(){
   //event a count of users online too.
   return Meteor.users.find().count();
  }
});

Template.showtime.helpers({
  isPowerToTheAdminChecked:function(){
    // var powerToThePeople = superGlobals.findOne({ powerToThePeople: { $exists: true}});
    // var isPowerToThePeople = (powerToThePeople) ? powerToThePeople.powerToThePeople : true;
    var isPowerToThePeople = getSuperGlobal("powerToThePeople", true);
    console.log("isPowerToTheAdminChecked", !isPowerToThePeople);
    return !isPowerToThePeople;
  },
  whoIsSUPERinterrupted:function(){
    // var SUPERinterrupt = superGlobals.findOne({ SUPERinterrupt: { $exists: true}});
    // var isSUPERinterrupt = (SUPERinterrupt) ? SUPERinterrupt.SUPERinterrupt : [];
    var isSUPERinterrupt = getSuperGlobal("SUPERinterrupt", []);
    console.log("isSUPERinterruptChecked", isSUPERinterrupt);
    return isSUPERinterrupt;
  },
  isModeSpectacleChecked:function(){
    // var modeSpectacle = superGlobals.findOne({ modeSpectacle: { $exists: true}});
    // var isModeSpectacle = (modeSpectacle) ? modeSpectacle.modeSpectacle : false;
    var isModeSpectacle = getSuperGlobal("modeSpectacle", []);
    console.log("isModeSpectacleChecked", isModeSpectacle);
    return isModeSpectacle;
  },
  isForceHangupChecked:function(){
    // var modeSpectacle = superGlobals.findOne({ modeSpectacle: { $exists: true}});
    // var isModeSpectacle = (modeSpectacle) ? modeSpectacle.modeSpectacle : false;
    var isForceHangup = getSuperGlobal("forceHangup", false);
    console.log("isForceHangupChecked", isForceHangup);
    return isForceHangup;
  },
  isTheShowStarted:function(){
    // var spectacleStarted = superGlobals.findOne({ spectacleStarted: { $exists: true}});
    // var isSpectacleStarted = (spectacleStarted) ? spectacleStarted.spectacleStarted : false;
    var isSpectacleStarted = getSuperGlobal("spectacleStarted", false);
    console.log("isTheShowStarted", isSpectacleStarted);
    return isSpectacleStarted;
  },
  usersOnlineCount:function(){
   //event a count of users online too.
   return Meteor.users.find().count();
  },

  cuppasCount:function(){
    // var cuppasCount = superGlobals.findOne({ cuppasCount: { $exists: true}});
    // var theCuppasCount = (cuppasCount) ? cuppasCount.cuppasCount : 0;
    var theCuppasCount = getSuperGlobal("cuppasCount", 0);
    console.log("theCuppasCount", theCuppasCount);
   return theCuppasCount;
  },
  nbCuppasFinished: function(){
    // var cuppasFinished = superGlobals.findOne({ nbCuppasFinished: { $exists: true}});
    // var nbCuppasFinished = (cuppasFinished) ? cuppasFinished.nbCuppasFinished : 0;
    var nbCuppasFinished = getSuperGlobal("nbCuppasFinished", 0);
    console.log("nbCuppasFinished", nbCuppasFinished);
   return nbCuppasFinished;
  },
  buchesAllummees: function(){

    var buchesArray = getSuperGlobal("buchesCount", []);
    var buchesAllumees = buchesArray.filter(function(buche){ return buche; }).length;

  },
  nextBucheAllumage:function(){
    // var nextBuche = superGlobals.findOne({ nextBucheAllumage: { $exists: true}});
    // var nextBucheAllumage = (nextBuche) ? nextBuche.nextBucheAllumage : 0;
    var nextBucheAllumage = getSuperGlobal("nextBucheAllumage", 0);
    console.log("nextBucheAllumage", nextBucheAllumage);
   return nextBucheAllumage;
  },
  buchesCount: function(){
    // var buchesCount = superGlobals.findOne({ buchesCount: { $exists: true}});
    // var buchesArray = (buchesCount) ? buchesCount.buchesCount : 0;
    var buchesArray = getSuperGlobal("buchesCount", 0);
    console.log("buchesArray", buchesArray);
   return buchesArray.length;
  },
  buchesArray: function(){
    // var buchesCount = superGlobals.findOne({ buchesCount: { $exists: true}});
    // var buchesArray = (buchesCount) ? buchesCount.buchesCount : [];
    var buchesArray = getSuperGlobal("buchesCount", []);
    console.log("buchesArray", buchesArray, buchesArray.sort().reverse());
   return buchesArray.sort().reverse();
  },
  loopCount: function(count){
    var countArr = [];
    for (var i=0; i<count; i++){
      countArr.push({});
    }
    return countArr;
  },

  dataArray: function (obj) {
    var arr = [], datas = obj;
    for (var key in datas) {
        var obj = {};
        obj.key = key;
        obj.value = datas[key];
        arr.push(obj);
    }
    return arr;
  },
  compteurAdmin: function(){
    return getSuperGlobal('compteurAdmin');
  }
});

Template.phonesList.helpers({
  listPhoneNumbers:function(){
    console.log("PhoneNumbers??");
    return PhoneNumbers.find({}, {sort: {updated: -1}});
  },
  phoneNumbersCount:function(){
   //event a count of users online too.
   return PhoneNumbers.find().count();
  },
  getRepresentationName:function(){
   var found = representations.findOne({_id: this.representation})
   console.log("getRepresentationName", found);
   return (found) ? found.name : this.representation;
  },
  quickRemoveButtonOnError: function () {
    return function (error) { alert("BOO!"); console.log(error); };
  },
  quickRemoveButtonOnSuccess: function () {
    return function (result) { alert("YAY!"); console.log(result); };
  },
  quickRemoveButtonBeforeRemove: function () {
    return function (collection, id) {
      var doc = collection.findOne(id);
      if (confirm('Really delete "' + doc.number + '"?')) {
        this.remove();
      }
    };
  }
});
Template.loteriesList.helpers({
  listLoteries:function(){
    console.log("loteries??");
    return loteries.find();
  },
  quickRemoveButtonOnError: function () {
    return function (error) { alert("BOO!"); console.log(error); };
  },
  quickRemoveButtonOnSuccess: function () {
    return function (result) { alert("YAY!"); console.log(result); };
  },
  quickRemoveButtonBeforeRemove: function () {
    return function (collection, id) {
      var doc = collection.findOne(id);
      if (confirm('Really delete "' + doc.name + '"?')) {
        this.remove();
      }
    };
  },

  dataArray: function (obj) {
    var arr = [], datas = obj;
    for (var key in datas) {
        var obj = {};
        obj.key = key;
        obj.value = datas[key];
        arr.push(obj);
    }
    return arr;
  }
});

Template.showtime.events({

  'click #top_midi1':function(){
    output.send([144, 84, 127]); // full velocity note on A4 on channel zero
/*  
        var zoupla = setTimeout(function(){
          output.send([144, 72,0])
          },1000)
*/
  },
    'click #top_midi2':function(){
    output.send([144, 85, 127]); // full velocity note on A4 on channel zero
  },
    'click #top_midi3':function(){
    output.send([144, 86, 127]); // full velocity note on A4 on channel zero
  },
    'click #top_midi4':function(){
    output.send([144, 87, 127]); // full velocity note on A4 on channel zero
  },    'click #top_midi5':function(){
    output.send([144, 88, 127]); // full velocity note on A4 on channel zero
  },    'click #top_midi6':function(){
    output.send([144, 89, 127]); // full velocity note on A4 on channel zero
  },
      'click #kill_midi':function(){
    output.send([144, 84, 0]); // full velocity note on A4 on channel zero
    output.send([144, 85, 0]); // full velocity note on A4 on channel zero
    output.send([144, 86, 0]); // full velocity note on A4 on channel zero
    output.send([144, 87, 0]); // full velocity note on A4 on channel zero
    output.send([144, 88, 0]); // full velocity note on A4 on channel zero
    output.send([144, 89, 0]); // full velocity note on A4 on channel zero
  },

  // faire un bouton pour éteindre toutes les buches!

  'click #resetCuppas': function(){
    //Meteor.call('setSuperGlobal', {name: 'cuppasCount', value: +=1});
    Meteor.call('setSuperGlobal', {name: 'cuppasReset'});
  },
  'click #fakeCuppasInc': function(){
    //Meteor.call('setSuperGlobal', {name: 'cuppasCount', value: +=1});
    Meteor.call('setSuperGlobal', {name: 'cuppasInc'});
  },
  'click #fakeCuppasFinished': function(){
    //Meteor.call('setSuperGlobal', {name: 'cuppasCount', value: +=1});
    Meteor.call('setSuperGlobal', {name: 'finishCuppa'});
  },
  'click #resetSUPERinterrupt': function(){
    console.log("resetSUPERinterrupt!");
    //Meteor.call('setSuperGlobal', {name: 'cuppasCount', value: +=1});
    var bookmarkToGo = ($('#whereSUPERinterrupt').val() != "") ? $('#whereSUPERinterrupt').val() : 'spectacle';
    em.setClient({ bookmark: bookmarkToGo });
    em.emit('adminForceGoTo');
      gotobookmark(bookmarkToGo);
    Meteor.call('setSuperGlobal', {name: 'SUPERinterrupt', value: []});
  },

  'click #start-the-stream': function(){
    // console.log('superGlobals streamStarted', Meteor);
    // Meteor.call('startTheStream', function(result){
    //   console.log(result);
    // });
    // em.setClient({ compteur: compteur });
    em.emit('adminstartstream');
    console.log('adminstartstream emmited');
  },
  'click #show-the-ONE': function(){
      em.emit('adminshowtheone');
  },
  'click #hide-the-ONE': function(){
      em.emit('adminhidetheone');
  },
  'click #show-the-ONE-single-training': function(){
      em.emit('adminshowtheone-single-training');
  },
  'click #show-the-ONE-multi-training': function(){
      em.emit('adminshowtheone-multi-training');
  },

  'click #hide-the-ONE-training': function(){
      em.emit('adminhidetheone-training');
  },
/*
  'submit #addcompteur': function(event){


      var newCompteur = $('#newCompteur').val();


      console.log("addcompteur submit", newCompteur);
      Meteor.call('createCompteurFromAdmin',newCompteur,function(err,result){
        if(!err){
          console.log("a new compteur just got created")
        } else {
          console.log("something goes wrong with the following error message " +err.reason )
        }
      });
           

      return false;


  },*/
  'click button.remove-SUPERinterrupt': function(event){

    if(Roles.userIsInRole(Meteor.user(), "admin")==true) {
      console.log('click button.remove-SUPERinterrupt', $(event.currentTarget).val());

      // var SUPERinterrupt = superGlobals.findOne({ SUPERinterrupt: { $exists: true}});
      // var isSUPERinterrupt = (SUPERinterrupt) ? SUPERinterrupt.SUPERinterrupt : false;
      var isSUPERinterrupt = getSuperGlobal("SUPERinterrupt", false);
      console.log("parking from admin : is isSUPERinterrupt", isSUPERinterrupt);
      if(SUPERinterrupt !== false) {
        var parkingRole = $(event.currentTarget).val();
        console.log("parking from admin : disable FOR ONE ROLE -> ", parkingRole);
        //retirer role du tableau SUPERinterrupt (si déjà dedans)
        var found = jQuery.inArray(parkingRole, isSUPERinterrupt);
        if (found >= 0) {
          // Element was found, remove it.
          isSUPERinterrupt.splice(found, 1);
          console.log("parking from admin : disabling for ", parkingRole);
        } else {
          // Element was not found, don't remove it.
        }
      }
      // em.setClient({ value: isSUPERinterrupt });
      // em.emit('adminSUPERinterrupt');
      console.log("parking from admin : new SUPERinterrupt = ", isSUPERinterrupt);
      Meteor.call('setSuperGlobal', {name: 'SUPERinterrupt', value: isSUPERinterrupt});
    }
  },
  'click button.add-SUPERinterrupt': function(event){

      console.log('click button.add-SUPERinterrupt', $(event.currentTarget).val());

      // var SUPERinterrupt = superGlobals.findOne({ SUPERinterrupt: { $exists: true}});
      // var isSUPERinterrupt = (SUPERinterrupt) ? SUPERinterrupt.SUPERinterrupt : false;
      var isSUPERinterrupt = getSuperGlobal("SUPERinterrupt", false);
      console.log("parking from admin : is isSUPERinterrupt", isSUPERinterrupt);
      if(SUPERinterrupt !== false) {

        var parkingRole = $(event.currentTarget).val();
        console.log("parking from admin : enable FOR ONE ROLE -> ", parkingRole);
        //retirer role du tableau SUPERinterrupt (si déjà dedans)
        var found = jQuery.inArray(parkingRole, isSUPERinterrupt);
        if (found >= 0) {
          // Element was found, don't add it again.
        } else {
          // Element was not found, add it.
          isSUPERinterrupt.push(parkingRole);
          console.log("parking : enabling for ", parkingRole);
        }
        console.log("parking from admin : new SUPERinterrupt = ", isSUPERinterrupt);
        Meteor.call('setSuperGlobal', {name: 'SUPERinterrupt', value: isSUPERinterrupt});
      }
      // em.setClient({ value: isSUPERinterrupt });
      // em.emit('adminSUPERinterrupt');

  },
  'click div.autofill_bookmark span': function(event){

      console.log('div.autofill_bookmark span', $(event.currentTarget).text());

      $('#whereSUPERinterrupt').val($(event.currentTarget).text());


  }

});



Template.admin.events({

  'click .divAmbiance' : function(event){
    var _id = event.currentTarget.id
    changeImg([etats[_id][0], etats[_id][1]])
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

  'click input#setCompteur': function(){
    console.log('setCompteur', $('#adminCompteur').val());
    compteur = parseInt($('#adminCompteur').val())-1;
    //fake adminNext()
    window.clearTimeout(autonextcontainer)
    compteur +=1
    var modeSpectacle = getSuperGlobal("modeSpectacle");
    var isItPowerToThePeople = getSuperGlobal("powerToThePeople");
    var compteurAdmin = getSuperGlobal("compteurAdmin");
    console.log("adminNext modeSpectacle?", modeSpectacle, "isItPowerToThePeople?", isItPowerToThePeople, "compteurAdmin?", compteurAdmin);
    if(modeSpectacle && !isItPowerToThePeople && parseInt(compteurAdmin) != compteur) {
      console.log("admin next compteur set cookie", compteur)
      // cookies.set('compteurAdmin', compteur);
      Meteor.call('setSuperGlobal', {name: 'compteurAdmin', value: parseInt(compteur)});
    }
    // $('#currentCompteur').text(compteur);
    em.setClient({ compteur: compteur });
    em.emit('adminnext');
    next();
  }

});

Template.loteriesList.events({

  'click button.pick-random-one': function(event){

    console.log('click button.pick-random-one', $(event.currentTarget).val(), this);

    args = {_id: this._id}

    Meteor.call('chooseRandomONE', args);
  },
  'click button.pick-everybody-tea': function(event){

    console.log('click button.pick-everybody-tea', $(event.currentTarget).val(), this);

    args = {_id: this._id}

    Meteor.call('chooseEverybodyTea', args);
  },
  'click button.assign-random-phoneNumbers': function(event){

    console.log('click button.assign-random-phoneNumbers', $(event.currentTarget).val(), this);

    args = {_id: this._id}

    Meteor.call('assignRandomPhoneNumbers', args);
  },
  'click button.deliver-messages': function(event){

    console.log('click button.deliver-messages', $(event.currentTarget).val(), this);

    args = {_id: this._id, name: this.name}
    em.setClient(args);
    em.emit('adminDeliverMessages');
  }

});