Router.route('/', {
  subscriptions: function() {
    // returning a subscription handle or an array of subscription handles
    // adds them to the wait list.
    return [Meteor.subscribe('superGlobals'), Meteor.subscribe('allRepresentations')];
  },

  action: function () {
    if(this.ready()) {
      this.render('jacky');
    } else {
      this.render('loading');
    }
  },

  layoutTemplate:"main"

});

Router.route('/login');

Router.route('/postits',{
  action: function () {
    if(this.ready()) {
    this.render('postits');
  }
  },
});

Router.route('/admin',{
  onBeforeAction: function() {
      console.log(!Roles.userIsInRole(Meteor.user(), ['admin']));
      if (Meteor.loggingIn()) {
          this.render(this.loadingTemplate);
      } else if(!Roles.userIsInRole(Meteor.user(), ['admin'])) {
          this.redirect('/');
      }
      else{
          this.next();
      }
  }
});

Router.route('/adminBabySit',{
  onBeforeAction: function() {
      console.log(!Roles.userIsInRole(Meteor.user(), ['admin']));
      if (Meteor.loggingIn()) {
          this.render(this.loadingTemplate);
      } else if(!Roles.userIsInRole(Meteor.user(), ['admin'])) {
          this.redirect('/');
      }
      else{
          this.next();
      }
  }
});

Router.route('/data',{
  onBeforeAction: function() {
      console.log(!Roles.userIsInRole(Meteor.user(), ['admin']));
      if (Meteor.loggingIn()) {
          this.render(this.loadingTemplate);
      } else if(!Roles.userIsInRole(Meteor.user(), ['admin'])) {
          this.redirect('/');
      }
      else{
          this.next();
      }
  }
});
Router.route('/representations',{
  onBeforeAction: function() {
      console.log(!Roles.userIsInRole(Meteor.user(), ['admin']));
      if (Meteor.loggingIn()) {
          this.render(this.loadingTemplate);
      } else if(!Roles.userIsInRole(Meteor.user(), ['admin'])) {
          console.log("redirect?!");
          this.redirect('/');
      }
      else{
          this.next();
      }
  }
});
Router.route('/ambiances',{
  onBeforeAction: function() {
      console.log(!Roles.userIsInRole(Meteor.user(), ['admin']));
      if (Meteor.loggingIn()) {
          this.render(this.loadingTemplate);
      } else if(!Roles.userIsInRole(Meteor.user(), ['admin'])) {
          console.log("redirect?!");
          this.redirect('/');
      }
      else{
          this.next();
      }
  }
});
Router.route('/users',{
  onBeforeAction: function() {
      console.log(!Roles.userIsInRole(Meteor.user(), ['admin']));
      if (Meteor.loggingIn()) {
          this.render(this.loadingTemplate);
      } else if(!Roles.userIsInRole(Meteor.user(), ['admin'])) {
          console.log("redirect?!");
          this.redirect('/');
      }
      else{
          this.next();
      }
  }
});
// Router.route('/oui-non-euh-client');
// Router.route('/spectacle');
Router.route('/jacky', {
  subscriptions: function() {
    // returning a subscription handle or an array of subscription handles
    // adds them to the wait list.
    return Meteor.subscribe('superGlobals');
  },

  action: function () {
    if(this.ready()) {
      // modeSpectacle = superGlobals.findOne({ modeSpectacle: { $exists: true}}).modeSpectacle;
      modeSpectacle = getSuperGlobal("modeSpectacle");
      console.log("modeSpectacle??", modeSpectacle);
      if(modeSpectacle) this.render('jacky');
      else this.render('waiting');
      // else this.render('home');
      // this.render('waiting');
    } else {
      this.render('loading');
    }
  },

  layoutTemplate:"main"

});


Router.route('/videoproj', {
  subscriptions: function() {
    // returning a subscription handle or an array of subscription handles
    // adds them to the wait list.
    return Meteor.subscribe('superGlobals');
  },

  action: function () {
    if(this.ready()) {
      // modeSpectacle = superGlobals.findOne({ modeSpectacle: { $exists: true}}).modeSpectacle;
      modeSpectacle = getSuperGlobal("modeSpectacle");
      console.log("modeSpectacle??", modeSpectacle);
      if(modeSpectacle) this.render('videoproj');
      else this.render('waiting');
      // else this.render('home');
      // this.render('waiting');
    } else {
      this.render('loading');
    }
  },

  layoutTemplate:"main"

});

