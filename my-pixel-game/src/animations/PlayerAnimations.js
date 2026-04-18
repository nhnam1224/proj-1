export const createPlayerAnimations = (scene) => {
    // Soldier Animations
    scene.anims.create({ key: 'soldier_idle_anim', frames: scene.anims.generateFrameNumbers('soldier_idle'), frameRate: 8, repeat: -1 });
    scene.anims.create({ key: 'soldier_walk_anim', frames: scene.anims.generateFrameNumbers('soldier_walk'), frameRate: 10, repeat: -1 });
    scene.anims.create({ key: 'soldier_hurt_anim', frames: scene.anims.generateFrameNumbers('soldier_hurt'), frameRate: 10, repeat: 0 });
    scene.anims.create({ key: 'soldier_death_anim', frames: scene.anims.generateFrameNumbers('soldier_death'), frameRate: 10, repeat: 0 });
    scene.anims.create({ key: 'soldier_attack_anim', frames: scene.anims.generateFrameNumbers('soldier_attack'), frameRate: 15, repeat: 0 }); // Chém 1 lần rồi dừng
    scene.anims.create({ key: 'soldier_attack2_anim', frames: scene.anims.generateFrameNumbers('soldier_attack2'), frameRate: 15, repeat: 0 });
    scene.anims.create({ key: 'soldier_attack3_anim', frames: scene.anims.generateFrameNumbers('soldier_attack3'), frameRate: 15, repeat: 0 });
};