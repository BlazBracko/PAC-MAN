document.addEventListener("DOMContentLoaded", () => {
    const playButton = document.getElementById('playButton');
    const aboutButton = document.getElementById('aboutButton');
    const settingsButton = document.getElementById('settingsButton');
    const storyButton = document.getElementById('storyButton');
    const game = document.getElementById('game');
    const menu = document.getElementById('menu');
    const about = document.getElementById('about');
    const settings = document.getElementById('settings');
    const story = document.getElementById('story');

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

    storyButton.addEventListener('click', () => {
        menu.style.display = 'none';
        story.style.display = 'block';
    });

    function backToMenu() {
        const sections = document.querySelectorAll('#game, #about, #settings, #story');
        sections.forEach(sec => sec.style.display = 'none');
        menu.style.display = 'block';
    }

    window.backToMenu = backToMenu; // Make it globally accessible for inline HTML onclick

    function initGame() {
        const scoreDisplay = document.getElementById("score")
        const levelDisplay = document.getElementById("level")
        levelDisplay.innerHTML = 1;
        const width = 28
        let score = 0
        const grid = document.querySelector(".grid")
        grid.innerHTML = "";
        let level = 1;
        let moveInterval;
        let direction = null;
        let requestedDirection = null; 
        let pacmanCurrentIndex = 490

        const layouts = [
            [
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
            ],
            
            [
            1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
            1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
            1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1,
            1, 3, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1,
            1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1,
            1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 1,
            1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1,
            1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1,
            1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
            1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1,
            1, 0, 1, 1, 1, 1, 0, 1, 1, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 1, 1, 0, 1, 1, 1, 1, 0, 1,
            1, 0, 1, 1, 1, 1, 0, 1, 1, 4, 1, 1, 1, 2, 2, 1, 1, 1, 4, 1, 1, 0, 1, 1, 1, 1, 0, 1,
            1, 0, 1, 1, 1, 1, 0, 1, 1, 4, 1, 2, 2, 2, 2, 2, 2, 1, 4, 1, 1, 0, 1, 1, 1, 1, 0, 1,
            1, 0, 1, 1, 1, 1, 0, 0, 0, 4, 1, 2, 2, 2, 2, 2, 2, 1, 4, 0, 0, 0, 0, 0, 0, 0, 0, 1,
            1, 3, 1, 1, 1, 1, 0, 1, 1, 4, 1, 2, 2, 2, 2, 2, 2, 1, 4, 1, 1, 0, 1, 1, 1, 1, 0, 1,
            1, 0, 1, 1, 1, 1, 0, 1, 1, 4, 1, 1, 1, 1, 1, 1, 1, 1, 4, 1, 1, 0, 1, 1, 1, 1, 0, 1,
            1, 0, 1, 1, 1, 1, 0, 1, 1, 4, 1, 1, 1, 1, 1, 1, 1, 1, 4, 1, 1, 0, 1, 1, 1, 1, 0, 1,
            1, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 1, 1, 1, 1, 0, 1,
            1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1,
            1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1,
            1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1,
            1, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1,
            1, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1,
            1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 1,
            1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1,
            1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1,
            1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
            1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1
        ]
    ]

            
        

        // 0 - pac-dots
        // 1 - wall
        // 2 - ghost-lair
        // 3 - power-pellet
        // 4 - empty

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
            squares[pacmanCurrentIndex].classList.add("pac-man");
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

        function unScareGhosts() {
            ghosts.forEach(ghost => ghost.isScared = false)
        }

        class Ghost {
            constructor(className, startIndex, speed) {
                this.className = className
                this.startIndex = startIndex
                this.speed = speed
                this.currentIndex = startIndex
                this.isScared = false
                this.timerId = NaN
            }
        }

        const ghosts = [
            new Ghost("blinky", 348, 250),
            new Ghost("pinky", 376, 400),
            new Ghost("inky", 351, 300),
            new Ghost("clyde", 379, 500),
        ]

        ghosts.forEach(ghost =>
            squares[ghost.currentIndex].classList.add(ghost.className, "ghost"))

        ghosts.forEach(ghost => moveGhost(ghost))

        function moveGhost(ghost) {
            const directions = [-1, 1, width, -width]
            let direction = directions[Math.floor(Math.random() * directions.length)]

            ghost.timerId = setInterval(function () {
                if (
                    !squares[ghost.currentIndex + direction].classList.contains("ghost") &&
                    !squares[ghost.currentIndex + direction].classList.contains("wall")
                ) {
                    squares[ghost.currentIndex].classList.remove(ghost.className, "ghost", "scared-ghost")
                    ghost.currentIndex += direction
                    squares[ghost.currentIndex].classList.add(ghost.className, "ghost")
                } else direction = directions[Math.floor(Math.random() * directions.length)]
                if (ghost.isScared) {
                    squares[ghost.currentIndex].classList.add("scared-ghost")
                }

                if (ghost.isScared && squares[ghost.currentIndex].classList.contains("pac-man")) {
                    ghost.isScared = false
                    squares[ghost.currentIndex].classList.remove(ghost.className, "ghost", "scared-ghost")
                    ghost.currentIndex = ghost.startIndex
                    score += 100
                    scoreDisplay.innerHTML = score
                    squares[ghost.currentIndex].classList.add(ghost.className, "ghost")
                }
                checkForGameOver()
            }, ghost.speed)
        }

        function increaseGhostSpeed() {
            ghosts.forEach(ghost => {
                ghost.speed *= 0.80; 
                clearInterval(ghost.timerId); 
                moveGhost(ghost); 
            });
        }

        function checkForGameOver() {
            if (
                squares[pacmanCurrentIndex].classList.contains("ghost") &&
                !squares[pacmanCurrentIndex].classList.contains("scared-ghost")) {
                ghosts.forEach(ghost => clearInterval(ghost.timerId))
                document.removeEventListener("keyup", movePacman)
                backToMenu(); //todo
            }
        }

        function checkForWin() {
            if (score >= 20 && level === 1) {
                level++; 
                increaseGhostSpeed(); 
                createBoard()
                scoreDisplay.innerHTML = score;
                levelDisplay.innerHTML = 2;
                alert("Level 1 Complete! Welcome to Level 2!");
            } else if (score >= 50 && level === 2) {
                ghosts.forEach(ghost => clearInterval(ghost.timerId))
                document.removeEventListener("keyup", movePacman)
                backToMenu(); //todo
                
               
            }
        }
    }
});