Router.route('/strobe', {
  subscriptions: function() {
    // returning a subscription handle or an array of subscription handles
    // adds them to the wait list.
    return Meteor.subscribe('superGlobals');
  },

  action: function () {
    if(this.ready()) {
      // modeSpectacle = superGlobals.findOne({ modeSpectacle: { $exists: true}}).modeSpectacle;
      modeSpectacle = getSuperGlobal("modeSpectacle");
      console.log("modeSpectacle??", modeSpectacle);
      if(modeSpectacle) this.render('strobe');
      else this.render('waiting');
      // else this.render('home');
      // this.render('waiting');
    } else {
      this.render('loading');
    }
  },

  layoutTemplate:"main"

});


Router.route('/training');


//phones
Router.route('/getPhone', {where: 'server'})
.get(function () {
    this.response.end('get request\n');
    console.log("this.request", this.request);
})
.post(function () {
  console.log("this.params", this.params);
  console.log("this.request", this.request);

  var phone = this.request.body.phone;
  var regexPhone = /^(\+?[\dx]+)$/;
  // console.log("phone:"+phone);
  // console.log("phone:"+phone.replace(/[^\dx]/gm, ""));
  var passes = regexPhone.test(phone.replace(/[^\dx]/gm, ""));

  if (passes) {

    var currentRepresentation = null;
    modeSpectacle = getSuperGlobal("modeSpectacle");
    if(modeSpectacle) { //le spectacle va bientôt commencer ou a déjà commencé
      //récupérons la representation du jour
      var now = new Date();
      todayStart = new Date(now.setHours(0,0,0,0));
      todayEnd = new Date(now.setHours(24,0,0,0));
      console.log("router checkPhone - today is between", todayStart, todayEnd);
      var foundRepresentation = representations.findOne({ 
        date_start: { 
          $gte: todayStart,
          $lt: todayEnd
        },
        "status": /(pending|running)/
      }, {sort: {date_start: 1}});
      console.log("router checkPhone - representation?", foundRepresentation);
      if(foundRepresentation) { //representation du jour trouvée
        console.log("router checkPhone - representation du jour trouvée");
        var currentRepresentation = foundRepresentation._id;
        console.log("router checkPhone - representation?", currentRepresentation);
      }
    }

    var args = { number: phone };
    if(currentRepresentation) args.representation = currentRepresentation;
    var phoneNumber = PhoneNumbers.findOne(args);
    // console.log(PhoneNumbers.find().fetch());
    console.log("getPhone phoneNumber exists ?", phoneNumber);
    // var gotoId = phoneNumber ? "help" : "main";
    var gotoId = phoneNumber ? "main" : "main";
    this.response.end('<?xml version="1.0" encoding="UTF-8"?><vxml version="2.0" xmlns="http://www.w3.org/2001/vxml" xml:lang="fr-FR">    <form id="phoneNumber">      <block name="tech">        <goto next="/svi/test.vxml#'+gotoId+'" />      </block>    </form></vxml>');
    // this.response.end('post request\nphone valid : '+phone+'\n');
    console.log('addPhoneNumber : ', args);
    Meteor.call('addPhoneNumber', args);
    
  } else {
    // this.response.end('post request\nphone not valid : '+phone+'\n');
    this.response.end();
  }
});
/*
Router.route('/checkPhone', {where: 'server'})
.get(function(){

  forceHangup = getSuperGlobal("forceHangup");
  var gotoId = forceHangup ? "main" : "main";
  this.response.end('<?xml version="1.0" encoding="UTF-8"?><vxml version="2.0" xmlns="http://www.w3.org/2001/vxml" xml:lang="fr-FR">    <form id="phoneNumber">      <block name="tech">        <goto next="/svi/test.vxml#'+gotoId+'" />      </block>    </form></vxml>');
  if(forceHangup)
  if(modeSpectacle) { //le spectacle va bientôt commencer ou a déjà commencé
    //récupérons la representation du jour
    var now = new Date();
    todayStart = new Date(now.setHours(0,0,0,0));
    todayEnd = new Date(now.setHours(24,0,0,0));
    console.log("router checkPhone - today is between", todayStart, todayEnd);
    var foundRepresentation = representations.findOne({ 
      date_start: { 
        $gte: todayStart,
        $lt: todayEnd
      },
      "status": /(pending|running)/
    }, {sort: {date_start: 1}});
    console.log("router checkPhone - representation?", foundRepresentation);
    if(foundRepresentation) { //representation du jour trouvée
      console.log("router checkPhone - representation du jour trouvée");
      var currentRepresentation = foundRepresentation._id;
      console.log("router checkPhone - representation?", currentRepresentation);
    } else var currentRepresentation = null;
  }

  var args = { number: phone };
  if(currentRepresentation) args.representation = currentRepresentation;
  var phoneNumber = PhoneNumbers.findOne(args);

});*/
