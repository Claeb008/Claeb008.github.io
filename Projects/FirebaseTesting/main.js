//player
var x = 0;
var y = 0;
var lx = document.getElementById("lx");
var ly = document.getElementById("ly");
var player = document.getElementById("player");

var player2 = {
	l: document.getElementById("l2"),
    x: 0,
    y: 0

};


// Set the configuration for your app
  // TODO: Replace with your project's config object
  var config = {
    apiKey: "AIzaSyDfIFP4ZgQct3tg3jtvKqCaRR8V8kbVmTw",
    authDomain: "lgcp-9bb89.firebaseapp.com",
    databaseURL: "https://lgcp-9bb89.firebaseio.com",
    projectId: "lgcp-9bb89",
    storageBucket: "lgcp-9bb89.appspot.com",
    messagingSenderId: "192476211570"
  };
  firebase.initializeApp(config);

  // Get a reference to the database service
  var database = firebase.database();
  
/*firebase.database().ref('maps/' + "Fortaan").set({
    name: "Fortaan123",
    source: "0,0,0",
    author: "Claeb"
    
  });*/
  
  var mapsRef = firebase.database().ref('maps/');
  console.log(mapsRef.length);
  
  
  firebase.database().ref('maps/' + "Fortaan").once('value').then(function(snapshot) {
  var username = (snapshot.val() && snapshot.val().name) || 'Anonymous';
  // ...
  document.getElementById("ppp").innerHTML = username;
});
var starCountRef = firebase.database().ref('maps/' + "Fortaan");
starCountRef.on('value', function(snapshot) {
	var username = (snapshot.val() && snapshot.val().name) || 'Anonymous';
  // ...
  document.getElementById("ppp").innerHTML = username;
  //updateStarCount(postElement, snapshot.val());
});

//PLAYERS MULTIPLAYER
var p1Ref = firebase.database().ref('maps/player1');
p1Ref.on('value',function(snapshot){
	x = snapshot.val().x;
    y = snapshot.val().y;
});
var p2Ref = firebase.database().ref('maps/player2');
p2Ref.on('value',function(snapshot){
	player2.x = snapshot.val().x;
    player2.y = snapshot.val().y;
});
p1Ref.update({
	x: 200

});

/*var newPostRef = mapsRef.push();
newPostRef.set({
    // ...
    name: "Draida",
    source: "160,0,80",
    author: "Claeb Hero"
});
newPostRef.key = "DraidaMap";*/

mapsRef.once('value', function(snapshot) {
  snapshot.forEach(function(childSnapshot) {
    var childKey = childSnapshot.key;
    var childData = childSnapshot.val();
    console.log(childKey);
    firebase.database().ref("maps/" + childKey).update({
    	author: "Claeb Hero"
        
    	
    });
    // ...
  });
});

window.addEventListener("keydown",function(event)
{
	const key = event.key;
	if(key == "Enter")
    {
    	
    	console.log(firebase.database().ref('maps/' + "test").exists);
    	firebase.database().ref('maps/' + "test").child("child doc").update(
        {
        	//name: "Something like Fortaan",
            source: null
        });
    }
    if(key == "ArrowRight") p1Ref.update({x: x+5}); //x += 5;
    if(key == "ArrowLeft") p1Ref.update({x: x-5}); //x -= 5;
    if(key == "d") p2Ref.update({x: player2.x+5});
    if(key == "a") p2Ref.update({x: player2.x-5});
    if(key == "e")
    {
    	//Hello123();
    	//som();
    	//document.getElementById("mod1").innerHTML = document.getElementById("script_box").value;
    	//document.getElementById("ibox").contentWindow.document.body.innerHTML = document.getElementById("script_box").value;
        //document.body.innerHTML += "console.log('THIS IS A VERY TEST');";
        //document.getElementById("ibox").init();
        //console.log(document.scripts[4].innerHTML);
        //document.scripts[4].innerHTML += document.getElementById("script_box").value;
        //console.log(document.scripts[4].innerHTML);
        som();
        
        var script = document.createElement("script");
		script.type = "text/javascript";
    	//script.src = "//myapp.disqus.com/embed.js";
        script.onload = function()
        {
        	
        	for(i=0;i<10;i++)
            {
            	console.log("this is amzing" + i);
            }
        };
        //script.innerHTML = 'console.log("it is done"); function Hello123(){console.log("this is a ery very test");}';
        script.innerHTML = document.getElementById("script_box").value;//'function Move(){x += 5; y += 1}setInterval(Move,100); player.style.color = "green";';
    	script.async = true;
        //script.innerHTML += "function Hello111(){console.log('i wish this would work');}";
    	document.body.appendChild(script);
        //document.scripts[6].innerHTML += "console.log('just extra');";
        //console.log(document.scripts[6].innerHTML);
        

        //script.innerHTML += "function Hello222(){console.log('i want this to work so bad');}";
        //var node = document.body.removeChild(document.scripts[6]);
        //document.body.appendChild(node);
        
    }
    if(key == "r")
    {
    	Hello123();
        //Hello111();
        //Hello222();
    }
    
});

