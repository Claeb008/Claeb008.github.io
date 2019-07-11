//This is the script for the revised classic game mode.
//This script was written and optimized for the 2D version, it might not work in the 3D.

//init
document.getElementById("gamemode_l").innerHTML = "Revised Classic";
document.getElementById("gamemode_d").style.visibility = "visible";
var curPlayer;

//overwrite arrow movement
overwrite[0] = true;
alert("added new script");

//fixes
if(!pSnap.child("game").exists())
{
  pRef.child("game").update({
    curMoves: 0,
    moveAmt: 0
  });
}

//add display things
var din = `<span style="font-size: 15px; color: gray">Moves: <span id="curMoves_l">0</span> / <span id="moveAmt_l">0</span></span>
<span style="font-size: 15px; color: gray">It's <span id="curPlayer_l"></span>'s turn</span>`;
var displayDiv = document.createElement("div");
displayDiv.innerHTML = din;
document.getElementById("replaceDiv").appendChild(displayDiv);
var curMoves_l = document.getElementById("curMoves_l");
var moveAmt_l = document.getElementById("moveAmt_l");
var curPlayer_l = document.getElementById("curPlayer_l");
lSnap.child("players/").forEach(function(c){
  if(c.val().id == lSnap.val().game.turn)
  {
    curPlayer = c;
    curMoves_l.innerHTML = pSnap.val().game.curMoves;
    moveAmt_l.innerHTML = c.val().game.moveAmt;
    curPlayer_l.innerHTML = c.val().name;
  }
});

function Updater()
{
  lSnap.child("players/").forEach(function(c){
    if(c.val().id == lSnap.val().game.turn)
    {
      curMoves_l.innerHTML = c.val().game.curMoves;
      moveAmt_l.innerHTML = c.val().game.moveAmt;
      curPlayer_l.innerHTML = c.val().name;
    }
  });
}
setInterval(Updater,200);


document.addEventListener("keydown",function(e){
  var key = e.key;
  if(key == "h") console.log(pSnap.val());
  //Moving
  if((key == "ArrowUp" || key == "ArrowDown" || key == "ArrowRight" || key == "ArrowLeft"))
  {
     e.preventDefault();
     if(!lSnap.child("loc").exists())
     {
       lGameRef.child('players/' + user.uid).update({
         here: true
       });
     }
     if(!lSnap.child('players/' + user.uid + "/fighting").exists() && !curPlayer.child("fighting").exists() && lSnap.val().game.turn == pSnap.val().id && pSnap.val().game.moveAmt != 0)
     {
      var curP = lSnap.child('players/' + user.uid);
      var dir = (key == "ArrowUp" ? 1 : key == "ArrowDown" ? 0 : key == "ArrowRight" ? 3 : key == "ArrowLeft" ? 2 : -1);
      var nArr = lSnap.child("pieces/" + curP.val().loc).child("props").val();
      if(dir != -1 && nArr[dir + parseInt(nArr[4] == "'" ? 6 : 8)] != -1 && !lSnap.child("props/" + nArr[dir + parseInt(nArr[4] == "'" ? 6 : 8)]).exists())
      {
        if(pSnap.val().game.curMoves >= pSnap.val().game.moveAmt)
        {
          if(lSnap.val().game.turn >= lSnap.val().pAmt - 1) lGameRef.child("game").update({turn: 0}); //lSnap.val().players.length - 1
          else lGameRef.child("game").update({turn: lSnap.val().game.turn + 1});
          pRef.child("game").update({curMoves: 0, moveAmt: 0, roll: 0})
          return;
        }
        else pRef.child("game").update({curMoves: pSnap.val().game.curMoves + 1})

        v_loc = parseInt(nArr[dir + parseInt(nArr[4] == "'" ? 6 : 8)]);
        lGameRef.child('players/' + user.uid).update({
          loc: v_loc
        });

        //update display stuff
        lSnap.child("players/").forEach(function(c){
          if(c.val().id == lSnap.val().game.turn)
          {
            curMoves_l.innerHTML = pSnap.val().game.curMoves;
            moveAmt_l.innerHTML = c.val().game.moveAmt;
            curPlayer_l.innerHTML = c.val().name;
          }
        });

      }
     }
  }

  //Rolling
  if(key == "r")
  {
    if(lSnap.val().game.turn != pSnap.val().id || (curPlayer.val().id != pSnap.val().id && curPlayer.child("fighting").exists())) return;

    var roll = Math.floor(Math.random() * 6);
    var moveAmt = (roll > 3 ? roll - 2 : roll); // 0 = move 1 space : 1 = shield : 2 = move 2 spaces : 3 = move 3 spaces

    if(!enemy)
    {
      CheckAround();
      console.log("No enemy");
      //return;
    }

    pRef.child("game").update({
      //roll: roll,
      curMoves: 0,
      moveAmt: moveAmt
    });

    if(enemy)
    {
      if(lSnap.child('players/' + user.uid).val().fighting.state) //if you are fighting
      {
        var me = lSnap.child('players/' + user.uid).val();
        if(roll == 1 || roll == 3 || roll == 0) //DESTROY
        {

          alert("Start HIS HEALTH IS " + lSnap.child(enemy).val().health);

          alert("HIS HEALTH IS " + (parseInt(lSnap.child(enemy).val().health) - 1));
          if(parseInt(lSnap.child(enemy).val().health) - 1 <= 0)
          {

            lGameRef.child('props/' + me.fighting.where).set({});
            lGameRef.child('players/' + user.uid + "/fighting").set({});
            //CheckAround();
            //alert("DESTROYED");
            EndTurn();
            console.log("DESTREOYED");
            alert(enemy);

            return;
          }
          else
          {

          }
          lGameRef.child('props/' + me.fighting.where + "/Subitem").update({health: lSnap.child(enemy).val().health - 1});
        }
        else // SKULL / FAILED
        {
          pRef.update({health: pSnap.val().health - parseInt(lSnap.child(enemy).val().health)});
          alert("SKULL / FAILED - YOU LOST " + lSnap.child(enemy).val().health + " HEALTH");
        }
      }
    }
  }
});

function EndTurn()
{
  if(lSnap.val().game.turn >= lSnap.val().pAmt - 1) lGameRef.child("game").update({turn: 0}); //lSnap.val().players.length - 1
  else lGameRef.child("game").update({turn: lSnap.val().game.turn + 1});
  pRef.child("game").update({curMoves: 0, moveAmt: 0, roll: 0});
}

/*CheckAround = ()=>
{
//return;
//("New CHECK");
if(!overwrite[0]) return;

  for(i = 0; i < 4; i++)
  {
  	if(!v_loc)
    {
    	v_loc = lSnap.child('players/' + user.uid).val().loc;
    }
  	//alert(v_loc);
    //alert(mp);
    //alert(lSnap);
    if((!mp[v_loc] || lSnap.child('players/' + user.uid + "/fighting").exists()) && enemy) return;
    var v = mp[v_loc][i + parseInt(mp[v_loc][4] == "'" ? 6 : 8)];
    console.log(v + " i " + i);
    //lGameRef.once('value',function(snap){
      if(lSnap.child('props/' + v + '/Subitem').exists())
      {
        if(lSnap.child('props/' + v + '/Subitem/health').val() > 0)
        {
          alert("FIGHTING! - " + user.uid);
          enemy = ('props/' + v + '/Subitem');
          //alert("parent = " + enemy.parent.key);
          lGameRef.child('players/' + user.uid).update({fighting: {state: true, where: v}});
        }
      }
    //});

  }
}*/
