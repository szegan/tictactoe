window.addEventListener('DOMContentLoaded',()=> {});

var myVar;
function myFunction(){
   myVar = setTimeout(showPage, 1000);}

function showPage(){
   document.getElementById("loader").style.display="none";
   document.getElementById("myDiv").style.display="block";
}

/* save a reference to the DOM node, we need get an array to reurns a nodeList. 
   Get a references to the player display, reset button and the winner annoucer. */
const tiles = Array.from(document.querySelectorAll('.tile'));
const playerDisplay = document.querySelector('.display-player');
const resetButton = document.querySelector('#reset');
const announcer = document.querySelector('.announcer');
/*
The board will save all the X and O value
Default player X starts first
There will always be one current player who is active until someone wins or resulted in a tied game
*/
let board = ['','','','','','','','',''];
let currentPlayer = 'X';
let isGameActive = true;

// Three results: X wins, O wins or Tie 
const PLAYERX_WON = 'PLAYERX_WON';
const PLAYERO_WON = 'PLAYERO_WON';
const TIE = 'TIE';

/*
   Indexes within the board 
   [0] [1] [2]
   [3] [4] [5]
   [6] [7] [8]
*/

/*
Store all the winning possibilities on the tiles 
*/
const winningConditions = [
   [0,1,2],
   [3,4,5],
   [6,7,8],
   [0,3,6],
   [1,4,7],
   [2,5,8],
   [0,4,8],
   [2,4,6]
];

/*
Check if the tile is empty to avoid duplicates on the tile
*/
const isValidAction = (tile) => {
   if (tile.innerText === 'X' || tile.innerText === 'O'){
      return false;
   }

   return true;
};

/*
Receive an index as a parameter and set the corresponding element 
in the board array to the symbol of the current player. 
*/
const updateBoard = (index) => {
   board[index] = currentPlayer;
};

/*
This function will be handling player changes, the string will changes from X to O 
depending on the current player. Player X will starts as default. 
The expression is if it is X, it will be O otherwise it will be X. 
After changing the user's value, player display will need to be updated using innerText. 
*/
const changePlayer = () => {
   playerDisplay.classList.remove(`player${currentPlayer}`);
   currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
   playerDisplay.innerText = currentPlayer;
   playerDisplay.classList.add(`player${currentPlayer}`);
};

/*
Announce the final winner, update the result using innerHTML with switch case. 
Need to hide the announcer at the end of the dunction because announcer is hidden as default
until the end of the game. 
*/
const announce = (type) => {
   switch(type){
      case PLAYERO_WON:
         announcer.innerHTML = 'Player <span class= "playerO"> O </span> Won.';
         break;
      
      case PLAYERX_WON:
         announcer.innerHTML = 'Player <span class= "playerX"> X </span> Won.';
         break;

      case TIE:
         announcer.innerHTML = ' It is a tie. '; 
         break;
   }
   announcer.classList.remove('hide');
}

/*
Create a function result validation function, create a roundwon variable and 
set it to false, then we can iterate through the winCondiions array & check 
each win condiion on the board. 

Optimization: 
1. Ignore any empty tile "", skip and continue iterate the winning conditions array.
2. If all fields are equal, then we have a winner, set roundwon to true and break the loop. 

After the loop, check the value of roundwon, if it's true the declare the winner & set 
the game to inactive. If we dont have a winner, check the board for empty tile, 
no winnder & no empty tile = we declare a draw game. 
*/
function handleResultValidation(){
   let roundWon = false;
   for (let i = 0; i <= 7; i++){
      const winCondition = winningConditions[i];
      const a = board[winCondition[0]];
      const b = board[winCondition[1]];
      const c = board[winCondition[2]];
      if (a === "" || b === "" || c ===""){
         continue;
      }
      if (a === b && b === c){
         roundWon = true;
         break;
      }
   }

   if (roundWon){
      announce(currentPlayer === "X" ? PLAYERX_WON : PLAYERO_WON);
      isGameActive = false;
      return;
   }

   if (!board.includes("")) announce(TIE);

}

/**
 * 
 * @param {*} tile: 
 * @param {*} index 
 * 
 * This function is called when user clicks a tile.
 * First, we need to check if it's a valid action & whether the game is currently active. 
 * IF both are true, update the tile's innerText with the current player's symbols. 
 * Update the board array. Now that everything is updayed, we have to check if the game 
 * is over, so we call handleResultValidation() functiton. At last, call the 
 * changeplayer method to pass he turn to the other player. 
 */
const userAction = (tile, index) => {
   if (isValidAction(tile) && isGameActive){
      tile.innerText = currentPlayer;
      tile.classList.add(`player${currentPlayer}`);
      updateBoard(index);
      handleResultValidation();
      changePlayer();
   }
}

/**
 * Add event listener to the tile, do this by looping through 
 * the array of tiles and add event listener for each tile. 
 */
tiles.forEach( (tile, index) => {
   tile.addEventListener('click',() => userAction(tile, index));
});

/**
 * This function is to reset the game, set the board to nine empty strings. 
 * Set the game to active and remove the announcer. 
 * Change the player to default X. 
 * Iterate over the tiles and set innerText to empty string &
 * remove any player from the tiles. 
 */
const resetBoard = () => {
   board = ['','','','','','','','',''];
   isGameActive = true;
   announcer.classList.add('hide');

   if (currentPlayer === 'O'){
      changePlayer();
   }

   tiles.forEach(tile => {
      tile.innerText = '';
      tile.classList.remove('PlayerX');
      tile.classList.remove('PlayerO');
   });
      announcer.innerHTML = '<span class= "playerX"> </span>';
      announcer.innerHTML = '<span class= "playerO"> </span>';

}

resetButton.addEventListener('click',resetBoard);