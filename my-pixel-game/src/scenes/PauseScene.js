import * as Phaser from 'phaser';

export default class PauseScene extends Phaser.Scene {
    constructor() {
        super('PauseScene');
    }

    create() {
        // 1. Dark overlay
        this.add.rectangle(400, 300, 800, 600, 0x000000, 0.7);

        this.add.text(400, 150, 'PAUSED', {
            fontSize: '40px', fill: '#ffffff', fontFamily: 'Courier'
        }).setOrigin(0.5);

        // 2. Buttons
        const resumeBtn = this.createButton(400, 250, '[ RESUME ]', '#ffffff');
        const helpBtn = this.createButton(400, 330, '[ HELP ]', '#ffffff');
        const backBtn = this.createButton(400, 410, '[ BACK TO MENU ]', '#ff0000');

        // 3. Button Logic
        resumeBtn.on('pointerdown', () => {
            // Find which scene is currently paused and resume it
            const currentRoom = this.scene.manager.getScenes(true).find(s => s.scene.key !== 'PauseScene');
            if (currentRoom) {
                this.scene.resume(currentRoom.scene.key);
                this.scene.stop();
            }
        });

        helpBtn.on('pointerdown', () => {
            alert("QUARANTINE RULES:\n1. UV Light -> STOP.\n2. Room 3 -> DO NOT OPEN.\n3. Noise -> LOOK AT IT.");
        });

        backBtn.on('pointerdown', () => {
            this.scene.stop();
            // Stop all other scenes and go to Menu
            this.scene.manager.getScenes(true).forEach(s => this.scene.stop(s.scene.key));
            this.scene.start('MenuScene');
        });
    }

    createButton(x, y, text, color) {
        const btn = this.add.text(x, y, text, {
            fontSize: '28px', fill: color, fontFamily: 'Courier'
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        btn.on('pointerover', () => btn.setStyle({ shadow: { blur: 10, color: '#fff', fill: true } }));
        btn.on('pointerout', () => btn.setStyle({ shadow: { blur: 0 } }));
        return btn;
    }
}