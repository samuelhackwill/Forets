daText = "Bonjour à toutes et à tous\. Cette présentation est dédiée à Dominique Sommeveille, mon ancien médecin traitant dans l'avant-pays savoyard\. C\'est quelqu\'un qui n\'aimait pas beaucoup l\'informatique\, qui n\'avait pas d\'ordinateur et qui travaillait uniquement avec le gros dictionnaire des médicaments là\, le Vidal\, vous voyez\? donc je disais dominique\. L\'age de la retraite approchait\. C\'est comme si une course s\'était engagée entre lui et l\'informatisation du monde\. Allait-il pouvoir conserver ses méthodes de travail jusqu\'à la fin de sa vie professionnelle\? deux ans avant la retraite\, un ordinateur est apparu sur son bureau\. Était-ce lui qui s\'est dit \"boah merde j\'ai qu\'a essayer j\'ai pas grand chose à perdre\"\. Ou est-ce une directive qui est tombée d\'en haut\, comme un couperet\? Quoi qu\'il en soit\, voilà qu\'après chaque consultation\, il s\'installe à son bureau\, mains sur le clavier\, yeux rivés sur l\'écran\. Il se tait entièrement\. Je me tais aussi\, je le regarde\. Il tape l\'ordonnance\, très lentement\, touche après touche\, en respirant très fort avec les narines\. S\'écoulent comme ça deux\, trois minutes\, dans un silence total\, très paisibles\. En fait j\'aimais vraiment très fort ce moment\, à la fin de chaque consultation\. C\'était comme une petite méditation à deux\. Enfin disons que ça aurait été chouette si c\'était pas juste quelqu\'un se faisant tordre par la marche du progrès n\'est ce pas\."// â ça fait tout bugger comme c'est une ligature, bearfk
daArray = daText.split("")
errorMode = false
breakpoint = -1
lastShift = []

_bepoSpeed = 0
_bepoAcc = 100
_azertySpeed = 0
_azertyAcc = 100

azertyMode = false
bepoMode = false

Template.speedtest.onCreated(function() {

  this.autorun(() => {
    this.subscribe('allSpeedTest');
  });
});

Template.diag.helpers({
  accuracy:function(){
      return _bepoAcc
  },
  speed:function(){
      return _bepoSpeed
  },
  speedHS:function(){
    return SpeedTest.find({},{limit: 1, sort: {speed: -1}}).fetch()[0].speed
  },

  accHS:function(){
    return SpeedTest.find({},{limit: 1, sort: {speed: -1}}).fetch()[0].acc
  },

  showHide:function(){
    if(Session.get("status")=="FINISHED"){
      return "1"
    }else{
      return "0"
    }
  }
});

Template.speedtest.helpers({
  bepoButton:function(){
    if(Session.get("status")=="BEPO"){
      return Session.get("time")
    }else{
      return "START TEST"
    }
  },

  azertyButton:function(){
    if(Session.get("status")=="AZERTY"){
      return Session.get("time")
    }else{
      return "START AZERTY"
    }
  },

  speedHS:function(){
    return SpeedTest.find({},{limit: 1, sort: {speed: -1}}).fetch()[0].speed
  },

  accHS:function(){
    return SpeedTest.find({},{limit: 1, sort: {speed: -1}}).fetch()[0].acc
  },



});

Template.speedtest.events({

'click #startCountingBEPO': function(){
  if(Session.get("status")==undefined || Session.get("status")=="FINISHED"){
    Session.set("status", "BEPO")
    console.log("launch timer")

    timerBepo = Meteor.setInterval(function(){
      Session.set("time", Session.get("time")+1)
    }, 1000)
  }else{
    stopTimer("BEPO")

    _bepoSpeed = lastShift.length
    // log score 
    Session.set({bepoSpeed: _bepoSpeed,bepoAcc: _bepoAcc})



    Session.set("status", "FINISHED")
    Session.set("time", 0)

    // log score, show window, etc.
  }

}

});

Template.speedtest.onRendered(function () {

  $(document.body).addClass('speedtest');
  Session.set("status", undefined)
  Session.set("time", 0)


  $(document.body).on('keydown', function(e) {

    e = e || window.event
    // KEYCODE 32 IS SPACEBAR
    // 8 is backspace
    // 13 is return

    if(daArray.length<1){
      console.log("FINISHED")
      Session.set("status", "FINISHED")
      stopTimer()
    }

    if(e.key =='Tab' || e.key =='Shift' || e.key =='CapsLock' || e.key =='Alt' || e.key =='Meta' || e.key =='Control' || e.key =='ArrowLeft' || e.key =='ArrowDown' || e.key =='ArrowUp' || e.key =='ArrowRight' || e.key =='Enter'|| e.key =='Escape'|| e.key =='Backspace' ){
      // if error mode check breakpoint. If breakpoint found, go back to normal mode.
      if(e.key=='Backspace' && !errorMode){
        daArray.unshift(lastShift.shift())
        looseAcc()  
      }
      console.log("Breakpoint was ", breakpoint, " and we're at ", document.getElementById("daInput").value.length)
      if(document.getElementById("daInput").value.length == breakpoint){
        console.log("ok go back to normal mode!")
        errorMode = false
        document.getElementById("daInput").style.backgroundColor = "white"
      }else{
        if(e.key=="Backspace" && errorMode){
          looseAcc()
        }else{
          return
        }
      }
    }else{
      if(e.key == daArray[0] && !errorMode){
        lastShift.unshift(daArray.shift())
        // vases communiquants
        console.log("good key!", e.key)
      }else{
        if(!errorMode){
          breakpoint = document.getElementById("daInput").value.length+1
          console.log("GO TO ERROR MODE at ", breakpoint, "!")
          console.log("SHOULD HAVE WRITTEN ", lastShift, "!", " YOU WROTE ", e.key)
          errorMode = true
          document.getElementById("daInput").style.backgroundColor = "red"
          looseAcc()
        }
        looseAcc()
        return

      }


    }

  });

});


  looseAcc=function(){
    switch(Session.get("status")){
      case "BEPO" :
        _bepoAcc = _bepoAcc-1
        break;

      case "AZERTY":
        _azertyAcc = _azertyAcc-1
        break;
    }
  }

  stopTimer=function(which){
    if(which=="BEPO"){
      _bepoSpeed = lastShift.length/parseInt(document.getElementById("startCountingBEPO").innerHTML)
      console.log(_bepoSpeed)

      document.getElementById("speedBepo").value = _bepoSpeed.toFixed(2) ; 
      document.getElementById("accBepo").value = _bepoAcc
      document.getElementById("speedBepo2").value = _bepoSpeed.toFixed(2) ; 
      document.getElementById("accBepo2").value = _bepoAcc


      SpeedTest.insert({speed:_bepoSpeed.toFixed(2) , acc:_bepoAcc})

      // log local score
      // if better than highscore, celebrate! name of venue + score

      Meteor.clearInterval(timerBepo)
    }else{
      console.log(document.getElementById("startCountingAZERTY").innerHTML)
      Meteor.clearInterval(timerAzerty)
    }
  }
