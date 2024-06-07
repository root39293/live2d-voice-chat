// app/static/js/live2d.js
window.PIXI = PIXI;

const app = new PIXI.Application({
    view: document.getElementById('character'),
    autoStart: true,
    backgroundAlpha: 0,
    resizeTo: document.getElementById('character')
});

PIXI.live2d.Live2DModel.from('/static/hiyori_pro_ko/runtime/hiyori_pro_t11.model3.json')
.then(model => {
    app.stage.addChild(model);

    const modelScale = 0.1;
    model.scale.set(modelScale);

    const containerAspectRatio = app.renderer.width / app.renderer.height;
    const modelAspectRatio = model.width / model.height;

    if (containerAspectRatio > modelAspectRatio) {
        model.width = app.renderer.width * 0.55;
        model.scale.y = model.scale.x;
    } else {
        model.height = app.renderer.height * 0.55;
        model.scale.x = model.scale.y;
    }

    model.x = app.renderer.width / 2;
    model.y = app.renderer.height;
    model.anchor.set(0.5, 1);
})
.catch(error => {
    console.error('Failed to load model:', error);
});