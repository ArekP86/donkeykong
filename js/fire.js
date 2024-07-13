

const fireData = {
    frames: {
        fire1: {
            frame: { x: 0, y: 0, w: 21, h: 22 },
            sourceSize: { w: 21, h: 22 },
            spriteSourceSize: { x: 0, y: 0, w: 42, h: 22 }
        },
        fire2: {
            frame: { x: 22, y: 0, w: 42, h: 22 },
            sourceSize: { w: 21, h: 22 },
            spriteSourceSize: { x: 0, y: 0, w: 42, h: 22 }
        },
    },
    meta: {
        image: 'assets\images\fire_spritesheet.png',
        format: 'RGBA8888',
        size: { w: 42, h: 22 },
        scale: 1
    },
    animations: {
        burn: ['fire1', 'fire2'] //array of frames by name
    }
}

function getFireAnimation() {
    // Create the SpriteSheet from data and image
    const fireSpritesheet = new Spritesheet(
        Texture.from(fireData.meta.image),
        fireData
    );

    // Generate all the Textures asynchronously
    await fireSpritesheet.parse();

    // spritesheet is ready to use!
    const fireAnimation = new AnimatedSprite(fireSpritesheet.animations.burn);

    // set the animation speed
    fireAnimation.animationSpeed = 0.1666;
    // play the animation on a loop
    fireAnimation.play();
    // add it to the stage to render
    // app.stage.addChild(fireAnimation);
    return fireAnimation;
}