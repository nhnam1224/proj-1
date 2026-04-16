// Đường dẫn: src/animations/PlayerAnimations.js

export const createPlayerAnims = (anims) => {
    // Tránh việc tạo đi tạo lại gây lỗi bộ nhớ
    if (anims.exists('idle')) return;

    // 1. Đứng yên
    anims.create({
        key: 'idle',
        frames: [{ key: 'player_img', frame: 0 }], 
        frameRate: 10
    });

    // 2. Đi bộ
    anims.create({
        key: 'walk',
        frames: anims.generateFrameNumbers('player_img', { start: 0, end: 7 }),
        frameRate: 10,
        repeat: -1 
    });

    // 3. Bắn súng
    anims.create({
        key: 'shoot',
        frames: [{ key: 'player_img', frame: 0 }], 
        frameRate: 15,
        repeat: 0 
    });

    // 4. Nhảy (Tạm lấy frame số 10, bạn có thể xem ảnh spritesheet để đổi số cho đúng)
    anims.create({
        key: 'jump',
        frames: anims.generateFrameNumbers('player_img', { start: 24, end: 29 }), 
        frameRate: 10
    });

    // 5. Cúi (Tạm lấy frame số 15)
    anims.create({
        key: 'crouch',
        frames: anims.generateFrameNumbers('player_img', { start: 6, end: 7 }), 
        frameRate: 10
    });
};