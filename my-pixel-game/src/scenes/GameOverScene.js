import * as Phaser from 'phaser';

export default class GameOverScene extends Phaser.Scene {
    constructor() {
        super('GameOverScene');
    }

    init(data) {
        // Nhận tên của cái Room hiện tại (VD: 'Room101') để biết đường mà Restart
        this.previousScene = data.previousScene; 
    }

    create() {
        // 1. Lấy chiều rộng và cao của toàn bộ màn hình game
        const width = this.scale.width;
        const height = this.scale.height;

        // TẠO LỚP CHE MỜ CHUẨN XÁC VÀ GHIM CỨNG LẠI
        const overlay = this.add.rectangle(0, 0, width, height, 0x000000, 0.7);
        overlay.setOrigin(0, 0);
        overlay.setScrollFactor(0); // Ghim chặt lên màn hình, không trôi theo camera

        this.add.text(width / 2, height / 3, 'GAME OVER', {
            fontSize: '64px', 
            fill: '#ff0000', 
            fontFamily: 'Courier', 
            fontStyle: 'bold',
            stroke: '#000',
            strokeThickness: 6
        }).setOrigin(0.5);

        // 3. Tạo 2 nút bấm
        const restartBtn = this.createButton(400, 320, '[ RESTART ROOM ]', '#ffffff');
        const roomSelectBtn = this.createButton(400, 400, '[ ROOM SELECT ]', '#ffffff');

        // 4. Logic nút RESTART (Dừng scene cũ -> Bật lại scene cũ -> Tắt bảng Game Over)
        restartBtn.on('pointerdown', () => {
            if (this.previousScene) {
                this.scene.stop(this.previousScene); 
                this.scene.start(this.previousScene); 
                this.scene.stop(); 
            }
        });

        // 5. Logic nút ROOM SELECT (Tắt scene cũ -> Về màn chọn phòng -> Tắt bảng Game Over)
        roomSelectBtn.on('pointerdown', () => {
            if (this.previousScene) {
                this.scene.stop(this.previousScene);
            }
            this.scene.start('RoomSelectScene'); // Gọi về Scene Chọn Phòng của bạn
            this.scene.stop();
        });
    }

    // Hàm tạo nút bấm có hiệu ứng hover giống hệt PauseScene của bạn
    createButton(x, y, text, color) {
        const btn = this.add.text(x, y, text, {
            fontSize: '28px', fill: color, fontFamily: 'Courier'
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        btn.on('pointerover', () => btn.setStyle({ shadow: { blur: 10, color: '#fff', fill: true } }));
        btn.on('pointerout', () => btn.setStyle({ shadow: { blur: 0 } }));
        return btn;
    }
}