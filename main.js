////////////////////
// Imports
import { createTiles } from "./tile.js";
import { createPowerups } from "./tile.js"; // TODO: Antaa virhettä jos saman funktion importtaa powerup.js?
import { renderLevel } from "./level.js";
import { renderPowerups } from "./level.js"; // sama tässä
import { renderPlayer } from "./player.js";
import { renderEnemies, spawnEnemies } from "./enemy.js";
import { renderBombs, renderExplosions } from "./bomb.js";

////////////////////
// Globals
export let canvas;
export let ctx;
export let level = [];
export let powerups = [];

////////////////////
// Settings
export const tileSize = 32;
export const levelWidth = 25;
export const levelHeight = 25;
export const softTilePercent = 0.1;
export const powerUpCount = 3;

////////////////////
// Assets
export let spriteSheet = document.getElementById("sprite-sheet");

////////////////////
// Render
let lastTimeStamp = 0;
function Render(timeStamp)
{
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const deltaTime = (timeStamp - lastTimeStamp) / 1000;
    const fps = 1 / deltaTime;

    renderLevel();
    renderPowerups();
    renderEnemies(deltaTime);
    renderBombs();
    renderExplosions();
    renderPlayer(deltaTime);

    // 
    ctx.fillStyle = "#a2f3a2";
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 2;
    ctx.font = "24px Arial";
    ctx.strokeText("FPS: " + fps.toFixed(1), canvas.width - 125, 25);
    ctx.fillText("FPS: " + fps.toFixed(1), canvas.width - 125, 25);
    ctx.strokeText("dt:  " + (deltaTime*1000).toFixed(2) + "ms", canvas.width - 125, 50);
    ctx.fillText("dt:  " + (deltaTime*1000).toFixed(2) + "ms", canvas.width - 125, 50);
    //

    lastTimeStamp = timeStamp

    requestAnimationFrame(Render);
}

////////////////////
// DOM
document.addEventListener("DOMContentLoaded", function ()
{
    canvas = document.getElementById("canvas");
    if (canvas) {
        ctx = canvas.getContext("2d");
        if (ctx) {
            level = createTiles();
            powerups = createPowerups(level);
            if (level.length > 0) {
                spawnEnemies();
            } else {
                console.error("Failed to create level");
            }

            Render();
        } else {
            console.error("Could not find ctx object.");
        }
    } else {
        console.error("Could not find canvas object.");
    }
});

