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
    
    const languageForm = settings.querySelector('form');
    const themeSelectors = document.getElementsByName('theme');

    let terminateGame;

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

    changeLanguage('en');

    function applyTheme(theme) {
        if (theme === 'dark') {
            bodyElement.classList.add('dark-theme');
            bodyElement.classList.remove('light-theme');
        } else {
            bodyElement.classList.add('light-theme');
            bodyElement.classList.remove('dark-theme');
        }
    }

    themeSelectors.forEach(selector => {
        selector.addEventListener('change', function(event) {
            //applyTheme(event.target.value);
            //value je "dark" in "light"
            //hendlat to v style.css
        });
    });

    const currentTheme = themeSelectors.length > 0 && themeSelectors[0].checked ? 'light' : 'dark';
    //applyTheme(currentTheme);

    languageForm.addEventListener('change', function(event) {
        if (event.target.name === 'language') {
            changeLanguage(event.target.value);
        }
    });
    function backToMenu() {
        terminateGame=true;
        const sections = document.querySelectorAll('#game, #about, #settings, #story');
        sections.forEach(sec => sec.style.display = 'none');
        menu.style.display = 'block';
    }

    window.backToMenu = backToMenu; 

    function changeLanguage(lang) {
        fetch(`${lang}.json`)
        .then(response => response.json())
        .then(translations => {
            document.querySelectorAll("[data-translate]").forEach(el => {
                el.textContent = translations[el.getAttribute('data-translate')];
                const elements = document.querySelectorAll('[data-translate]');
                elements.forEach(el => {
                    const key = el.getAttribute('data-translate');
                    el.innerHTML = translations[key];  // Tukaj se prevod vstavi z HTML oznakami
                });  
            });
        }).catch(error => console.error('Error loading the translations:', error));
    }

    function initGame() {
        terminateGame=false;
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
        var squares = []

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

        const ghostSpeed=500;

        const ghosts = [
            new Ghost("blinky", 348, ghostSpeed),
            new Ghost("pinky", 376, ghostSpeed),
            new Ghost("inky", 351, ghostSpeed),
            new Ghost("clyde", 379, ghostSpeed),
        ]

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

        function createBoard(selLayout) {
            grid.innerHTML = '';
            if(selLayout == 1){
                direction = null;
                requestedDirection = null;
                squares = [];
            }
            if(selLayout == 0){
                scoreDisplay.innerHTML = 0;
                levelDisplay.innerHTML = 1;
                squares = [];
            }
        
            for (let i = 0; i < layouts[selLayout].length; i++) {
                const square = document.createElement("div");
                square.id = i;
                grid.appendChild(square);
                squares.push(square);
        
                if (layouts[selLayout][i] === 0) squares[i].classList.add("pac-dot");
                if (layouts[selLayout][i] === 1) {
                    squares[i].classList.add("wall");
                    // Add additional classes to indicate adjacent wall squares
                    if (i - width >= 0 && layouts[selLayout][i - width] === 1) squares[i].classList.add("wall-top");
                    if (i + width < layouts[selLayout].length && layouts[selLayout][i + width] === 1) squares[i].classList.add("wall-bottom");
                    if (i % width !== 0 && layouts[selLayout][i - 1] === 1) squares[i].classList.add("wall-left");
                    if ((i + 1) % width !== 0 && layouts[selLayout][i + 1] === 1) squares[i].classList.add("wall-right");
                }
                if (layouts[selLayout][i] === 2) squares[i].classList.add("ghost-lair");
                if (layouts[selLayout][i] === 3) squares[i].classList.add("power-pellet");
            }
            squares[pacmanCurrentIndex].classList.add("pac-man");
        }
              

        createBoard(0);

        function movePacman() {
            let potentialIndex = pacmanCurrentIndex + requestedDirection;
            if (!squares[potentialIndex].classList.contains("wall") && !squares[potentialIndex].classList.contains("ghost-lair")) direction = requestedDirection; 
            
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

        moveInterval = setInterval(function() {
            if (terminateGame) {
                clearInterval(moveInterval);
                return;
            }
            movePacman();
        }, 200);

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

        ghosts.forEach(ghost =>
            squares[ghost.currentIndex].classList.add(ghost.className, "ghost"))

        ghosts.forEach(ghost => moveGhost(ghost))

        function calculateDistance(index1, index2) {
            const x1 = index1 % width;
            const y1 = Math.floor(index1 / width);
            const x2 = index2 % width;
            const y2 = Math.floor(index2 / width);
            return Math.abs(x1 - x2) + Math.abs(y1 - y2);
        }
        

        function moveGhost(ghost) {
            const directions = [-1, 1, width, -width];
        
            ghost.timerId = setInterval(function () {
                if (terminateGame) {
                    clearInterval(ghost.timerId);
                    return;
                }
        
                // Find the shortest path to Pac-Man using BFS
                const queue = [{ index: ghost.currentIndex, path: [] }];
                const visited = new Set();
                visited.add(ghost.currentIndex);
        
                while (queue.length > 0) {
                    const { index, path } = queue.shift();
        
                    // If we've found Pac-Man, move in the direction of the first step in the path
                    if (index === pacmanCurrentIndex) {
                        if (path.length > 0) {
                            const nextStep = path[0];
                            squares[ghost.currentIndex].classList.remove(ghost.className, "ghost", "scared-ghost");
                            ghost.currentIndex = nextStep;
                            squares[ghost.currentIndex].classList.add(ghost.className, "ghost");
                        }
                        break;
                    }
        
                    // Explore adjacent squares
                    directions.forEach(direction => {
                        const newIndex = index + direction;
                        if (
                            !visited.has(newIndex) &&
                            !squares[newIndex].classList.contains("wall") &&
                            !squares[newIndex].classList.contains("ghost")
                        ) {
                            visited.add(newIndex);
                            queue.push({ index: newIndex, path: [...path, newIndex] });
                        }
                    });
                }
        
                if (ghost.isScared) {
                    squares[ghost.currentIndex].classList.add("scared-ghost");
                }
        
                if (ghost.isScared && squares[ghost.currentIndex].classList.contains("pac-man")) {
                    ghost.isScared = false;
                    squares[ghost.currentIndex].classList.remove(ghost.className, "ghost", "scared-ghost");
                    ghost.currentIndex = ghost.startIndex;
                    score += 100;
                    scoreDisplay.innerHTML = score;
                    squares[ghost.currentIndex].classList.add(ghost.className, "ghost");
                }
        
                checkForGameOver();
            }, ghost.speed);
        }
        
        
        

        function increaseGhostSpeed() {
            ghosts.forEach(ghost => {
                ghost.speed *= 0.80; 
                clearInterval(ghost.timerId); 
                moveGhost(ghost); 
            });
        }

        function checkForGameOver() {
            if (squares[pacmanCurrentIndex].classList.contains("ghost") && !squares[pacmanCurrentIndex].classList.contains("scared-ghost")) {
                ghosts.forEach(ghost => clearInterval(ghost.timerId))
                document.removeEventListener("keyup", movePacman)
                alert("Game Over! You lost.");
                scoreDisplay.innerHTML = 0;
                levelDisplay.innerHTML = 1;
                score = 0;
                level = 1;
                backToMenu(); 
            }
        }

        function checkForWin() {
            if (score >= 274 && level === 1) {
                level++; 
                pacmanCurrentIndex = 490
                increaseGhostSpeed(); 
                createBoard(1)
                ghosts.forEach(ghost => {
                    ghost.currentIndex = ghost.startIndex; 
                    squares[ghost.currentIndex].classList.add(ghost.className, "ghost"); 
                });
                scoreDisplay.innerHTML = score;
                levelDisplay.innerHTML = 2;
                alert("Level 1 complete, lets see how u handle level 2.")
            } else if (score >= 568 && level === 2) {
                ghosts.forEach(ghost => clearInterval(ghost.timerId))
                document.removeEventListener("keyup", movePacman)
                alert("You won."); 
                score = 0;
                level = 1;
                backToMenu(); 
            }
        }
    }
});