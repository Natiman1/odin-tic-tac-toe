const board = document.getElementById("board");
const result = document.getElementById("result");

let currentPlayer = "X";
let gameBoard = ["", "", "", "", "", "", "", "", ""];
let gameActive = true;

// Function to handle cell clicks
function cellClick(index) {
	if (gameBoard[index] === "" && gameActive) {
		gameBoard[index] = currentPlayer;
		updateBoard();
		checkWinner();
		currentPlayer = currentPlayer === "X" ? "O" : "X";

		if (currentPlayer === "O" && gameActive) {
			// Computer's turn
			setTimeout(() => {
				makeComputerMove();
				updateBoard();
				checkWinner();
				currentPlayer = "X";
			}, 500); // Delay for a better user experience
		}
	}
}

// Function to make a move for the computer using the minimax algorithm
function makeComputerMove() {
	const bestMove = minimax(gameBoard, currentPlayer);
	gameBoard[bestMove.index] = "O";
}

// Minimax algorithm implementation
function minimax(board, player) {
	const availableMoves = getEmptyCells(board);

	if (checkWinnerForPlayer(board, "X")) {
		return { score: -1 };
	} else if (checkWinnerForPlayer(board, "O")) {
		return { score: 1 };
	} else if (availableMoves.length === 0) {
		return { score: 0 };
	}

	const moves = [];

	for (let i = 0; i < availableMoves.length; i++) {
		const move = {};
		move.index = availableMoves[i];

		board[availableMoves[i]] = player;

		if (player === "O") {
			const result = minimax(board, "X");
			move.score = result.score;
		} else {
			const result = minimax(board, "O");
			move.score = result.score;
		}

		board[availableMoves[i]] = "";

		moves.push(move);
	}

	let bestMove;
	if (player === "O") {
		let bestScore = -Infinity;
		for (let i = 0; i < moves.length; i++) {
			if (moves[i].score > bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	} else {
		let bestScore = Infinity;
		for (let i = 0; i < moves.length; i++) {
			if (moves[i].score < bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	}

	return moves[bestMove];
}

// Function to get empty cells on the board
function getEmptyCells(board) {
	return board.reduce((acc, val, index) => {
		if (val === "") acc.push(index);
		return acc;
	}, []);
}

// Function to check for a winner for a specific player
function checkWinnerForPlayer(board, player) {
	const winPatterns = [
		[0, 1, 2],
		[3, 4, 5],
		[6, 7, 8],
		[0, 3, 6],
		[1, 4, 7],
		[2, 5, 8],
		[0, 4, 8],
		[2, 4, 6],
	];

	for (const pattern of winPatterns) {
		const [a, b, c] = pattern;
		if (board[a] === player && board[b] === player && board[c] === player) {
			return true;
		}
	}

	return false;
}

// Function to update the game board
function updateBoard() {
	board.innerHTML = "";
	gameBoard.forEach((value, index) => {
		const cell = document.createElement("div");
		cell.className = "cell";
		cell.textContent = value;
		cell.addEventListener("click", () => cellClick(index));
		board.appendChild(cell);
	});
}

// Function to check for a winner
function checkWinner() {
	if (checkWinnerForPlayer(gameBoard, "X")) {
		result.textContent = "X is the winner!";
		gameActive = false;
	} else if (checkWinnerForPlayer(gameBoard, "O")) {
		result.textContent = "O is the winner!";
		gameActive = false;
	} else if (!gameBoard.includes("")) {
		result.textContent = "It's a tie!";
		gameActive = false;
	}
}

// Function to reset the game
function resetGame() {
	currentPlayer = "X";
	gameBoard = ["", "", "", "", "", "", "", "", ""];
	gameActive = true;
	result.textContent = "";
	updateBoard();

	if (currentPlayer === "O") {
		// Computer starts if it's its turn
		makeComputerMove();
		updateBoard();
		currentPlayer = "X";
	}
}
