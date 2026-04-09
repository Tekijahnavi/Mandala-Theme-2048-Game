// Mandala 2048 Game Logic
class Mandala2048 {
    constructor() {
        this.grid = [];
        this.score = 0;
        this.bestScore = 0;
        this.size = 4;
        this.won = false;
        this.over = false;
        this.keepPlaying = false;
        this.touchStartX = 0;
        this.touchStartY = 0;
        this.boardContainer = null;
        this.scoreElement = null;
        this.bestScoreElement = null;
        this.overlayElement = null;
        this.overlayTitle = null;
        this.overlayMessage = null;
        
        this.init();
    }

    init() {
        this.setupDOM();
        this.loadBestScore();
        this.setupEventListeners();
        this.newGame();
    }

    setupDOM() {
        this.boardContainer = document.getElementById('game-board');
        this.scoreElement = document.getElementById('score');
        this.bestScoreElement = document.getElementById('best-score');
        this.overlayElement = document.getElementById('game-overlay');
        this.overlayTitle = document.getElementById('overlay-title');
        this.overlayMessage = document.getElementById('overlay-message');
        
        // Create grid cells
        this.boardContainer.innerHTML = '';
        for (let i = 0; i < this.size * this.size; i++) {
            const cell = document.createElement('div');
            cell.className = 'grid-cell';
            this.boardContainer.appendChild(cell);
        }
    }

    setupEventListeners() {
        // Keyboard controls
        document.addEventListener('keydown', (e) => this.handleKeyPress(e));
        
        // Touch controls
        this.boardContainer.addEventListener('touchstart', (e) => this.handleTouchStart(e), { passive: true });
        this.boardContainer.addEventListener('touchmove', (e) => this.handleTouchMove(e), { passive: true });
        this.boardContainer.addEventListener('touchend', (e) => this.handleTouchEnd(e));
        
        // Button controls
        document.getElementById('new-game').addEventListener('click', () => this.newGame());
        document.getElementById('restart-btn').addEventListener('click', () => this.newGame());
        document.getElementById('continue-btn').addEventListener('click', () => this.continueGame());
        document.getElementById('theme-toggle').addEventListener('click', () => this.toggleTheme());
    }

    newGame() {
        this.grid = this.emptyGrid();
        this.score = 0;
        this.won = false;
        this.over = false;
        this.keepPlaying = false;
        
        this.addRandomTile();
        this.addRandomTile();
        this.updateDisplay();
        this.hideOverlay();
    }

    emptyGrid() {
        const grid = [];
        for (let i = 0; i < this.size; i++) {
            grid[i] = [];
            for (let j = 0; j < this.size; j++) {
                grid[i][j] = 0;
            }
        }
        return grid;
    }

