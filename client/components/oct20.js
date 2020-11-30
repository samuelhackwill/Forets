const { gsap } = require("gsap/dist/gsap");

// gsap globals
timeline = gsap.timeline();
// timeline globale de toute la scène
timelineTrack = gsap.timeline({id:'track'});
// timeline de la piste de course
isBeforeFinish = false;
// booleenne pour stopper la camera de chaque joueur

throttle = false;
// booleenne pour empecher le triple click lors du choix du mot

var caughtUp = false;
var intervalReload;
Session.set("localName", "");
yeecount = 1;
zob = ""
playerHasWonLocaly = false;

// timeintervals
timer = ""
loading =""

// le truc qui permet de faire cycler le texte lol
loadingDialogCycle = 0


playerId = ""

pseudos = ["ant", "mar", "cam", "tom", "ale", "jea", "ali", "jul", "XXX", "zor", "GRO", "zob"]
randompseudo= pseudos[Math.floor(Math.random() * pseudos.length)];
communes = ["Aiguebelette","Attignat-Oncin","Ayn","Domessin","Dullin","Gerbaix","La Bridoire","Le Pont-de-Beauvoisin","Lépin-le-lac","Lépin-Village","Nances","Novalaise","Saint-Alban de Montbel","Saint-Béron","Saint-Genix-sur-guiers","Saint-Jean-de-Chevelu","Sainte-Marie-D'Alvey","Verel","Yenne"]
randomcommune= communes[Math.floor(Math.random() * communes.length)];

compteurAnim=1;

animationRate = 20;
// en fait 80 c'est pas mal

Template.loading.onCreated(function(){
	Session.set("dynamicRender", "reader")
  Session.set("whichRace", "none")

  poules = ["lents", "rapides"]
  randomPoule = poules[Math.floor(Math.random() * poules.length)];

  // insère un nouveau player dans la db
  playerId = Bonhomme.insert({
    word : "", arrivedAt : new Date(), posX : 0, posY : 0, 
    pseudo : randompseudo, commune:randomcommune, 
    poule : randomPoule, haswonpoule : "", 
    score:{"firstRun":0, "soloRun":0, "ffaRun":0, "pouleRun":0, "finals":0} })

  // insère ta posx dans le tableau de vérité
  Meteor.call("addGuyToPosTable", playerId, (error, result)=>{
    if (error) {
      console.log("error ",error)
    }else{
      console.log("result ",result)
    }
  })
})

Template.reader.onCreated(function(){
    Session.set("spaceBarEffect", 1)
    Session.set("whichRace", "firstRun")
});

Template.reader.onRendered(function(){

  this.autorun(() =>{
    this.subscribe('allBonhommes');
    this.subscribe("allFukinScore");
    this.subscribe("allContenusEcran", {
      onReady: function () {     
        let contnus = ContenusEcran.find().fetch();
        data = ContenusEcran.findOne({name: "data_test"}).data
        var isItPowerToThePeople = superGlobals.findOne({ powerToThePeople: { $exists: true}}).powerToThePeople;
        console.log("isItPowerToThePeople", isItPowerToThePeople);
       },
      onError: function () { console.log("onError", arguments); }
    });
  })
  em.addListener('salmnext', function(what) {
    console.log('salm next!', what);
    // compteur = what.compteur;
    var SUPERinterrupt = superGlobals.findOne({ SUPERinterrupt: { $exists: true}});
    var isSUPERinterrupt = (SUPERinterrupt) ? SUPERinterrupt.SUPERinterrupt : [];
    console.log("salm next : isSUPERinterrupt", isSUPERinterrupt);
    var found = jQuery.inArray('salm', isSUPERinterrupt);
    if (found >= 0) {
      //ce role est dans le parking !
    } else {
      //ce role n'est pas dans le parking, faisons un next
      console.log('pas dans le parking, faisons un next')
      compteur = what.compteur;
      next();
    } 
  }); 

  em.addListener('salmForceGoTo', function(what) {
    console.log('salm salmForceGoTo!', what);
    // compteur = what.compteur;
    gotobookmark(what.bookmark);
  }); 

  em.addListener("remoteClickWord", function(what){

    console.log(what.params)

    document.getElementById(what.params).style.pointerEvents="none";
    document.getElementById(what.params).style.color="darkgrey";
  });

  em.addListener("remoteGoToRaceTrack", function(){

    clearInterval(loading)
    document.getElementById("loadingWidgetDialog").innerHTML="Ah ça y est tout le monde a choisi un mot! <br/> L'écran va devenir tout noir, pas de panique."

    setTimeout(function(){
      document.body.style.opacity="0"
    },4500)

    setTimeout(function(){
      Session.set("dynamicRender", "raceTrack")
    },5500)

  });
})

