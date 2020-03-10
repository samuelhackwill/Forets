superGlobals = new Meteor.Collection('superGlobals');

Postit = new Mongo.Collection("postits")

ContenusEcran = new Meteor.Collection('contenusEcran');

representations = new Meteor.Collection('representations');

ambiances = new Meteor.Collection('ambiances');

loteries = new Meteor.Collection('loteries');

score = new Meteor.Collection("score");

SpeedTest = new Meteor.Collection("speedTest");

PosRunner = new Meteor.Collection("posRunner");

FukinScore = new Meteor.Collection("fukinScore");
HallOfFame = new Meteor.Collection("hallofame");

var Schemas = {};

Schemas.score = new SimpleSchema({
  type : {
    type:String,
    label:"Type",
    max:200,
  },

  value : {
    type: Number,
    label: "Score",
  }, 

   pseudo : {
    type: String,
    label: "quiça",
  }
});

Schemas.ContenusEcran = new SimpleSchema({

    name: {
          type: String,
          label: "Nom",
          max: 200
    },
    text: {
          type: String,
          label: "Texte"
    },
    "data": {
        type: [Object],
        label: "Données",
        blackbox: true
    },
    "data.$.type": {
        type: String,
        label: "Type du blob de donnée"
    },
    "created": {
      type: Date,
      label: "Date de création",
      autoValue: function() {
        if ( this.isInsert ) {
          return new Date;
        } 
      }
    },
    "updated": {
      type: Date,
      label: "Date de modification",
      autoValue: function() {
        if ( this.isUpdate || this.isInsert || this.isInsert ) {
          return new Date;
        } 
      }
    }

});


Schemas.superGlobals = new SimpleSchema({
    powerToThePeople: {
      type: Boolean,
      label: "Pouvoir au peuple, les SALM dirigent le déroulé (barre espace)",
      optional: true
    },

    SUPERinterrupt: {
      type: [String],
      label: "bloquer l'action next (barre espace) pour les SALM selon leur role",
      optional: true
    },

    modeSpectacle: {
      type: Boolean,
      label: "Quand le spectacle va commencer ou commence",
      optional: true
    },

    spectacleStarted: {
      type: Boolean,
      label: "Quand le spectacle a commencé",
      optional: true
    },
    forceHangup: {
      type: Boolean,
      label: "Quand le serveur vocal force à raccrocher après la prochaine note",
      optional: true
    },

    cuppasCount: {
      type: Number,
      label: "Le nombre de volontaires PALM pour préparer une tasses de thé",
      optional: true,
    },
    
    whichAmbiance:{
      type: String,
      label: "bonne ambiance en cours",
      optional: true
    },
    nbCuppasFinished: {
      type: Number,
      label: "Le nombre de tasses de thé qui sont prêtes",
      optional: true,
    },

    buchesCount: {
      type: [Boolean],
      label: "Le nombre de bûches allumées ou pas (true/false)",
      optional: true
    },
    nextBucheAllumage: {
      type: Number,
      label: "Le prochain nombre de tasses restantes avant d'allumer la prochaine bûche",
      optional: true
    },

    compteurAdmin: {
      type: Number,
      label: "Le compteur quand l'admin prend le pouvoir",
      optional: true,
    },

    compteurs: {
      type: [Object],
      label: "Les compteurs pour chaque role",
      optional: true,
    },

    isItVictoryYet:{
      type: Boolean,
      label: "qui c'est qu'a gagné la course",
      optional:true,
    }

});


Schemas.representations = new SimpleSchema({

    name: {
          type: String,
          label: "Nom",
          max: 200
    },
    location: {
          type: String,
          label: "Lieu",
          max: 200
    },
    "date_start": {
      type: Date,
      label: "Date et heure de Début"
    },
    "date_end": {
      type: Date,
      label: "Date et heure de Fin"
    },
    "contenuEcran": {
      type: String,
      label: "Contenu Écran à charger",
    },
    "status": {
      type: String,
      label: "Statut",
      max: 200
    },
    "participants": {
      type: Object,
      label: "Participants",
      optional: true
    },
    "anonymousParticipants": {
        type: Number,
        label: "Participants anonymes",
        defaultValue: 0
    },
    "created": {
      type: Date,
      label: "Date de création",
      autoValue: function() {
        if ( this.isInsert ) {
          return new Date;
        } 
      }
    },
    "updated": {
      type: Date,
      label: "Date de modification",
      autoValue: function() {
        if ( this.isUpdate || this.isInsert || this.isInsert ) {
          return new Date;
        } 
      }
    }

});


Schemas.ambiances = new SimpleSchema({

    name: {
          type: String,
          label: "Nom",
          max: 200
    },
    value: {
          type: String,
          label: "Valeur",
          max: 200
    },
    "created": {
      type: Date,
      label: "Date de création",
      autoValue: function() {
        if ( this.isInsert ) {
          return new Date;
        } 
      }
    },
    "updated": {
      type: Date,
      label: "Date de modification",
      autoValue: function() {
        if ( this.isUpdate || this.isInsert || this.isInsert ) {
          return new Date;
        } 
      }
    }

});


