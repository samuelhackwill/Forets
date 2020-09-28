const { gsap } = require("gsap/dist/gsap");
// TODO : implémenter un calculateur de fréquence de stroke
// pour accélérer ou ralentir le cycle de course
// ainsi que de faire avance le gonze plus ou moins vite
// (plus tu tapes vite, plus il va vite)

// a terme : si pas d'appui pendant une demi seconde, le personnage retourne au repos

var caughtUp = false;
var intervalReload;
Session.set("localName", "");
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
    document.getElementById("halloffame").style.display="block"
  });

  em.addListener('salmrefreshpage', function(what) {
    console.log('salm refresh page!', what);
    location.reload();
  });

});

Template.covid19.helpers({

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
  // console.log("redrawy", posTable)
  $.each(posTable, function(key, value){
    // console.log("redraw ", key, value)
    // console.log(document.getElementById(""+key))
    if(key == playerId && value[0]>90){
      clearInterval(timer);
      return
    }else{
      var doesPlayerExist = document.getElementById(""+key)

      if(doesPlayerExist!==null){
        doesPlayerExist.style.transform="translateX("+value[0]+"vw)"
      }
    }
  })
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

  // 48 = 0
  // 49 = 1
  // 50 = 2
  // 51 = 3

  if(e.keyCode == '32') nextEvent();
});

var nextEvent = function(){

  console.log(timeline.getTweensOf('#player-1', true));
  var playerOneTimeline = timeline.getChildren(true, false, true)[0];
  var timeScale = playerOneTimeline.timeScale();
  var newTimeScale = timeScale+0.02 >= 1 ? 1 : timeScale+0.02;
  console.log(timeScale, ' -> ', newTimeScale);
  gsap.to(playerOneTimeline, 0.25, {timeScale: newTimeScale});

  Meteor.call("requestStepServerSide", playerId)
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
  console.log("domelements ", domelements)
  // domelements2 = domelements[0].children
  // console.log("domelements2 ", domelements2)


    // console.log(yeecount+1, "YEE hide this guy")
  domelements.children[yeecount+1].style.opacity=0


    // console.log(yeecount+2, "YEE show this guy")
  domelements.children[yeecount+2].style.opacity=1





  if(yeecount<11){
    if(yeecount==1){
      // console.log(13 + "YEE hide this guy also ")
      domelements.children[13].style.opacity=0
    }
    yeecount ++
  }else{
    yeecount = 1;
  }

}

closingWindow = function(){
  Bonhomme.remove({_id:playerId})
  Meteor.call("removeOneGuy", playerId)
}
