
// ContenusEcran.before.insert(function (userId, doc) {
//   doc.createdAt = new Date();
// });


// var bonhommeQuery = Bonhomme.find();
// bonhommeQuery.observeChanges({
//   changed:function(id, fields){
//     console.log("bonhomme updated ", id, fields)
//   }
// })


ratsRace = 0
namesRace = []

glisseContainer = null
indexPostit = 0
servColor = "red"

timer = 0
timerDecimales = 0
timerUnites = 0

howmanyBonhommes = 0

Meteor.publish('allWinners', function(){
  return Winners.find();
});

Meteor.publish('allTimer', function(){
  return Timer.find();
});

Meteor.publish('allHallOfFame', function(){
  return HallOfFame.find();
});

Meteor.publish('allPostits', function(){
  return Postit.find();
});

Meteor.publish('allBonhommes', function(){
  return Bonhomme.find();
});

Meteor.publish('allViewSwitcher', function(){
  return ViewSwitcher.find();
});

Meteor.publish('allContenusEcran', function () {
  return ContenusEcran.find();
});
Meteor.publish('allSuperGlobals', function () {
  return superGlobals.find();
});
Meteor.publish('allRepresentations', function () {
  return representations.find();
});
Meteor.publish( 'users', function() {
  let isAdmin = Roles.userIsInRole( this.userId, 'admin' );

  if ( isAdmin ) {
    return Meteor.users.find( {}, { fields: { "emails.address": 1, "roles": 1 } } )
  } else {
    return null;
  }
});

Meteor.startup(function () {

  if(ViewSwitcher.findOne()===undefined){
    console.log("VIEWSWITCHER IS EMPTY, INSERTING NOW")
    ViewSwitcher.insert({"name":"noCourse", "activated":true})
    ViewSwitcher.insert({"name":"freeForAll", "activated":false})
    ViewSwitcher.insert({"name":"courseSolo", "activated":false})
    ViewSwitcher.insert({"name":"coursePoule", "activated":false})
    ViewSwitcher.insert({"name":"courseFinale", "activated":false})
  }

  if(Timer.findOne()===undefined){
    console.log("TIMER IS EMPTY, INSERTING NOW")
    Timer.insert({"time":""})
  }
});


