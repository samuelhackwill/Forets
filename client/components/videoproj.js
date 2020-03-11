// call function yeehaw with setinterval so see the guy running
// 80 feels natural
// 5 does not
// a voir comment on combine avec un keystroke pour que ça soit plus joli qu'à la belonne


var caughtUp = false;
var intervalReload;
Session.set("localName", "");
yeecount = 1;
infiniteZindex = 0;

compteurAnim=1;


Template.videoproj.onCreated(function() {

  //subscribe à la collection representations
  this.autorun(() => {
    this.subscribe('allRepresentations');
    this.subscribe('allContenusEcran');
    this.subscribe('allPosRunner');
    this.subscribe('allSpeedTest');
    this.subscribe('allscore');
    this.subscribe('allFukinScore');
    this.subscribe('allHallOfFame');
    this.subscribe('allSuperGlobals');
  });

});



Template.videoproj.onRendered(function () {


  this.autorun(() => {
    let ready = Template.instance().subscriptionsReady();
    if (!ready){ return; }
    let contnus = ContenusEcran.find().fetch();
    console.log("contnus", contnus, data);
    // data = ContenusEcran.findOne({name: "ce_jeudi_no_comment"}).data
    data = ContenusEcran.findOne({name: "data_test"}).data
    console.log('srt spectacle videoproj rendered');
    console.log('data ?', data);
    console.log('ContenusEcran ?', ContenusEcran.find().fetch());
    // if(data) {
    //   catchUpWithTheShow();
    // }

    //
    // rawTextToJson();
  // console.log(Template.instance());
    // zoupageJSON(dataFromDB, data);
    // autonext(2000);
      // Meteor.setInterval(yeehaw(), 100);

  });





  $(document.body).addClass('videoproj');

  // function catchUpWithTheShow(){
  //   console.log('catchUpWithTheShow caughtUp?', caughtUp);
  //   if(!caughtUp) {
  //     caughtUp = true;
  //     console.log("checking compteur", compteur, "cookie.compteur", cookies.get('compteur'), modeSpectacle);
  //     //si on est en mode spectacle, que l'admin a le pouvoir
  //     var isPowerToThePeople = getSuperGlobal('powerToThePeople');
  //     if(modeSpectacle && !isPowerToThePeople) {
  //       //et si il y a un compteur enregistré
  //       var compteurAdmin = getSuperGlobal('compteurAdmin');
  //       console.log("checking compteurAdmin", compteurAdmin);

  //       if(null !== compteurAdmin) compteur = parseInt(compteurAdmin);
  //       if(compteur != -1) {
  //         //revenir où on était dans le spectacle
  //         next();
  //       }

  //       //ambiance?
  //       var whichAmbiance = getSuperGlobal("whichAmbiance", "");
  //       if(whichAmbiance != "") { //il y a une ambiance en cours
  //         //passons à cette ambiance
  //         var newAmbiance = ambiances.findOne({name: whichAmbiance});
  //         if(newAmbiance) {
  //           console.log("set Ambiance", newAmbiance.value)
  //           changeImg(newAmbiance.value)
  //         }
  //       }
  //     }
      
  //   }

  // }


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

  em.addListener('scoreGServer', function() {
    $('#srt').html("la personne de gauche a mis "+FukinScore.findOne({name:"gauche"}).score/1000+" secondes à parcourir le texte.")
  }); 

  em.addListener('scoreDServer', function() {
    $('#srt').html("la personne de droite a mis "+FukinScore.findOne({name:"droite"}).score/1000+" secondes à parcourir le texte.")
  }); 

  em.addListener('salmrefreshpage', function(what) {
    console.log('salm refresh page!', what);
    location.reload();
  }); 
  
  em.addListener('salmUnStop', function(what) {
    console.log('salm unstop', what);
    console.log('salm unstop - interrupt?', interrupt);
    unstop();
  }); 


// CUSTOM KEYUP POUR AVIGNON!!!

// startRace = function(){
//   __id = superGlobals.findOne({ isItVictoryYet: { $exists: true}})._id
//   superGlobals.update(__id, {$set:{"isItVictoryYet":true},})
// }

initiateTheShitOutOfThisProgram = function(who){
    //  __id = superGlobals.findOne({ isItVictoryYet: { $exists: true}})._id
    // superGlobals.update(__id, {$set:{"isItVictoryYet":true},})


    _did = PosRunner.find({name:"gauche"}).fetch()[0]._id
    _gid = PosRunner.find({name:"droite"}).fetch()[0]._id
    
    PosRunner.update(_did, {$set:{"posX":0},})
    PosRunner.update(_did, {$set:{"cycle":1},})

    PosRunner.update(_gid, {$set:{"posX":0},})
    PosRunner.update(_gid, {$set:{"cycle":1},})

    Session.set("localName", who)
}

  
  $(document.body).on('keyup', function(e) {

    e = e || window.event
    // KEYCODE 32 IS SPACEBAR
    // KEYCIODE 78 IS "n"

    // 48 = 0
    // 49 = 1
    // 50 = 2
    // 51 = 3

    if(e.keyCode == '32') nextEvent();


    if(e.keyCode == '48'){
      document.getElementById("srt").innerHTML="miracle des dieux :<br/>aucun bug"
    }    
    if(e.keyCode == '49'){
      document.getElementById("srt").innerHTML="pas de prise RJ45<br/>(bug lvl 1)"
    }    
    if(e.keyCode == '50'){
      document.getElementById("srt").innerHTML="conflit DHCP<br/>(!bug lvl 3!)"
    }
    if(e.keyCode == '51'){
      document.getElementById("srt").innerHTML=""
    }
  });

});

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
          $('#srt').html("\ \ \ \ \ ")
        }else{
          $('#srt').html(params)
        }
        // }
      // pis si la balise c'est pas une action et pas une balise de texte vide, met a jour le texte
      // bon ben c'est ici qu'il faudrait faire un truc
    }
  }

