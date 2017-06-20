servColor = "red"

search = function(e, t){

//salut alors bien différencier
// E qui est l'evenement
// "qu'est ce qui s'est passé !!"
// et T qui est l'objet (this)
// "d'où ça vient ce bordel? "

//aaaai ça serait trop bien de faire une fonction pour 
//récupérer tout ce qui a été entré dans le pseudo-terminal
//en appuyant sur la flèche directionelle du haut

    if(t.value=="showServer"){
    	$("#formulaire").css("color", "#033ef4");  
    }else{
    	$("#formulaire").css("color", "black");  
    }

    console.log("event ",e)
    console.log("this ", t.value)

    e = e || window.event

    if(e.keyCode == 13 && t.value != ""){
    	execute(t.value)
    	t.value=""
    }

}

execute = function(what){
	console.log("EXECUTE "+what)

    var whatInstructions = what.match(/[^\s][a-zA-Z0-9\u00E0-\u00FC().'\[\]\;,_!?\-\:]{0,}/gm)
    console.log("insctructions :", whatInstructions)

    $('#srt').append($('<ul/>').html("<small>vous :</small>\ \ \ \ \ \ \ \ " + what))
    $('#srt').scrollTop($('#srt')[0].scrollHeight);

    switch(whatInstructions[0]){
        case "showServer":
    		em.emit('pingServerShort', servColor)
            break;

        case "pickColor":
            servColor=whatInstructions[1]
            break;
	}
}