function Update()
{
	lx.innerHTML = x;
    ly.innerHTML = y;
    player.style.marginTop = y + "px";
    //player.style = "margin-left: " + x + "px;";
    player.style.marginLeft = x + "px";
    
    player2.l.style.marginTop = player2.y + "px";
    player2.l.style.marginLeft = player2.x + "px";
}
setInterval(Update,20);
  /*
  
    
  var citiesRef = db.collection("cities");

citiesRef.doc("SF").set({
    name: "San Francisco", state: "CA", country: "USA",
    capital: false, population: 860000,
    regions: ["west_coast", "norcal"] });
citiesRef.doc("LA").set({
    name: "Los Angeles", state: "CA", country: "USA",
    capital: false, population: 3900000,
    regions: ["west_coast", "socal"] });
citiesRef.doc("DC").set({
    name: "Washington, D.C.", state: null, country: "USA",
    capital: true, population: 680000,
    regions: ["east_coast"] });
citiesRef.doc("TOK").set({
    name: "Tokyo", state: null, country: "Japan",
    capital: true, population: 9000000,
    regions: ["kanto", "honshu"] });
citiesRef.doc("BJ").set({
    name: "Beijing", state: null, country: "China",
    capital: true, population: 21500000,
    regions: ["jingjinji", "hebei"] });
  
  */
  
  
  
  ////////LGCP testing stuffs
  var newGameRef;
  function CreateGame()
  {
  		if(!newGameRef)
        {
        	newGameRef = firebase.database().ref('gameplay/').push();
			newGameRef.child('player1').set({
    		// ...
    		curMoves: 0,
   			moveAmt: 0,
    		roll: 0
			});
        }
        else alert("You have already made a new game!");
  }
  
  function OpenGame()
  {
  		var ibox = document.getElementById("i_OpenGame");
  		newGameRef = firebase.database().ref('gameplay/' + ibox.value);
        newGameRef.set({
        	playerAmt: 1,
            player1: {
            	roll: 0,
                curMoves: 0,
                moveAmt: 0,
                charID: 0
            
            }
        
        });
  }
  
  


function ClearGame()
{
var k = newGameRef.key;
	firebase.database().ref('gameplay/' + k).set(null);
}


////////
// Initialize the FirebaseUI Widget using Firebase.
var ui = new firebaseui.auth.AuthUI(firebase.auth());

var uiConfig = {
  callbacks: {
    signInSuccessWithAuthResult: function(authResult, redirectUrl) {
      // User successfully signed in.
      // Return type determines whether we continue the redirect automatically
      // or whether we leave that to developer to handle.
      return true;
    },
    uiShown: function() {
      // The widget is rendered.
      // Hide the loader.
      document.getElementById('loader').style.display = 'none';
    }
  },
  // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
  signInFlow: 'popup',
  signInSuccessUrl: 'index.html',//'<url-to-redirect-to-on-success>',
  signInOptions: [
    // Leave the lines as is for the providers you want to offer your users.
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    firebase.auth.FacebookAuthProvider.PROVIDER_ID,
    firebase.auth.TwitterAuthProvider.PROVIDER_ID,
    firebase.auth.GithubAuthProvider.PROVIDER_ID,
    firebase.auth.EmailAuthProvider.PROVIDER_ID,
    firebase.auth.PhoneAuthProvider.PROVIDER_ID
  ],
  // Terms of service url.
  tosUrl: '<your-tos-url>',
  // Privacy policy url.
  privacyPolicyUrl: '<your-privacy-policy-url>'
};

ui.start('#firebaseui-auth-container', {
  signInOptions: [
    // List of OAuth providers supported.
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    //firebase.auth.FacebookAuthProvider.PROVIDER_ID,
    //firebase.auth.TwitterAuthProvider.PROVIDER_ID,
    //firebase.auth.GithubAuthProvider.PROVIDER_ID
  ],
  // Other config options...
});

/*ui.start('#firebaseui-auth-container', {
  signInOptions = [
    {
      provider: firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      scopes: [
        'https://www.googleapis.com/auth/plus.login'
      ],
      customParameters: {
        // Forces account selection even when one account
        // is available.
        prompt: 'select_account'
      }
    },
    {
      provider: firebase.auth.FacebookAuthProvider.PROVIDER_ID,
      scopes: [
        'public_profile',
        'email',
        'user_likes',
        'user_friends'
      ],
      customParameters: {
        // Forces password re-entry.
        auth_type: 'reauthenticate'
      }
    },
    firebase.auth.TwitterAuthProvider.PROVIDER_ID, // Twitter does not support scopes.
    firebase.auth.EmailAuthProvider.PROVIDER_ID // Other providers don't need to be given as object.
  ]
});*/

// The start method will wait until the DOM is loaded.
ui.start('#firebaseui-auth-container', uiConfig);
  