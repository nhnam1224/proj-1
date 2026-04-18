export const createOrcAnimations = (scene) => {
    scene.anims.create({ key: 'orc_idle_anim', frames: scene.anims.generateFrameNumbers('orc_idle'), frameRate: 8, repeat: -1 });
    scene.anims.create({ key: 'orc_walk_anim', frames: scene.anims.generateFrameNumbers('orc_walk'), frameRate: 8, repeat: -1 });
    scene.anims.create({ key: 'orc_hurt_anim', frames: scene.anims.generateFrameNumbers('orc_hurt'), frameRate: 10, repeat: 0 });
    scene.anims.create({ key: 'orc_death_anim', frames: scene.anims.generateFrameNumbers('orc_death'), frameRate: 10, repeat: 0 });
    scene.anims.create({ key: 'orc_attack_anim', frames: scene.anims.generateFrameNumbers('orc_attack'), frameRate: 15, repeat: 0 });
    scene.anims.create({ key: 'orc_attack2_anim', frames: scene.anims.generateFrameNumbers('orc_attack2'), frameRate: 15, repeat: 0 });
};