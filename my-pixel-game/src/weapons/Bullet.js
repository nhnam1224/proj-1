import * as Phaser from 'phaser';

export default class Bullet extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture) {
        super(scene, x, y, texture); //874
        
        scene.add.existing(this);
        scene.physics.add.existing(this);
        
        this.body.setSize(10, 10);
        this.setScale(2);

        // Đạn không bị ảnh hưởng bởi trọng lực
        this.body.setAllowGravity(false);
        this.speed = 500;
    }

    fire(x, y, angle) {
        this.setPosition(x, y);

        this.setActive(true);
        this.setVisible(true);

        this.body.setAllowGravity(false);

        // Tốc độ bay của đạn (bạn có thể đưa biến này vào tham số nếu muốn súng lục đạn bay nhanh, shotgun bay chậm)
        const speed = 400;

        // PHÉP THUẬT NẰM Ở ĐÂY: Hàm của Phaser tự động tính toán trục X và Y để đạn bay xéo dựa theo góc
        this.scene.physics.velocityFromAngle(angle, speed, this.body.velocity);

        // Xoay hình ảnh viên đạn cho khớp với hướng bay (nếu viên đạn của bạn là hình dài/xéo)
        this.setAngle(angle);

        // Tự hủy đạn sau 1.5 giây nếu không trúng gì
        this.scene.time.delayedCall(1500, () => {
            this.destroyBullet();
        });
    }

    preUpdate(time, delta) {
        super.preUpdate(time, delta);
    }

    destroyBullet() {
        this.destroy();
    }
}