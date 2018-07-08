
// ContenusEcran.before.insert(function (userId, doc) {
//   doc.createdAt = new Date();
// });
ratsRace = 0
namesRace = []

glisseContainer = null
indexPostit = 0
servColor = "red"

Meteor.publish('allPostits', function(){
  return Postit.find();
});

Meteor.publish('allScore', function(){
  return score.find();
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
Meteor.publish('allAmbiances', function () {
  return ambiances.find();
});
Meteor.publish('allLoteries', function () {
  return loteries.find();
});
Meteor.publish('allPhoneNumbers', function () {
  return PhoneNumbers.find();
});

Meteor.publish( 'users', function() {
  let isAdmin = Roles.userIsInRole( this.userId, 'admin' );

  if ( isAdmin ) {
    return Meteor.users.find( {}, { fields: { "emails.address": 1, "roles": 1 } } )
  } else {
    return null;
  }
});



// ICI TOUS LES EVENEMENTS DE DDP
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


  UserStatus.events.on("connectionLogin", function(fields) { console.log("connectionLogin", fields); });


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

    em.addListener('showSpeedWinnerAdmin', function(args){
      em.emit('showSpeedWinnerServer', args)
    });   

     em.addListener('showMoneyWinnerAdmin', function(args){
      em.emit('showMoneyWinnerServer', args)
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

  em.addListener('ca_va_peter', function(/* client */) {
    // console.log("ca_va_peter cote serveur");
    em.emit('ca_va_peter_client')
  });

  em.addListener('new_ambiance', function(params) {
    // console.log("new_ambiance cote serveur ", params);
    Meteor.call('setSuperGlobal', {name: 'ambiance', value: params.key});
    em.emit('new_ambiance_client')

  });

  em.addListener('adminstartstream', function(/* client */) {
    // console.log('ADMIN START STREAM', _.toArray(arguments), arguments[0]);
    // em.setClient({ reponse: arguments[0].reponse });
    // set client ça marche pas côté serveur
    var args = arguments[0];
    if(args) {
      em.emit('salmstartstream', args);
    }
  });

  em.addListener('adminshowtheone', function(/* client */) {
    // console.log('ADMIN SHOW THE ONE', _.toArray(arguments), arguments[0]);
    // em.setClient({ reponse: arguments[0].reponse });
    // var args = arguments[0];
    // if(args) {
      em.emit('salmtheoneshow');
    // }
  });
  em.addListener('adminhidetheone', function(/* client */) {
    // console.log('ADMIN HIDE THE ONE', _.toArray(arguments), arguments[0]);
    // em.setClient({ reponse: arguments[0].reponse });
    // var args = arguments[0];
    // if(args) {
      em.emit('salmtheonehide');
    // }
  });

  em.addListener('adminshowtheone-single-training', function(/* client */) {
    // console.log('ADMIN SHOW THE ONE', _.toArray(arguments), arguments[0]);
    // em.setClient({ reponse: arguments[0].reponse });
    // var args = arguments[0];
    // if(args) {
      em.emit('salmtheoneshow-single-training');
    // }
  });
  em.addListener('adminshowtheone-multi-training', function(/* client */) {
    // console.log('ADMIN SHOW THE ONE', _.toArray(arguments), arguments[0]);
    // em.setClient({ reponse: arguments[0].reponse });
    // var args = arguments[0];
    // if(args) {
      em.emit('salmtheoneshow-multi-training');
    // }
  });
  em.addListener('adminhidetheone-training', function(/* client */) {
    // console.log('ADMIN HIDE THE ONE', _.toArray(arguments), arguments[0]);
    // em.setClient({ reponse: arguments[0].reponse });
    // var args = arguments[0];
    // if(args) {
      em.emit('salmtheonehide-training');
    // }
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


  em.addListener('salmAddMeToLottery', function(/* client */) {
    // console.log('SALM REQUEST ADD TO LOTTERY', _.toArray(arguments), arguments[0]);
    // em.setClient({ reponse: arguments[0].reponse });
    var args = arguments[0];
    if(args) {
      // em.emit('salmForceGoTo', args);
      Meteor.call('addUserToLottery', args);
    }
  });

  em.addListener('salmFinishCuppa', function(/* client */) {
    // console.log('SALM FINISH A CUP', _.toArray(arguments), arguments[0]);
    // em.setClient({ reponse: arguments[0].reponse });
    var args = arguments[0];
    if(args) {
      // em.emit('salmForceGoTo', args);
      // Meteor.call('addUserToLottery', args);
      Meteor.call('setSuperGlobal', {name: 'finishCuppa'});
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

    logScore:function(obj){
      console.log("pseudo ,", obj.pseudo)
      console.log("speed ,", obj.speed)
      console.log("money ,", obj.money)

      score.insert({pseudo: obj.pseudo, type: "speed", value: obj.speed});  
      score.insert({pseudo: obj.pseudo, type: "money", value: obj.money});  
    },

    jmMic:function(){
      em.emit("jmMicServer")
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
  });

  // console.log('SERVER', this.UserConnections, UserStatus, UserStatus.connections);

  // UserStatus.connections.before.upsert(function (userId, selector, modifier, options) {
  //   console.log("before upsert", userId, selector, modifier, options);
  //   // modifier.$set = modifier.$set || {};
  //   // modifier.$set.modifiedAt = Date.now();
  // });
}


Meteor.methods({

  /**
  * enregistre un nouveau contenu écran
  *
  * @method newContenuEcran
  * @param {String} name Nom du contenu écran
  * @param {String} data Données du contenu écran
  */
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
            console.log('modeSpectacle2', obj.value, superGlobals.findOne({ modeSpectacle: { $exists: true}}));
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
          console.log('spectacleStarted', obj.value);
          if(typeof(obj.value) === "boolean") {
            console.log('spectacleStarted2', obj.value, superGlobals.findOne({ spectacleStarted: { $exists: true}}));
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
          console.log('forceHangup', obj.value);
          if(typeof(obj.value) === "boolean") {
            console.log('forceHangup2', obj.value, superGlobals.findOne({ forceHangup: { $exists: true}}));
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

        case 'cuppasInc':
          var thecuppasCount = superGlobals.findOne({ cuppasCount: { $exists: true}});
          if(thecuppasCount){
            if(thecuppasCount.cuppasCount || thecuppasCount.cuppasCount < 1) {
              console.log('un thé supplémentaire en cours de préparation');
              console.log(thecuppasCount)
              //mise à jour
              superGlobals.update(thecuppasCount._id, { $inc: { "cuppasCount": 1 } }, { filter: false });
            }
          } else {
            console.log('le premier thé est en cours de préparation');
            //création
            superGlobals.insert({cuppasCount: 1}, { filter: false });
          }
          //calculons le prochain pas / décompte à atteindre pour allumer une bûche
          var nbBuches = 6;
          // var coeffRandom = getRandomArbitrary(0.2,1.8);
          var coeffRandom = getRandomArbitrary(0.3,3);
          console.log("coeffRandom", coeffRandom);
          var buches = superGlobals.findOne({ buchesCount: { $exists: true}});
          if(buches){
            console.log('il y a des buches', buches);
            var buchesArray = buches.buchesCount; 
            console.log('le tableau de buches', buchesArray);
            if(buchesArray && buchesArray.length > 0 && buchesArray.length <= nbBuches) {
              var buchesAllumees = buchesArray.filter(function(buche){ return buche; }).length;
              var nbBuchRestantes = nbBuches - buchesAllumees;
              console.log("nbBuchRestantes", nbBuchRestantes);
              //get cuppasCount - volontaires en cours
              var cuppasCount = superGlobals.findOne({ cuppasCount: { $exists: true}});
              var theCuppasCount = (cuppasCount) ? cuppasCount.cuppasCount : 0;
              //get nextBuche - compteur avant prochain allumage
              var nextBuche = superGlobals.findOne({ nextBucheAllumage: { $exists: true}});
              var nextBucheAllumage = (nextBuche) ? nextBuche.nextBucheAllumage : 0;
              if(cuppasCount) {
                var valPasSuivant = (nbBuchRestantes==0) ? 0 : (theCuppasCount - nbBuchRestantes) / nbBuchRestantes * coeffRandom;
                console.log("valPasSuivant", "(theCuppasCount"+theCuppasCount+" - nbBuchRestantes"+nbBuchRestantes+") / nbBuchRestantes"+nbBuchRestantes+" * coeffRandom"+coeffRandom+" = "+valPasSuivant);
                console.log("valPasSuivant rounded", Math.round(valPasSuivant));
                //enregistrons le nouveau prochain allumage (selon le pas qui vient d'être calculé)
                var newNextBucheAllumage = (valPasSuivant<0) ? 0 : Math.round(valPasSuivant)
                console.log("prochain allumage", "nextBucheAllumage="+newNextBucheAllumage);
                superGlobals.update(nextBuche._id, { $set: { "nextBucheAllumage": newNextBucheAllumage } }, { filter: false });
              } else console.log("no cuppasCount?.");
            }
          }

        break
        case 'finishCuppa':
          var nbBuches = 6;
          var buches = superGlobals.findOne({ buchesCount: { $exists: true}});
          if(buches){
            console.log('il y a des buches', buches);
            var buchesArray = buches.buchesCount; 
            console.log('le tableau de buches', buchesArray);
            if(buchesArray && buchesArray.length > 0 && buchesArray.length <= nbBuches) {
              var buchesAllumees = buchesArray.filter(function(buche){ return buche; }).length;
              console.log("buches déjà allumées", buchesAllumees);

              //get cuppasCount - volontaires en cours
              var cuppasCount = superGlobals.findOne({ cuppasCount: { $exists: true}});
              var theCuppasCount = (cuppasCount) ? cuppasCount.cuppasCount : 0;
              var nextBuche = superGlobals.findOne({ nextBucheAllumage: { $exists: true}});
              var nextBucheAllumage = (nextBuche) ? nextBuche.nextBucheAllumage : 0;
              console.log("theCuppasCount", theCuppasCount);
              console.log("nextBucheAllumage", nextBucheAllumage);
              if(null != nextBucheAllumage && nextBucheAllumage == 0) { //on a atteint le nombre voulu pour le prochain allumage
                console.log("on a atteint le nombre voulu pour le prochain allumage");
                //calculons le prochain pas / décompte à atteindre pour allumer une bûche
                // var coeffRandom = getRandomArbitrary(0.2,1.8);
                var coeffRandom = getRandomArbitrary(0.3,3);
                console.log("coeffRandom", coeffRandom);
                var nbBuchRestantes = nbBuches - buchesAllumees;
                var valPasSuivant = (nbBuchRestantes==0) ? 0 : (theCuppasCount - nbBuchRestantes) / nbBuchRestantes * coeffRandom;
                console.log("valPasSuivant", "(theCuppasCount"+theCuppasCount+" - nbBuchRestantes"+nbBuchRestantes+") / nbBuchRestantes"+nbBuchRestantes+" * coeffRandom"+coeffRandom+" = "+valPasSuivant);
                console.log("valPasSuivant rounded", Math.round(valPasSuivant));
                //enregistrons le nouveau prochain allumage (selon le pas qui vient d'être calculé)
                var newNextBucheAllumage = (valPasSuivant<0) ? 0 : Math.round(valPasSuivant);
                console.log("prochain allumage", "nextBucheAllumage"+nextBucheAllumage+"-Math.round(valPasSuivant)"+Math.round(valPasSuivant)+"="+newNextBucheAllumage);
                superGlobals.update(nextBuche._id, { $set: { "nextBucheAllumage": newNextBucheAllumage } }, { filter: false });
                //allumons une bûche en plus
                var buchesCountDefault = [];
                for (var i = 0; i < nbBuches; i++) {
                  buchesCountDefault.push( (i <= buchesAllumees) ? true : false);
                }
                // for (var i = 0; i < buchesAllumees+1; i++) {
                //   if(i<nbBuches) buchesCountDefault[i] = true;
                // }
                buchesArray = buchesCountDefault;
                console.log("buchesArray", buchesArray);
                //mise à jour
                superGlobals.update(buches._id, { $set: { "buchesCount": buchesArray } }, { filter: false });
                var args = {buches: buchesAllumees+1}
                em.emit('adminFireBuche', args);
              } else {
                console.log("on a pas encore atteint le prochain allumage");
              }
              //dans tous les cas, quelqu'un a fini de préparer un thé, décrémentons le nombre de tasses
              Meteor.call('setSuperGlobal', {name: 'cuppasDec'});
            }
          } else {
            console.log('où sont les bûches ?');
            //création
            // superGlobals.insert({cuppasCount: 1}, { filter: false });
          }

        break

        case 'cuppasReset':
          //remise à zéro des tasses de thé
          var thecuppasCount = superGlobals.findOne({ cuppasCount: { $exists: true}});
          if(thecuppasCount){
            if(thecuppasCount.cuppasCount) {
              console.log('remise à zéro des tasses de thé');
              //mise à jour
              superGlobals.update(thecuppasCount._id, { $set: { "cuppasCount": 0 } }, { filter: false });
            }
            console.log('ben euh ya bien une collection mais elle est vide');
          } else {
            console.log('ben euh ya rien en fait');
            //création
            superGlobals.insert({cuppasCount: 0}, { filter: false });
          }
          //remise à zéro (en fait 8) des bûches
          var buchesCount = superGlobals.findOne({ buchesCount: { $exists: true}});
          var nbBuches = 6;
          var buchesCountDefault = [];
          for (var i = 0; i < nbBuches; i++) {
            buchesCountDefault.push(false);
          }
          console.log("buchesCount", buchesCount);
          if(buchesCount){
            if(buchesCount.buchesCount) {
              console.log('remise à zéro des bûches');
              //mise à jour

              superGlobals.update(buchesCount._id, { $set: { "buchesCount": buchesCountDefault } }, { filter: false });
            }
            console.log('ben euh ya bien une collection mais elle est vide');
          } else {
            console.log('ben euh ya rien en fait');
            //création
            superGlobals.insert({buchesCount: buchesCountDefault}, { filter: false });
          }
          //remise à zéro du compteur de la prochaine bûche à allumer
          var nextBuche = superGlobals.findOne({ nextBucheAllumage: { $exists: true}});
          console.log("nextBuche", nextBuche);
          if(nextBuche){
            if(null !== nextBuche.nextBucheAllumage) {
              console.log('remise à zéro de l\'allumage des bûches');
              //mise à jour
              superGlobals.update(nextBuche._id, { $set: { "nextBucheAllumage": 0 } }, { filter: false });
            }
            console.log('ben euh ya bien une collection mais elle est vide');
          } else {
            console.log('ben euh ya rien en fait');
            //création
            superGlobals.insert({nextBucheAllumage: 0}, { filter: false });
          }

        break

        case 'cuppasDec':
          var thecuppasCount = superGlobals.findOne({ cuppasCount: { $exists: true}});
          if(thecuppasCount){
            if(thecuppasCount.cuppasCount && thecuppasCount.cuppasCount > 0) {
              console.log('un thé supplémentaire est prêt!');
              //mise à jour
              superGlobals.update(thecuppasCount._id, { $inc: { "cuppasCount": -1 } }, { filter: false });
            }
          } else {
            console.log('on peut pas enlever des thés parce que yen a pas');
            //création
          }
          //décrémentons le nextBucheAllumage de 1
          var nextBuche = superGlobals.findOne({ nextBucheAllumage: { $exists: true}});
          if(nextBuche){
            if(nextBuche.nextBucheAllumage && nextBuche.nextBucheAllumage > 0) {
              console.log('décrémentons le prochain allumage de bûche');
              //mise à jour
              superGlobals.update(nextBuche._id, { $inc: { "nextBucheAllumage": -1 } }, { filter: false });
            }
          } else {
            console.log('on peut pas décrémenter le prochain allumage de bûche parce que yen a pas');
            //création
          }

          break

        case 'ambiance':
          var ambiance = superGlobals.findOne({ whichAmbiance: { $exists: true}});
          if(ambiance){
            if(ambiance.whichAmbiance) {
              console.log('changement d\'ambiance');
              //mise à jour
              superGlobals.update(ambiance._id, { $set: { "whichAmbiance": obj.value } }, { filter: false });
            }
            console.log('ben euh ya bien une collection mais elle est vide');
          } else {
            console.log('ben euh ya rien en fait');
            //création
            superGlobals.insert({whichAmbiance: obj.value}, { filter: false });
          }

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

  newAmbiance: function (obj) {
    var loggedInUser = Meteor.user()

    if (!loggedInUser || !Roles.userIsInRole(loggedInUser, ['admin'])) {
      throw new Meteor.Error(403, "Access denied")
    }
    console.log("newAmbiance", obj);
    ambiances.insert(obj, { filter: false });
  },
  editAmbiances: function (args) {
    var loggedInUser = Meteor.user()

    if (!loggedInUser || !Roles.userIsInRole(loggedInUser, ['admin'])) {
      throw new Meteor.Error(403, "Access denied")
    }
    console.log("editAmbiance", args);
    ambiances.update(args._id, 
      { $set: args.obj },
      { filter: false }
    );
  },

  addPhoneNumber: function (obj) {
    // var loggedInUser = Meteor.user()

    // if (!loggedInUser || !Roles.userIsInRole(loggedInUser, ['admin'])) {
    //   throw new Meteor.Error(403, "Access denied")
    // }
    console.log("addPhoneNumber", obj);
    var phoneNumber = PhoneNumbers.findOne(obj);
    console.log("phoneNumber exists ?", phoneNumber);
    if(phoneNumber) {
      console.log("it exists already. increment number of calls");
      PhoneNumbers.update(phoneNumber._id, {
        $inc: { calls: 1 },
      });
    } else {
      PhoneNumbers.insert(obj, { filter: false });
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
  addUserToLottery: function(args){

    console.log("addUserToLottery server", args);
    var lotteryName = args.lotteryName;
    if(lotteryName != "") {
      var lottery = loteries.findOne({name: lotteryName});
      console.log("lottery", lottery);
      if(!lottery) {
        //créer la loterie
        var lotteryId = loteries.insert({name: lotteryName, ids: []});
      } else {
        var lotteryId = lottery._id;
      }
      console.log("lotteryId", lotteryId);
      if(args.sessionId != "") {
        lottery = loteries.findOne({_id: lotteryId});
        if(lottery) {
          if(lottery.ids.indexOf(args.sessionId) === -1) {
            console.log('id pas déjà dans la loterie, ajoutons le');
            loteries.update(lotteryId, { $push: { ids: args.sessionId }});
          } else {
            console.log('cet id est deja dans la loterie');
          }
        }
      }
      
    }
    // var phoneNumber = PhoneNumbers.findOne(obj);
    // console.log("phoneNumber exists ?", phoneNumber);
    // if(phoneNumber) {
    //   console.log("it exists already. increment number of calls");
    //   PhoneNumbers.update(phoneNumber._id, {
    //     $inc: { calls: 1 },
    //   });
    // } else {
    //   PhoneNumbers.insert(obj, { filter: false });
    // }
  },


  chooseRandomONE: function(args){

    console.log("chooseRandomONE server", args);
    var nbPeopleToChoose = 1;
    var lotteryId = args._id;
    if(lotteryId != "") {

      var lottery = loteries.findOne({_id: lotteryId});
      console.log("lottery", lottery);
      if(!lottery) {
        //créer la loterie
        console.log("couldn't find lottery");
      } else {

        var random = _.sample(lottery.ids, nbPeopleToChoose);
        console.log("random", random);
        var messages = [];
        for(i=0;i<random.length;i++){
          var obj = {};
          obj[random[i]] = 'showMeTheButtons';
          messages.push(obj);
        }
        if(messages.length>0){
          console.log('update lottery messages', messages);
          loteries.update(lottery._id, 
            {  $set: { messages: messages} },
            { filter: false }
          );
        }

        // return Collection.find({_id: random && random._id}
        // var lotteryId = lottery._id;
      }
      
    }
  },
  chooseEverybodyTea: function(args){

    console.log("chooseEverybodyTea server", args);
    // var nbPeopleToChoose = 1;
    var lotteryId = args._id;
    if(lotteryId != "") {

      var lottery = loteries.findOne({_id: lotteryId});
      console.log("lottery", lottery);
      if(!lottery) {
        //créer la loterie
        console.log("couldn't find lottery");
      } else {

        var teaPeople = lottery.ids;
        console.log("teaPeople", teaPeople);
        var messages = [];
        for(i=0;i<teaPeople.length;i++){
          var obj = {};
          obj[teaPeople[i]] = 'addCuppasButtons';
          messages.push(obj);
        }
        if(messages.length>0){
          console.log('update lottery messages', messages);
          loteries.update(lottery._id, 
            {  $set: { messages: messages} },
            { filter: false }
          );
        }

        // return Collection.find({_id: random && random._id}
        // var lotteryId = lottery._id;
      }
      
    }
  },


  assignRandomPhoneNumbers: function(args){

    console.log("assignRandomPhoneNumbers server", args);
    // var nbPeopleToChoose = 1;
    var lotteryId = args._id;
    if(lotteryId != "") {

      var lottery = loteries.findOne({_id: lotteryId});
      console.log("lottery", lottery);
      if(!lottery) {
        //y'a pas cette loterie
        console.log("couldn't find lottery");
      } else {


        //mélanger les ids des participants pour avoir un ordre aléatoire
        var random = _.shuffle(lottery.ids);
        console.log("random", random);

        //récupérer les numéros des SAT qui ont appelés
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
          if(currentRepresentation) {

            console.log("representation en cours = ", currentRepresentation);
            var phones = PhoneNumbers.find({representation: currentRepresentation}).fetch();
            if(phones) {
              var messages = [];
              var phonesRandom = _.shuffle(phones);
              console.log("numeros de tél trouvés pour cette representation", phones, phonesRandom);
              //TODO + de num -> envoyer plusieurs num a chaque SALM (max 4)
              if(phones.length > random.length) {
                console.log("+ de nums de tél que de SALM volontaires pour appeler");
                var nbPhonesToSend = Math.ceil(phones.length/random.length);
                console.log("nbPhonesToSend", phones.length, random.length, phones.length/random.length, nbPhonesToSend);

                var groupSize = nbPhonesToSend > 4 ? 4 : nbPhonesToSend;

                var phoneGroups = _.map(phonesRandom, function(item, index){
                  return index % groupSize === 0 ? phonesRandom.slice(index, index + groupSize) : null; 
                }).filter(function(item){ 
                  return item; 
                });
                console.log("phones groups", phoneGroups);
                for(i=0;i<random.length;i++){
                  if(phoneGroups.length>i) {
                    var obj = {};
                    var numbers = _.map(phoneGroups[i], function(a) {return "'"+a.number+"'";});
                    console.log("numbers", numbers, numbers.join(','));
                    obj[random[i]] = 'displayPhoneNumbers(['+numbers.join(',')+'])';
                    messages.push(obj);
                  }
                }

              } else if(phones.length <= random.length){
                // - de num (ou pareil)-> envoyer 1 à chaque SALM tant que y'a des nums 
                
                for(i=0;i<random.length;i++){
                  if(phonesRandom.length>i) {
                    var obj = {};
                    obj[random[i]] = "displayPhoneNumbers(['"+phonesRandom[i].number+"']);";
                    messages.push(obj);
                  }
                }
              }
              //TODO et sinon envoyer message 'désolé y'avait pas assez de numéros à distribuer'
              if(messages.length>0){
                console.log('update lottery messages', messages);
                loteries.update(lottery._id, 
                  {  $set: { messages: messages} },
                  { filter: false }
                );
              }

            }
          }
        }

        // return Collection.find({_id: random && random._id}
        // var lotteryId = lottery._id;
      }
      
    }
  },

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
