Template.users.onCreated( () => {
  Template.instance().subscribe( 'users' );
});

Template.users.helpers({
  users: function() {
    var users = Meteor.users.find();

    if ( users ) {
      return users;
    }
  },
  isCurrentUser: function(currentUser) {
    return currentUser === Meteor.userId() ? true : false;
  },
  disableIfAdmin: function ( userId ) {
    if ( Meteor.userId() === userId ) {
      return Roles.userIsInRole( userId, 'admin' ) ? "disabled" : "";
    }
  },
  selected: function ( v1, v2 ) {
    return v1 === v2 ? true : false;
  },
  humanDate: function ( timestamp ) {
    if ( timestamp ) {
      return moment( timestamp ).format( "MMMM Do, YYYY" );
    }
  },
  quickRemoveButtonOnError: function () {
    return function (error) { alert("BOO!"); console.log(error); };
  },
  quickRemoveButtonOnSuccess: function () {
    return function (result) { alert("YAY!"); console.log(result); };
  },
  quickRemoveButtonBeforeRemove: function () {
    return function (collection, id) {
      var doc = collection.findOne(id);
      console.log(doc);
      if (confirm('Really delete "' + doc.emails[0].address + '"?')) {
        this.remove();
      }
    };
  }
});

Template.users.events({
  'submit #adduser': function(event){


      var userEmail = $('#newUserEmailAddress').val();
      var userPassword = $('#newUserPassword').val();
      var userRole = $('#newUserRole').val();


      console.log("adduser submit", userEmail, userPassword, userRole);
      Meteor.call('createUserFromAdmin',userEmail,userPassword,userRole,function(err,result){
        if(!err){
          console.log("a new user just got created")
        } else {
          console.log("something goes wrong with the following error message " +err.reason )
        }
      });
           

      return false;


  }


});
