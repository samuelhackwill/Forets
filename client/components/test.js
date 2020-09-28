const { gsap } = require("gsap/dist/gsap");


$(document.body).addClass('test');


derouleur = function(){
  var node = document.createElement("div");                 // Create a <li> node
  node.classList.add("trackverticalline");
  document.getElementById("trackbackground").appendChild(node);
  // Append <li> to <ul> with id="myList"
}

startDefilement = function(){
  document.getElementById("trackbackground").classList.add="animateEnd"

  zob = setInterval(function(){
    derouleur()
  },3000)
}
//
// var timeline = new Timeline.to({
//
// });

timeline = gsap.timeline();


Template.test.onRendered(function () {
  console.log(timeline);

  var players = $('.wordcontainer');
  console.log('players', players);
  $.each(players, function(i,player){
    console.log(player, $(player).attr('id'));
    var timelinePlayer = gsap.timeline();
    timelinePlayer.to(player, {id: $(player).attr('id'), left: "100%", duration: 20}).timeScale(0.01);
    timeline.add(timelinePlayer, 0);
  });
  timeline.play();



});


$(document.body).on('keyup', function(e) {

  e = e || window.event
  // KEYCODE 32 IS SPACEBAR
  // KEYCIODE 78 IS "n"

  // 48 = 0
  // 49 = 1
  // 50 = 2
  // 51 = 3

  if(e.keyCode == '32') {
  }
});
