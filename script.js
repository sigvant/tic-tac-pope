const gameBoard = (() => {
    // creates players
    const playerFactory = (name, mark, ai, turn) => {
        return { name, mark, ai, turn };
    };

    const player1 = playerFactory('Player 1', 'X', false, true);
    const player2 = playerFactory('Player 2', 'O', false, false);

    // here we take into account all the possible winning combos from tic tac tore
    const winCombos = [
        [0, 1, 2],
        [0, 3, 6],
        [3, 4, 5],
        [6, 7, 8],
        [1, 4, 7],
        [2, 4, 6],
        [2, 5, 8],
        [0, 4, 8]
    ];

    let winner = null;

    // turn counter
    let turns = 0;

    // board array
    let board = [];

    // winner combination array
    let winnerCombo = [];

    // function when making a move
    const playerTurn = (function () {
        const box = document.querySelectorAll('.board-spot');
        box.forEach( box => {
            box.addEventListener('click', e => {
                // x player will move if the conditions below are met
                if (player1.turn == true && gameBoard.winner == null && e.target.textContent == '') {
                    //adds move to the array
                    board[e.target.id] = player1.mark;
                    //some styles
                    box.textContent = player1.mark;
                    box.style.color = 'black';
                    // set player turns
                    player1.turn = false;
                    document.querySelector('.inst').textContent = 'Player 2 Turn. Add a Circle.'
                    player2.turn = true;

                    console.log(board)
                // o player will move if the conditions below are met
                } else if (player2.turn == true && gameBoard.winner == null && e.target.textContent == '' && player2.ai == false) {
                    //adds the move to the array
                    board[e.target.id] = player2.mark;
                    // add some styles
                    box.textContent = player2.mark;
                    box.style.color = 'black';
                    // set players turns
                    player1.turn = true;
                    document.querySelector('.inst').textContent = 'Player 1 Turn. Add a X.'
                    player2.turn = false;

                    console.log(board)
                } else {
                    return;
                };

                winCheck();

                // fade effectusing opacity
                box.style.opacity = '1';                
            });
        });
        return { box }
    })();

    winCheck = () => {
        turns++;

        let xPlays = board.reduce((a, e, i) =>
        (e === player1.mark) ? a.concat(i) : a, []);
        let oPlays = board.reduce((a, e, i) =>
        (e === player2.mark) ? a.concat(i) : a, []);
        // loop iterates over each winCombo array to check for victory
        for (let [index, combo] of winCombos.entries()) {
            // check if player moves index is equal to combo array index
            // indexOf returns first index or -1 if not found
            // that's why we are checking for > -1, which means it was found
            if (combo.every(elem => xPlays.indexOf(elem) > -1)) {

                gameBoard.winner = 'p1';
                gameBoard.winnerCombo = combo;
                document.querySelector('.inst').textContent = 'Game is Over!';

            } else if (combo.every(elem => oPlays.indexOf(elem) > -1)) {

                gameBoard.winner = 'p2';
                document.querySelector('.inst').textContent = 'Game is Over!';
                gameBoard.winnerCombo = combo;

            } else if (gameBoard.winner == null && gameBoard.winner == undefined && turns == 9) {

                gameBoard.winner = 'tie';
                document.querySelector('.inst').textContent = 'Game is Over!';
                gameBoard.winnerCombo = combo;
            };
        };

        // display the winner
        console.log(turns, gameBoard.winner, winnerCombo);
        winDisplay();
        return winnerCombo;

    };

    //resets the board and display
    gameReset = () => {
        gameBoard.winner = null;
        gameBoard.winnerCombo = undefined;
        player1.turn = true;
        player2.turn = false;
        player2.ai = false;
        turns = 0;
        board.splice(0, board.length);
        console.log(board, winner, player1.turn, player2.turn)
    };
    console.log(board, winner, player1.turn, player2.turn)

    return { winCheck, gameReset, playerTurn, board, player2, winnerCombo };
})();

// controls the display
const displayController = (() => {
    const boxCtn = document.querySelector('.boardgame');
    const box = document.querySelectorAll('.board-spot');
    const winCtn = document.querySelector('.win-display');
    // display winner function

    winDisplay = () => {
        // displays the win combo
        combDisplay = () => {
            // selects the elements of the win combo to be styled
            for(i = 0; i < gameBoard.winnerCombo.length; i++) {
                document.getElementById(gameBoard.winnerCombo[i]).style.
                    backgroundColor = 'rgba(255, 255, 255, 0.40)';
            };
        };

        // displays the winner
        if(gameBoard.winner === 'p1') {
            winCtn.textContent = 'P1 Wins!';
            combDisplay();

        } else if (gameBoard.winner === 'p2') {
            winCtn.textContent = 'P2 Wins!';
            combDisplay();

        } else if (gameBoard.winner === 'tie') {
            winCtn.textContent = 'It\'s a tie!';

        } else {
            return;
        };

        replayBtn.style.display = 'flex';
        // backBtn.style.display = 'flex';
        console.log(gameBoard.winnerCombo)
    };
    // board render
    gamePlay = () => {
        winCtn.style.display = 'block';
        
        header.style.display = 'none';

        playBtn.style.display = 'none';

        boxCtn.style.display = 'flex';

        backBtn.style.display = 'flex';
    };

    gameReplay = () => {
        gameBoard.gameReset();

        box.forEach( box => {
            box.textContent = '';
            box.style.opacity = '1';
            box.style.backgroundColor = 'white';
        });

        replayBtn.style.display = 'none';

        winCtn.textContent = '';
    };

    mainPage = () => {
        // adding styles
        boxCtn.style.display = 'none';

        winCtn.style.display = 'none';

        header.style.display = 'flex';

        document.querySelector('.inst').textContent = 'Player 1 Turn. Add a X.'

        gameReplay();
    };

    //now the event listeners
    
    const replayBtn = document.querySelector('.replay-btn');
    replayBtn.addEventListener('click', gameReplay);

    const header = document.querySelector('header');

    return { winDisplay, gamePlay }

})();