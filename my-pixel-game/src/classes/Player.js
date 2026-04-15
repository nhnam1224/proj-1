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

        this.lastFired = 0;

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

        // // --- XỬ LÝ ANIMATION ---
        // // Chỉ chạy animation đi/đứng khi đang chạm đất và không cúi
        // if (this.body.blocked.down && !this.isCrouching && !isShooting) {
        //     // Kiểm tra xem animation đã được tạo trong Scene chưa để tránh lỗi
        //     if (this.anims.animationManager.exists('walk') && this.anims.animationManager.exists('idle')) {
        //         if (isMoving) {
        //             this.anims.play('walk', true); 
        //         } else {
        //             this.anims.play('idle', true);
        //         }
        //     }
        // }


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
        } else {
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

    // shoot() {

    //     // Lấy thời gian hiện tại của game
    //     let currentTime = this.scene.time.now; 

    //     // Kiểm tra Cooldown: Phải cách lần bắn trước ít nhất 300ms (0.3 giây)
    //     if (currentTime > this.lastFired) {
    //         // 1. CHẠY ANIMATION BẮN SÚNG
    //         this.anims.play('shoot', true);

    //         // Bắt sự kiện: Khi animation 'shoot' chạy xong thì làm gì tiếp theo?
    //         this.once('animationcomplete-shoot', () => {
    //             // Trả lại trạng thái đứng im (nếu nhân vật không đang di chuyển)
    //             if (this.body.velocity.x === 0 && !this.isCrouching) {
    //                 this.anims.play('idle', true);
    //             }
    //         });

    //         // 2. XỬ LÝ SINH ĐẠN
    //         const direction = this.flipX ? 'left' : 'right';
            
    //         // Chỉnh tọa độ nòng súng để đạn bay ra từ tay chứ không phải từ bụng
    //         const offset_x = this.flipX ? -20 : 20; // Dịch đạn ra đằng trước
    //         const offset_y = 5; // Dịch đạn xuống dưới 1 chút cho khớp tay

    //         // Gọi đạn từ class Bullet (bạn đã code sẵn)
    //         const bullet = new Bullet(this.scene, this.x + offset_x, this.y + offset_y);
    //         bullet.fire(this.x + offset_x, this.y + offset_y, direction);
            
    //         console.log("Pằng! Đã bắn 1 viên đạn.");

    //         // 3. CẬP NHẬT COOLDOWN
    //         // Gán lại thời gian: 300ms sau mới được phép bắn phát tiếp theo
    //         this.lastFired = currentTime + 300; 
    //     }
    // }

    shoot() {
        let currentTime = this.scene.time.now; 

        if (currentTime > this.lastFired) {
            
            // Ép chạy hoạt ảnh bắn súng ngay lập tức
            this.anims.play('shoot', true);

            const direction = this.flipX ? 'left' : 'right';
            const offset_x = this.flipX ? -20 : 20; 
            
            // SỬA LỖI ĐẠN: Nếu đang cúi thì nòng súng bị lùn xuống, đạn phải sinh ra thấp hơn
            const offset_y = this.isCrouching ? 16 : 5; 

            const bullet = new Bullet(this.scene, this.x + offset_x, this.y + offset_y);
            bullet.fire(this.x + offset_x, this.y + offset_y, direction);

            this.lastFired = currentTime + 300; 
        }
    }

    switchWeapon(slot) {
        console.log(`Đổi sang vũ khí ô số ${slot}`);
    }

    castSkill(skillKey) {
        console.log(`Dùng skill: ${skillKey}`);
    }
}