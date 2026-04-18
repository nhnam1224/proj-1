import Entity from '../Entity.js';
import * as Phaser from 'phaser';

export default class Orc extends Entity {
    constructor(scene, x, y) {
        super(scene, x, y, 'orc_idle');
        this.speed = 60;
        this.hp = 50;
        this.attackDamage = 20;

        this.target = null;
        this.isAttacking = false;
        this.lastAttackTime = 0;

        this.lastDirX = 1;
        this.lastDirY = 0;
    }

    setTarget(player) {
        this.target = player;
    }

    update() {
        if (this.isDead) return;

        if (!this.target || this.target.isDead) {
            this.setVelocity(0, 0);
            this.play('orc_idle_anim', true);
            return;
        }

        if (this.isAttacking || this.isHurt) return;

        // Quái tự động tìm tới người chơi
        const distance = Phaser.Math.Distance.Between(this.x, this.y, this.target.x, this.target.y);

        if (distance > 45) { // Nếu cách xa thì đi tới
            this.scene.physics.moveToObject(this, this.target, this.speed);
            this.play('orc_walk_anim', true);

            const vx = this.body.velocity.x;
            const vy = this.body.velocity.y;
            const length = Math.sqrt(vx * vx + vy * vy);

            if (length > 0) {
                this.lastDirX = vx / length;
                this.lastDirY = vy / length;
            }

            // Quay mặt về phía người chơi
            if (this.body.velocity.x < 0) this.setFlipX(true);
            else if (this.body.velocity.x > 0) this.setFlipX(false);
        } 
        else {
            // Lại gần thì đứng yên (Sau này bạn thêm code cắn người chơi ở đây)
            this.setVelocity(0, 0);
            if (this.scene.time.now > this.lastAttackTime + 1500) {
                this.attack();
            } else {
                this.play('orc_idle_anim', true); // Chờ hồi chiêu thì đứng thở
            }
        }
    }

    attack() {
        this.isAttacking = true;
        this.play('orc_attack_anim'); // Chạy animation chém của Orc
        
        // 1. TẠO HẸN GIỜ TRỪ MÁU (400ms sau búa mới chạm đất)
        this.attackEvent = this.scene.time.delayedCall(300, () => {
            // Kiểm tra xem Orc còn sống, đang không bị đau, và Player vẫn còn sống không
            if (!this.isDead && this.isAttacking && this.target && !this.target.isDead) {

                const hitboxX = this.x + (this.lastDirX * 35);
                const hitboxY = this.y + (this.lastDirY * 35);

                const hitbox = this.scene.add.circle(hitboxX, hitboxY, 25, 0xff0000, 0); 
                this.scene.physics.add.existing(hitbox);
                hitbox.body.setAllowGravity(false);
                hitbox.body.setCircle(25);

                let hasHit = false;

                const hitCollider = this.scene.physics.add.overlap(hitbox, this.target, (box, playerTarget) => {
                    if (!hasHit) {
                        playerTarget.takeDamage(this.attackDamage);
                        hasHit = true; // Đánh dấu là đã chém trúng rồi, không trừ máu nữa
                    }
                });

                this.scene.time.delayedCall(100, () => {
                    if (hitbox.active) {
                        hitCollider.destroy();
                        hitbox.destroy();
                    }
                });
                
                // 2. CHECK LẠI KHOẢNG CÁCH: Nếu Player vẫn đứng trong tầm 55px thì mới trúng đòn
                // const currentDist = Phaser.Math.Distance.Between(this.x, this.y, this.target.x, this.target.y);
                // if (currentDist <= 65) {
                //     this.target.takeDamage(this.attackDamage);
                // }
            }
        });

        // 3. Hoạt ảnh vung búa chạy xong thì trả lại trạng thái bình thường
        this.once('animationcomplete', (anim) => {
            if (anim.key === 'orc_attack_anim') {
                this.isAttacking = false;
                this.lastAttackTime = this.scene.time.now; 
            }
        });
    }

    playHurtAnim() {
        this.isAttacking = false;
        if (this.attackEvent) this.attackEvent.destroy();

        this.play('orc_hurt_anim');
        this.setVelocity(0, 0); // Đứng hình khi bị đau
        this.scene.time.delayedCall(300, () => {
            if (!this.isDead) this.play('orc_idle_anim');
        });
    }

    playDeathAnim() {
        this.play('orc_death_anim');
        this.setVelocity(0, 0);
    }
}