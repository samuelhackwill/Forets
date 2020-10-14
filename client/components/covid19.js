// TODO : implémenter un calculateur de fréquence de stroke
// pour accélérer ou ralentir le cycle de course
// ainsi que de faire avance le gonze plus ou moins vite
// (plus tu tapes vite, plus il va vite)

// a terme : si pas d'appui pendant une demi seconde, le personnage retourne au repos

var caughtUp = false;
var intervalReload;
Session.set("localName", "");
Session.set("spaceBarEffect", 0);
yeecount = 1;
zob = ""
playerHasWonLocaly = false;
timer = ""

pseudos = ["ant", "mar", "cam", "tom", "ale", "jea", "ali", "jul", "XXX", "zor", "GRO", "zob"]
randompseudo= pseudos[Math.floor(Math.random() * pseudos.length)];
communes = ["Aiguebelette","Attignat-Oncin","Ayn","Domessin","Dullin","Gerbaix","La Bridoire","Le Pont-de-Beauvoisin","Lépin-le-lac","Lépin-Village","Nances","Novalaise","Saint-Alban de Montbel","Saint-Béron","Saint-Genix-sur-guiers","Saint-Jean-de-Chevelu","Sainte-Marie-D'Alvey","Verel","Yenne"]
randomcommune= communes[Math.floor(Math.random() * communes.length)];

// testSpeed = [50, 52, 56, 60, 61, 65, 105, 107, 130, 134, 200, 250]
// hmmm quand les appels à la DB sont trop proches les uns des autres pour
// deux clients ça fout grave la merde mammen.
// il faut que je pose la question à un specialiste de meteor.
// meteor boards ou stack overflow

// ça marchait mieux quand j'avais que quatre valeurs dans le tableau je crois
// ou peut être c'est lié au fait que je faisais moins d'appels à la DB? hm
// testSpeed = [50, 100, 150, 200]


// randomTestSpeed = testSpeed[Math.floor(Math.random() * testSpeed.length)];

compteurAnim=1;

animationRate = 20;
// en fait 80 c'est pas mal


Template.covid19.onCreated(function() {


  //subscribe à la collection representations
  this.autorun(() => {
    // this.subscribe('allRepresentations');
    this.subscribe('allBonhommes');
    this.subscribe('allFukinScore');
    this.subscribe('allViewSwitcher');
    // this.subscribe('allContenusEcran');
    this.subscribe('allHallOfFame');
    // this.subscribe('allTimer');
    this.subscribe('allSuperGlobals');
    this.subscribe('allWinners');
  });

  $(window).bind('beforeunload', function() {
        closingWindow();
    });
  // ici toute la logique cookies & id blublu

  poules = ["lents", "rapides"]
  randomPoule = poules[Math.floor(Math.random() * poules.length)];

  // insère un nouveau player dans la db
  playerId = Bonhomme.insert({arrivedAt : new Date(), posX : 0, posY : 0, pseudo : randompseudo, commune:randomcommune, poule : randomPoule, haswonpoule : "", score:{"firstRun":0, "pouleRun":0, "ffaRun":0} })

  // insère ta posx dans le tableau de vérité
  Meteor.call("addGuyToPosTable", playerId)

});



Template.covid19.onRendered(function () {

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
      // catchUpWithTheShow();
    }
  });

  $(document.body).addClass('covid19');

  em.addListener("stopRunServer", function(){
    clearInterval(timer);
  });

  em.addListener("autoRunAll", function(){
    console.log('AUTO RUN ALL')
    timer = setInterval(function(){ 
      Meteor.call("requestStepServerSide", playerId)
      console.log('keypress robot', playerId)    
    },parseInt(Session.get("testSpeed")))
  });

  em.addListener("victoryAnimation", function(what){
    console.log("hey, victoryAnimation!")
    document.getElementById("sav").style.display="block"
  });

  em.addListener("endRaceAnimation", function(what){
    console.log("hey, the race is finished!")
    document.body.style.backgroundColor="black";
    document.getElementById("runnersGrid").style.opacity="0";
    // hide running peeps
    // show score of winner
    // then go back to srt

    // document.getElementById("halloffame").style.display="block"
  });

  em.addListener('salmrefreshpage', function(what) {
    console.log('salm refresh page!', what);
    location.reload();
  }); 

  em.addListener('scoreGServer', function() {
    $('#srt').html("la personne de gauche a mis "+FukinScore.findOne({name:"gauche"}).score/1000+" secondes à parcourir le texte.")
  }); 

  em.addListener('scoreDServer', function() {
    $('#srt').html("la personne de droite a mis "+FukinScore.findOne({name:"droite"}).score/1000+" secondes à parcourir le texte.")
  }); 


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

});

