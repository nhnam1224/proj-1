// src/scenes/HelpScene.js
import * as Phaser from 'phaser';

export default class HelpScene extends Phaser.Scene {
    constructor() {
        super('HelpScene');
    }

    init(data) {
        // Nếu không có ai truyền data (ví dụ ấn trực tiếp từ Menu), mặc định là 'MenuScene'
        this.caller = data.from || 'MenuScene'; 
    }

    create() {
        this.add.rectangle(400, 300, 800, 600, 0x000000, 1);
        
        // 1. Tiêu đề
        this.add.text(400, 80, 'HOW TO PLAY', {
            fontSize: '40px', fill: '#8b0000', fontFamily: 'Courier', fontStyle: 'bold'
        }).setOrigin(0.5);

        // 2. Nội dung hướng dẫn điều khiển (Tiếng Anh)
        const controlsText = `
        [ CONTROLS ]
        - A / D  : Move Left / Right
        - W      : Jump
        - S      : Crouch
        - SPACE  : Shoot
        - 1 -> 6 : Switch Weapon
        - ESC    : Pause
        `;
        
        this.add.text(400, 220, controlsText, {
            fontSize: '24px', fill: '#ffffff', fontFamily: 'Courier', align: 'left'
        }).setOrigin(0.5);

        // 4. Nút quay lại Menu (Tiếng Anh)
        const backBtn = this.add.text(400, 530, '< BACK TO MENU', {
            fontSize: '28px', fill: '#888', fontFamily: 'Courier'
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        // Hiệu ứng hover cho nút quay lại
        backBtn.on('pointerover', () => backBtn.setStyle({ fill: '#ffffff' }));
        backBtn.on('pointerout', () => backBtn.setStyle({ fill: '#888' }));
        
        // Sự kiện click
        backBtn.on('pointerdown', () => {
            if (this.caller === 'MenuScene') {
                // Nếu gọi từ Menu, chuyển cảnh hoàn toàn về Menu
                this.scene.start('MenuScene');
            } else {
                // Nếu gọi từ Pause (hoặc scene khác), tắt Help đi và tiếp tục scene cũ
                this.scene.stop(); 
                this.scene.resume(this.caller); 
            }
        });
    }
}