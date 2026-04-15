import * as Phaser from 'phaser';

export default class Bullet extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        // Tạm dùng hình chữ nhật nhỏ làm đạn
        super(scene, x, y, '');
        
        scene.add.existing(this);
        scene.physics.add.existing(this);
        
        this.graphics = scene.add.graphics();
        this.graphics.fillStyle(0xffff00, 1); // Đạn màu vàng
        this.graphics.fillRect(-4, -4, 8, 8); // Kích thước 8x8
        this.body.setSize(8, 8);

        // Đạn không bị ảnh hưởng bởi trọng lực
        this.body.setAllowGravity(false);
        this.speed = 500;
    }

    fire(x, y, direction) {
        this.setPosition(x, y);
        this.graphics.setPosition(x, y);
        this.setActive(true);
        this.setVisible(true);

        // Bắn sang trái hoặc phải tùy vào hướng nhân vật đang quay
        if (direction === 'left') {
            this.setVelocityX(-this.speed);
        } else {
            this.setVelocityX(this.speed);
        }

        // Tự hủy đạn sau 1.5 giây nếu không trúng gì
        this.scene.time.delayedCall(1500, () => {
            this.destroyBullet();
        });
    }

    preUpdate(time, delta) {
        super.preUpdate(time, delta);
        this.graphics.setPosition(this.x, this.y);
    }

    destroyBullet() {
        this.graphics.destroy();
        this.destroy();
    }
}