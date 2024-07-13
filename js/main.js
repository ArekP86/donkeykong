const app_width = 800;
const app_height = 800;
const pixi_app = new PIXI.Application();
var spritesheets = {};

(async () => {
    await pixi_app.init({ width: app_width, height: app_height, antialias: true });
    await PIXI.Assets.load('assets/images/ground.png');
    await LoadSpritesheets();

    document.body.appendChild(pixi_app.canvas);

    drawGround();
    await drawLevel();


    // loop
    let elapsed = 0.0;

    pixi_app.ticker.add((ticker) => {
        elapsed += ticker.deltaTime;

        // ground.x = 100.0 + Math.cos(elapsed / 50.0) * 100.0;
    });

})();

function normalize(n) {
    return n / 100.0 * app_width;
}

function drawGround() {
    let i = 0;
    do {
        let ground = PIXI.Sprite.from('assets/images/ground.png');
        ground.x = i;
        ground.y = app_height - ground.height;
        pixi_app.stage.addChild(ground);
        i += ground.width;
    } while (i < app_width);
}

function getLevelData() {
    return fetch('assets/data/level.json')
        .then((response) => {
            return response.json();
        })
        .then((json) => {
            return json;
        });
}

function drawPlatforms(platformData) {
    const graphics = new PIXI.Graphics();
    platformData.forEach((p) => {
        graphics
            .moveTo(normalize(p.start.x), normalize(p.start.y))
            .lineTo(
                normalize(p.end.x), normalize(p.end.y)
            );
        graphics.stroke({ width: 10, color: 0xffd900 });
    });
    pixi_app.stage.addChild(graphics);
}

function drawFires(fireData) {
    console.log(spritesheets);
    fireData.forEach((f) => {
        let fireAnimation = new PIXI.AnimatedSprite(spritesheets.fire.animations.burn);
        fireAnimation.animationSpeed = 0.15 + Math.random() * 0.15;
        fireAnimation.play();

        fireAnimation.x = normalize(f.x);
        fireAnimation.y = normalize(f.y);
        pixi_app.stage.addChild(fireAnimation);
    });
}

function drawGoal(goalData) {
    let graphics = new PIXI.Graphics();
    let n = 0;
    pixi_app.stage.addChild(graphics);
    pixi_app.ticker.add(() => {
        graphics.clear();
        graphics.star(
            normalize(goalData.x), normalize(goalData.y), 5, normalize(4), 0, n
        );
        graphics.stroke({ width: 10, color: 0xffd900 });
        n -= 0.05;
        if (n > 360) { n = 1 }
    });
}

async function drawLevel() {
    const levelData = await getLevelData();
    drawPlatforms(levelData.platformData);
    drawFires(levelData.fireData);
    drawGoal(levelData.goal);
}

async function LoadSpritesheets() {
    await PIXI.Assets.load('assets/images/fire_spritesheet.png');
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
            image: 'assets/images/fire_spritesheet.png',
            format: 'RGBA8888',
            size: { w: 42, h: 22 },
            scale: 1
        },
        animations: {
            burn: ['fire1', 'fire2'] //array of frames by name
        }
    }
    const fire = new PIXI.Spritesheet(
        PIXI.Texture.from(fireData.meta.image),
        fireData
    );

    await fire.parse();

    spritesheets.fire = fire;
}