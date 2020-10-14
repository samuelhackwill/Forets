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