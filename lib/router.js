Router.route('/', {
  subscriptions: function() {
    // returning a subscription handle or an array of subscription handles
    // adds them to the wait list.
    return [Meteor.subscribe('superGlobals'), Meteor.subscribe('allRepresentations')];
  },

  action: function () {
      this.render('spectacle');
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


Router.route('/speedtest',{
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

Router.route('/videoproj',{
  action: function () {
    if(this.ready()) {
    this.render('videoproj');
  }
  },
});

Router.route('/game', {
  subscriptions: function() {
    // returning a subscription handle or an array of subscription handles
    // adds them to the wait list.
    return Meteor.subscribe('superGlobals');
  },

  action: function () {
     this.render('game');
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
     this.render('strobe');
  },

  layoutTemplate:"main"

});
