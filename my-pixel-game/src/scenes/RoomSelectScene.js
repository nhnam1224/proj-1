import * as Phaser from 'phaser';

export default class RoomSelectScene extends Phaser.Scene {
    constructor() {
        super('RoomSelectScene');
    }

    init(data) {
        this.selectedFloor = data.floor || 1;
    }

    create() {
        this.add.text(400, 80, `FLOOR ${this.selectedFloor}: SELECT ROOM`, { 
            fontSize: '32px', fill: '#8b0000', fontFamily: 'Courier' 
        }).setOrigin(0.5);

        // Tạo danh sách phòng X01 -> X05
        for (let i = 1; i <= 5; i++) {
            const roomNumber = this.selectedFloor * 100 + i;
            const btn = this.add.text(400, 180 + (i * 60), `ROOM ${roomNumber}`, {
                fontSize: '28px', fill: '#ffffff', fontFamily: 'Courier'
            }).setOrigin(0.5).setInteractive({ useHandCursor: true });

            btn.on('pointerover', () => btn.setStyle({ fill: '#ff0000' }));
            btn.on('pointerout', () => btn.setStyle({ fill: '#ffffff' }));

            btn.on('pointerdown', () => {
                if (roomNumber === 101) {
                    this.scene.start('Room101Scene');
                } else {
                    alert(`Room ${roomNumber} is currently under construction!`);
                }
            });
        }

        const backBtn = this.add.text(400, 550, '< BACK TO FLOORS', { fontSize: '20px', fill: '#888' }).setOrigin(0.5).setInteractive({ useHandCursor: true });
        backBtn.on('pointerdown', () => this.scene.start('FloorSelectScene'));
    }
}