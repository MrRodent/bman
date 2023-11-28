import { ctx, tileSize, scale, canvas, deltaTime } from "./main.js";
import { levelWidth } from "./gamestate.js";
import { players } from "./player.js";
import { getTileFromWorldLocation, lerp } from "./utils.js";
import { isMobile } from "./mobile.js";

export let cameraX = 0;
export function setCameraX(value) {
    cameraX = value;
}
let cameraLt = 0;
let cameraRt = 0;
let cameraPt = 0;
const followCameraSpeed = 0.05;
const edgeCameraSpeed = 0.25;

let targetOffset;
let edgeOffset;

export function updateCamera()
{

    const playerTile = getTileFromWorldLocation(players[0]);
    const playerX = playerTile.x / tileSize;

    // Left edge
    if (playerX <= edgeOffset) {
        cameraPt = 0;

        cameraLt += deltaTime * edgeCameraSpeed;
        cameraLt = Math.min(cameraLt, 1);
        const targetX = 0;
        cameraX = lerp(cameraX, targetX, cameraLt);

        ctx.setTransform(scale, 0, 0, scale, cameraX, 0);

    // Right edge
    } else if (playerX >= levelWidth - edgeOffset) {
        cameraPt = 0;

        cameraRt += deltaTime * edgeCameraSpeed;
        cameraRt = Math.min(cameraRt, 1);

        const targetX = canvas.width / 2 - scale * (levelWidth - targetOffset) * tileSize;
        cameraX = lerp(cameraX, targetX, cameraRt);

        ctx.setTransform(scale, 0, 0, scale, cameraX, 0);

    // Follow camera
    } else {
        cameraLt = 0;
        cameraRt = 0;

        cameraPt += deltaTime * followCameraSpeed;
        cameraPt = Math.min(cameraPt, 1);

        const targetX = canvas.width / 2 - scale * players[0].x;
        cameraX = lerp(cameraX, targetX, cameraPt);

        ctx.setTransform(scale, 0, 0, scale, cameraX, 0);
    }

    //ctx.setTransform(scale, 0, 0, scale, canvas.width/2 - scale * players[0].x, canvas.height/2 - scale * players[0].y);
}

export function setCameraOffsets() {
    if (isMobile) {
        console.info("camera: mobile offsets");
        targetOffset = 3;
        edgeOffset = 2;
    } else {
        console.info("camera: normal offsets");
        targetOffset = 6.5;
        edgeOffset = 6;
    }
}