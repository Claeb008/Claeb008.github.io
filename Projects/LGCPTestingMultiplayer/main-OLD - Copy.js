//var can = document.getElementById('can');
//var ctx = can.getContext('2d');

//Variables
var players = [];
var playerID = -1;
var updated = false;
var c = document.getElementById("c");

var config = {
  apiKey: "AIzaSyDfIFP4ZgQct3tg3jtvKqCaRR8V8kbVmTw",
  authDomain: "lgcp-9bb89.firebaseapp.com",
  databaseURL: "https://lgcp-9bb89.firebaseio.com",
  projectId: "lgcp-9bb89",
  storageBucket: "lgcp-9bb89.appspot.com",
  messagingSenderId: "192476211570"
};
firebase.initializeApp(config);
var database = firebase.database();

var newGameRef = firebase.database().ref('Tests/Games');
var gSnap;
/*newGameRef.update({
  playerAmt: 0
});*/
newGameRef.on('value',function(snap){
  if(gSnap != snap)
  {
    //alert("NOW!!!!");
    updated = true;
  }
  gSnap = snap;

});


function LoadGame()
{
  newGameRef.once('value',function(snap){
    gSnap = snap;



  for(i = 0; i < gSnap.val().playerAmt; i++)
  {
    var player_d = document.createElement('p');
    player_d.innerHTML = "P";
    player_d.style = "color: blue;";
    document.getElementById('pBox').insertBefore(player_d,players[i - 1]);
    //var i = players.push(player_d);

    players[i] = player_d;
    //i--;
    console.log(i);
    newGameRef.child('players/p' + (i)).on('value',function(snap){
      //alert(i);
      //alert(snap.key);
      if(snap.child('x').exists() && players[i])
      {
        players[i].style.marginLeft = snap.val().x;
        players[i].style.color = snap.val().color;
      }
    });
  }
  });
}

newGameRef.child('players').on('child_added',function(snap){
  //newGameRef.once('value',function(snap2){
  //alert(snap2.val().playerAmt);
  if(!updated) return;
  //else if(!snap.child('x').exists()) return;
  //alert(snap.key);



  ///////var i = gSnap.val().playerAmt;
  var i = snap.key.substr(1,snap.key.length - 1);


  if(players[i])
  {
    //alert("Wait");
    return;
  };
  var player_d = document.createElement('p');
  player_d.innerHTML = "P";
  player_d.style = "color: blue;";
  document.getElementById('pBox').insertBefore(player_d,players[i - 1]);
  //var i = players.push(player_d);

  players[i] = player_d;
  //i--;
  console.log(i);
  newGameRef.child('players/p' + (i)).on('value',function(snap){
    //alert(i);
    //alert(snap.key);
    if(snap.child('x').exists() && players[i])
    {
      players[i].style.marginLeft = snap.val().x;
      players[i].style.color = snap.val().color;
    }
  });
//});
});

newGameRef.child('players').on('child_removed',function(snap){
  if(!snap.key.startsWith("p")) return;
  newGameRef.child('players/p' + (snap.key.substr(1,snap.key.length - 1))).off('value',function(snap){
    console.log('hopefully off now');
  });
  var i = snap.key.substr(1,snap.key.length - 1);
  document.getElementById('pBox').removeChild(players[i]);
  //players.splice(i,1);
  players[i] = null;
});



function AddPlayer()
{
  if(!updated)
  {
    alert("Wait first");
    return;
  }
  updated = false;

  playerID = gSnap.val().playerAmt;
  newGameRef.child('players/p' + gSnap.val().playerAmt).update({
    color: "blue",
    x: 50,
    y: 50
  });
  newGameRef.update({
    playerAmt: gSnap.val().playerAmt + 1
  });


}
function ClearGame()
{
  newGameRef.set({
    playerAmt: 0
    //players: "p0"
  });
  /*for(i = 0; i < players.length; i++)
  {
    newGameRef.child('players/p' + (i)).off('value',function(snap){
    });
  }*/

  //players = [];
  //document.getElementById('pBox').innerHTML = "";
}
function JoinGame()
{
  if(playerID != -1)
  {
    alert("You are already in a game!");
    return;
  }
  playerID = gSnap.val().playerAmt;
  newGameRef.child('players/p' + gSnap.val().playerAmt).update({
    color: "blue",
    x: 50,
    y: 50
  });
  newGameRef.update({
    playerAmt: gSnap.val().playerAmt + 1
  });

}
function LeaveGame()
{
  if(playerID == -1)
  {
    alert("You arent even in a game!");
    return;
  }
  newGameRef.child("players/p" + playerID).set({});
  playerID = -1;
}

document.addEventListener('keydown',function(e){
  var key = e.key;
  if(key == "d" || key == "a") newGameRef.child('players/p' + playerID).update({x: gSnap.child('players/p' + playerID).val().x + (key == "d" ? 10 : -10)});
  //if(key == "a") console.log(players);//players[0].style.marginLeft += 10;
});

function Update()
{
  if(playerID != -1 && gSnap && gSnap.child('players/p' + playerID).val().color != c.value)
  {
    newGameRef.child('players/p' + playerID).update({
      color: c.value,
    });
  }

}
setInterval(Update,20);
