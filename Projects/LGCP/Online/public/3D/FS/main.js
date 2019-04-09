// Initialize Firebase
var config = {
  apiKey: "AIzaSyDfIFP4ZgQct3tg3jtvKqCaRR8V8kbVmTw",
  authDomain: "lgcp-9bb89.firebaseapp.com",
  databaseURL: "https://lgcp-9bb89.firebaseio.com",
  projectId: "lgcp-9bb89",
  storageBucket: "lgcp-9bb89.appspot.com",
  messagingSenderId: "192476211570"
};
firebase.initializeApp(config);
var db = firebase.firestore();

var s = document.getElementById("demo0");
var di = document.createElement("div");
document.body.appendChild(di);

db.collection("colors").get().then(function(snap){
  snap.forEach(function(c){
    var d = document.createElement("p");
    d.innerHTML = c.data().name;
    d.style.backgroundColor = c.data().color;
    di.appendChild(d);
    //if(c.data().players.exists)
    {
      console.log(c.data());
    }
  });
});

//var p = document.createElement("span");
//p.style.position = absolute;
//db.collection("colors")

db.collection("players").get().then(function(snap){
  s.innerHTML = snap.ref.doc("0").data().x;
  //alert("d");
});
