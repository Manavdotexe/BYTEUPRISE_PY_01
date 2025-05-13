const cells = document.querySelectorAll('.cell');
const message = document.getElementById('message');
const resetBtn = document.getElementById('resetBtn');
const scoreBoard = document.getElementById('scoreBoard');

let board = Array(9).fill('');
let gameOver = false;
let userWins = 0;
let computerWins = 0;

const winCombos = [
  [0,1,2], [3,4,5], [6,7,8],
  [0,3,6], [1,4,7], [2,5,8],
  [0,4,8], [2,4,6]
];

const drawComments = [
  "Well, nobody won. That’s something.",
  "A draw. Almost like we both tried.",
  "Nobody lost, but nobody cared either.",
  "That was a whole lot of nothing."
];

const lossRoasts = [

  "Life is unfair. So is this game.",
  "Get a life.",
  "Computer wins again. Shocker.",
  "That was embarrassing... for you, not the computer.",
  "Even a potato bot could’ve beaten you.",
  "You just got outplayed by if-statements.",
  "Game over. Blame your decisions.",
  "You lost. But at least you're consistent.",
  "Computer wins! You can't even win a 3x3 game, and you want to win at life?"
];

function checkWinner(player) {
  return winCombos.some(combo => combo.every(i => board[i] === player));
}

function emptyCells() {
  return board.map((val, i) => val === '' ? i : null).filter(i => i !== null);
}

function updateScore() {
  scoreBoard.textContent = `You: ${userWins} | Computer: ${computerWins}`;
}

function resetGame() {
  board.fill('');
  cells.forEach(cell => cell.textContent = '');
  message.textContent = '';
  gameOver = false;
}

function minimax(newBoard, player) {
  const availSpots = newBoard.map((val, i) => val === '' ? i : null).filter(i => i !== null);

  // Check if the current player has won
  if (checkWinner('X')) return { score: -10 };
  if (checkWinner('O')) return { score: 10 };

  // No more moves available, it's a draw
  if (availSpots.length === 0) return { score: 0 };

  let moves = [];

  // Loop over all possible moves
  for (let i of availSpots) {
    let move = {};
    move.index = i;
    newBoard[i] = player;

    // Recursively call minimax for the next player
    let result = minimax(newBoard, player === 'O' ? 'X' : 'O');
    move.score = result.score;

    // Undo the move
    newBoard[i] = '';
    moves.push(move);
  }

  let bestMove;

  if (player === 'O') {
    // Maximizing for the computer (O)
    let bestScore = -Infinity;
    moves.forEach((move) => {
      if (move.score > bestScore) {
        bestScore = move.score;
        bestMove = move;
      }
    });
  } else {
    // Minimizing for the player (X)
    let bestScore = Infinity;
    moves.forEach((move) => {
      if (move.score < bestScore) {
        bestScore = move.score;
        bestMove = move;
      }
    });
  }

  return bestMove;
}

function handleClick(e) {
  const i = e.target.dataset.index;
  if (gameOver || board[i] !== '') return;

  board[i] = 'X';
  e.target.textContent = 'X';

  if (checkWinner('X')) {
    message.textContent = "You win! Mark the day.";
    userWins++;
    updateScore();
    gameOver = true;
    return;
  }

  if (emptyCells().length === 0) {
    message.textContent = drawComments[Math.floor(Math.random() * drawComments.length)];
    gameOver = true;
    return;
  }

  setTimeout(() => {
    const bestMove = minimax(board, 'O');
    board[bestMove.index] = 'O';
    cells[bestMove.index].textContent = 'O';

    if (checkWinner('O')) {
      message.textContent = lossRoasts[Math.floor(Math.random() * lossRoasts.length)];
      computerWins++;
      updateScore();
      gameOver = true;
      return;
    }

    if (emptyCells().length === 0) {
      message.textContent = drawComments[Math.floor(Math.random() * drawComments.length)];
      gameOver = true;
    }
  }, 300);
}

cells.forEach(cell => cell.addEventListener('click', handleClick));
resetBtn.addEventListener('click', resetGame);