Template.reader.events({

// le trigger span span est bug prone faudrait le changer un jour

  'mouseenter span span' : function(e){
    document.getElementById("zouifTitle").innerHTML = e.target.innerHTML
    document.getElementById("zouifBody").innerHTML = "<span id='def1'>"+wordsDef[e.target.innerHTML+"1"]+"</span><br/><br/><span id='def2'>"+wordsDef[e.target.innerHTML+"2"]+"<span>"
    document.getElementById("zouif").style.opacity = "1"
   },

  'mouseleave span span' : function(e){
  document.getElementById("zouif").style.opacity = "0"
 },

  'click span span' : function(e){
    var loadingTxt = ["chargement .","chargement ..","chargement ..."]
    var t = '';
    console.log("CLICK ", e.target.innerHTML, " ", e.target.id)

    // make all span spans unclickable
    $('span > span').each(function() {
      var $this = $(this);
      $this.addClass("unclickable")
    });

    // send message to server
    em.setClient({ params: e.target.id });
    em.emit("salmClickWord")

    // change background color
    setTimeout(function(){
      document.body.style.backgroundColor="black"
    },500)

    // show loading widget
    document.getElementById("loadingWidget").style.opacity = "1"

    // make widget run
    loading = setInterval(function(){
      var insertText = ""
      imageCycler("loadingWidgetRunner")

      switch(loadingDialogCycle){
        case 0:
        case 1:
        case 6:
        case 7:
          insertText="chargement."
        break;
        case 2:
        case 3:
        case 8:
        case 9:
          insertText="chargement.."
        break;
        case 4:
        case 5:
        case 10:
        case 11:
          insertText ="chargement..."
        break;
        default:
          insertText ="on attend encore "+Bonhomme.find({"word":""}).fetch().length + " personne(s)"
        break;
      }   

      document.getElementById("loadingWidgetDialog").innerHTML=insertText

      if (loadingDialogCycle<23) {
        loadingDialogCycle++
      }else{
        loadingDialogCycle=0
      }

    },250)

    // change spacebar effect
    Session.set("spaceBarEffect", 2)

    // tell the DB i have chosen a word!
    Bonhomme.update(playerId, {$set:{"word":e.target.innerHTML},})

    // check if i'm the last one, and if it's the case ask for the server to change 
    // everyone's dynamic render
    stillWaitingForTheOthers = Bonhomme.find({"word":""}).fetch().length
    if (!stillWaitingForTheOthers) {
        em.emit("everybodyChoseTheWord")
    }else{
      console.log("still waiting for "+Bonhomme.find({"word":""}).fetch().length+" people.")
    }

  },
});

Template.raceTrack.onCreated(function() {

  Session.set("whichRace", "soloRun")
  Session.set("spaceBarEffect", 3)

  //subscribe à la collection representations
  this.autorun(() => {
    this.subscribe('allBonhommes');
    this.subscribe('allViewSwitcher');
    this.subscribe('allHallOfFame');
    // this.subscribe('allTimer');
    this.subscribe('allSuperGlobals');
    this.subscribe('allWinners');
  });

  $(window).bind('beforeunload', function() {
        closingWindow();
    });

  $(document).off("mousemove")
});



