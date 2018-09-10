var relativeTime;

em = new EventDDP('salm', Meteor.connection);


var cookies = new Cookies()
console.log("cookyHOME", cookies);

if (Meteor.isClient) {

  this.cookies = cookies;
  console.log("cooky2", cookies);
  Meteor.subscribe('superGlobals');

  this.UserConnections = new Mongo.Collection("user_status_sessions");

  relativeTime = function(timeAgo) {
    var ago, days, diff, time;
    diff = moment.utc(TimeSync.serverTime() - timeAgo);
    time = diff.format("H:mm:ss");
    days = +diff.format("DDD") - 1;
    ago = (days ? days + "d " : "") + time;
    return ago + " ago";
  };
  Handlebars.registerHelper("userStatus", UserStatus);
  Handlebars.registerHelper("localeTime", function(date) {
    return date != null ? date.toLocaleString() : void 0;
  });
  Handlebars.registerHelper("relativeTime", relativeTime);
  

  Template.login.helpers({
    loggedIn: function() {
      return Meteor.userId();
    }
  });
  
  console.log('client', this.UserConnections);
  this.UserConnections.before.upsert(function (userId, selector, modifier, options) {
    console.log("before upsert", userId, selector, modifier, options);
    // modifier.$set = modifier.$set || {};
    // modifier.$set.modifiedAt = Date.now();
  });
  this.UserConnections.after.insert(function (userId, doc) {
      console.log("after insert", userId, doc);
  });
  this.UserConnections.after.update(function (userId, doc) {
      console.log("after update", userId, doc);
  });


}