Schemas.loteries = new SimpleSchema({

    name: {
      type: String,
      label: "Nom",
      max: 200
    },
    ids: {
      type: [String],
      label: "ids des participants",
      max: 200,
      optional: true
    },
    messages: {
      type: [Object],
      label: "messages à envoyer et à qui",
      max: 200,
      optional: true,
      blackbox: true
    },
    "created": {
      type: Date,
      label: "Date de création",
      autoValue: function() {
        if ( this.isInsert ) {
          return new Date;
        } 
      }
    },
    "updated": {
      type: Date,
      label: "Date de modification",
      autoValue: function() {
        if ( this.isUpdate || this.isInsert || this.isInsert ) {
          return new Date;
        } 
      }
    }

});



//attachons les schema à nos collections
ContenusEcran.attachSchema(Schemas.ContenusEcran);
superGlobals.attachSchema(Schemas.superGlobals);
representations.attachSchema(Schemas.representations);
ambiances.attachSchema(Schemas.ambiances);
loteries.attachSchema(Schemas.loteries);


//permissions
ContenusEcran.allow({
  insert: function () { return true; },
  update: function () { return true; },
  remove: function () {

    var loggedInUser = Meteor.user()

    if (!loggedInUser || !Roles.userIsInRole(loggedInUser, ['admin'])) {
      throw new Meteor.Error(403, "Access denied")
    }
    return true; 

  }
});

superGlobals.allow({
  insert: function () {

    return true; 

  },
  update: function () {


    return true; 

  },
  remove: function () {

    return true; 

  }
});


//permissions
representations.allow({
  insert: function () {

    var loggedInUser = Meteor.user()

    if (!loggedInUser || !Roles.userIsInRole(loggedInUser, ['admin'])) {
      throw new Meteor.Error(403, "Access denied")
    }
    return true; 
  },
  update: function () {

    var loggedInUser = Meteor.user()

    if (!loggedInUser || !Roles.userIsInRole(loggedInUser, ['admin'])) {
      throw new Meteor.Error(403, "Access denied")
    }
    return true; 
  },
  remove: function () {

    var loggedInUser = Meteor.user()

    if (!loggedInUser || !Roles.userIsInRole(loggedInUser, ['admin'])) {
      throw new Meteor.Error(403, "Access denied")
    }
    return true; 

  }
});



//permissions
ambiances.allow({
  insert: function () {

    var loggedInUser = Meteor.user()

    if (!loggedInUser || !Roles.userIsInRole(loggedInUser, ['admin'])) {
      throw new Meteor.Error(403, "Access denied")
    }
    return true; 
  },
  update: function () {

    var loggedInUser = Meteor.user()

    if (!loggedInUser || !Roles.userIsInRole(loggedInUser, ['admin'])) {
      throw new Meteor.Error(403, "Access denied")
    }
    return true; 
  },
  remove: function () {

    var loggedInUser = Meteor.user()

    if (!loggedInUser || !Roles.userIsInRole(loggedInUser, ['admin'])) {
      throw new Meteor.Error(403, "Access denied")
    }
    return true; 

  }
});



//permissions

SpeedTest.allow({
  insert:function(){
    return true;
  },
  update:function(){
    return true;
  },
  remove:function(){
    return true;
  }
});

FukinScore.allow({
  insert:function(){
    return true;
  },
  update:function(){
    return true;
  },
  remove:function(){
    return true;
  }
});

HallOfFame.allow({
  insert:function(){
    return true;
  },
  update:function(){
    return true;
  },
  remove:function(){
    return true;
  }
});

Postit.allow({
  insert:function(){
    return true;
  },
  update:function(){
    return true;
  },
  remove:function(){
    return true;
  }
});

score.allow({
  insert:function(){
    return true;
  },
  update:function(){
    return true;
  },
  remove:function(){
    return true;
  }
});

PosRunner.allow({
  insert:function(){
    return true;
  },
  update:function(){
    return true;
  },
  remove:function(){
    return true;
  }
});

loteries.allow({
  insert: function () {

    var loggedInUser = Meteor.user()

    if (!loggedInUser || !Roles.userIsInRole(loggedInUser, ['admin'])) {
      throw new Meteor.Error(403, "Access denied")
    }
    return true; 
  },
  update: function () {

    var loggedInUser = Meteor.user()

    if (!loggedInUser || !Roles.userIsInRole(loggedInUser, ['admin'])) {
      throw new Meteor.Error(403, "Access denied")
    }
    return true; 
  },
  remove: function () {

    var loggedInUser = Meteor.user()

    if (!loggedInUser || !Roles.userIsInRole(loggedInUser, ['admin'])) {
      throw new Meteor.Error(403, "Access denied")
    }
    return true; 

  }
});

Meteor.users.allow({
  remove: function (userId, doc) {
    var loggedInUser = Meteor.user()

    if (!loggedInUser || !Roles.userIsInRole(loggedInUser, ['admin'])) {
      throw new Meteor.Error(403, "Access denied")
    }
    return true;
  }
});