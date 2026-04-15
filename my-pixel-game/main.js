import * as Phaser from 'phaser';
import MenuScene from './src/scenes/MenuScene.js';
import PauseScene from './src/scenes/PauseScene.js';
import FloorSelectScene from './src/scenes/FloorSelectScene.js';
import RoomSelectScene from './src/scenes/RoomSelectScene.js';
import Room101Scene from './src/scenes/Floor1/Room101.js';

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'game-container',
    pixelArt: true,
    backgroundColor: '#050505',

    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 800 },
            debug: false
        }
    },
    // The order determines which scene starts first
    scene: [MenuScene, FloorSelectScene, RoomSelectScene, PauseScene, Room101Scene]
};

new Phaser.Game(config);