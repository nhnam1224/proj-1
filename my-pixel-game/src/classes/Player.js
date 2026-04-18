import * as Phaser from 'phaser';
import Entity from './Entity.js';

export default class Player extends Entity {
    constructor(scene, x, y) {
        super(scene, x, y, 'soldier_idle'); // Dùng class Entity cha
        this.hp = 100;

        this.speed = 150;
        this.attackDamage = 25;
        this.isAttacking = false;
        this.weaponType = 1;

        this.lastDirX = 1;
        this.lastDirY = 0;

        this.keys = scene.input.keyboard.addKeys('W,A,S,D');

        // Bấm chuột trái để chém kiếm
        scene.input.keyboard.on('keydown-SPACE', () => {
            this.attack();
        });

        scene.input.keyboard.on('keydown-ONE', () => { 
            this.weaponType = 1; 
            console.log("Đã đổi sang Vũ khí 1 (Chém 1)"); 
        });
        
        scene.input.keyboard.on('keydown-TWO', () => { 
            this.weaponType = 2; 
            console.log("Đã đổi sang Vũ khí 2 (Chém 2)"); 
        });
        
        scene.input.keyboard.on('keydown-THREE', () => { 
            this.weaponType = 3; 
            console.log("Đã đổi sang Vũ khí 3 (Bắn cung)"); 
        });
    }

    update() {
        if (this.isDead || this.isAttacking || this.isHurt) return; // Đang chém hoặc chết thì không đi lại

        let vx = 0; let vy = 0;

        if (this.keys.A.isDown) vx = -this.speed;
        if (this.keys.D.isDown) vx = this.speed;
        if (this.keys.W.isDown) vy = -this.speed;
        if (this.keys.S.isDown) vy = this.speed;

        // Chuẩn hóa vector: Giúp việc đi chéo (Vd: bấm W + D) không bị chạy nhanh gấp rưỡi
        const length = Math.sqrt(vx * vx + vy * vy);
        if (length > 0) {
            vx = (vx / length) * this.speed;
            vy = (vy / length) * this.speed;

            this.lastDirX = vx / this.speed;
            this.lastDirY = vy / this.speed;
        }

        this.setVelocity(vx, vy);

        // Chạy animation di chuyển
        if (vx !== 0 || vy !== 0) {
            this.play('soldier_walk_anim', true);
            if (vx < 0) this.setFlipX(true);
            else if (vx > 0) this.setFlipX(false);
        } 
        else {
            this.play('soldier_idle_anim', true);
        }
    }

    attack() {
        if (this.isAttacking || this.isDead) return;

        this.isAttacking = true;
        this.setVelocity(0, 0); // Đứng lại khi chém

        if (this.weaponType === 1) this.play('soldier_attack_anim');
        else if (this.weaponType === 2) this.play('soldier_attack2_anim');
        else if (this.weaponType === 3) this.play('soldier_attack3_anim');

        // TẠO HITBOX CHÉM KIẾM TÀNG HÌNH (Rộng 40px, cao 50px)
        // const direction = this.flipX ? -1 : 1;
        // ==========================================
        // VŨ KHÍ 1 & 2: CHÉM CẬN CHIẾN (MELEE)
        // ==========================================
        if (this.weaponType === 1 || this.weaponType === 2) {
            const hitboxX = this.x + (this.lastDirX * 40); 
            const hitboxY = this.y - 10 + (this.lastDirY * 40); 

            const hitbox = this.scene.add.circle(hitboxX, hitboxY, 25, 0xff0000, 0); 
            this.scene.physics.add.existing(hitbox);
            hitbox.body.setAllowGravity(false);
            hitbox.body.setCircle(25);

            hitbox.enemiesHit = [];

            const meleeCollider = this.scene.physics.add.overlap(hitbox, this.scene.enemiesGroup, (box, enemy) => {
                if (!box.enemiesHit.includes(enemy)) {
                    enemy.takeDamage(this.attackDamage);
                    box.enemiesHit.push(enemy); 
                }
            });

            this.scene.time.delayedCall(150, () => {
                if (hitbox.active) {
                    meleeCollider.destroy(); // Hủy trạm gác
                    hitbox.destroy(); // Hủy hitbox
                }
            });
        } 
        // ==========================================
        // VŨ KHÍ 3: BẮN CUNG (RANGED)
        // ==========================================
        else if (this.weaponType === 3) {
            this.scene.time.delayedCall(480, () => {
                if (this.isDead || this.isHurt) return;
                // Tọa độ sinh ra mũi tên (ngay trước mặt Player)
                const arrowX = this.x + (this.lastDirX * 40);
                const arrowY = this.y - 10 + (this.lastDirY * 40); 

                // Tạo Sprite mũi tên và bật vật lý cho nó
                const arrow = this.scene.physics.add.sprite(arrowX, arrowY, 'arrow');
                arrow.setScale(1.5); // Phóng to mũi tên bằng kích thước nhân vật
                arrow.body.setAllowGravity(false); // Không bị rơi rớt

                // Bắn đạn theo vector 8 hướng
                arrow.setVelocity(this.lastDirX * 450, this.lastDirY * 450);

                // QUAN TRỌNG: Xoay hình ảnh mũi tên hướng về phía đang bay
                arrow.rotation = Math.atan2(this.lastDirY, this.lastDirX);

                // Dùng Hitbox hình tròn nhỏ ngay đầu mũi tên (Bán kính 10, đẩy tâm ra 40x40)
                arrow.body.setCircle(10, 40, 40);

                const arrowCollider = this.scene.physics.add.overlap(arrow, this.scene.enemiesGroup, (arr, enemy) => {
                    enemy.takeDamage(this.attackDamage); 
                    arr.destroy(); 
                    arrowCollider.destroy(); 
                });

                this.scene.time.delayedCall(1500, () => {
                    if (arrow.active) {
                        arrowCollider.destroy();
                        arrow.destroy();
                    }
                });
            });      
        };

        // Hết animation tấn công thì cho phép thao tác lại
        this.once('animationcomplete', () => {
            this.isAttacking = false;
        });
    }

    playHurtAnim() {
        this.isAttacking = false;
        this.play('soldier_hurt_anim');
    }

    playDeathAnim() {
        this.play('soldier_death_anim');
        this.setVelocity(0, 0);
        
        // 2 giây sau khi ngã xuống thì in ra console (hoặc chuyển scene)
        this.scene.time.delayedCall(2000, () => {
            const currentRoomName = this.scene.sys.settings.key; 
            
            this.scene.scene.launch('GameOverScene', { previousScene: currentRoomName });
        });
    }
}