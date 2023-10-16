import { PlayAudio } from "./audio.js";
import { clearBombs } from "./bomb.js";
import { exit, newLevel } from "./main.js";
import { updateLevelDisplay, updateScoreDisplay } from "./page.js";
import { players } from "./player.js";
import { exitLocation} from "./tile.js";

export let pause = false;

export class Game {
    constructor() {
        this.score = 0;
        this.level = 1;
        this.numOfEnemies = -1;
        this.firstBombExploded = false;
        this.isPaused = false;
    }

    init() {
        this.numOfEnemies = 0;
        // TODO: Escin kuuntelija (ehkä muualle?)
        document.addEventListener('keyup', function(event) {
            if (event.key === 'Escape') {
                this.isPaused = !this.isPaused;
                console.log("pause", this.isPaused);
            }
        });
    }
    
    increaseScore(points) {
        this.score += points;
        updateScoreDisplay(this.score);
    }
    
    async fetchLevelData() {
        const response = await fetch("levels.json");
        const data = await response.json();
        console.info("level", this.level, data[this.level]);
        return data[this.level];
    }
    
    nextLevel() {
        this.level++;
        updateLevelDisplay(this.level);
        clearBombs();
        this.saveGame();
        newLevel();
    }
    
    increaseEnemies() {
        this.numOfEnemies++;
    }
    
    decreaseEnemies() {
        this.numOfEnemies--;
    }
    
    toggleDoor() {
        exitLocation.isOpen = !exitLocation.isOpen;
        console.log("toggle")
        
        if (exitLocation.isOpen) {
            exit.playAnimation();
        } else {
            exit.init();
        }
    }

    checkGameState() {
        if (this.numOfEnemies === 0 && exitLocation.isOpen === false) {
            this.toggleDoor();
            PlayAudio("assets/audio/exitopen01.wav");
        }
    }

    // Saving & loading
    saveGame() {
        // Save the display
        localStorage.setItem("level-number", this.level);
        localStorage.setItem("score", this.score);
        localStorage.setItem("players", JSON.stringify(players));
    }
    
    loadGame() {
        if (localStorage.length != 0) {
            // Load the display
            this.level = parseInt(localStorage.getItem("level-number"));
            this.score = parseInt(localStorage.getItem("score"));
            updateLevelDisplay(this.level);
            updateScoreDisplay(this.score);
            
            const loadedPlayers = JSON.parse(localStorage.getItem("players"));
            loadPowerups(loadedPlayers);
        }
    }
}

function loadPowerups(loadedPlayers) {
    for (let i = 0; i < players.length; i++) {
        players[i].speed = loadedPlayers[i].speed;
        players[i].powerup.maxBombs = loadedPlayers[i].powerup.maxBombs;
        players[i].powerup.maxRange = loadedPlayers[i].powerup.maxRange;

        console.info("LOADED PLAYER", i+1, "\nSpeed:", players[i].speed, "Bombs:", players[i].powerup.maxBombs, "Range:", players[i].powerup.maxRange)
    }
}