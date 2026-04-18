import * as Phaser from 'phaser';

export default class VictoryScene extends Phaser.Scene {
    constructor() {
        super('VictoryScene');
    }

    init(data) {
        this.currentScene = data.currentScene; // VD: 'Room101'
        this.nextScene = data.nextScene;       // VD: 'Room102'
    }

    create() {
        const width = this.scale.width;
        const height = this.scale.height;

        // Lớp mờ che màn chơi (Ghim cứng màn hình)
        const overlay = this.add.rectangle(0, 0, width, height, 0x000000, 0.7);
        overlay.setOrigin(0, 0);
        overlay.setScrollFactor(0); 

        // Chữ ROOM CLEARED màu vàng
        this.add.text(width / 2, height / 3, 'ROOM CLEARED!', {
            fontSize: '60px', 
            fill: '#ffd700', // Màu vàng Gold
            fontFamily: 'Courier', 
            fontStyle: 'bold',
            stroke: '#000',
            strokeThickness: 6
        }).setOrigin(0.5);

        // Tạo 2 nút bấm
        const nextRoomBtn = this.createButton(width / 2, height / 2, '[ NEXT ROOM ]', '#ffffff');
        const roomSelectBtn = this.createButton(width / 2, height / 2 + 80, '[ ROOM SELECT ]', '#ffffff');

        // Logic sang phòng tiếp theo
        nextRoomBtn.on('pointerdown', () => {
            if (this.currentScene) this.scene.stop(this.currentScene); 
            
            // Nếu có truyền tên phòng tiếp theo thì chuyển tới đó, nếu không thì về Menu
            if (this.nextScene) {
                this.scene.start(this.nextScene); 
            } else {
                this.scene.start('RoomSelectScene'); 
            }
            this.scene.stop(); 
        });

        // Logic về màn chọn phòng
        roomSelectBtn.on('pointerdown', () => {
            if (this.currentScene) this.scene.stop(this.currentScene);
            this.scene.start('RoomSelectScene'); // Gọi về Scene Chọn Phòng của bạn
            this.scene.stop();
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