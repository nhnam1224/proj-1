import * as Phaser from 'phaser';

export default class PauseScene extends Phaser.Scene {
    constructor() {
        super('PauseScene');
    }

    init(data) {
        this.previousScene = data.previousScene; 
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
        const restartBtn = this.createButton(400, 410, '[ RESTART ]', '#ffffff');
        const backBtn = this.createButton(400, 500, '[ BACK TO ROOM SELECT ]', '#ff0000');

        // 3. Button Logic
        resumeBtn.on('pointerdown', () => {
            // Find which scene is currently paused and resume it
            if (this.previousScene) {
                this.scene.resume(this.previousScene);
                this.scene.stop(); // Tắt bảng Pause
            }
        });

        helpBtn.on('pointerdown', () => {
            this.scene.pause(); 
            
            // Gọi HelpScene đè lên và báo cho nó biết mình là PauseScene
            this.scene.launch('HelpScene', { from: 'PauseScene' }); 
            this.scene.bringToTop('HelpScene');
        });

        restartBtn.on('pointerdown', () => {
            if (this.previousScene) {
                // 1. Dừng hẳn cái scene cũ (Room101) đang bị Pause ở bên dưới
                this.scene.stop(this.previousScene); 
                
                // 2. Chạy lại scene đó từ đầu (reset lại toàn bộ vị trí, quái, máu...)
                this.scene.start(this.previousScene); 
                
                // 3. Tắt luôn cái bảng Pause này đi
                this.scene.stop(); 
            }
        });

        backBtn.on('pointerdown', () => {
            // Tìm tất cả các scene đang chạy
            const allScenes = this.scene.manager.getScenes(false); 
            allScenes.forEach(s => {
                this.scene.stop(s.scene.key); // Dừng và giải phóng mọi scene
            });
            this.scene.start('RoomSelectScene');
        });

        this.input.keyboard.on('keydown-ESC', () => {
            if (this.previousScene) {
                this.scene.resume(this.previousScene);
                this.scene.stop(); // Tắt bảng Pause
            }
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