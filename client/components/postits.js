dragging = false;
deltaX = 0
deltaY = 0

// 375,9 ms entre la création de deux postits normalement
// donc dans cet intervalle faut qu'il soit monté de la hauteur d'un postit
// soit une 80aine de pixels disons

spawn = 1000
mesure = 0

launch=null
create=null
move=null

// autoscrolldown = function(){
//     glisseContainer = setInterval(function(){ 
//       // console.log("décale un peu steup")
//       zeb = Postit.findOne()._id
//       Postit.update({_id : zeb}, {$set : {position :{y:z}}})
//       z -= 5
//       mesure += 1
//     }, 32);
// }

Template.postits.onCreated(function() {

  //subscribe à la collection representations
  this.autorun(() => {
    this.subscribe('allPostits');
  });

});

Template.postits.onRendered(function () {

  em.addListener('newFrame', function(index){
      $("<div id='"+index+"' class='postit'>").appendTo(document.body);
      $("#"+index).css("background-image", "url(/img/DDRplanche-"+index+".png");
  });

  em.addListener('movePostit', function(index){
    console.log("MOVE POSTIT CLIENTTTTT ")
      $("#"+index).css({"-webkit-transform":"translate(20vw,-1280px)"})
  });

  em.addListener('destroyFrameClient', function(index){
    $("#"+index).remove()
  })

  em.addListener('stopMoveServer', function(){
    console.log("stopMoveClient!!!")
    em.emit('resetIndex')
    clearInterval(create)
    clearInterval(move)
    clearInterval(destroy)
  });

});

Template.postits.events({
  "click .movePostIt": function(){
      launch = setTimeout(function(){
        create = setInterval(function(){
          em.emit('addPostit')
          console.log('EMIT ADDPOSTIT')
        }, 1500)
      }, 750)

    move = setInterval(function(){
      em.emit('moveNextPostit')
      console.log('EMIT MOVE NEXTPOSTIT')
    }, 1500)

    launch2 = setTimeout(function(){
      destroy = setInterval(function(){
        em.emit('destroyFrame')
      }, 1500)
    }, 3000)
  },

  "click .resetPostIt": function(){
      em.emit("stopMoveAdmin")
      console.log("EMIT STOPMOVEAMDIN")
  },

  "click .addPostit": function(){
    em.emit('addPostit')
  },

  "click .supprimer" : function(){
    // Postit.remove(this._id)
    console.log("TELL CLIENT TO REMOVE THIS DIV!")
  }

})


Template.body.events({

})