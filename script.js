const Gameboard = (() => {
  const gameBoard = [null, null, null, null, null, null, null, null, null];

  return {
    getBoard() {
      return gameBoard;
    },
    setCell(index, marker) {
      if (index >= 0 && index < 9 && gameBoard[index] === null) {
        gameBoard[index] = marker;
        return true;
      }
      return false;
    },
    resetBoard() {
      for (let i = 0; i < gameBoard.length; i++) {
        gameBoard[i] = null;
      }
    }
  };
})();

function Player(name, marker) {
  return {
    name,
    marker,
    getName() {
      return name;
    },
    getMarker() {
      return marker;
    }
  };
}

const GameController = (() => {
  let player1 = Player("Player 1", "X");
  let player2 = Player("Player 2", "O");
  let currentPlayer = player1;
  let gameActive = true;

  const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], 
    [0, 3, 6], [1, 4, 7], [2, 5, 8], 
    [0, 4, 8], [2, 4, 6] 
  ];

  const playTurn = (index) => {
    if (!gameActive) return false;
    if (Gameboard.setCell(index, currentPlayer.getMarker())) {
      if (checkWinner()) {
        gameActive = false;
        DisplayController.showResult(`${currentPlayer.getName()} wins!`);
        return true;
      }
      if (checkTie()) {
        gameActive = false;
        DisplayController.showResult("It's a tie!");
        return true;
      }
      currentPlayer = currentPlayer === player1 ? player2 : player1;
      return true;
    }
    return false;
};

  const checkWinner = () => {
    const board = Gameboard.getBoard();
    return winningCombinations.some(combo => 
      combo.every(index => board[index] === currentPlayer.getMarker())
    );
  };

  const checkTie = () => {
    return Gameboard.getBoard().every(cell => cell !== null);
  };

  const resetGame = () => {
    Gameboard.resetBoard();
    currentPlayer = player1;
    gameActive = true;
  };

  const updatePlayers = (name1, name2) => {
    player1 = Player(name1 || "Player 1", "X");
    player2 = Player(name2 || "Player 2", "O");
    currentPlayer = player1;
  };

  return {
    playTurn,
    resetGame,
    updatePlayers,
    getCurrentPlayer: () => currentPlayer
  };
})();

const DisplayController = (() => {
  const boardDiv = document.getElementById('gameboard');
  const resultDiv = document.getElementById('result');
  const player1Input = document.getElementById('player1-name');
  const player2Input = document.getElementById('player2-name');
  const startButton = document.getElementById('start-button');

  const render = () => {
    boardDiv.innerHTML = '';
    const board = Gameboard.getBoard();
    board.forEach((cell, index) => {
      const cellDiv = document.createElement('div');
      cellDiv.classList.add('cell');
      cellDiv.dataset.index = index;
      cellDiv.textContent = cell || '';
      cellDiv.addEventListener('click', () => handleCellClick(index));
      boardDiv.appendChild(cellDiv);
    });
  };

  const handleCellClick = (index) => {
    if (GameController.playTurn(index)) {
      render();
    }
  };

  const showResult = (message) => {
    resultDiv.textContent = message;
  };

  const clearResult = () => {
    resultDiv.textContent = '';
  };

  const initializeGame = () => {
    const name1 = player1Input.value.trim();
    const name2 = player2Input.value.trim();
    GameController.updatePlayers(name1, name2);
    GameController.resetGame();
    clearResult();
    render();
  };

  startButton.addEventListener('click', initializeGame);

  return { render, showResult };
})();

// Initial render
DisplayController.render();