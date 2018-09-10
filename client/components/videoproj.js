var caughtUp = false;
var intervalReload;

Template.videoproj.onCreated(function() {

  //subscribe à la collection representations
  this.autorun(() => {
    this.subscribe('allRepresentations');
    this.subscribe('allContenusEcran');
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
    if(data) {
      catchUpWithTheShow();
    }

    //
    // rawTextToJson();
  // console.log(Template.instance());
    // zoupageJSON(dataFromDB, data);
    // autonext(2000);
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

  em.addListener('salmForceGoTo', function(what) {
    console.log('salm salmForceGoTo!', what);
    // compteur = what.compteur;
    gotobookmark(what.bookmark);
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
    // ça c'est pour virer le autonext si il y en avait un en cours (c'est quand
    // ça avance tout seul avec un délai)
  }
}