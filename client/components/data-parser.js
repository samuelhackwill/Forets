import Parser from 'simple-text-parser';

rawTextToJson = function (rawText) {

  console.log('rawTextToJson');
  // var fs = require('fs');
  // var Parser = require("simple-text-parser"),
  parser = new Parser();
  console.log(parser);

  // require.extensions['.txt'] = function (module, filename) {
  //   module.exports = fs.readFileSync(filename, 'utf8');
  // };

  // var words = require("./input.txt");
  var words = rawText;
  var wordsz = words.replace(/^\n/gm, '');
  // vire toutes les lignes vides

    parser.addRule(/\%{3}.+/g, function(content){
    cleantext = content.substr(4)
    return{text:cleantext, type:"comment"}
  })

  parser.addRule(/\#.+/gm, function(content){

    var contentz = content.replace(/\n/gm, '');
    // pour virer les incohérences avec les newlines de mairde
    var contentzarray = contentz.match(/[^# ][a-zA-Z0-9\u00E0-\u00FC().'\[\]\;,_!?\-\:]{0,}/gm)
    var cleanbalise = contentzarray[0]
    contentzarray.shift()

    return { text:contentzarray, type:cleanbalise}
  });

  parser.addRule(/\n/gm, function(videur){
  //  videur = ""
  //  return {text:videur, type:"blanc"}
    // ça c'est pour si tu veux mettre des blancs entre chaque ligne tu connais?
    return false
    // ben lui tu vois il sert à la fois à splitter et a caler des blancs.
  });

  var parsed = parser.toTree(wordsz);


  console.log(JSON.stringify(parsed, null, 4));
  // $('#json-result').val(JSON.stringify(parsed, null, 4));
  return JSON.stringify(parsed, null, 4);
};



  /*loadJSON: function(callback) {

    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', '/libs/output.json', true); // Replace 'my_data' with the path to your file
    xobj.onreadystatechange = function () {
      if (xobj.readyState == 4 && xobj.status == "200") {
        // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
        callback(xobj.responseText);
      }
    };
    xobj.send(null);  
  },*/
  //fonction qui parse le JSON
  //et qui range dans un tableau numéroté
  //afin d'utiliser next() qui va faire défiler les textes/events du spectacle
  zoupageJSON = function(response, obj) {
    // Parse JSON string into object
    console.log("zoupageJSON");
    console.log(response, response.length);
    // var actual_JSON = JSON.parse(response);
    var actual_JSON = JSON.parse(response);
    console.log("actual_JSON");
    console.log(actual_JSON);
    for(i=0; i<actual_JSON.length; i++){
     // console.log(actual_JSON[i]["type"])
     if((actual_JSON[i]["text"]=="") && (actual_JSON[i]["type"]=="text")){
        console.log("cette ligne s'est fait zoupper ", actual_JSON[i])
      }else{
        obj.push(actual_JSON[i])
      }
      // là tu mets une condition pour qu'il pushe pas les trucs de texte vide sa mère
    }
    // for(i=0; i<actual_JSON.length; i++){
    //   obj.push(actual_JSON[i])
    // }
    console.log("demoData", obj, demoData);
    console.log("demoCompteur", demoCompteur);
    return obj;
  };