var nextEvent = function(){

  // var isItPowerToThePeople = superGlobals.findOne({ powerToThePeople: { $exists: true}}).powerToThePeople;
  var isItPowerToThePeople = getSuperGlobal("powerToThePeople", true);
  console.log('spectacle keyup compteur = ', compteur, 'interrupt = ', interrupt, 'isItPowerToThePeople = ', isItPowerToThePeople);
  if(compteur < data.length-1 && interrupt==false && isItPowerToThePeople == true){
    window.clearTimeout(autonextcontainer)
    compteur +=1
    next();
    console.log("keyup, ", compteur)

    __id = PosRunner.find({name:Session.get("localName")}).fetch()[0]._id
    _posX = PosRunner.find({name:Session.get("localName")}).fetch()[0].posX
    _cycle = PosRunner.find({name:Session.get("localName")}).fetch()[0].cycle

    if(_cycle<12){
      _cycle = _cycle+1
    }else{
      _cycle = 1
    }

    // if(superGlobals.findOne({ isItVictoryYet: { $exists: true}}).isItVictoryYet==false){

    PosRunner.update(__id, {$set:{"posX":_posX+1},})
    PosRunner.update(__id, {$set:{"cycle":_cycle},})

    // victory = superGlobals.findOne({ isItVictoryYet: { $exists: true}}).isItVictoryYet
    _progressG = (PosRunner.find({name:"gauche"}).fetch()[0].posX)*5
    _progressD = (PosRunner.find({name:"droite"}).fetch()[0].posX)*5

    // }


    if(_progressG>690 || _progressD>690 && victory==false){
      console.log("victory de quelqu'un")
      __id = superGlobals.findOne({ isItVictoryYet: { $exists: true}})._id
      superGlobals.update(__id, {$set:{"isItVictoryYet":true},})

      document.getElementById("victory").style.opacity="1"

      setTimeout(function(){
        document.getElementById("victory").style.opacity="0"
      },3000)

    }


    // document.getElementById("runningGuy").style.background="url('/img/running guy-"+compteurAnim+".png'"
    // make compteur anim a reactive var ou quoi...

    // ça c'est pour virer le autonext si il y en avait un en cours (c'est quand
    // ça avance tout seul avec un délai)
  }
}

yeehaw = function(){
  document.getElementById("sprite"+yeecount).style.zIndex=infiniteZindex

  if(yeecount<12){
    yeecount ++
  }else{
    yeecount = 1;
  }

  infiniteZindex ++
}

// i know this is stupid but don't have time


  Template.videoproj.helpers({

    victoryOnOff(){

      console.log("updating victoryONOFF")

      if(FukinScore.findOne({ winTrigger: { $exists: true}}).winTrigger==false){
        __id = PosRunner.findOne({ winTrigger: { $exists: true}})._id
        PosRunner.update(__id, {$set:{"winTrigger":false},})
        return "SPACEBAR ATHLETE!"
      }else{
        return "TEAM SIESTE."
      }

      // est ce que tu es le premier a gagner? si oui = "YES" sinon = "OH DOMMAGE"

      // if( ){
      //   return 1
      // }else{
      //   return 0
      // }
    },

    courseOnOff(){
      victory = superGlobals.findOne({ isItVictoryYet: { $exists: true}}).isItVictoryYet

      if(victory==false){
        console.log("courseOnOff returning 1")
        return 1
      }else{
        console.log("courseOnOff returning 0")
        return 0
      }
    },

    progressG(){
      _progressG = (PosRunner.find({name:"gauche"}).fetch()[0].posX)*5


        return _progressG
        //omg pour l'instant c'est des pourcentages de la taille en pixels du viewport... qui est différent en fonction des machines.
        // donc faudra faire mieux
    },    

    progressD(){
      _progressD = (PosRunner.find({name:"droite"}).fetch()[0].posX)*5

        return _progressD
        //omg pour l'instant c'est des pourcentages de la taille en pixels du viewport... qui est différent en fonction des machines.
        // donc faudra faire mieux
    },

    whichImageG(){
      _whichImageG = PosRunner.find({name:"gauche"}).fetch()[0].cycle
      return "\'/img/running guy-"+_whichImageG+".png\'"
    },

    whichImageD(){
      _whichImageD = PosRunner.find({name:"droite"}).fetch()[0].cycle
      return "\'/img/running guy-"+_whichImageD+".png\'"
    },

    whichVous(){
      _progressG = (PosRunner.find({name:"gauche"}).fetch()[0].posX)*5
      _progressD = (PosRunner.find({name:"droite"}).fetch()[0].posX)*5

      if(Session.get("localName")=="gauche"){
        return _progressG+39
      }else{
        return _progressD+39
      }
    }

  });