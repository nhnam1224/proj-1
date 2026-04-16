import * as Phaser from 'phaser';

export default class MenuScene extends Phaser.Scene {
    constructor() {
        super('MenuScene');
    }

    create() {
        this.add.text(400, 150, '????????? ????? ?????', {
            fontSize: '48px',
            fill: '#8b0000',
            fontFamily: 'Courier',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        this.add.text(400, 200, 'J??k t?? R??p?r - Z?di?? ?il?? - A?L??d?N', {
            fontSize: '18px',
            fill: '#555555',
            fontFamily: 'Courier'
        }).setOrigin(0.5);

        const playBtn = this.add.text(400, 300, '[ PLAY ]', {
            fontSize: '32px', fill: '#ffffff', fontFamily: 'Courier'
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        const settingsBtn = this.add.text(400, 380, '[ SETTINGS ]', {
            fontSize: '32px', fill: '#ffffff', fontFamily: 'Courier'
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        const helpBtn = this.add.text(400, 460, '[ HELP ]', {
            fontSize: '32px', fill: '#ffffff', fontFamily: 'Courier'
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        const aboutBtn = this.add.text(400, 540, '[ ABOUT ]', {
            fontSize: '32px', fill: '#ffffff', fontFamily: 'Courier'
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        const buttons = [playBtn, settingsBtn, helpBtn, aboutBtn];
        buttons.forEach(btn => {
            btn.on('pointerover', () => btn.setStyle({ fill: '#ff0000' }));
            btn.on('pointerout', () => btn.setStyle({ fill: '#ffffff' }));
        });

        playBtn.on('pointerdown', () => {
            this.scene.start('FloorSelectScene');
        });

        settingsBtn.on('pointerdown', () => alert('Settings - Coming soon!'));
        helpBtn.on('pointerdown', () => {
            this.scene.start('HelpScene');
        });

        aboutBtn.on('pointerdown', () => {
            this.scene.start('AboutScene');
        });
    }
}