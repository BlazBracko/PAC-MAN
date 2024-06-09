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
    const themeStylesheet = document.getElementById('themeStylesheet');

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

    function backToMenu() {
        terminateGame=true;
        const sections = document.querySelectorAll('#game, #about, #settings, #story');
        sections.forEach(sec => sec.style.display = 'none');
        menu.style.display = 'block';
    }

    window.backToMenu = backToMenu; 

    function applyTheme(theme) {
        if (theme === 'dark') {
            themeStylesheet.href = 'darkstyle.css';
        } else {
            themeStylesheet.href = 'lightstyle.css';
        }
        localStorage.setItem('theme', theme);
    }

    themeSelectors.forEach(selector => {
        selector.addEventListener('change', function(event) {
            applyTheme(event.target.value);
        });
    });

    const savedTheme = localStorage.getItem('theme') || 'dark';
    applyTheme(savedTheme);
    document.querySelector(`input[name="theme"][value="${savedTheme}"]`).checked = true;

    languageForm.addEventListener('change', function(event) {
        if (event.target.name === 'language') {
            changeLanguage(event.target.value);
        }
    });

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
                1, 5, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 5, 1,
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
                1, 6, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 6, 1,
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
                1, 5, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1,
                1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1,
                1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 0, 0, 0, 0, 0, 0, 0, 0, 1,
                1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1,
                1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1,
                1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
                1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1,
                1, 0, 1, 1, 1, 1, 0, 1, 1, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 1, 1, 0, 1, 1, 1, 1, 0, 1,
                1, 0, 1, 1, 1, 1, 0, 1, 1, 4, 1, 1, 1, 2, 2, 1, 1, 1, 4, 1, 1, 0, 1, 1, 1, 1, 0, 1,
                1, 0, 1, 1, 1, 1, 0, 1, 1, 4, 1, 2, 2, 2, 2, 2, 2, 1, 4, 1, 1, 0, 1, 1, 1, 1, 0, 1,
                1, 0, 1, 1, 1, 1, 0, 0, 0, 4, 1, 2, 2, 2, 2, 2, 2, 1, 4, 0, 0, 0, 0, 0, 0, 0, 0, 1,
                1, 6, 1, 1, 1, 1, 0, 1, 1, 4, 1, 2, 2, 2, 2, 2, 2, 1, 4, 1, 1, 0, 1, 1, 1, 1, 0, 1,
                1, 0, 1, 1, 1, 1, 0, 1, 1, 4, 1, 1, 1, 1, 1, 1, 1, 1, 4, 1, 1, 0, 1, 1, 1, 1, 0, 1,
                1, 0, 1, 1, 1, 1, 0, 1, 1, 4, 1, 1, 1, 1, 1, 1, 1, 1, 4, 1, 1, 0, 1, 1, 1, 1, 0, 1,
                1, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 1, 1, 1, 1, 0, 1,
                1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1,
                1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1,
                1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1,
                1, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1,
                1, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1,
                1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 5, 0, 0, 0, 0, 0, 0, 0, 0, 1,
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
        // 5 - cherry
        // 6 - banana

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
                    if (i - width >= 0 && layouts[selLayout][i - width] === 1) squares[i].classList.add("wall-top");
                    if (i + width < layouts[selLayout].length && layouts[selLayout][i + width] === 1) squares[i].classList.add("wall-bottom");
                    if (i % width !== 0 && layouts[selLayout][i - 1] === 1) squares[i].classList.add("wall-left");
                    if ((i + 1) % width !== 0 && layouts[selLayout][i + 1] === 1) squares[i].classList.add("wall-right");
                }
                if (layouts[selLayout][i] === 2) squares[i].classList.add("ghost-lair");
                if (layouts[selLayout][i] === 3) squares[i].classList.add("power-pellet");
                if (layouts[selLayout][i] === 5) squares[i].classList.add("cherry");
                if (layouts[selLayout][i] === 6) squares[i].classList.add("banana");
            }
            squares[pacmanCurrentIndex].classList.add("pac-man");
        }
              

        createBoard(0);

        let currentPacmanImage = 1;
        let currentDirection = 'right';
        
        function movePacman() {
            let potentialIndex = pacmanCurrentIndex + direction;
        
            if (!squares[potentialIndex].classList.contains("wall") && !squares[potentialIndex].classList.contains("ghost-lair")) {
                squares[pacmanCurrentIndex].classList.remove("pac-man", "pac-man-1", "pac-man-2", "pac-man-3", "left", "right", "up", "down");
                pacmanCurrentIndex = potentialIndex;
                squares[pacmanCurrentIndex].classList.add("pac-man", currentDirection);
                switchPacmanImage();
            }
        
            pacDotEaten();
            powerPelletEaten();
        
            checkForEatGhost();
            checkForGameOver();
            checkForWin();
        
            // Handle the requested direction change
            potentialIndex = pacmanCurrentIndex + requestedDirection;
            if (!squares[potentialIndex].classList.contains("wall") && !squares[potentialIndex].classList.contains("ghost-lair")) {
                direction = requestedDirection;
                currentDirection = requestedAppearanceDirection; // Update appearance direction when changing actual direction
            }
        }
        
        function switchPacmanImage() {
            const pacmanClass = `pac-man-${currentPacmanImage}`;
            squares[pacmanCurrentIndex].classList.remove(`pac-man-1`, `pac-man-2`, `pac-man-3`);
            squares[pacmanCurrentIndex].classList.add(pacmanClass);
        
            currentPacmanImage++;
            if (currentPacmanImage > 3) {
                currentPacmanImage = 1;
            }
        }
        
        
        function checkForEatGhost() {
            if (squares[pacmanCurrentIndex].classList.contains("ghost") && squares[pacmanCurrentIndex].classList.contains("scared-ghost")) {
                const ghost = ghosts.find(ghost => ghost.currentIndex === pacmanCurrentIndex);
                if (ghost) {
                    ghost.isScared = false;
                    squares[ghost.currentIndex].classList.remove(ghost.className, "ghost", "scared-ghost");
                    ghost.currentIndex = ghost.startIndex;
                    score += 100;
                    scoreDisplay.innerHTML = score;
                    squares[ghost.currentIndex].classList.add(ghost.className, "ghost");
                }
            }
        }

        document.addEventListener("keydown", function(e) {
            switch (e.key) {
                case "ArrowLeft":
                    requestedDirection = -1;
                    requestedAppearanceDirection = 'left';
                    break;
                case "ArrowUp":
                    requestedDirection = -width;
                    requestedAppearanceDirection = 'up';
                    break;
                case "ArrowRight":
                    requestedDirection = 1;
                    requestedAppearanceDirection = 'right';
                    break;
                case "ArrowDown":
                    requestedDirection = width;
                    requestedAppearanceDirection = 'down';
                    break;
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
                score++;
                scoreDisplay.innerHTML = score;
                squares[pacmanCurrentIndex].classList.remove("pac-dot");
            }
        }

        let scareTimeout;

        function powerPelletEaten() {
            if (squares[pacmanCurrentIndex].classList.contains("cherry") || squares[pacmanCurrentIndex].classList.contains("banana")) {
                score += 10;
                scoreDisplay.innerHTML = score;
                ghosts.forEach(ghost => ghost.isScared = true);
                if (scareTimeout) {
                    clearTimeout(scareTimeout);
                }
                scareTimeout = setTimeout(unScareGhosts, 10000);
                squares[pacmanCurrentIndex].classList.remove("cherry", "banana");
            }
        }
        
        function unScareGhosts() {
            ghosts.forEach(ghost => ghost.isScared = false);
            scareTimeout = null;
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
        
                const targetIndex = ghost.isScared ? getFurthestSquareIndex(ghost.currentIndex) : pacmanCurrentIndex;
        
                const queue = [{ index: ghost.currentIndex, path: [] }];
                const visited = new Set();
                visited.add(ghost.currentIndex);
        
                while (queue.length > 0) {
                    const { index, path } = queue.shift();
        
                    if (index === targetIndex) {
                        if (path.length > 0) {
                            const nextStep = path[0];
        
                            squares[ghost.currentIndex].classList.remove(ghost.className, "ghost", "scared-ghost");
        
                            if (squares[nextStep].classList.contains("pac-dot")) {
                                squares[nextStep].classList.add("hidden-pac-dot");
                                squares[nextStep].classList.remove("pac-dot");
                            }
        
                            if (squares[nextStep].classList.contains("pac-man") || squares[nextStep].classList.contains("pac-man-1") || squares[nextStep].classList.contains("pac-man-2") || squares[nextStep].classList.contains("pac-man-3")) {
                                squares[nextStep].classList.remove("pac-man", "pac-man-1", "pac-man-2", "pac-man-3");
                            }
        
                            ghost.currentIndex = nextStep;
                            squares[ghost.currentIndex].classList.add(ghost.className, "ghost");
                        }
                        break;
                    }
        
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
        
                squares.forEach(square => {
                    if (square.classList.contains("hidden-pac-dot") && !square.classList.contains("ghost")) {
                        square.classList.add("pac-dot");
                        square.classList.remove("hidden-pac-dot");
                    }
                });
        
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
        
        function getFurthestSquareIndex(currentIndex) {
            const directions = [-1, 1, width, -width];
            let maxDistance = -1;
            let furthestIndex = currentIndex;
        
            directions.forEach(direction => {
                const newIndex = currentIndex + direction;
                if (
                    !squares[newIndex].classList.contains("wall") &&
                    !squares[newIndex].classList.contains("ghost") &&
                    calculateDistance(newIndex, pacmanCurrentIndex) > maxDistance
                ) {
                    maxDistance = calculateDistance(newIndex, pacmanCurrentIndex);
                    furthestIndex = newIndex;
                }
            });
        
            return furthestIndex;
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
                pacmanCurrentIndex = 490;
                increaseGhostSpeed();
                createBoard(1);
                ghosts.forEach(ghost => {
                    ghost.currentIndex = ghost.startIndex;
                    ghost.isScared = false; // Reset scared state
                    squares[ghost.currentIndex].classList.add(ghost.className, "ghost");
                });
                scoreDisplay.innerHTML = score;
                levelDisplay.innerHTML = 2;
                alert("Level 1 complete, let's see how you handle level 2.");
            } else if (score >= 568 && level === 2) {
                ghosts.forEach(ghost => clearInterval(ghost.timerId));
                document.removeEventListener("keyup", movePacman);
                alert("You won.");
                score = 0;
                level = 1;
                backToMenu();
            }
        }
    }
});