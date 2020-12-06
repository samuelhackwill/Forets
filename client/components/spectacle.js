Template.registerHelper('formatDateHeure', function(date) {
  return moment(date).format('dddd D MMM YYYY à HH:mm');
});


Template.data.onCreated(function() {

  //subscribe à la collection contenus écran + representations
  this.autorun(() => {
  });

});

Template.spectacle.onCreated(function() {

  //subscribe à la collection representations
  this.autorun(() => {
    this.subscribe('allRepresentations');
    this.subscribe('allContenusEcran');
  });

});
Template.spectacle.helpers({

  doYouHavePower:function(){
    var powerToThePeople = superGlobals.findOne({ powerToThePeople: { $exists: true}});
    console.log(powerToThePeople);
    return powerToThePeople.powerToThePeople ? 'powerToThePeople' : 'powerToTheAdmin';
  },
  listRepresentations:function(){
    console.log("listRepresentations??", representations.find().fetch());
    return representations.find();
  }
});

Template.spectacle.onRendered(function () {


  this.autorun(() => {
    console.log("spectacle autorun admin", Template.instance());
    let ready = Template.instance().subscriptionsReady();
    if (!ready){ return; }
    let contnus = ContenusEcran.find().fetch();
    console.log("contnus", contnus, data);
    // for testing purposes
    
    // data = ContenusEcran.findOne({name: "data_test"}).data
    data = ContenusEcran.findOne({name: "data"}).data
    console.log('srt spectacle rendered');
    console.log('data ?', data);
    console.log('ContenusEcran ?', ContenusEcran.find().fetch());
    var isItPowerToThePeople = superGlobals.findOne({ powerToThePeople: { $exists: true}}).powerToThePeople;
    console.log("isItPowerToThePeople", isItPowerToThePeople);
    // rawTextToJson();
  // console.log(Template.instance());
    // zoupageJSON(dataFromDB, data);
    // autonext(2000);
  });


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
      compteur += 1;
      next();
    } 
  }); 

  em.addListener('salmForceGoTo', function(what) {
    console.log('salm salmForceGoTo!', what);
    // compteur = what.compteur;
    gotobookmark(what.bookmark);
  }); 


  $(document.body).on('keyup', function(e) {


    e = e || window.event
    // KEYCODE 32 IS SPACEBAR
    // KEYCIODE 78 IS "n"
    var isItPowerToThePeople = superGlobals.findOne({ powerToThePeople: { $exists: true}}).powerToThePeople;
    var SUPERinterrupt = superGlobals.findOne({ SUPERinterrupt: { $exists: true}});
    var isSUPERinterrupt = (SUPERinterrupt) ? SUPERinterrupt.SUPERinterrupt : false
    console.log('spectacle keyup compteur = ', compteur, 'interrupt = ', interrupt, 'isItPowerToThePeople = ', isItPowerToThePeople, 'isSUPERinterrupt = ', isSUPERinterrupt);
      
    if(e.keyCode =='32' && compteur < data.length-1 && interrupt==false && isItPowerToThePeople == true && isSUPERinterrupt == false){
      window.clearTimeout(autonextcontainer)
      compteur +=1
      next();
      console.log("keyup, ", compteur)
      // ça c'est pour virer le autonext si il y en avait un en cours (c'est quand
      // ça avance tout seul avec un délai)
    }

  });


  em.addListener('salmstartstream', startTheStream);

  function startTheStream(what) {

    console.log('salm startstream!', what, streaming);

    var body = { "request": "watch", id: parseInt(1) };
    streaming.send({"message": body});
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


  function chooseTheShow(what) {

    console.log('salm chooseTheShow!', what);
    $('#shows-list').removeClass('hidden');
  }

});

switchThePower = function(toWhat){

  console.log('salm switchThePower toWhat', toWhat);
  console.log('salm interrupt is ', interrupt);
  interrupt = toWhat;
  console.log('salm interrupt is ', interrupt);
}

Template.spectacle.events({

    'click #cuppasInc': function(){
    //Meteor.call('setSuperGlobal', {name: 'cuppasCount', value: +=1});
    Meteor.call('setSuperGlobal', {name: 'cuppasInc'});
    },

    'click #cuppasDec': function(){
      Meteor.call('setSuperGlobal', {name: 'cuppasDec'});
    },

    'touchstart #gcontainer': function(){
      compteur+=1;
      next();
    }

})

// TO DO
// balises pour afficher du texte ailleurs que dans SRT (checklist, rubrique fiction)

// var compteurquest = -1
// var compteur = -1
// // ça c'est pour commencer au 0 du tableau.
// var interrupt = false
// var indeximg = 0
// var alternance = false
// var autonextcontainer
// var flipbookstatus = false

// // var data = data;

// var posanswers =["disponible", "à la maison", "tranquille", "son ok", "concentré"]
// var neganswers =["occupé","en ville","pas seul", "mute", "distrait"]