// ICI TOUS LES EVENEMENTS  DDP
if (Meteor.isServer) {
  process.env.HTTP_FORWARDED_COUNT = 1;
  Meteor.publish(null, function() {
    return [
      Meteor.users.find({
        "status.online": true
      }, {
        fields: {
          status: 1,
          username: 1
        }
      }), UserStatus.connections.find()
    ];
  });


  // UserStatus.events.on("connectionLogin", function(fields) { console.log("connectionLogin", fields); });


  em.addListener('showScoreAdmin', function(params){
    console.log("show who won the speed contest MF")
    console.log(" et donc ",params.key)

    em.emit('showScoreServer', params.key)
  });

  em.addListener('resetIndex', function(){
    indexPostit=0
    // console.log("RESET INDEX")
  });

  em.addListener('addPostit', function(){
     // Postit.insert(emptyPostit)
     // console.log("TELL CLIENT TO CREATE NEW FRAME AT INDEX ", indexPostit+1)
     em.emit('newFrame', indexPostit+1)
     indexPostit++
  });

  em.addListener('destroyFrame', function(){
    // console.log("DESTROY FRAME NUMBER ", indexPostit-2)
    em.emit('destroyFrameClient', indexPostit-2)
  })

  em.addListener('moveNextPostit', function(){
    // console.log("MOVE DAT POSTIT ,", indexPostit)
    em.emit('movePostit', indexPostit)
  });

  em.addListener('stopMoveAdmin', function(){
    // console.log("StopMoveServer --em emit")
    em.emit('stopMoveServer')
  });

  em.addListener('salmclick', function(/* client */) {
    // console.log('HELLO', _.toArray(arguments), arguments[0].reponse, moment().format('YYYYMMDD-HH:mm:ss.SSS'));
    // em.setClient({ reponse: arguments[0].reponse });
    var reponse = arguments[0].reponse;
    var mode = arguments[0].mode;
    var args = {mode: mode}
    if(reponse) {
      // console.log('emit salmreponse '+reponse, moment().format('YYYYMMDD-HH:mm:ss.SSS'));
      em.emit('salmreponse'+reponse, args);
    }
  });

    em.addListener('pingServer', function(/* client */) {
    // console.log('pingServer SERVER');
    em.emit('pingServer', servColor)
  });

    em.addListener('hideServerStrobe', function(){
      // console.log('someone sent hideserver!');
      em.emit('allHideServerStrobe')
    });

    em.addListener('pingServerShort', function(/* client */) {
    // console.log('pingServer short SERVER color = ', arguments[1]);
    args = arguments[1]
    em.emit('pingServerShort', args)
  });

    em.addListener('waitingClient', function(){
      console.log("WAITING CLIENT!")
    });



  em.addListener('adminnext', function(/* client */) {
    // console.log('ADMIN NEXT', _.toArray(arguments), arguments[0]);
    // em.setClient({ reponse: arguments[0].reponse });
    var args = arguments[0];
    if(args) {
      em.emit('salmnext', args);
    }
  });
  em.addListener('adminUnStop', function(/* client */) {
    // console.log('ADMIN UNSTOP', _.toArray(arguments), arguments[0]);
    // em.setClient({ reponse: arguments[0].reponse });
    var args = arguments[0];
    if(args) {
      em.emit('salmUnStop', args);
    }
  });


  em.addListener('adminswitchthepower', function(what) {
    // console.log('ADMIN SWITCH THE POWER', _.toArray(arguments), arguments[0], what, em);
    // em.setClient({ reponse: arguments[0].reponse });
    // var args = arguments[0];
    // if(args) {
      // em.setClient({ powerToThePeople: what.powerToThePeople });

      em.emit(what.powerToThePeople ? 'salmpowerpeople' : 'salmpoweradmin');
    // }
  });

  em.addListener('adminrefreshpage', function(/* client */) {
    // console.log('ADMIN REFRESH PAGE', _.toArray(arguments), arguments[0]);
    // em.setClient({ reponse: arguments[0].reponse });
    // var args = arguments[0];
    // if(args) {
      em.emit('salmrefreshpage');
    // }
  });


  em.addListener('adminForceGoTo', function(/* client */) {
    // console.log('ADMIN FORCE GO TO', _.toArray(arguments), arguments[0]);
    // em.setClient({ reponse: arguments[0].reponse });
    var args = arguments[0];
    if(args) {
      em.emit('salmForceGoTo', args);
    }
  });

  em.addListener('adminDeliverMessages', function(/* client */) {
    // console.log('ADMIN DELIVER MESSAGES', _.toArray(arguments), arguments[0]);
    // em.setClient({ reponse: arguments[0].reponse });
    var args = arguments[0];
    if(args) {
      em.emit('salmGetMessage', args);
    }
  });

  
  
  // This code only runs on the server
  Meteor.publish('superGlobals', function tasksPublication() {
    return superGlobals.find();
  });

  Meteor.methods({
    stepServerSide:function(who){
      Bonhomme.update(who, {$inc:{"posX":1},})
    },

// Tickets.update(
//         {_id: ticketId}, 
//         { $set: {title: ticket.title, content: ticket.content}},
//         { $inc: {counterEdit: 1 }}
//         )


    autoRun:function(){
      em.emit("autoRunAll")
    },    

    startRun:function(_howmanyBonhommes){

      // em.emit("startLocalTimers")

      // tous les timers sont désynchronisés si on fait ça...

      howmanyBonhommes = _howmanyBonhommes

      timerDecimales = 0
      timerUnites = 0

      if(timer!=0){Meteor.clearInterval(timer); console.log("clear the old timer")}

      timer = Meteor.setInterval(function(){
        timerDecimales = timerDecimales+1
        if (timerDecimales > 99) {
          timerDecimales = 0
          timerUnites = timerUnites +1
        }
      //   console.log("timer ", timerUnites, ":", timerDecimales)
      //   Timer.update(Timer.findOne({})._id, {$set:{"time":timerUnites+":"+timerDecimales},})
      
      // y'a pas moyen, ça ralentit tous les autres accès à la db
      
      },10)
    
    },

    stopRun:function(){
      Meteor.clearInterval(timer)
    },

    killBonhommes:function(){
      Bonhomme.remove({})
    },

    forceRefresh:function(){
      em.emit("salmrefreshpage")
    },


    restartBonhommes:function(){
      Bonhomme.update({}, {$set: {posX: 0}}, {multi: true});
    },

    getRidOfWinners:function(){
      Winners.remove({})
    },


    logScore:function(obj){
      console.log("pseudo ,", obj.pseudo)
      console.log("speed ,", obj.speed)
      console.log("money ,", obj.money)

      if(obj.speed==0||undefined){
        return
      }else{
        score.insert({pseudo: obj.pseudo, type: "speed", value: obj.speed});  
        score.insert({pseudo: obj.pseudo, type: "money", value: obj.money});  
      }

    },

    jmMic:function(){
      em.emit("jmMicServer")
    },

    removeClicAdmin:function(){
      em.emit("removeClicEnd")
    },  

    showLightCall:function(who){
      console.log("show light call ", who)
      em.emit('showLightServer', who);

    },

    lognameClient:function(name){
      // console.log("new client logged name : ", name, " he is the ", ratsRace, "th to register")
      namesRace[ratsRace] = name
      console.log(namesRace[ratsRace])
      ratsRace ++
    },

    startTheStream: function(){
      // superGlobals.upsert('streamStarted', { $set: { value: true, time: Date.now() } });
    },
    isTheStreamStarted: function(){
      return superGlobals.find();
    },

  // console.log('SERVER', this.UserConnections, UserStatus, UserStatus.connections);

  // UserStatus.connections.before.upsert(function (userId, selector, modifier, options) {
  //   console.log("before upsert", userId, selector, modifier, options);
  //   // modifier.$set = modifier.$set || {};
  //   // modifier.$set.modifiedAt = Date.now();
  // });

  /**
  * enregistre un nouveau contenu écran
  *
  * @method newContenuEcran
  * @param {String} name Nom du contenu écran
  * @param {String} data Données du contenu écran
  */

  endRace : function(obj){

    console.log(" endRace ", obj.who.commune, obj.who.pseudo, " ", timerUnites, ":", timerDecimales, "conc ", (timerUnites*1000)+timerDecimales*10)
    HallOfFame.insert({"commune":obj.who.commune, "pseudo":obj.who.pseudo, "whichCourse":obj.context, "score":(timerUnites*1000)+timerDecimales*10})
    
    howmanyBonhommes = howmanyBonhommes-1

    if(howmanyBonhommes==0){
      console.log("this was the last mf!")
      Meteor.call("stopRun")
      em.emit("endRaceAnimation")
    }

    em.emit("victoryAnimation")

    // tout ce qui se passe en dessous n'advient qu'une foy

    if (Winners.findOne()) {
      return
    }else{
      Bonhomme.update(obj.who, {$set:{haswonpoule:true},})
      Winners.insert({"commune":obj.who.commune, "pseudo":obj.who.pseudo})
    }
},

  newContenuEcran: function (obj) {
    var loggedInUser = Meteor.user()

    if (!loggedInUser || !Roles.userIsInRole(loggedInUser, ['admin'])) {
      throw new Meteor.Error(403, "Access denied")
    }
    //check si deja enregistré
    var data = tryParseJSON(obj.data);
    if(data) {
    
      // console.log(typeof obj.name, obj.name);
      // console.log('valid JSON?'); 
      // console.log(typeof data);
      // console.log(data instanceof Object);

      var contenuEcran = ContenusEcran.findOne({name: obj.name});
      // console.log("contenuEcran existe ?", contenuEcran);
      
      if(contenuEcran) {
        // console.log("contenuEcran existe. mise à jour.");
        ContenusEcran.update(contenuEcran._id, { 
          $set: {
            name: obj.name, 
            data: data, 
            text: obj.text 
          }
        }, { filter: false });
      } else {
        // console.log("nouveau contenuEcran. insertion");
        // var copie = Object.assign({}, data);
        // console.log('true Object?'); 
        // console.log(typeof copie);
        // console.log(copie instanceof Object);
        // console.log(copie);
        // insertion du nouveau contenu écran
        ContenusEcran.insert({name: obj.name, data: data, text: obj.text}, { filter: false });  
      }
      
    }
  },
  setSuperGlobal: function(obj) {
    // console.log('setSuperGlobal', obj);
    if(obj.name) {
      switch(obj.name) {
        case 'powerToThePeople':
          // console.log('powerToThePeople', obj.value);
          if(typeof(obj.value) === "boolean") {
            // console.log('powerToThePeople2', obj.value, superGlobals.findOne({ powerToThePeople: { $exists: true}}));
            var powerToThePeople = superGlobals.findOne({ powerToThePeople: { $exists: true}});
            if(powerToThePeople) {
              // console.log('powerToThePeople3 mise a jour');
              //mise à jour
              superGlobals.update(powerToThePeople._id, { $set: {powerToThePeople: obj.value} }, { filter: false });
            } else {
              // console.log('powerToThePeople3 insert!');
              //création
              superGlobals.insert({powerToThePeople: obj.value}, { filter: false });

            }
            // superGlobals.upsert({powerToThePeople: obj.value}, { filter: false });
          }
          break;
          
        case 'SUPERinterrupt':
          // console.log('SUPERinterrupt', obj.value);
          // if(typeof(obj.value) === "boolean") {
          if( Object.prototype.toString.call( obj.value ) === '[object Array]' ) { //check si c'est un array
            // console.log('SUPERinterrupt2', obj.value, superGlobals.findOne({ SUPERinterrupt: { $exists: true}}));
            var SUPERinterrupt = superGlobals.findOne({ SUPERinterrupt: { $exists: true}});
            if(SUPERinterrupt) {
              console.log('SUPERinterrupt3 mise a jour');
              //mise à jour
              superGlobals.update(SUPERinterrupt._id, { $set: {SUPERinterrupt: obj.value} }, { filter: false });
            } else {
              console.log('SUPERinterrupt3 insert!');
              //création
              superGlobals.insert({SUPERinterrupt: obj.value}, { filter: false });

            }
            // superGlobals.upsert({modeSpectacle: obj.value}, { filter: false });
          }
          break;

        case 'modeSpectacle':
          console.log('modeSpectacle', obj.value);
          if(typeof(obj.value) === "boolean") {
            // console.log('modeSpectacle2', obj.value, superGlobals.findOne({ modeSpectacle: { $exists: true}}));
            var modeSpectacle = superGlobals.findOne({ modeSpectacle: { $exists: true}});
            if(modeSpectacle) {
              console.log('modeSpectacle3 mise a jour');
              //mise à jour
              superGlobals.update(modeSpectacle._id, { $set: {modeSpectacle: obj.value} }, { filter: false });
            } else {
              console.log('modeSpectacle3 insert!');
              //création
              superGlobals.insert({modeSpectacle: obj.value}, { filter: false });

            }
            // superGlobals.upsert({modeSpectacle: obj.value}, { filter: false });
          }
          break;

        case 'spectacleStarted':
          // console.log('spectacleStarted', obj.value);
          if(typeof(obj.value) === "boolean") {
            // console.log('spectacleStarted2', obj.value, superGlobals.findOne({ spectacleStarted: { $exists: true}}));
            var spectacleStarted = superGlobals.findOne({ spectacleStarted: { $exists: true}});
            if(spectacleStarted) {
              console.log('spectacleStarted3 mise a jour');
              //mise à jour
              superGlobals.update(spectacleStarted._id, { $set: {spectacleStarted: obj.value} }, { filter: false });
            } else {
              console.log('spectacleStarted3 insert!');
              //création
              superGlobals.insert({spectacleStarted: obj.value}, { filter: false });

            }
            // superGlobals.upsert({modeSpectacle: obj.value}, { filter: false });
          }
          break;

        case 'forceHangup':
          // console.log('forceHangup', obj.value);
          if(typeof(obj.value) === "boolean") {
            // console.log('forceHangup2', obj.value, superGlobals.findOne({ forceHangup: { $exists: true}}));
            var forceHangup = superGlobals.findOne({ forceHangup: { $exists: true}});
            if(forceHangup) {
              console.log('forceHangup3 mise a jour');
              //mise à jour
              superGlobals.update(forceHangup._id, { $set: {forceHangup: obj.value} }, { filter: false });
            } else {
              console.log('forceHangup3 insert!');
              //création
              superGlobals.insert({forceHangup: obj.value}, { filter: false });

            }
            // superGlobals.upsert({modeSpectacle: obj.value}, { filter: false });
          }
          break;

        case 'compteurAdmin':
          console.log('compteurAdmin', obj.value);
          if(typeof(obj.value) === "number") { //check si c'est un number
          // if( Object.prototype.toString.call( obj.value ) === '[object Array]' ) { 
            console.log('compteurAdmin2', obj.value, superGlobals.findOne({ compteurAdmin: { $exists: true}}));
            var compteurAdmin = superGlobals.findOne({ compteurAdmin: { $exists: true}});
            if(compteurAdmin) {
              console.log('compteurAdmin3 mise a jour');
              //mise à jour
              superGlobals.update(compteurAdmin._id, { $set: {compteurAdmin: obj.value} }, { filter: false });
            } else {
              console.log('compteurAdmin3 insert!');
              //création
              superGlobals.insert({compteurAdmin: obj.value}, { filter: false });

            }
            // superGlobals.upsert({modeSpectacle: obj.value}, { filter: false });
          }
          break;

        default:
          break;
      }
    }
  },

  /**
  * enregistre une nouvelle représentation
  *
  * @method newRepresentation
  * @param {Object} name, location, date_start, date_end, status
  */
  newRepresentation: function (obj) {
    var loggedInUser = Meteor.user()

    if (!loggedInUser || !Roles.userIsInRole(loggedInUser, ['admin'])) {
      throw new Meteor.Error(403, "Access denied")
    }
    console.log("newRepresentation", obj);
    representations.insert(obj, { filter: false });
  },
  editRepresentation: function (args) {
    var loggedInUser = Meteor.user()

    if (!loggedInUser || !Roles.userIsInRole(loggedInUser, ['admin'])) {
      throw new Meteor.Error(403, "Access denied")
    }
    console.log("editRepresentation", args);
    representations.update(args._id, 
      { $set: args.obj },
      { filter: false }
    );
  },
  addUserToRepresentation: function (obj) {
    console.log("addUserToRepresentation", obj);
    if(obj._id) {

      if(obj.userId) {
        participants = representations.findOne({ "_id": obj._id, "participants.userId": obj.userId});
        //logged user
        console.log("logged user", participants);

        // participants.push({userId: obj.userId});
      } else {
        anonParticipants = representations.findOne(
          { "_id": obj._id },
          { "anonymousParticipants": 1 }
        );
        console.log("anonymous user", anonParticipants);
        if(anonParticipants) {
          representations.update(
            { "_id": obj._id }, 
            { $inc: { "anonymousParticipants": 1 }}
          );
        } else {
          representations.updateOne(obj._id, 
            { "_id": obj._id, "participants.anonymous": {$exists: false}}, 
            { $set: { "participants.anonymous": 1 }}, { filter: false }
          );
        }

      }
      if(obj.old_representation) {
        console.log("remove from old representation", obj.old_representation);
        representations.update(
          { "_id": obj.old_representation }, 
          { $inc: { "anonymousParticipants": -1 }}
        );
      }
      representations.update(obj._id, {
        $set: { checked: ! this.checked },
      });
    }
  },

  createUserFromAdmin: function(email,password,role){
    console.log('createUserFromAdmin', email,password,role);
    var id = Accounts.createUser({ email: email, password: password });
    console.log('Accounts.createUser', id);
    if (role != '' && role != 'admin') {
      // Need _id of existing user record so this call must come
      // after `Accounts.createUser` or `Accounts.onCreate`
      console.log('addUsersToRoles', role);
      Roles.addUsersToRoles(id, [role]);
    }
  },
  /*createCompteurFromAdmin: function(compteurName){
    console.log('createCompteurFromAdmin', compteurName);


    var compteurs = superGlobals.findOne({ compteurs: { $exists: true}});
    if(compteurs) {
      console.log('spectacleStarted3 mise a jour');
      //mise à jour
      superGlobals.update(spectacleStarted._id, { $set: {spectacleStarted: obj.value} }, { filter: false });
    } else {
      console.log('spectacleStarted3 insert!');
      //création
      superGlobals.insert({spectacleStarted: obj.value}, { filter: false });

    }

    var id = Accounts.createUser({ email: email, password: password });
    console.log('Accounts.createUser', id);
    if (role != '' && role != 'admin') {
      // Need _id of existing user record so this call must come
      // after `Accounts.createUser` or `Accounts.onCreate`
      console.log('addUsersToRoles', role);
      Roles.addUsersToRoles(id, [role]);
    }
  }*/

  retrieveMessage: function(lotteryId, userCookie){
    if(lotteryId && userCookie) {
      var lottery = loteries.findOne({_id: lotteryId});
      if(lottery){
        console.log("retrieveMessage lottery", lottery);
        var theMessage = _.find(lottery.messages, function(message){ 
          console.log("message", message, userCookie in message);
          return userCookie in message; 
        });
        console.log('theMessage', theMessage);
        if(theMessage) {
          return theMessage[userCookie];
        }
        // if(lottery.messages[userCookie] && lottery.messages[userCookie] != "") {

          // return 
        // }
        // var messageToReturn = lottery.messages
      }
    }
  }

});

}
