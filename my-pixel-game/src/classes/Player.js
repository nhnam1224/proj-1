import * as Phaser from 'phaser';
import Bullet from '../weapons/Bullet.js';

export default class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture) {
        // Tạm thời dùng hình chữ nhật trắng nếu chưa có sprite
        super(scene, x, y, texture);
        
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setScale(4);
        
        // Vẽ một hình chữ nhật giả làm nhân vật
        // this.graphics = scene.add.graphics();
        // this.graphics.fillStyle(0xffffff, 1);
        // this.graphics.fillRect(-16, -24, 32, 48); // Kích thước 32x48
        
        this.body.setSize(10, 16);
        this.setCollideWorldBounds(true);

        // Các chỉ số cơ bản
        this.speed = 200;
        this.jumpForce = -500;
        this.isCrouching = false;

        // Khai báo bộ phím chuẩn theo yêu cầu
        this.keys = scene.input.keyboard.addKeys({
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D,
            jump: Phaser.Input.Keyboard.KeyCodes.W,
            crouch: Phaser.Input.Keyboard.KeyCodes.S,
            shoot: Phaser.Input.Keyboard.KeyCodes.SPACE,
            skill1: Phaser.Input.Keyboard.KeyCodes.U,
            skill2: Phaser.Input.Keyboard.KeyCodes.I,
            skill3: Phaser.Input.Keyboard.KeyCodes.O,
            wep1: Phaser.Input.Keyboard.KeyCodes.ONE,
            wep2: Phaser.Input.Keyboard.KeyCodes.TWO,
            wep3: Phaser.Input.Keyboard.KeyCodes.THREE,
            wep4: Phaser.Input.Keyboard.KeyCodes.FOUR,
            wep5: Phaser.Input.Keyboard.KeyCodes.FIVE,
            wep6: Phaser.Input.Keyboard.KeyCodes.SIX
        });

        // Bắt sự kiện bấm phím 1 lần (để không bị spam khi đè phím)
        scene.input.keyboard.on('keydown-SPACE', () => this.shoot());
        scene.input.keyboard.on('keydown-U', () => this.castSkill('U'));
        scene.input.keyboard.on('keydown-I', () => this.castSkill('I'));
        scene.input.keyboard.on('keydown-O', () => this.castSkill('O'));
        
        for (let i = 1; i <= 6; i++) {
            scene.input.keyboard.on(`keydown-${i}`, () => this.switchWeapon(i));
        }
    }

    preUpdate(time, delta) {
        super.preUpdate(time, delta);
        
        // Đồng bộ cái hình vẽ vuông với body vật lý
        // this.graphics.setPosition(this.x, this.y);
        let isMoving = false;
        this.setVelocityX(0);

        // A và D: Di chuyển trái/phải
        if (this.keys.left.isDown && !this.isCrouching) {
            this.setVelocityX(-this.speed);
            this.flipX = true;
            isMoving = true;
        } else if (this.keys.right.isDown && !this.isCrouching) {
            this.setVelocityX(this.speed);
            this.flipX = false;
            isMoving = true;
        }

        // --- XỬ LÝ ANIMATION ---
        // Chỉ chạy animation đi/đứng khi đang chạm đất và không cúi
        if (this.body.blocked.down && !this.isCrouching) {
            // Kiểm tra xem animation đã được tạo trong Scene chưa để tránh lỗi
            if (this.anims.animationManager.exists('walk') && this.anims.animationManager.exists('idle')) {
                if (isMoving) {
                    this.anims.play('walk', true); 
                } else {
                    this.anims.play('idle', true);
                }
            }
        }

        // S: Cúi xuống (Cúi thì không cho đi)
        if (this.keys.crouch.isDown) {
            if (!this.isCrouching) {
                this.isCrouching = true;
                this.body.setSize(32, 24); // Thu nhỏ hitbox còn một nửa
                this.y += 12;
                // this.body.setOffset(0, 24);
                // this.graphics.clear().fillStyle(0xffffff, 1).fillRect(-16, 0, 32, 24);
                this.scaleY = 1;

            }
        } else {
            if (this.isCrouching) {
                const oldBottom = this.body.bottom;

                this.isCrouching = false;
                this.body.setSize(32, 48); // Trả lại hitbox bình thường
                this.y -= 12;
                // this.body.setOffset(0, 0);
                // this.graphics.clear().fillStyle(0xffffff, 1).fillRect(-16, -24, 32, 48);
                this.scaleY = 2;
            }
        }

        // W: Nhảy (Chỉ nhảy khi đang đứng trên mặt đất)
        if (this.keys.jump.isDown && this.body.blocked.down && !this.isCrouching) {
            this.setVelocityY(this.jumpForce);
        }
    }

    shoot() {
        // console.log("Bắn! Đạn sẽ được xử lý ở class Weapon sau.");
        const direction = this.flipX ? 'left' : 'right';
        
        // Tạo viên đạn ngay vị trí của người chơi
        const bullet = new Bullet(this.scene, this.x, this.y);
        bullet.fire(this.x, this.y, direction);
        
        console.log("Pằng! Đã bắn 1 viên đạn.");
    }

    switchWeapon(slot) {
        console.log(`Đổi sang vũ khí ô số ${slot}`);
    }

    castSkill(skillKey) {
        console.log(`Dùng skill: ${skillKey}`);
    }
}