Template.covid19.helpers({
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


  // pseudo(){
  //   return randompseudo
  // },


  // commune(){
  //   return randomcommune
  // },


  HallOfFameList(){
    return HallOfFame.find({},{sort : {score : 1}})
  },

  timerShow(){
    return Timer.find({})
  },

  bonhomme(){
    if (ViewSwitcher.find({"activated":true}).fetch()[0].name==="noCourse") {
      return
    }    

    if (ViewSwitcher.find({"activated":true}).fetch()[0].name==="freeForAll") {
      return Bonhomme.find({},{sort : {arrivedAt : 1}})
    }    

    if (ViewSwitcher.find({"activated":true}).fetch()[0].name==="courseSolo") {
      return Bonhomme.find({_id : playerId})// just one guy, but the full object so we can access all its proprieties
    }    

    if (ViewSwitcher.find({"activated":true}).fetch()[0].name==="coursePoule") {
      return Bonhomme.find({poule : randomPoule}, {sort : {arrivedAt : 1}}) // à mettre à jour avec le mécanisme des poules
    }

    if (ViewSwitcher.find({"activated":true}).fetch()[0].name==="courseFinale") {
      return // just the poule winners
    }
  },

  gauchedroite(){
    return Session.get("localName")
  },

  vous(){
    if(playerId===this._id){
      return "V"
    }else{
      return
    }
  },

  whichRace(){
    console.log("WHICH RACE TRIGGERED")
    return ViewSwitcher.find({"activated":true}).fetch()[0].name
  },

  winner(){
    return Winners.find({})
  },

  winnerOnOff(){
    // 0 no one has won yet
    // 1 yaaay we have a winner to the first race
    // 2 ok now let's move on
    if(Winners.find({})){return 1}else{return 0}

  }
});


redrawPlayers=function(posTable){
  if (Router.current().route.getName()=="admin") {
    return
  }else{
  // console.log("redrawy", posTable)
    $.each(posTable, function(key, value){
      // console.log("redraw ", key, value)
      // console.log(document.getElementById(""+key))
      if(key == playerId && value>95){
        console.log("STOP THE TIMEEEEER NOONE MOVE")
        clearInterval(timer); //autorun
        Meteor.call("endRace", Session.get("localName"))
        return
      }else{
        var doesPlayerExist = document.getElementById(""+key)

        if(doesPlayerExist!==null){
          doesPlayerExist.style.transform="translateX("+value+"vw)"
        }
      }
    })
  }
};


setDeceleratingTimeout = function(callback, factor, times){
  var internalCallback = function(tick, counter){
    return function(){
      if (--tick >= 0){
        window.setTimeout(internalCallback, ++counter * factor);
        callback();

      }
    }
  }(times, 0) ;
  window.setTimeout(internalCallback, factor);
};


$(document.body).on('keyup', function(e) {

  e = e || window.event
  // KEYCODE 32 IS SPACEBAR
  // KEYCIODE 78 IS "n"


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
  
  if(e.keyCode == '32')
  {
    var isItPowerToThePeople = getSuperGlobal("powerToThePeople", true);
    if(compteur < data.length-1 && interrupt==false && isItPowerToThePeople == true){
      if(Session.get("spaceBarEffect")==0){
        next();
        // move dat text
      }else{
        nextEvent();
        // move dat guy
    }
  }
}

});

var nextEvent = function(){
  Meteor.call("requestStepServerSide", playerId)
  imageCycler(playerId)
}

sendPseudo = function(who, e){
  Bonhomme.update(who, {$set:{"pseudo":e},})
  document.getElementById("lazyStartup").style.display="none"
}

imageCycler = function(who){

  // en vrai ça devrait fonctionner comme ça : quand tu appuies sur la barre espace
  // ça correspond à quand le pied touche le sol
  // et ça cycle les autres images comme ça peut
  // mais pas avec un set timeout tout laid


  domelements = document.getElementById(who).children[0]
  // domelements2 = domelements[0].children
  // console.log("domelements2 ", domelements2)


    // console.log(yeecount+1, "YEE hide this guy")
  domelements.children[yeecount].style.opacity=0


    // console.log(yeecount+2, "YEE show this guy")
  domelements.children[yeecount+1].style.opacity=1


  if(yeecount<10){
    if(yeecount==1){
      domelements.children[11].style.opacity=0
    }
    yeecount ++
  }else{
    yeecount = 1;
  }
}

closingWindow = function(){
  Bonhomme.remove({_id:playerId})
  Meteor.call("removeOneGuy", playerId)
  Meteor.call("getRidOfWinners")
}