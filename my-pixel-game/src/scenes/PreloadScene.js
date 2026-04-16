// src/scenes/PreloadScene.js
import * as Phaser from 'phaser';

export default class PreloadScene extends Phaser.Scene {
    constructor() {
        super('PreloadScene');
    }

    preload() {
        // Có thể làm một dòng chữ "Loading..." ở giữa màn hình
        this.add.text(400, 300, 'ĐANG TẢI DỮ LIỆU...', { 
            fontSize: '32px', fill: '#ffffff', fontFamily: 'Courier' 
        }).setOrigin(0.5);

        // ----------------------------------------------------
        // TẢI TẤT CẢ HÌNH ẢNH, ÂM THANH CỦA TOÀN BỘ GAME Ở ĐÂY
        // ----------------------------------------------------
        
        // 1. Tải hình nhân vật
        this.load.spritesheet('player_img', 'characters/main/ActionDude-Spritesheet1.png', { 
            frameWidth: 16, 
            frameHeight: 16 
        });

        // 2. Tải hình viên đạn (Hãy chỉnh lại đường dẫn sao cho đúng với nơi bạn lưu ảnh nhé)
        this.load.spritesheet('fire_bullet', 'assets/animations/bullets/All_Fire_Bullet_Pixel_16x16.png', { 
            frameWidth: 16, 
            frameHeight: 16 
        });

        // 3. Tải hình kẻ địch, âm thanh, v.v... sau này thêm vào đây
    }

    create() {
        // Ngay khi preload() chạy xong 100%, hàm create() sẽ được gọi
        // Lúc này dữ liệu đã sẵn sàng, ta chuyển người chơi sang màn hình Menu
        this.scene.start('MenuScene');
    }
}