import * as Phaser from 'phaser';
import Player from '../../classes/Player.js';

export default class Room101Scene extends Phaser.Scene {
    constructor() {
        super('Room101Scene');
    }

    preload() {
        // Tải bức ảnh và đặt tên cho nó là 'player_img'
        this.load.spritesheet('player_img', 'characters/main/ActionDude-Spritesheet1.png', { 
            frameWidth: 16, 
            frameHeight: 16 
        });
    }

    create() {
        // Phím Pause
        this.input.keyboard.on('keydown-ESC', () => {
            this.scene.pause();
            this.scene.launch('PauseScene');
            this.scene.bringToTop('PauseScene');
        });

        // --- BƯỚC 1: MỞ RỘNG THẾ GIỚI GAME ---
        // Chiều dài map bây giờ là 2000 pixel, chiều cao vẫn là 600
        const mapWidth = 3000;
        const mapHeight = 600;
        this.physics.world.setBounds(0, 0, mapWidth, mapHeight);

        // 1. Tạo mặt đất (Nền tảng tĩnh - Static Group)
        this.platforms = this.physics.add.staticGroup();
        
        // Vẽ một hình chữ nhật dài làm sàn nhà ở đáy màn hình
        const ground = this.add.rectangle(mapWidth / 2, 580, mapWidth, 40, 0x444444);
        this.platforms.add(ground);

        // (Tùy chọn) Thêm một vài bục nhảy rải rác trên đường để thấy rõ camera đang di chuyển
        this.platforms.add(this.add.rectangle(600, 450, 100, 20, 0x666666));
        this.platforms.add(this.add.rectangle(800, 350, 150, 20, 0x666666));
        this.platforms.add(this.add.rectangle(1000, 250, 100, 20, 0x666666));

        this.anims.create({
            key: 'idle',
            frames: [{ key: 'player_img', frame: 0 }], // Chỉ dùng 1 frame đầu tiên
            frameRate: 10
        });

        // Tạo animation chạy (Walk)
        this.anims.create({
            key: 'walk',
            frames: this.anims.generateFrameNumbers('player_img', { start: 0, end: 7 }), // Lặp từ frame 0 đến 7
            frameRate: 10, // Tốc độ chạy (10 hình/giây)
            repeat: -1 // Lặp lại vô hạn (-1)
        });

        this.anims.create({
            key: 'shoot',
            // Theo như hình ActionDude, tư thế bắn thường nằm ở dòng thứ 3 (frame 16 đến 18)
            // Nếu bạn thấy nó chạy sai hình, hãy thử đổi số start và end nhé.
            frames: this.anims.generateFrameNumbers('player_img', { start: 72, end: 74 }), 
            frameRate: 15, // Tốc độ hoạt họa bắn (nhanh hơn đi bộ xíu)
            repeat: 0 // Lặp 0 lần (nghĩa là chỉ chạy 1 lần rồi dừng)
        });

        // 2. Gọi class Player OOP ra
        this.player = new Player(this, 400, 300, 'player_img');

        // Bật Camera bám theo nhân vật
        this.cameras.main.setBounds(0, 0, mapWidth, mapHeight); // Khung camera không được vượt ra ngoài map

        // Cú pháp: startFollow(mục_tiêu, làm_tròn_pixel, tốc_độ_trượt_x, tốc_độ_trượt_y)
        // Số 0.05 tạo cảm giác camera lướt theo nhịp nhàng (smooth follow) chứ không bị cứng ngắc
        this.cameras.main.startFollow(this.player, true, 0.05, 0.05);

        

        // ... (code va chạm)

        // 3. Thêm va chạm giữa Player và Mặt đất để không bị rơi lủng màn hình
        this.physics.add.collider(this.player, this.platforms);
    }

    update(time, delta) {
        // Không cần viết code di chuyển ở đây nữa vì Player.js đã lo liệu
        // Các logic môi trường khác sẽ đặt ở đây
    }
}