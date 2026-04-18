import * as Phaser from 'phaser';

export default class Entity extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture) {
        super(scene, x, y, texture);
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setScale(2);

        this.hp = 100;
        this.speed = 100;
        this.isDead = false;
        this.isInvulnerable = false;
        this.isHurt = false;
        
        // Thu gọn khung va chạm (hitbox vật lý) để vừa với dáng người
        this.body.setSize(20, 30); 
        this.body.setOffset(40, 45);
    }

    takeDamage(amount) {
        if (this.isDead || this.isInvulnerable) return;

        this.hp -= amount;
        this.isInvulnerable = true;
        this.isHurt = true;

        this.setTint(0xff0000);

        if (this.hp <= 0) {
            this.die();
        } 
        else {
            this.playHurtAnim();

            this.scene.time.delayedCall(200, () => {
                this.isInvulnerable = false;
            });

            this.scene.time.delayedCall(300, () => {
                this.isInvulnerable = false;
                this.clearTint();
                this.isHurt = false;
            });
        }
    }

    die() {
        this.isDead = true;
        this.isHurt = false;
        this.clearTint(); // Chết thì hết màu đỏ
        this.setVelocity(0, 0);
        this.playDeathAnim();
        this.body.checkCollision.none = true; // Chết rồi thì đi xuyên qua
    }

    // Các hàm này sẽ được định nghĩa riêng ở từng con
    playHurtAnim() {}
    playDeathAnim() {}
}