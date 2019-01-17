//var can = document.getElementById('can');
//var ctx = can.getContext('2d');

//Variables
var players = [];
var playerID = -1;
var updated = false;
var c = document.getElementById("c");
var username = "";

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
  gSnap = snap;
  updated = true;
});

/*newGameRef.child('players').once('value',function(snap){
  var i = snap.key.substr(1,snap.key.length - 1));

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

  if(user)
  {
    if(snap.user == user.uid) playerID = i;
  }

  newGameRef.child('players/p' + (i)).on('value',function(snap){
    //alert(i);
    //alert(snap.key);
    if(snap.child('x').exists() && players[i])
    {
      players[i].style.marginLeft = snap.val().x;
      players[i].style.marginTop = snap.val().y;
      players[i].style.color = snap.val().color;
    }
  });
});*/

firebase.auth().onAuthStateChanged(function(user1) {
if (user1) {
  // User is signed in.
  console.log("this user is signed in");
  document.getElementById("p_Username").innerHTML = user1.displayName;
  document.getElementById("p_photo").src = user1.photoURL;
  console.log(user1);
  user = user1;

       var userRef = firebase.database().ref('users/' + user1.uid);
       userRef.once('value').then(function(snap){
           userRef.update({
        loginTimes: snap.child('loginTimes').val() + 1//parseInt(snap.val()) + 1

      });

       });

} else {
  // No user is signed in.
  console.log("no user in");
  document.getElementById("p_Username").innerHTML = "no user";
}

});
user = firebase.auth().currentUser;
if(user)console.log(user);






newGameRef.child('players').on('child_added',function(snap){
  //newGameRef.once('value',function(snap2){
  //alert(snap2.val().playerAmt);
  var i;
  //if(!updated)
  //{
    //return;
    i = snap.key.substr(1,snap.key.length - 1);


  //}
  //else
  //{

  //}
  //else if(!snap.child('x').exists()) return;
  //alert(snap.key);

  //i = gSnap.val().playerAmt;
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

  if(user)
  {
    if(snap.user == user.uid) playerID = i;
  }
  else if(username != "")
  {
    if(username == user.name) playerID = i;
  }

  newGameRef.child('players/p' + (i)).on('value',function(snap){
    //alert(i);
    //alert(snap.key);
    if(snap.child('x').exists() && players[i])
    {
      players[i].style.marginLeft = snap.val().x;
      players[i].style.marginTop = snap.val().y;
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
  if(!user)
  {
    alert("Please Log In First!");
    return;
  }

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
    y: 50,
    user: user.uid,
    name: username
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
    y: 50,
    user: user.uid,
    name: username
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
  if(key == "ArrowLeft" || key == "ArrowRight") newGameRef.child('players/p' + playerID).update({x: gSnap.child('players/p' + playerID).val().x + (key == "ArrowRight" ? 10 : -10)});
  if(key == "ArrowUp" || key == "ArrowDown") newGameRef.child('players/p' + playerID).update({y: gSnap.child('players/p' + playerID).val().y + (key == "ArrowDown" ? 10 : -10)});
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

  if(username != document.getElementById('name_i').innerHTML) username = document.getElementById('name_i').innerHTML;

}
setInterval(Update,20);

//NETWORKING

var user;

var provider = new firebase.auth.GoogleAuthProvider();
provider.setCustomParameters({
'login_hint': 'user@example.com'
});
function LogIn()
{
  console.log("loggingIN");
firebase.auth().signInWithPopup(provider).then(function(result) {

// This gives you a Google Access Token. You can use it to access the Google API.
var token = result.credential.accessToken;
// The signed-in user info.
var user = result.user;
console.log(user);
// ...
}).catch(function(error) {
// Handle Errors here.
var errorCode = error.code;
var errorMessage = error.message;
// The email of the user's account used.
var email = error.email;
// The firebase.auth.AuthCredential type that was used.
var credential = error.credential;
// ...
});
}

function LogOut()
{
if(!user)
  {
    return;
  }

firebase.auth().signOut().then(function() {
// Sign-out successful.
console.log("sign out successful");
}).catch(function(error) {
// An error happened.
console.log("error signing out");
});
}
