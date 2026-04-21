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

        // ==========================================
        // BƯỚC 1: TẠO MAP TRƯỚC
        // ==========================================
        const map = this.make.tilemap({ key: 'desert_map' });
        const tileset = map.addTilesetImage('DesertTilemapBlankBackground', 'desert_tiles');

        const groundLayer = map.createLayer('Grounds', tileset, 0, 0);
        this.obstacleLayer = map.createLayer('Obstacles', tileset, 0, 0);

        const mapScale = 1.5; 
        groundLayer.setScale(mapScale);
        this.obstacleLayer.setScale(mapScale);

        const actualMapWidth = map.widthInPixels * mapScale;
        const actualMapHeight = map.heightInPixels * mapScale;
        this.cameras.main.setBounds(0, 0, actualMapWidth, actualMapHeight);
        this.physics.world.setBounds(0, 0, actualMapWidth, actualMapHeight);

        // ==========================================
        // BƯỚC 2: SINH RA NHÂN VẬT VÀ QUÁI VẬT
        // ==========================================
        this.enemiesGroup = this.physics.add.group();

        // Giờ thì this.player đã chính thức tồn tại
        this.player = new Player(this, 400, 300);

        const orc1 = new Orc(this, 100, 100);
        orc1.setTarget(this.player); 
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

        // ==========================================
        // BƯỚC 3: SET CAMERA VÀ VA CHẠM (Sau khi mọi thứ đã có mặt)
        // ==========================================
        // Camera trượt mượt mà theo Player
        this.cameras.main.startFollow(this.player, true, 0.08, 0.08);

        // Cài đặt tường cản
        this.obstacleLayer.setCollisionByExclusion([-1]); 

        // Va chạm giữa Người/Quái với Tường cản
        this.physics.add.collider(this.player, this.obstacleLayer);
        this.physics.add.collider(this.enemiesGroup, this.obstacleLayer);

        this.isRoomCleared = false;
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