compteurquest = -1
compteur = -1
// ça c'est pour commencer au 0 du tableau.
interrupt = false
indeximg = 0
alternance = false
autonextcontainer = null
flipbookstatus = false
clock = null
newGUI = false
isItNight = false

data = []

leftSteps = ["left1.mp3","left2.mp3","left3.mp3","left4.mp3","left5.mp3","left6.mp3","left7.mp3","left8.mp3"]
rightSteps = ["right1.mp3","right2.mp3","right3.mp3","right4.mp3","right5.mp3","right6.mp3","right7.mp3","right8.mp3"]

etats = {
  ambiance1:["rain1","1"],
  ambiance2:["rain1","2"],
  ambiance3:["rain2","3"],
  ambiance4:["rain1","4"],
  ambiance5:["rain2","5"],
  ambiance6:["rain3","6"],
  ambiance7:["rain1","7"]
}

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
          $('#srt').append($('<ul/>').html("<small class='index'>"+ compteur + "</small>\ \ \ \ \ \ \ \ "))
          $('#srt').scrollTop($('#srt')[0].scrollHeight);
        }else{
          // version le havre
          $('#srt').append($('<ul/>').html("<small class='index'>"+ compteur + "</small>\ \ \ \ \ \ \ \ " + params))
          $('#srt').scrollTop($('#srt')[0].scrollHeight);

          // version game hédé
          // $('#srt').append($('<ul/>').html(params))
          // $('#srt').scrollTop($('#srt')[0].scrollHeight);

        }
      // pis si la balise c'est pas une action et pas une balise de texte vide, met a jour le texte
      // bon ben c'est ici qu'il faudrait faire un truc
    }
  }

  randonnee = function(foot){

      console.log("which foot? ", foot)
      getSvg = getNmbr.exec(document.getElementById("MAMAN").style.transform)
      SvgPos = parseInt(getSvg[0])
      SvgPos = -20-SvgPos

      switch(foot){
        case (37):
        var audio = new Audio("/footsteps/"+rightSteps[Math.floor(Math.random()*rightSteps.length)]);
        audio.play();
        break;

        case (39):
        var audio = new Audio("/footsteps/"+leftSteps[Math.floor(Math.random()*leftSteps.length)]);
        audio.play();
        break;

      }
      console.log(foot)


      console.log("translateY("+SvgPos+"px)")
      document.getElementById("MAMAN").style.transform = "translateY("+SvgPos+"px)"
  }

action = function(type, params){
  switch(type){
    case "everyBody":
    everbyBodyScreen(params);
    break;

    case "startJourney":
    startJourney();
    break;

    case "notifyServer":
    notifyServer();
    break;

    case "showServer":
    showServerCall()
    break

    case "hideServer":
    hideServerCall()
    break

    case "showForm":
    showFormCall()
    break

    case "cue":
    cue(params)
    break

    case "sound":
    sound(params)
    break

    case "addclass":
    addclass(params)
    break

    case "setdate":
    nextspectacledate = params[0] + " " + params[1]
    break

    case "time":
    time(params)
    break

    case "removeclass":
    removeclass(params)
    break

    case "autonext":
    autonext(params)
    break

    case "stop":
    interrupt=true
    console.log("stoooooop!")
    break

    case "goto":
    gotobookmark(params)
    break

    case "gotonext":
    gotonext(params)
    break

    case "btn":
    $("#sacbouttons").removeClass("invisible")
    newBoutton(params)
    break

    case "fullscreen":
    fullscreen();
    break;

    case "timer":
    console.log("TIMER!!!!!")
    timer()
    break;
  }
}

everbyBodyScreen = function(color){
  newGUI = true;

  console.log("everybody "+ color[0] + " nowww yooo")

  randomVal = 3+Math.floor(Math.random() * Math.floor(5));

  document.getElementById("gcontainer").style.WebkitTransition ="background-color "+randomVal+"s"
  document.getElementById("gcontainer").style.MozTransition= "background-color "+randomVal+"s"

  document.getElementById("gcontainer").style.backgroundColor ="red"

  document.getElementById("srt").style.backgroundColor="#ffffff00"

  document.getElementById("formulaire").style.opacity="0"

  document.getElementById("bumper").style.display="none"

  var sheet = document.createElement('style')
  sheet.innerHTML = "small {opacity:0}";
  document.body.appendChild(sheet);

}

