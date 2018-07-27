

var cross = "<div class=\"crosses\"><div class=\"cross\"></div><div class=\"cross\"></div></div>",
    circle = "<div class=\"circle\"></div>",
    grid = [0,0,0,
            0,0,0,
            0,0,0
    ],
    computer = "circle",
    MAX = 10,
    pcMove = 1,
    playerMove = -1,
    allPos = [0,1,2,3,4,5,6,7,8],
    store = [],
    gameStarted = false,
    playerWinMsg = "Wasn't suppose to happen...<br/>But whatever, you won",
    pcWinMsg = "Well...<br/>It was obvious",
    drawMsg = "Huh, this is the most you could do?";


function findBestMove() {
  var bestMove = -1, bestVal = -1000;
  // console.log(grid);
  var cnt = 0;
  allPos.forEach(function(pos) {
    if(grid[pos] == 0){
      cnt++;
      
      grid[pos] = pcMove;
      var curGrid = grid;
      var curVal = minmax(curGrid, 0, playerMove);
      grid[pos] = 0;
      console.log(pos , curVal);
      if(curVal > bestVal) {
        bestVal = curVal;
        bestMove = pos;
      }
    }
  })
  // console.log(bestMove);
  
  // else {
    grid[bestMove] = pcMove;
  
    var slot = $("#main_board").children().eq(bestMove);
    if(computer == "circle")
      slot.html(circle);
    else 
      slot.html(cross);

    slot.children("div").fadeTo( "fast" , 1, function() {
      grid[bestMove] = pcMove;
      return true;
  	});
  // }
  
}

function gameOver(game) {
  $("#score").toggleClass("hidden");
  if(game == 1) {
    $("#result").html(pcWinMsg);
  }
  else if(game == -1)
    $("#result").html(playerWinMsg);
  else $("#result").html(drawMsg);
  gameStarted = false;
}



function checkGame() {
  
  var score = 0;
       if(grid[0] + grid[1] + grid[2] == 3) score = MAX; //horizontal win
  else if(grid[3] + grid[4] + grid[5] == 3) score = MAX; //horizontal win
  else if(grid[6] + grid[7] + grid[8] == 3) score = MAX; //horizontal win
  else if(grid[0] + grid[3] + grid[6] == 3) score = MAX; //vertical win
  else if(grid[1] + grid[4] + grid[7] == 3) score = MAX; //vertical win
  else if(grid[2] + grid[5] + grid[8] == 3) score = MAX; //vertical win
  else if(grid[0] + grid[4] + grid[8] == 3) score = MAX; //cross win
  else if(grid[2] + grid[4] + grid[6] == 3) score = MAX; //cross win
  
  else if(grid[0] + grid[1] + grid[2] == -3) score = -MAX; //horizontal win player
  else if(grid[3] + grid[4] + grid[5] == -3) score = -MAX; //horizontal win player
  else if(grid[6] + grid[7] + grid[8] == -3) score = -MAX; //horizontal win player
  else if(grid[0] + grid[3] + grid[6] == -3) score = -MAX; //vertical win player
  else if(grid[1] + grid[4] + grid[7] == -3) score = -MAX; //vertical win player
  else if(grid[2] + grid[5] + grid[8] == -3) score = -MAX; //vertical win player
  else if(grid[0] + grid[4] + grid[8] == -3) score = -MAX; //cross win player
  else if(grid[2] + grid[4] + grid[6] == -3) score = -MAX; //cross win player

  return score;

}

function minmax(curGrid, depth, move) {

  var score = checkGame(curGrid);
  
  if(score == MAX) return score - depth;
  else if(score == -MAX) return score + depth;
  
  var best = - move*1000;
  
  allPos.forEach(function(pos) {
    
    if(curGrid[pos] == 0) {

      curGrid[pos] = move;
      var cpGrid = curGrid;
      var val = minmax(cpGrid, depth + 1, -move);
      
        if(move == pcMove)
        	best = Math.max(best, val);
      	else 
        	best = Math.min(best, val);

      curGrid[pos] = 0;
    }
    // console.log(best);
  })
  return best;
}


$(".slot").click ( function() {
    if(gameStarted) {
      if($(this).html() != "") return;
      if(computer == "circle")
        $(this).html(cross);
      else 
        $(this).html(circle);
      $(this).children("div").fadeTo( "fast" , 1, function() {
        var playerClickPos = $(this).parent().index();
        grid[playerClickPos] = playerMove;
        if(checkGame() == MAX) return gameOver(1);
        else if(checkGame() == -MAX) return gameOver(-1);
        findBestMove();
        if(checkGame() == MAX) return gameOver(1);
        else if(checkGame() == -MAX) return gameOver(-1);
        else if(grid.indexOf(0) == -1) return gameOver(0);
      });
      
   } else {
     if($(this).html().indexOf("circle") != -1) {
       computer = "cross";
       findBestMove();
     }
     else computer = "circle";
     
     $("#settings").toggleClass("hidden");
     gameStarted = true;
   }
})

$("#again").click(function(){
  $("#main_board .slot").html("");
  allPos.forEach(function(pos){
    grid[pos] = 0;
  })
  $("#score").toggleClass("hidden");
  $("#settings").toggleClass("hidden");
})