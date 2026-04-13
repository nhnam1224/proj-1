import * as Phaser from 'phaser';

export default class Room101Scene extends Phaser.Scene {
    constructor() {
        super('Room101Scene');
    }

    init() {
        this.playerSpeed = 150;
        this.isUVActive = false;
    }

    preload() {
        // Assets will be loaded here later
    }

    create() {
        this.input.keyboard.on('keydown-ESC', () => {
            this.scene.pause(); // Dừng phòng hiện tại
            this.scene.launch('PauseScene'); // Chạy đè PauseScene lên trên
            this.scene.bringToTop('PauseScene'); // Đảm bảo PauseScene ở trên cùng
        });

        // 1. Create Player (Placeholder)
        this.player = this.add.rectangle(400, 500, 32, 32, 0xffffff);
        this.physics.add.existing(this.player);
        this.player.body.setCollideWorldBounds(true);

        // 2. Controls
        this.cursors = this.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D
        });

        // 3. Logic for Rule 1: UV Light (Mockup timer)
        this.time.addEvent({
            delay: 5000,
            callback: this.toggleUVLight,
            callbackScope: this,
            loop: true
        });
    }

    toggleUVLight() {
        this.isUVActive = !this.isUVActive;
        if (this.isUVActive) {
            this.cameras.main.setBackgroundColor('#2e004d'); // Purple tint
            console.log("UV ACTIVE: DO NOT MOVE!");
        } else {
            this.cameras.main.setBackgroundColor('#050505');
        }
    }

    update() {
        this.player.body.setVelocity(0);

        // Movement Logic
        let moving = false;
        if (this.cursors.left.isDown) { this.player.body.setVelocityX(-this.playerSpeed); moving = true; }
        else if (this.cursors.right.isDown) { this.player.body.setVelocityX(this.playerSpeed); moving = true; }

        if (this.cursors.up.isDown) { this.player.body.setVelocityY(-this.playerSpeed); moving = true; }
        else if (this.cursors.down.isDown) { this.player.body.setVelocityY(this.playerSpeed); moving = true; }

        this.player.body.velocity.normalize().scale(this.playerSpeed);

        // Check Rule 1: Moving during UV
        if (this.isUVActive && moving) {
            console.warn("BREACH DETECTED: Health reduced!");
            // Add health reduction logic here
        }
    }
}