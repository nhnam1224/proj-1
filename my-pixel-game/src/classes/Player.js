import * as Phaser from 'phaser';
import { Pistol, Shotgun, Rifle } from '../weapons/Weapons.js';

export default class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture) {
        // Tạm thời dùng hình chữ nhật trắng nếu chưa có sprite
        super(scene, x, y, texture);
        
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setScale(4);
        
        this.body.setSize(10, 16);
        this.setCollideWorldBounds(true);

        // Các chỉ số cơ bản
        this.speed = 200;
        this.jumpForce = -500;
        this.isCrouching = false;

        this.lastFired = 0;

        this.jumpCount = 0; // Đếm số lần đã nhảy
        
        this.isDashing = false; // Đang lướt hay không
        this.dashSpeed = 450;   // Tốc độ lướt (nhanh gấp 3 lần đi bộ)
        this.dashEndTime = 0;   // Thời điểm kết thúc lướt
        this.dashCooldown = 0;  // Thời điểm được lướt tiếp (Hồi chiêu)

        // Khai báo bộ phím chuẩn theo yêu cầu
        this.keys = scene.input.keyboard.addKeys({
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D,
            jump: Phaser.Input.Keyboard.KeyCodes.W,
            crouch: Phaser.Input.Keyboard.KeyCodes.S,
            shift: Phaser.Input.Keyboard.KeyCodes.SHIFT,
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
        
        const numberKeys = ['ONE', 'TWO', 'THREE', 'FOUR', 'FIVE', 'SIX'];
        numberKeys.forEach((keyName, index) => {
        // index chạy từ 0 -> 5, tương ứng với slot vũ khí từ 1 -> 6
            scene.input.keyboard.on(`keydown-${keyName}`, () => this.switchWeapon(index + 1));
        });

        this.inventory = {
            1: new Pistol(scene),
            2: new Shotgun(scene),
            3: new Rifle(scene)
        };

        this.currentWeapon = this.inventory[1];

        this.weaponSprite = scene.add.sprite(this.x, this.y, this.currentWeapon.texture);
        this.weaponSprite.setScale(2); // Phóng to súng cho vừa tay
        this.weaponSprite.setDepth(10); // Đảm bảo súng vẽ đè lên nhân vật
    }

    preUpdate(time, delta) {
        super.preUpdate(time, delta);

        let gunOffsetX = this.flipX ? -16 : 16; // Súng nhô ra phía trước
        let gunOffsetY = this.isCrouching ? 22 : 12; // Cúi xuống thì súng cũng phải thấp xuống

        this.weaponSprite.setPosition(this.x + gunOffsetX, this.y + gunOffsetY);
        this.weaponSprite.setFlipX(this.flipX);

        // --- 1. RESET SỐ LẦN NHẢY KHI CHẠM ĐẤT ---
        if (this.body.blocked.down) {
            this.jumpCount = 0;
        }

        // --- 2. XỬ LÝ LƯỚT (DASH) ---
        // Bấm Shift + Đã hồi chiêu + Không cúi xuống
        if (Phaser.Input.Keyboard.JustDown(this.keys.shift) && time > this.dashCooldown && !this.isCrouching) {
            this.isDashing = true;
            this.dashEndTime = time + 200;    // Thời gian lướt là 200ms
            this.dashCooldown = time + 1000;  // Cooldown lướt là 1000ms (1 giây)
            
            this.body.setAllowGravity(false); // Tắt trọng lực để lướt thẳng trên không
            this.setVelocityY(0);             // Ngừng rơi
        }

        // Nếu đang lướt, chiếm quyền điều khiển di chuyển
        if (this.isDashing) {
            const dashDirection = this.flipX ? -1 : 1; 
            this.setVelocityX(dashDirection * this.dashSpeed);
            
            // Nếu hết thời gian lướt
            if (time > this.dashEndTime) {
                this.isDashing = false;
                this.body.setAllowGravity(true); // Bật lại trọng lực
            }
            return; // Dừng hàm tại đây, không xử lý đi bộ / cúi / nhảy trong lúc lướt
        }
        
        let isMoving = false;
        this.setVelocityX(0);
        const isShooting = this.anims.isPlaying && this.anims.currentAnim.key === 'shoot';

        // A và D: Di chuyển trái/phải
        if (this.keys.left.isDown && !this.isCrouching) {
            this.setVelocityX(-this.speed);
            this.flipX = true;
            isMoving = true;
        } 

        else if (this.keys.right.isDown && !this.isCrouching) {
            this.setVelocityX(this.speed);
            this.flipX = false;
            isMoving = true;
        }

        // --- 4. XỬ LÝ NHẢY VÀ NHẢY KÉP ---
        // Dùng JustDown thay vì isDown để bắt buộc phải nhấp nhả phím W
        if (Phaser.Input.Keyboard.JustDown(this.keys.jump) && !this.isCrouching) {
            // Cho phép nhảy nếu đang ở dưới đất, HOẶC số lần nhảy đang < 2 (nghĩa là đang ở trên không và mới nhảy 1 lần)
            if (this.body.blocked.down || this.jumpCount < 2) {
                this.setVelocityY(this.jumpForce);
                this.jumpCount++; 
                
                // Nếu đây là cú nhảy thứ 2 trên không, ép nó phát lại animation
                if (this.jumpCount === 2) {
                    this.anims.play('jump', true);
                }
            }
        }


        if (!isShooting) {
            if (!this.body.blocked.down) {
                this.anims.play('jump', true); // Đang trên không -> Nhảy
            } else if (this.isCrouching) {
                this.anims.play('crouch', true); // Đang giữ phím S -> Cúi
            } else if (isMoving) {
                this.anims.play('walk', true); // Đang giữ A/D -> Đi bộ
            } else {
                this.anims.play('idle', true); // Không làm gì -> Đứng thở
            }
        }

        // S: Cúi xuống (Cúi thì không cho đi)
        if (this.keys.crouch.isDown) {
            if (!this.isCrouching) {
                // this.isCrouching = true;
                // this.body.setSize(10, 8); // Thu nhỏ hitbox còn một nửa
                // this.y += 16;
                // // this.body.setOffset(0, 24);
                // // this.graphics.clear().fillStyle(0xffffff, 1).fillRect(-16, 0, 32, 24);
                // this.scaleY = 2;

                this.isCrouching = true;
                
                // 1. Ép lùn nhân vật xuống (từ scale gốc 4 xuống còn 2)
                this.scaleY = 2; 
                
                // 2. Chỉnh hitbox lùn đi (chiều ngang 10, chiều cao giảm còn 8)
                this.body.setSize(10, 8); 
                
                // 3. Đẩy hitbox dời xuống phần chân (trục X giữ nguyên 3, trục Y đẩy xuống 8)
                this.body.setOffset(3, 8); 
                
                // 4. Bù lại tọa độ Y để chân nhân vật vẫn bám đất
                this.y += 16;

            }
        } 
        else {
            if (this.isCrouching) {
                // this.isCrouching = false;
                // this.body.setSize(10, 8); // Trả lại hitbox bình thường
                // this.y -= 16;
                // // this.body.setOffset(0, 0);
                // // this.graphics.clear().fillStyle(0xffffff, 1).fillRect(-16, -24, 32, 48);
                // this.scaleY = 4;

                this.isCrouching = false;
                
                // 1. Trả lại scale ban đầu là 4 (lỗi của bạn nằm ở đây)
                this.scaleY = 4; 
                
                // 2. Trả lại hitbox mặc định như lúc mới sinh ra
                this.body.setSize(10, 16); 
                
                // 3. Trả lại offset mặc định
                this.body.setOffset(3, 0); 
                
                // 4. Kéo nhân vật lên lại để không bị lún sàn
                this.y -= 16;
            }
        }

        // W: Nhảy (Chỉ nhảy khi đang đứng trên mặt đất)
        if (this.keys.jump.isDown && this.body.blocked.down && !this.isCrouching) {
            this.setVelocityY(this.jumpForce);
        }
    }

    switchWeapon(slot) {
        if (this.inventory[slot]) {
            this.currentWeapon = this.inventory[slot];
            this.weaponSprite.setTexture(this.currentWeapon.texture); // Đổi hình ảnh súng
            console.log(`Đã đổi sang vũ khí: ${this.currentWeapon.name}`);
        }
    }

    shoot() {
        if (this.currentWeapon) {
            this.currentWeapon.fire(this);
        }
    }

    castSkill(skillKey) {
        console.log(`Dùng skill: ${skillKey}`);
    }
}