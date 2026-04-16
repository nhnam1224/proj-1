// src/weapons/weapons.js
import Bullet from './Bullet.js';

// Khẩu súng số 1
export class Pistol {
    constructor(scene) {
        this.scene = scene;
        this.name = "Pistol";
        this.texture = "gun_pistol";      
        this.bulletTexture = "ammo_pistol";
        this.cooldown = 500; 
        this.damage = 10;    
        this.lastFired = 0;
        // this.bulletFrame = 419;

    }

    fire(player) {
        let currentTime = this.scene.time.now;
        if (currentTime > this.lastFired) {
            player.anims.play('shoot', true);

            const baseAngle = player.flipX ? 180 : 0; 
            
            const offset_x = player.flipX ? -20 : 20; 
            const offset_y = player.isCrouching ? 16 : 5;

            const bullet = new Bullet(this.scene, player.x + offset_x, player.y + offset_y, this.bulletTexture);
            bullet.fire(player.x + offset_x, player.y + offset_y, baseAngle);

            this.lastFired = currentTime + this.cooldown; 
        }
    }
}

// Khẩu súng số 2
export class Shotgun {
    constructor(scene) {
        this.scene = scene;
        this.name = "Shotgun";
        this.texture = "gun_shotgun";
        this.bulletTexture = "ammo_shotgun";
        this.cooldown = 850; // Bắn chậm hơn
        this.damage = 25;    // Bắn mạnh hơn
        this.lastFired = 0;
        // this.bulletFrame = 419;
    }

    fire(player) {
        let currentTime = this.scene.time.now;
        if (currentTime > this.lastFired) {
            player.anims.play('shoot', true);
            const baseAngle = player.flipX ? 180 : 0;

            const offset_x = player.flipX ? -20 : 20; 
            const offset_y = player.isCrouching ? 16 : 5; 

            // Shotgun thường bắn ra nhiều viên đạn cùng lúc
            // Ở đây gọi 3 viên đạn tỏa ra

            // (Trong Phaser, trục Y hướng xuống dưới nên -15 là bắn lên trên, +15 là bắn cắm xuống)
            const spreadAngles = [
                baseAngle,           // Viên thẳng
                baseAngle - 15,      // Viên xéo lên
                baseAngle + 15       // Viên xéo xuống
            ];

            // Vòng lặp bắn 3 viên đạn
            spreadAngles.forEach((angle) => {
                const bullet = new Bullet(this.scene, player.x + offset_x, player.y + offset_y, this.bulletTexture);
                bullet.fire(player.x + offset_x, player.y + offset_y, angle);
            });
            
            
            this.lastFired = currentTime + this.cooldown; 
        }
    }
}

// Khẩu súng số 3
export class Rifle {
    constructor(scene) {
        this.scene = scene;
        this.name = "Rifle";
        this.texture = "gun_rifle";
        this.bulletTexture = "ammo_rifle";
        this.cooldown = 200; 
        this.damage = 10;    
        this.lastFired = 0;
        // this.bulletFrame = 419;
    }

    fire(player) {
        let currentTime = this.scene.time.now;
        if (currentTime > this.lastFired) { 
            player.anims.play('shoot', true); 
            
            const baseAngle = player.flipX ? 180 : 0; 
            
            const offset_x = player.flipX ? -20 : 20; 
            const offset_y = player.isCrouching ? 16 : 5;

            const bullet = new Bullet(this.scene, player.x + offset_x, player.y + offset_y, this.bulletTexture);
            bullet.fire(player.x + offset_x, player.y + offset_y, baseAngle);

            this.lastFired = currentTime + this.cooldown; 
        }
    }
}