    addRandomTile() {
        const emptyCells = [];
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                if (this.grid[i][j] === 0) {
                    emptyCells.push({ x: i, y: j });
                }
            }
        }
        
        if (emptyCells.length > 0) {
            const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
            this.grid[randomCell.x][randomCell.y] = Math.random() < 0.9 ? 2 : 4;
            return randomCell;
        }
        return null;
    }

    handleKeyPress(e) {
        if (this.over && !this.keepPlaying) return;
        
        let moved = false;
        
        switch(e.key) {
            case 'ArrowUp':
                e.preventDefault();
                moved = this.move('up');
                break;
            case 'ArrowDown':
                e.preventDefault();
                moved = this.move('down');
                break;
            case 'ArrowLeft':
                e.preventDefault();
                moved = this.move('left');
                break;
            case 'ArrowRight':
                e.preventDefault();
                moved = this.move('right');
                break;
        }
        
        if (moved) {
            this.addRandomTile();
            this.updateDisplay();
            
            if (this.isGameWon() && !this.won) {
                this.won = true;
                this.showWinScreen();
            } else if (this.isGameOver()) {
                this.over = true;
                this.showGameOverScreen();
            }
        }
    }

    handleTouchStart(e) {
        if (e.touches.length > 0) {
            this.touchStartX = e.touches[0].clientX;
            this.touchStartY = e.touches[0].clientY;
        }
    }

    handleTouchMove(e) {
        // Prevent scrolling during touch
        e.preventDefault();
    }

    handleTouchEnd(e) {
        if (this.over && !this.keepPlaying) return;
        
        if (e.changedTouches.length > 0) {
            const touchEndX = e.changedTouches[0].clientX;
            const touchEndY = e.changedTouches[0].clientY;
            
            const dx = touchEndX - this.touchStartX;
            const dy = touchEndY - this.touchStartY;
            
            const absDx = Math.abs(dx);
            const absDy = Math.abs(dy);
            
            if (Math.max(absDx, absDy) > 30) {
                let moved = false;
                
                if (absDx > absDy) {
                    moved = this.move(dx > 0 ? 'right' : 'left');
                } else {
                    moved = this.move(dy > 0 ? 'down' : 'up');
                }
                
                if (moved) {
                    this.addRandomTile();
                    this.updateDisplay();
                    
                    if (this.isGameWon() && !this.won) {
                        this.won = true;
                        this.showWinScreen();
                    } else if (this.isGameOver()) {
                        this.over = true;
                        this.showGameOverScreen();
                    }
                }
            }
        }
    }

    move(direction) {
        const previousGrid = this.grid.map(row => [...row]);
        let moved = false;
        
        switch(direction) {
            case 'left':
                for (let i = 0; i < this.size; i++) {
                    const row = this.grid[i];
                    const newRow = this.slideAndMerge(row);
                    this.grid[i] = newRow;
                    if (!this.arraysEqual(row, newRow)) moved = true;
                }
                break;
            case 'right':
                for (let i = 0; i < this.size; i++) {
                    const originalRow = this.grid[i].slice();
                    const row = this.grid[i].slice().reverse();
                    const newRow = this.slideAndMerge(row).reverse();
                    this.grid[i] = newRow;
                    if (!this.arraysEqual(originalRow, newRow)) moved = true;
                }
                break;
            case 'up':
                for (let j = 0; j < this.size; j++) {
                    const column = [];
                    for (let i = 0; i < this.size; i++) {
                        column.push(this.grid[i][j]);
                    }
                    const newColumn = this.slideAndMerge(column);
                    for (let i = 0; i < this.size; i++) {
                        this.grid[i][j] = newColumn[i];
                    }
                    if (!this.arraysEqual(column, newColumn)) moved = true;
                }
                break;
            case 'down':
                for (let j = 0; j < this.size; j++) {
                    const column = [];
                    for (let i = 0; i < this.size; i++) {
                        column.push(this.grid[this.size - 1 - i][j]);
                    }
                    const newColumn = this.slideAndMerge(column).reverse();
                    for (let i = 0; i < this.size; i++) {
                        this.grid[i][j] = newColumn[i];
                    }
                    if (!this.arraysEqual(column, newColumn.reverse())) moved = true;
                }
                break;
        }
        
        return moved;
    }

    slideAndMerge(arr) {
        // Remove zeros
        let newArr = arr.filter(val => val !== 0);
        
        // Merge equal adjacent numbers
        for (let i = 0; i < newArr.length - 1; i++) {
            if (newArr[i] === newArr[i + 1]) {
                newArr[i] *= 2;
                this.score += newArr[i];
                newArr.splice(i + 1, 1);
            }
        }
        
        // Add zeros to the end
        while (newArr.length < this.size) {
            newArr.push(0);
        }
        
        return newArr;
    }

    arraysEqual(a, b) {
        for (let i = 0; i < a.length; i++) {
            if (a[i] !== b[i]) return false;
        }
        return true;
    }

    updateDisplay() {
        // Clear existing tiles
        const existingTiles = this.boardContainer.querySelectorAll('.tile');
        existingTiles.forEach(tile => tile.remove());
        
        // Create tiles for grid
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                if (this.grid[i][j] !== 0) {
                    this.createTile(this.grid[i][j], i, j);
                }
            }
        }
        
        // Update score
        this.scoreElement.textContent = this.score;
        
        // Update best score
        if (this.score > this.bestScore) {
            this.bestScore = this.score;
            this.bestScoreElement.textContent = this.bestScore;
            this.saveBestScore();
        }
    }

    createTile(value, row, col) {
        const tile = document.createElement('div');
        tile.className = 'tile tile-new';
        tile.setAttribute('data-value', value);
        
        const mandalaPattern = document.createElement('div');
        mandalaPattern.className = 'mandala-pattern';
        tile.appendChild(mandalaPattern);
        
        // Position the tile
        const cellSize = this.boardContainer.offsetWidth / this.size;
        const gap = 10;
        tile.style.left = `${col * cellSize + gap}px`;
        tile.style.top = `${row * cellSize + gap}px`;
        
        this.boardContainer.appendChild(tile);
        
        // Remove the new tile animation after it completes
        setTimeout(() => {
            tile.classList.remove('tile-new');
        }, 300);
    }

    isGameWon() {
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                if (this.grid[i][j] === 2048) {
                    return true;
                }
            }
        }
        return false;
    }

    isGameOver() {
        // Check for empty cells
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                if (this.grid[i][j] === 0) {
                    return false;
                }
            }
        }
        
        // Check for possible merges
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                const current = this.grid[i][j];
                
                // Check right
                if (j < this.size - 1 && this.grid[i][j + 1] === current) {
                    return false;
                }
                
                // Check down
                if (i < this.size - 1 && this.grid[i + 1][j] === current) {
                    return false;
                }
            }
        }
        
        return true;
    }

    showWinScreen() {
        this.overlayTitle.textContent = 'Congratulations!';
        this.overlayMessage.textContent = `You've reached the ultimate mandala! Score: ${this.score}`;
        document.getElementById('continue-btn').style.display = 'inline-block';
        this.showOverlay();
    }

    showGameOverScreen() {
        this.overlayTitle.textContent = 'Game Over';
        this.overlayMessage.textContent = `No more moves available. Final score: ${this.score}`;
        document.getElementById('continue-btn').style.display = 'none';
        this.showOverlay();
    }

    showOverlay() {
        this.overlayElement.classList.add('show');
    }

    hideOverlay() {
        this.overlayElement.classList.remove('show');
    }

    continueGame() {
        this.keepPlaying = true;
        this.hideOverlay();
    }

    loadBestScore() {
        const saved = localStorage.getItem('mandala2048-best-score');
        if (saved) {
            this.bestScore = parseInt(saved);
            this.bestScoreElement.textContent = this.bestScore;
        }
    }

    saveBestScore() {
        localStorage.setItem('mandala2048-best-score', this.bestScore.toString());
    }

    toggleTheme() {
        const body = document.body;
        const themeToggle = document.getElementById('theme-toggle');
        
        if (body.hasAttribute('data-theme')) {
            body.removeAttribute('data-theme');
            themeToggle.textContent = 'Dark Mode';
            localStorage.setItem('mandala2048-theme', 'light');
        } else {
            body.setAttribute('data-theme', 'dark');
            themeToggle.textContent = 'Light Mode';
            localStorage.setItem('mandala2048-theme', 'dark');
        }
    }

    loadTheme() {
        const savedTheme = localStorage.getItem('mandala2048-theme');
        if (savedTheme === 'dark') {
            document.body.setAttribute('data-theme', 'dark');
            document.getElementById('theme-toggle').textContent = 'Light Mode';
        }
    }
}

