import * as Phaser from 'phaser';
import Player from '../../classes/Player.js';
import { createPlayerAnims } from '../../animations/PlayerAnimations.js';

export default class Room101Scene extends Phaser.Scene {
    constructor() {
        super('Room101Scene');
    }

    create() {
        // Phím Pause
        this.input.keyboard.on('keydown-ESC', () => {
            this.scene.pause();
            this.scene.launch('PauseScene', { previousScene: this.scene.key });
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

        // Gọi hàm để hệ thống tự động tạo toàn bộ hoạt ảnh cho Player
        createPlayerAnims(this.anims);

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