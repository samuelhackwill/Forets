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

communes = ["Aiguebelette","Attignat-Oncin","Ayn","Domessin","Dullin","Gerbaix","La Bridoire","Le Pont-de-Beauvoisin","Lépin-le-lac","Lépin-Village","Nances","Novalaise","Saint-Alban de Montbel","Saint-Béron","Saint-Genix-sur-guiers","Saint-Jean-de-Chevelu","Sainte-Marie-D'Alvey","Verel","Verel-de-Montbel","Yenne"]

compteurAnim=1;

animationRate = 20;
// en fait 80 c'est pas mal


Template.covid19.onCreated(function() {

  pseudos = ["ant", "mar", "cam", "tom", "ale", "jea", "ali", "jul", "XXX", "zor", "GRO", "zob"]
randompseudo= pseudos[Math.floor(Math.random() * pseudos.length)];
communes = ["Aiguebelette","Attignat-Oncin","Ayn","Domessin","Dullin","Gerbaix","La Bridoire","Le Pont-de-Beauvoisin","Lépin-le-lac","Lépin-Village","Nances","Novalaise","Saint-Alban de Montbel","Saint-Béron","Saint-Genix-sur-guiers","Saint-Jean-de-Chevelu","Sainte-Marie-D'Alvey","Verel","Verel-de-Montbel","Yenne"]
randomcommune= communes[Math.floor(Math.random() * communes.length)];


  //subscribe à la collection representations
  this.autorun(() => {
    this.subscribe('allRepresentations');
    this.subscribe('allBonhommes');
    this.subscribe('allViewSwitcher');
    this.subscribe('allContenusEcran');
    this.subscribe('allHallOfFame');
    this.subscribe('allSuperGlobals');
    this.subscribe('allWinners');
  });

  console.log("how many times is this shit created?")

  $(window).bind('beforeunload', function() {
        closingWindow();
    });
  // ici toute la logique cookies & id blublu

  poules = ["lents", "rapides"]
  randomPoule = poules[Math.floor(Math.random() * poules.length)];

  playerId = Bonhomme.insert({arrivedAt : new Date(), posX : 0, posY : 0, pseudo : randompseudo, commune:randomcommune, poule : randomPoule, haswonpoule : "", })

});



Template.covid19.onRendered(function () {

  this.autorun(() => {
    let ready = Template.instance().subscriptionsReady();
    if (!ready){ return; }
    let contnus = ContenusEcran.find().fetch();
    // console.log("contnus", contnus, data);
    // data = ContenusEcran.findOne({name: "ce_jeudi_no_comment"}).data
    data = ContenusEcran.findOne({name: "data_test"}).data
    // console.log('srt spectacle covid19 rendered');
    // console.log('data ?', data);
    // console.log('ContenusEcran ?', ContenusEcran.find().fetch());

  });




  $(document.body).addClass('covid19');

  em.addListener('salmnext', function(what) {
    console.log('salm next!', what);
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

  em.addListener("victoryAnimation", function(what){
    console.log("hey, victoryAnimation!")
// animate victory,
// timeout to hide the div & empty the DB

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
    window.clearTimeout(zob)
    compteur +=1
    next();
    console.log("keyup, ", compteur)


    _posX = parseInt(Bonhomme.find({_id:playerId}).fetch()[0].posX)

    if(_posX>97){
      whichrace = ViewSwitcher.find({"activated":true}).fetch()[0].name

      if(playerHasWonLocaly){
        return
      }else{
        Meteor.call("endRace", {context : whichrace, who : Bonhomme.find({_id:playerId}).fetch()[0]})
        console.log("HEYYY you've won.") 
        playerHasWonLocaly=true; 
      }

    }else{
      Bonhomme.update(playerId, {$set:{"posX":_posX+1},})
    }

    zob = setDeceleratingTimeout(function()
      {
        imageCycler(playerId)
        // et c'est là qu'il faudrait que ce fameux 20
        // deviene une variable qui augmente ou diminue
        // en fonction du rythme de pression sur la spacebar
        // ainsi que le déplacement en nombre de pixels
      },animationRate,3);

  }
}

imageCycler = function(who){

  // en vrai ça devrait fonctionner comme ça : quand tu appuies sur la barre espace
  // ça correspond à quand le pied touche le sol
  // et ça cycle les autres images comme ça peut
  // mais pas avec un set timeout tout laid


  domelements = document.getElementById(who).children

    console.log(yeecount+1, "YEE hide this guy")
  domelements.item(yeecount+1).style.opacity=0


    console.log(yeecount+2, "YEE show this guy")
  domelements.item(yeecount+2).style.opacity=1





  if(yeecount<11){
    if(yeecount==1){
      console.log(13 + "YEE hide this guy also ")
      domelements.item(13).style.opacity=0
    }
    yeecount ++
  }else{
    yeecount = 1;
  }

}

everybodyCycle = function(){
  console.log("everybody cycle now!")
}

// i know this is stupid but don't have time

closingWindow = function(){
  Bonhomme.remove({_id:playerId})
}


  Template.covid19.helpers({

    // pseudo(){
    //   return randompseudo
    // },


    // commune(){
    //   return randomcommune
    // },

    bonhomme(){
      if (ViewSwitcher.find({"activated":true}).fetch()[0].name==="noCourse") {
        return
      }    

      if (ViewSwitcher.find({"activated":true}).fetch()[0].name==="freeForAll") {
        return Bonhomme.find({})
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
      if(Winners.find({"status":0})||Winners.find({"status":2})){return 0}else{return 1}

    }
  });