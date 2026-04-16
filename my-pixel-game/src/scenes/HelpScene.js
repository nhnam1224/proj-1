// src/scenes/HelpScene.js
import * as Phaser from 'phaser';

export default class HelpScene extends Phaser.Scene {
    constructor() {
        super('HelpScene');
    }

    create() {
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

        // 3. Luật sinh tồn (Giữ nguyên bản tiếng Anh cực ngầu của bạn)
        // const rulesText = `
        // [ QUARANTINE RULES ]
        // 1. UV Light -> STOP.
        // 2. Room 3 -> DO NOT OPEN.
        // 3. Noise -> LOOK AT IT.
        // `;

        // this.add.text(400, 400, rulesText, {
        //     fontSize: '24px', fill: '#ff5555', fontFamily: 'Courier', align: 'left'
        // }).setOrigin(0.5);

        // 4. Nút quay lại Menu (Tiếng Anh)
        const backBtn = this.add.text(400, 530, '< BACK TO MENU', {
            fontSize: '28px', fill: '#888', fontFamily: 'Courier'
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        // Hiệu ứng hover cho nút quay lại
        backBtn.on('pointerover', () => backBtn.setStyle({ fill: '#ffffff' }));
        backBtn.on('pointerout', () => backBtn.setStyle({ fill: '#888' }));
        
        // Sự kiện click
        backBtn.on('pointerdown', () => {
            this.scene.start('MenuScene');
        });
    }
}