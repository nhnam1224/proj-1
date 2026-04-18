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
        
        // --- CÁC FRAME CỦA SOLDIER (Kích thước mỗi frame là 100x100 theo tên folder) ---
        this.load.spritesheet('soldier_idle', 'characters/soldiers/Characters(100x100)/Soldier/Soldier with shadows/Soldier-Idle.png', { frameWidth: 100, frameHeight: 100 });
        this.load.spritesheet('soldier_walk', 'characters/soldiers/Characters(100x100)/Soldier/Soldier with shadows/Soldier-Walk.png', { frameWidth: 100, frameHeight: 100 });
        this.load.spritesheet('soldier_attack', 'characters/soldiers/Characters(100x100)/Soldier/Soldier with shadows/Soldier-Attack01.png', { frameWidth: 100, frameHeight: 100 });
        this.load.spritesheet('soldier_attack2', 'characters/soldiers/Characters(100x100)/Soldier/Soldier with shadows/Soldier-Attack02.png', { frameWidth: 100, frameHeight: 100 });
        this.load.spritesheet('soldier_attack3', 'characters/soldiers/Characters(100x100)/Soldier/Soldier with shadows/Soldier-Attack03.png', { frameWidth: 100, frameHeight: 100 });
        this.load.spritesheet('soldier_death', 'characters/soldiers/Characters(100x100)/Soldier/Soldier with shadows/Soldier-Death.png', { frameWidth: 100, frameHeight: 100 });
        this.load.spritesheet('soldier_hurt', 'characters/soldiers/Characters(100x100)/Soldier/Soldier with shadows/Soldier-Hurt.png', { frameWidth: 100, frameHeight: 100 });

        // --- CÁC FRAME CỦA ORC ---
        this.load.spritesheet('orc_idle', 'characters/soldiers/Characters(100x100)/Orc/Orc with shadows/Orc-Idle.png', { frameWidth: 100, frameHeight: 100 });
        this.load.spritesheet('orc_walk', 'characters/soldiers/Characters(100x100)/Orc/Orc with shadows/Orc-Walk.png', { frameWidth: 100, frameHeight: 100 });
        this.load.spritesheet('orc_hurt', 'characters/soldiers/Characters(100x100)/Orc/Orc with shadows/Orc-Hurt.png', { frameWidth: 100, frameHeight: 100 });
        this.load.spritesheet('orc_death', 'characters/soldiers/Characters(100x100)/Orc/Orc with shadows/Orc-Death.png', { frameWidth: 100, frameHeight: 100 });
        this.load.spritesheet('orc_attack', 'characters/soldiers/Characters(100x100)/Orc/Orc with shadows/Orc-Attack01.png', { frameWidth: 100, frameHeight: 100 });
        this.load.spritesheet('orc_attack2', 'characters/soldiers/Characters(100x100)/Orc/Orc with shadows/Orc-Attack02.png', { frameWidth: 100, frameHeight: 100 });

        // 3. Tải hình kẻ địch, âm thanh, v.v... sau này thêm vào đây
        this.load.spritesheet('arrow', 'characters/soldiers/Arrow(Projectile)/Arrow01(100x100).png', { frameWidth: 100, frameHeight: 100 });
    }
    create() {
        // Ngay khi preload() chạy xong 100%, hàm create() sẽ được gọi
        // Lúc này dữ liệu đã sẵn sàng, ta chuyển người chơi sang màn hình Menu
        this.scene.start('MenuScene');
    }
}