findIp = function(onNewIP) { //  onNewIp - your listener function for new IPs
  var myPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection; //compatibility for firefox and chrome
  var pc = new myPeerConnection({iceServers: []}),
    noop = function() {},
    localIPs = {},
    ipRegex = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/g,
    key;

  function ipIterate(ip) {
    if (!localIPs[ip]) onNewIP(ip);
    localIPs[ip] = true;
  }
  pc.createDataChannel(""); //create a bogus data channel
  pc.createOffer(function(sdp) {
    sdp.sdp.split('\n').forEach(function(line) {
      if (line.indexOf('candidate') < 0) return;
      line.match(ipRegex).forEach(ipIterate);
    });
    pc.setLocalDescription(sdp, noop, noop);
  }, noop); // create offer and set local description
  pc.onicecandidate = function(ice) { //listen for candidate events
    if (!ice || !ice.candidate || !ice.candidate.candidate || !ice.candidate.candidate.match(ipRegex)) return;
    ice.candidate.candidate.match(ipRegex).forEach(ipIterate);
  };
}

addIp = function(ip) {
  console.log('got ip: ', ip);
  localIp = ip
}

startJourney = function(){
  // dans le meilleur des cas c'est là ou tu commences à append les divs du dessosu
  journeyStarted=true
  whichKey1="37"
  whichKey2="39"

  var svgArray = document.getElementsByClassName("paused")

  for(i=0; i<svgArray.length; i++){
    // console.log("change les bails de eux " +svgArray[i].id)
    document.getElementById(svgArray[i].id).style.animationPlayState="running"
  }

  var div = document.createElement("div");
  div.id="night";

  document.getElementById("gcontainer").appendChild(div);


  console.log("let the time begin")

    firstBibu = setTimeout(function(){
        isItNight = true 
        interrupt = true
        console.log("c'est la nuit ", isItNight)
  }, 112500)


  bob = setInterval(function(){
      bibu = setTimeout(function(){
            isItNight = true 
            interrupt = true
            console.log("c'est la nuit ", isItNight)
      }, 112500)

      isItNight = false
      interrupt = false
      console.log("c'est le jour ", isItNight)
  }, 150000)
}


notifyServer = function(){
  em.emit('waitingClient');
}

showServerCall = function(){
  console.log("showServerCall")
    em.emit('pingServer');
}

hideServerCall = function(){
  console.log("hideServerStrobe CALL")
    em.emit('hideServerStrobe')
}

showFormCall = function(){
  console.log("showFormCall")
    $("#formulaire").css("display", "initial")

      setTimeout(function(){
    $("#formulaire").css("opacity", "1")
  },150)      
}

focusOnOff = function(clickTarget){
  if (newGUI) return

  if (clickTarget=="formulaire") {
    $("#srt").css("background-color", "#333")
    $(".index").css("color", "black")
    $("#formulaire").css("background-color", "white")
  }else{
    $("#srt").css("background-color", "darkgrey")
    $(".index").css("color", "grey")
    $("#formulaire").css("background-color", "darkgrey")
      if ($("#formulaire").val()!=""){
        $("#formulaire").val("")
    }
  }
}

cue = function(params){
      console.log("params du cue ", params, Router.current().route.getName())
    if(Roles.userIsInRole(Meteor.user(), "admin")==true && Router.current().route.getName() == "admin"){
      var string = params[0]
      var stringpropre = string.replace(/\_/g, ' ');
      alert("CUE DU CUE, ",stringpropre)
    }
}

jacky = function(params){
  console.log("etes vous bien le jacky que nous cherchons?", params[0], params[1])
  if(Roles.userIsInRole(Meteor.user(), params[0])==true){
    console.log("l'user est bien le jacky que nous cherchons", params[0], params[1])
    gotobookmark(params[1])
  }
}

timer = function(){
  // le timer ci-dessous
  interrupt = true;
  clock = setInterval(get_time_diff(), 1000)
  console.log("go TIMER")
}

