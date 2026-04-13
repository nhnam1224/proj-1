import * as Phaser from 'phaser';

export default class FloorSelectScene extends Phaser.Scene {
    constructor() {
        super('FloorSelectScene');
    }

    create() {
        this.add.text(400, 100, 'SELECT FLOOR', { fontSize: '40px', fill: '#8b0000', fontFamily: 'Courier' }).setOrigin(0.5);

        const floors = [1, 2, 3];
        floors.forEach((floor, index) => {
            const btn = this.add.text(400, 250 + (index * 80), `FLOOR ${floor}`, {
                fontSize: '32px', fill: '#ffffff', fontFamily: 'Courier'
            }).setOrigin(0.5).setInteractive({ useHandCursor: true });

            btn.on('pointerover', () => btn.setStyle({ fill: '#ff0000' }));
            btn.on('pointerout', () => btn.setStyle({ fill: '#ffffff' }));
            
            // Chuyển sang màn chọn phòng của tầng đó
            btn.on('pointerdown', () => this.scene.start('RoomSelectScene', { floor: floor }));
        });

        const backBtn = this.add.text(400, 530, '< BACK', { fontSize: '24px', fill: '#888' }).setOrigin(0.5).setInteractive({ useHandCursor: true });
        backBtn.on('pointerdown', () => this.scene.start('MenuScene'));
    }
}