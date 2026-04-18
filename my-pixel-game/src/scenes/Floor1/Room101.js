import * as Phaser from 'phaser';
import Player from '../../classes/Player.js';
import Orc from '../../classes/enemy/Orc.js';
import { createPlayerAnimations } from '../../animations/PlayerAnimations.js';
import { createOrcAnimations } from '../../animations/enemy/OrcAnimations.js';

export default class Room101 extends Phaser.Scene {
    constructor() {
        super('Room101');
    }

    create() {
        createPlayerAnimations(this);
        createOrcAnimations(this);

        this.input.keyboard.on('keydown-ESC', () => {
            this.scene.pause(); // Dừng hoàn toàn mọi logic/vật lý ở Room101
            this.scene.launch('PauseScene', { previousScene: this.scene.key }); // Bật PauseScene lên chạy đè ở lớp trên
        });

        // 1. Tạo Group chứa toàn bộ kẻ địch để check va chạm
        this.enemiesGroup = this.physics.add.group();

        // 2. Spawn Người chơi
        this.player = new Player(this, 400, 300);

        // 3. Spawn bọn Orc (Bạn có thể ném bao nhiêu con tùy thích)
        const orc1 = new Orc(this, 100, 100);
        orc1.setTarget(this.player); // Bảo con Orc đuổi theo player
        this.enemiesGroup.add(orc1);

        const orc2 = new Orc(this, 700, 500);
        orc2.setTarget(this.player);
        this.enemiesGroup.add(orc2);

        const orc3 = new Orc(this, 300, 400);
        orc3.setTarget(this.player);
        this.enemiesGroup.add(orc3);

        const orc4 = new Orc(this, 200, 200);
        orc4.setTarget(this.player);
        this.enemiesGroup.add(orc4);

        const orc5 = new Orc(this, 800, 400);
        orc5.setTarget(this.player);
        this.enemiesGroup.add(orc5);

        // 4. Các setup khác (Tường, Camera, v.v...)
        this.cameras.main.startFollow(this.player, true, 0.05, 0.05);
    }

    update() {
        if (this.player) this.player.update();
        
        // Cập nhật AI cho từng con quái trong group
        this.enemiesGroup.getChildren().forEach(enemy => {
            enemy.update();
        });

        // Nếu phòng chưa clear và trong phòng có ít nhất 1 con quái
        if (!this.isRoomCleared && this.enemiesGroup.getChildren().length > 0) {
            
            // Dùng hàm every() để kiểm tra: "Có phải tất cả (every) quái đều có isDead == true không?"
            const isAllDead = this.enemiesGroup.getChildren().every(enemy => enemy.isDead);
            
            if (isAllDead) {
                this.isRoomCleared = true; // Chốt hạ là đã qua màn, không chạy lệnh này thêm nữa
                
                // Chờ 2 giây sau khi con quái cuối cùng ngã xuống mới hiện bảng Victory
                this.time.delayedCall(2000, () => {
                    this.scene.pause(); 
                    // Gọi VictoryScene, truyền tên phòng hiện tại và phòng tiếp theo
                    this.scene.launch('VictoryScene', { 
                        currentScene: 'Room101', 
                        nextScene: 'Room102' // Thay bằng tên Scene phòng tiếp theo của bạn (nếu có)
                    });
                });
            }
        }
    }
}