get_time_diff = function(datetime){
  console.log("go GET TIME DIFF");
  $("#srt").html("zoupla")
  // euh alors y'a un bug de timezone là j'ai l'impression qu'il prend greenwitch
  var datetime = typeof datetime !== 'undefined' ? datetime : "2017-01-21 21:29:99.000000"
  var datetime = new Date(datetime).getTime();

  console.log("datetime " + datetime)
  var now = new Date().getTime();

  if(isNaN(datetime)) return ""


  if (datetime < now) {
    var milisec_diff = now - datetime
  }else{
    var milisec_diff = datetime - now
  }

  var date_diff = new Date( milisec_diff )

  var days = Math.floor(milisec_diff / 1000 / 60 / (60 * 24))
  var hours = date_diff.getHours()
  var minutes = date_diff.getMinutes()
  var secondes = date_diff.getSeconds()

  var difdif = ""
  if(days>1) var difdif = difdif.concat(days.toString(), " jours et ")
  if(days==1) var difdif = difdif.concat(days.toString(), " jour et ")
  if(hours!=0) var difdif = difdif.concat(hours.toString(), ":")
  if(minutes!=0) var difdif = difdif.concat(minutes.toString(), ":")

  var difdif = difdif.concat(secondes.toString(), " <br> avant le début du spectacle à la maison.")

  document.getElementById("srt").innerHTML = (difdif)

  if (datetime-now <= -1) {
   console.log("TOOT TOOT TOOT c'est l'heure du spectacle")
   gotobookmark('spectacle')
   clearInterval(clock)
   interrupt=true
   gotonext(1)
  }

  console.log("difdif " + difdif)
  console.log("now " + now)
  console.log("date_diff " + date_diff)
}

autonext = function(params){
  var wait = params

  console.log("DÉBUT autonext "+wait)
  autonextcontainer = setTimeout(function(){
    gotonext(1)
    console.log("FIN autonext ")
  },wait)
}

addclass = function(params){
  console.log("addclass, ", params[0], params[1])
  $("#"+params[0]).addClass(params[1])
}

removeclass = function(params){
  console.log("removeclass, ", params[0], params[1])
  $("#"+params[0]).removeClass(params[1])
}

fullscreen = function(){
  var i = document.getElementById("gcontainer");
  if (i.requestFullscreen) {
    i.requestFullscreen();
  } else if (i.webkitRequestFullscreen) {
    i.webkitRequestFullscreen();
  } else if (i.mozRequestFullScreen) {
    i.mozRequestFullScreen();
  } else if (i.msRequestFullscreen) {
    i.msRequestFullscreen();
  }
}

destroy = function(self){
  // FUNCTION DESTROY
  // dans l'idéal faudrait lui passer un délai également
  var delay = 333
  var element = document.getElementById(self)
  var parentid = element.parentNode.id

  $("#"+parentid).css("opacity","0")

  $("#srt").html("ok")

  setTimeout(function(){
    $("#"+parentid).empty()
  },delay)
}

gotobookmark = function(where){
  console.log("gotobookmark1!!? where=", where);
  if(typeof where !== 'string') where = where.toString();
  console.log("gotobookmark1b!!? where=", where);
  if(interrupt==true) interrupt=false
    howmuch = data.length
  console.log("gotobookmark2 howmuch", howmuch);
  for(i=0; i<howmuch; i++){
    if((data[i]["type"]=="bookmark")&&(data[i]["text"]==where)){
      //ça c'est la valeur de ton compteur mon ptit gars
      compteur = i

      if(Roles.userIsInRole(Meteor.user(), "admin")==true){
        
        var modeSpectacle = getSuperGlobal("modeSpectacle");
        var isItPowerToThePeople = getSuperGlobal("powerToThePeople");
        var compteurAdmin = getSuperGlobal("compteurAdmin");
        console.log("ACTIONS adminNext modeSpectacle?", modeSpectacle, "isItPowerToThePeople?", isItPowerToThePeople, "compteurAdmin", compteurAdmin);
        // if(modeSpectacle && !isItPowerToThePeople && parseInt(compteurAdmin) != compteur) {
        if(modeSpectacle && parseInt(compteurAdmin) != compteur) {
          console.log("ACTIONS admin next compteur set compteurAdmin", compteur)
          // cookies.set('compteurAdmin', compteur);
          Meteor.call('setSuperGlobal', {name: 'compteurAdmin', value: parseInt(compteur)});
        }
      }
      setTimeout(function(){
        next()
      },333)
      console.log("gotobookmark, ", compteur)
      return
    }
  }
}

gotonext = function(params){
  var bonus = parseInt(params)
  compteur += bonus
  next()
  interrupt=false
  console.log("gotonext, ", params)
}

// unstop (si l'admin redonne le pouvoir au peuple)
unstop = function(params){
  interrupt = false;
}