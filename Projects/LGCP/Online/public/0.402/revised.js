//This is the script for the revised classic game mode.
//This script was written and optimized for the 2D version, it might not work in the 3D.

//init
document.getElementById("gamemode_l").innerHTML = "Revised Classic";
document.getElementById("gamemode_d").style.visibility = "visible";

//overwrite arrow movement
overwrite[0] = true;
alert("added new script");

//fixes
if(!pSnap.child("game").exists())
{
  pRef.child("game").update({
    roll: 0,
    curMoves: 0,
    moveAmt: 0
  });
}

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
     if(!lSnap.child('players/' + user.uid + "/fighting").exists() && lSnap.val().game.turn == pSnap.val().id && pSnap.val().game.moveAmt != 0)
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


      }
     }
  }

  //Rolling
  if(key == "r")
  {
    if(lSnap.val().game.turn != pSnap.val().id) return;

    var roll = Math.floor(Math.random() * 6);
    var moveAmt = (roll > 3 ? roll - 2 : roll); // 0 = move 1 space : 1 = shield : 2 = move 2 spaces : 3 = move 3 spaces

    if(!enemy)
    {
      CheckAround();
      console.log("No enemy");
      //return;
    }

    pRef.child("game").update({
      roll: roll,
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