// Initialize the game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const game = new Mandala2048();
    game.loadTheme();
});

// Add visual feedback for tile merges
function addMergeAnimation(tile) {
    tile.classList.add('tile-merged');
    setTimeout(() => {
        tile.classList.remove('tile-merged');
    }, 300);
}

// Sound effects (using Web Audio API for simple chimes)
class SoundEffects {
    constructor() {
        this.audioContext = null;
        this.enabled = true;
        this.initAudio();
    }

    initAudio() {
        try {
            window.AudioContext = window.AudioContext || window.webkitAudioContext;
            this.audioContext = new AudioContext();
        } catch (e) {
            console.log('Web Audio API not supported');
            this.enabled = false;
        }
    }

    playMergeSound(value) {
        if (!this.enabled || !this.audioContext) return;
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        // Different frequencies for different values
        const baseFrequency = 200;
        const frequency = baseFrequency + (Math.log2(value) * 50);
        
        oscillator.frequency.value = frequency;
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + 0.3);
    }

    playMoveSound() {
        if (!this.enabled || !this.audioContext) return;
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.frequency.value = 300;
        oscillator.type = 'triangle';
        
        gainNode.gain.setValueAtTime(0.05, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + 0.1);
    }

    toggle() {
        this.enabled = !this.enabled;
    }
}

// Create a global sound effects instance
const soundEffects = new SoundEffects();

// Add vibration feedback for mobile devices
function vibrate(duration = 50) {
    if ('vibrate' in navigator) {
        navigator.vibrate(duration);
    }
}

// Add pulse effect for score updates
function pulseScore() {
    const scoreElement = document.getElementById('score');
    scoreElement.style.transform = 'scale(1.2)';
    scoreElement.style.transition = 'transform 0.2s ease';
    
    setTimeout(() => {
        scoreElement.style.transform = 'scale(1)';
    }, 200);
}
