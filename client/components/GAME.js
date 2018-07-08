
var streamCheckInterval;
var caughtUp = false;
var intervalReload;
score = 0
var uid = 0
var armToggle = false;
localName = undefined

mouseOverToggle = false;
mouseClicToggle = false;
mouseClicUnToggle = false;
spacebarReToggle = false;

actionAvailable = 1

fragCount = 0

Template.game.onCreated(function() {

  //subscribe à la collection representations
  this.autorun(() => {
    this.subscribe('allRepresentations');
    this.subscribe('allContenusEcran');
    this.subscribe('allScore');
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
      // catchUpWithTheShow();
    }

    //
    // rawTextToJson();
  // console.log(Template.instance());
    // zoupageJSON(dataFromDB, data);
    // autonext(2000);
  });


  $(document.body).addClass('game');



  em.addListener('salmtheoneshow', showTheOneButtons);
  em.addListener('salmtheonehide', hideTheOneButtons);
  em.addListener('jmMicServer', function(){
        if(armToggle){
          document.getElementById("actif").style="opacity:0"
          document.getElementById("repos").style="opacity:1"
        }else{
          document.getElementById("actif").style="opacity:1"
          document.getElementById("repos").style="opacity:0"
        }
        armToggle =! armToggle
  });


 

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

  em.addListener('showLightServer', function(who){
    if (localName===who) {
      document.getElementById("fond_x5F_jour").style="transition: all 1s ease;background-color:white;opacity:1"
      console.log(who)
    }else{
      return}
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


  
  $(document.body).on('keyup', function(e) {

    e = e || window.event


    // KEYCODE 32 IS SPACEBAR
    // KEYCIODE 78 IS "n"
    if(e.keyCode == '32') nextEvent();
    // if(e.keyCode == '78'){
    //     if(armToggle){
    //       document.getElementById("actif").style="opacity:0"
    //       document.getElementById("repos").style="opacity:1"
    //     }else{
    //       document.getElementById("actif").style="opacity:1"
    //       document.getElementById("repos").style="opacity:0"
    //     }
    //     armToggle =! armToggle
    //     console.log(armToggle)
    // }
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




  // $("#login").click(function(e) { 
  //     if (!interval) {
  //         interval = setInterval(function(){myFunction();}, 2000); 
  //     }
  // });

  // $("#logout").click(function(e) { 
  //     clearInterval(interval); 
  //     interval = null;
  // });

    em.addListener('showSpeedWinnerServer', function(params){

            document.getElementById("srt").style="-webkit-transition: all 1s ease; -moz-transition: all 1s ease; -o-transition: all 1s ease; transition: all 1s ease;"

      setTimeout(function(){
        document.getElementById("srt").style="display:none"
      }, 50)      


    console.log("who is the speed winner", params.pseudo)

    if(localName===params.pseudo){
      document.getElementById("winner").style="display:initial;opacity:0; fill:orange;-webkit-transition: all 1s ease; -moz-transition: all 1s ease; -o-transition: all 1s ease; transition: all 1s ease;"

      setTimeout(function(){
        document.getElementById("black").style="opacity:0;fill:black;"
        document.getElementById("winner").style="opacity:1;fill:orange;"
      }, 50)      


    }else{
      document.getElementById("black").style="display:initial;opacity:0; fill:black;-webkit-transition: all 1s ease; -moz-transition: all 1s ease; -o-transition: all 1s ease; transition: all 1s ease;"

      setTimeout(function(){
        document.getElementById("black").style="opacity:1;fill:black;"
      }, 50)      

    }

  });


    em.addListener('showMoneyWinnerServer', function(params){

    console.log("who is the money winner", params.pseudo)

    if(localName===params.pseudo){
      document.getElementById("winner").style="display:initial;opacity:0; fill:orange;-webkit-transition: all 1s ease; -moz-transition: all 1s ease; -o-transition: all 1s ease; transition: all 1s ease;"

      setTimeout(function(){
        document.getElementById("black").style="opacity:0;fill:black;"
        document.getElementById("winner").style="opacity:1;fill:orange;"
      }, 50)      


    }else{
      document.getElementById("black").style="display:initial;opacity:0; fill:black;-webkit-transition: all 1s ease; -moz-transition: all 1s ease; -o-transition: all 1s ease; transition: all 1s ease;"

      setTimeout(function(){
        document.getElementById("black").style="opacity:1;fill:black;"
      }, 50)      

    }

  });

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

  'click .trees':function(e){

      uid ++

      console.log("uid ",uid)
      onomatopees = ["tac", "crac", "toc", "tchouc"]
      onomatopeesFin = ["scccrouatch", "ccrrrrfrouch", "crrrrrrrrBOMMMftch"] 

      // console.log("clic tree! ", e)

      console.log("clic occured here , ", e.screenY, " ", e.screenX)

        console.log("creating UID : ", uid)
      $('<div class="crac" id="'+uid+'" style="top:'+(e.screenY-80)+'px;left:'+e.screenX+'px";>'+onomatopees[getRndInteger(0,onomatopees.length-1)]+'</div>').appendTo('#cracs');

      setTimeout(function(){
        console.log("moving UID : ", uid)

        document.getElementById(uid).style="top:"+(e.screenY-80)+"px;left:"+e.screenX+"px; transform: translateY(20px); opacity:0;"
      }, 40)    

      setTimeout(balayeurUid.bind(null, uid), 500)
      // donc la pour mémoire on a eu pleeeeein de problème mais en fait c'était lié au fait 
      // que uid était réécrit avant d'être repassé à la fonction tiemout
      // du coup là ce qu'on fait c'est qu'on appelle une fonction extérieure en lui passant
      // l'uid DU MOMENT au lieu de le demander au moment ou le timeout est executé, tu vois?
      // y'a surement une façon plus maline de faire ça avec les scope javascript mais comme j'entrave rien




    // couché :
    // transform: rotateZ(90deg);
    // transform-origin: 8% 43%;

    // transform: translate(document.getElementById("I2").transform.baseVal.consolidate().matrix.e, document.getElementById("I2").transform.baseVal.consolidate().matrix.f) rotate(-90deg);

    // pis faut faire disparaître l'ombre, etc.


    currentHP = document.getElementById(e.target.id).HP
    if (currentHP===undefined) {
      console.log("first run, giving the object initial HP")
      document.getElementById(e.target.id).HP = -1
      return
    }else{
      if(currentHP<-4){
        console.log("this tree, ", e.target.id, " is dying")

        fragCount += 1;
        // console.log("this tree lives at X  ", document.getElementById(e.target.id).transform.baseVal.consolidate().matrix.e)
        // console.log("this tree lives at Y  ", document.getElementById(e.target.id).transform.baseVal.consolidate().matrix.f)

        // treeX = document.getElementById(e.target.id).transform.baseVal.consolidate().matrix.e
        // treeY = document.getElementById(e.target.id).transform.baseVal.consolidate().matrix.f

        // document.getElementById(e.target.id).style+="transform : translate("+treeX+"px,"+treeY+"px) rotate(-90deg)"
        // document.getElementById(e.target.id).style="transform: rotateZ(90deg); transform-origin: 8% 43%;"

        document.getElementById(e.target.id).style="display:none;"

        if(mouseClicToggle===true){
          if(mouseClicUnToggle===false){
          console.log("you should goto bookmark del a fin des eindjlsc")
          gotobookmark("arbreTombe")
          mouseClicUnToggle=true
        }else{
          compteur += 1;
          next();
        }
      }

        return
      }
      console.log("second run, giving the object -1 hp")
      document.getElementById(e.target.id).HP --
    }

    console.log("object's HP equals ", document.getElementById(e.target.id).HP)

    // et là en gros si la carac HP existe pas (undefined), tu la crée
    // si elle existe tu la -1
  },

  // 'mousemove' : function(pos){
  //     document.getElementById("workforce").style.left = pos.pageX+"px"
  //     document.getElementById("workforce").style.top = pos.pageY+"px"
  //     document.getElementById("score").style.left = pos.pageX+"px"
  //     document.getElementById("score").style.top = pos.pageY+"px"
  // },

  'click .clickable' : function(e){
    startWork(e.target.id)
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

startNight = function(){
  setTimeout(function(){
    document.getElementById("lumieres_1_").style="opacity:1;"
    document.getElementById("fond_x5F_jour").style="opacity:0;"
    document.getElementById("bourg").style="opacity:1;"

    document.getElementById("srt").style="color:#DBDBCC;background-color:#0A0606;"

    // il faudrait une fonction meteor qui me log le score de chaque personne a ce moment là

  },5000)
}


  logName = function(){
    console.log(document.getElementById("whoInput").value)
    localName = document.getElementById("whoInput").value
    document.getElementById("who").style="opacity:0";

    Meteor.call("lognameClient", localName)

    setTimeout(function(){
      document.getElementById("who").style="display:none";
    },500)
  }


  function balayeurUid(pastUid){
    console.log("destroying uid ", pastUid)
    document.getElementById(pastUid).remove()
  }

  function balayeurfunc(){
          $( ".eclair" ).remove();
          $( ".eclair2" ).remove();
  }

   function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
} 