Template.raceTrack.onRendered(function () {

  this.autorun(() => {
  });

  $(document.body).addClass('oct20');

  document.body.style.opacity = "1"

  em.addListener("stopRunServer", function(){
    clearInterval(timer);
  });
  function beforeFinish(){
    console.log('BEFORE FINISH', timelineTrack);
    timelineTrack.timeScale(0);
    isBeforeFinish = true;
  }


  em.addListener("autoRunAll", function(posTable){


    allGuysId = Object.keys(posTable)

    console.log("AUTORUNALL ", allGuysId)

    timelineTrack.to($('#the_track'), {xPercent: -100, duration: 180, ease: "linear"}).timeScale(0.1);
    // .to = définit l'animation (keyframes css genre)
    timelineTrack.addLabel('before_finish', 170);
    // ajoute un marqueur à un moment X
    timelineTrack.call(beforeFinish, [], 'before_finish');
    // appel de la fonction beforeFinish au label before_finish
    timeline.add(timelineTrack, 0);
    // ajoute l'animation de la track à la scène globale

    for (var i = allGuysId.length - 1; i >= 0; i--) {
      var timelinePlayer = gsap.timeline({id:allGuysId[i]});
      // créé une timeline pour chaque joueur qui a le nom de l'id du guy
      timelinePlayer.to($('#player'+allGuysId[i]), {left: "100%", duration: 180, ease: "linear"}).timeScale(0.1);
      // définit ton animation
      timeline.add(timelinePlayer, 0);
      // ajoute à la scène globale au temps 0
      console.log("timelinePlayer ", timelinePlayer)
      console.log("timelineScale ", timelinePlayer.timeScale())
    }

    timeline.play()
    // démarre la scène gloable
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

Template.raceTrack.helpers({
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
      return "mySprite"
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
  $.each(posTable, function(key, value){
      var timelinePlayer = timeline.getById(key);
      // choppe la timeline de chaque joueur
      var timeScale = timelinePlayer.timeScale();
      // choppe la vitesse d'execution de l'animation d'icelle
      var newTimeScale = timeScale+value[1]*0.1;
      // calcule la nouvelle timescale en ajoutant l'accélération
      gsap.to(timelinePlayer, 0.10, {timeScale: newTimeScale});
      // créée une animation secondaire qui lisse le changement de timescale
      if(isBeforeFinish) {
        timelineTrack.timeScale(0);
        // arrête l'animation quand tu arrives à la ligne d'arrivey
      } else {
        if(key == playerId) {
          gsap.to(timelineTrack, 0.10, {timeScale: newTimeScale});
          // synchronise le mouvement de la piste sur le mouvement SEULEMENT du joueur (key = playerID)
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
  if(e.keyCode == '32') spaceBarPress(e);
});

var spaceBarPress = function(e){

  console.log("space bar press ", Session.get("spaceBarEffect"))

  // en fonction de où t'es, fais des choses différentes
  
  // Session.set("spaceBarEffect", 0) = do nothing
  // Session.set("spaceBarEffect", 1) = reader text next
  // Session.set("spaceBarEffect", 2) = make loading widget run
  // Session.set("spaceBarEffect", 3) = make word run (for raceTrack)
  // Session.set("spaceBarEffect", 4) = public applause!
  
  switch(Session.get("spaceBarEffect")){
    case 0 :
    return
    break;

    case 1:
      nextEvent();
    break;

    case 2:
      console.log("make widget run!")
      imageCycler("loadingWidgetRunner")
    break;  

    case 3:
      Meteor.call("requestStepServerSide", playerId)
    break;

    case 4:
      console.log("applause!")
    break;
  }
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


  domelements = document.getElementById(who).children
  // domelements2 = domelements[0].children
  // console.log("domelements2 ", domelements2)


    // console.log(yeecount+1, "YEE hide this guy")
  domelements[yeecount].style.opacity=0


    // console.log(yeecount+2, "YEE show this guy")
  domelements[yeecount+1].style.opacity=1



  if(yeecount<10){
    if(yeecount==1){
      // console.log(13 + "YEE hide this guy also ")
      domelements[11].style.opacity=0
    }
    yeecount ++
  }else{
    yeecount = 1;
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
    // ça c'est pour virer le autonext si il y en avait un en cours (c'est quand
    // ça avance tout seul avec un délai)
  }
}


next = function(){

  console.log('next', compteur, data[compteur]);
  currentData = data[compteur]
  type = currentData["type"]
  params = currentData["text"]

  while(data[compteur]["type"]!="text"){
      // tant que data[compteur] est une balise, ben continue à executer les instructions s'il te plaît
      action(type, params)
      if((data[compteur]["type"]!="text")||(data[compteur]["text"]=="")){
        // euh alors ça je sais pas pourquoi ça marche mais ça permet d'éviter des situations où, arrivé à un bookmark
        // il sautait deux lignes au lieu d'une
        compteur+=1;
        next();
        return;
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
          $('#srt').append($('<span/>').html("\ \ \ \ \ "))
          $('#srt').append($('<br/>'))
          $('#srt').scrollTop($('#srt')[0].scrollHeight);
        }else{
          $('#srt').append($('<span/>').html(params))
          $('#srt').append($('<br/>'))
          $('#srt').scrollTop($('#srt')[0].scrollHeight);
        }
        // }
      // pis si la balise c'est pas une action et pas une balise de texte vide, met a jour le texte
      // bon ben c'est ici qu'il faudrait faire un truc
    }
  };

$(document).mousemove(function(e){

  offset = 10

  _zouif = document.getElementById("zouif")
  divHeight = _zouif.clientHeight
  windowHeight = document.body.clientHeight 

  divWidth = _zouif.clientWidth
  windowWidth = document.body.clientWidth

  PosX= e.pageX + offset
  PosY= e.pageY + offset
  // define it first

  if (PosY > windowHeight-divHeight) {
    PosY = windowHeight-divHeight
    console.log("OVERIDING POSX")
    // overide POSX if it's bigger than viewport
  }

  if (PosX > windowWidth-divWidth) {
    PosX = windowWidth-divWidth
    console.log("OVERIDING POSY")
    // overide POSY if it's bigger than viewport
  }

  $("#zouif").css({left:PosX, top:PosY});
});

closingWindow = function(){
  Bonhomme.remove({_id:playerId})
  Meteor.call("removeOneGuy", playerId)
}
