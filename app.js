document.addEventListener("DOMContentLoaded", () => {
    const playButton = document.getElementById('playButton');
    const aboutButton = document.getElementById('aboutButton');
    const settingsButton = document.getElementById('settingsButton');
    const game = document.getElementById('game');
    const menu = document.getElementById('menu');
    const about = document.getElementById('about');
    const settings = document.getElementById('settings');

    playButton.addEventListener('click', () => {
        menu.style.display = 'none';
        game.style.display = 'block';
        initGame();
    });

    aboutButton.addEventListener('click', () => {
        menu.style.display = 'none';
        about.style.display = 'block';
    });

    settingsButton.addEventListener('click', () => {
        menu.style.display = 'none';
        settings.style.display = 'block';
    });

    function backToMenu() {
        const sections = document.querySelectorAll('#game, #about, #settings');
        sections.forEach(sec => sec.style.display = 'none');
        menu.style.display = 'block';
    }

    window.backToMenu = backToMenu; // Make it globally accessible for inline HTML onclick

    function initGame() {
        const width = 28
        const grid = document.querySelector(".grid")

        const layout = [
            1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
            1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
            1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1,
            1, 3, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 3, 1,
            1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1,
            1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
            1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1,
            1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1,
            1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
            1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1,
            1, 1, 1, 1, 1, 1, 0, 1, 1, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 1, 1, 0, 1, 1, 1, 1, 1, 1,
            1, 1, 1, 1, 1, 1, 0, 1, 1, 4, 1, 1, 1, 2, 2, 1, 1, 1, 4, 1, 1, 0, 1, 1, 1, 1, 1, 1,
            1, 1, 1, 1, 1, 1, 0, 1, 1, 4, 1, 2, 2, 2, 2, 2, 2, 1, 4, 1, 1, 0, 1, 1, 1, 1, 1, 1,
            4, 4, 4, 4, 4, 4, 0, 0, 0, 4, 1, 2, 2, 2, 2, 2, 2, 1, 4, 0, 0, 0, 4, 4, 4, 4, 4, 4,
            1, 1, 1, 1, 1, 1, 0, 1, 1, 4, 1, 2, 2, 2, 2, 2, 2, 1, 4, 1, 1, 0, 1, 1, 1, 1, 1, 1,
            1, 1, 1, 1, 1, 1, 0, 1, 1, 4, 1, 1, 1, 1, 1, 1, 1, 1, 4, 1, 1, 0, 1, 1, 1, 1, 1, 1,
            1, 1, 1, 1, 1, 1, 0, 1, 1, 4, 1, 1, 1, 1, 1, 1, 1, 1, 4, 1, 1, 0, 1, 1, 1, 1, 1, 1,
            1, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 1,
            1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1,
            1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1,
            1, 3, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 3, 1,
            1, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1,
            1, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1,
            1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1,
            1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1,
            1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1,
            1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
            1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1
        ]

        const squares = []

        function createBoard() {
            for (let i = 0; i < layout.length; i++) {
                const square = document.createElement("div");
                square.id = i;
                grid.appendChild(square);
                squares.push(square);
                
                if (layout[i] === 0) squares[i].classList.add("pac-dot");
                if (layout[i] === 1) squares[i].classList.add("wall");
                if (layout[i] === 2) squares[i].classList.add("ghost-lair");
                if (layout[i] === 3) squares[i].classList.add("power-pellet");
            }
        }
        createBoard();

        function movePacman() {
            let potentialIndex = pacmanCurrentIndex + requestedDirection;
            if (!squares[potentialIndex].classList.contains("wall") && !squares[potentialIndex].classList.contains("ghost-lair")) {
                direction = requestedDirection; 
            }

            potentialIndex = pacmanCurrentIndex + direction;
            if (!squares[potentialIndex].classList.contains("wall") && !squares[potentialIndex].classList.contains("ghost-lair")) {
                squares[pacmanCurrentIndex].classList.remove("pac-man");
                pacmanCurrentIndex = potentialIndex;
                squares[pacmanCurrentIndex].classList.add("pac-man");
            }

            pacDotEaten();
            powerPelletEaten();
            checkForGameOver();
            checkForWin();
        }

        
        document.addEventListener("keydown", function(e) {
            switch (e.key) {
                case "ArrowLeft": requestedDirection = -1; break;
                case "ArrowUp": requestedDirection = -width; break;
                case "ArrowRight": requestedDirection = 1; break;
                case "ArrowDown": requestedDirection = width; break;
            }
        });

        moveInterval = setInterval(movePacman, 200);

        function pacDotEaten() {
            if (squares[pacmanCurrentIndex].classList.contains("pac-dot")) {
                score++
                scoreDisplay.innerHTML = score
                squares[pacmanCurrentIndex].classList.remove("pac-dot")
            }
        }

        function powerPelletEaten() {
            if (squares[pacmanCurrentIndex].classList.contains("power-pellet")) {
                score += 10
                scoreDisplay.innerHTML = score
                ghosts.forEach(ghost => ghost.isScared = true)
                setTimeout(unScareGhosts, 10000)
                squares[pacmanCurrentIndex].classList.remove("power-pellet")
            }
        }

    }

});
// 0 - pac-dots
// 1 - wall
// 2 - ghost-lair
// 3 - power-pellet
// 4 - empty
