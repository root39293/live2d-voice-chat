// app/static/js/live2d.js
window.PIXI = PIXI;

let lipSyncMouthY = 0;
let lipSyncMouthForm = 0;
let model = null;

function startLipSync() {
    const audioContext = new AudioContext();
    const audio = document.getElementById('audio');
    const audioSource = audioContext.createMediaElementSource(audio);
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 32;
    audioSource.connect(analyser);
    analyser.connect(audioContext.destination);

    const dataArray = new Uint8Array(analyser.frequencyBinCount);

    function updateLipSync() {
        const lipSyncFrequencyThreshold = 50; 

        analyser.getByteFrequencyData(dataArray);

        let totalAmplitude = 0;
        for (let i = 0; i < dataArray.length; i++) {
            totalAmplitude += dataArray[i];
        }
        const averageAmplitude = totalAmplitude / dataArray.length;


        if (averageAmplitude > lipSyncFrequencyThreshold) {
            lipSyncMouthY = Math.min(1, averageAmplitude / 500);
            lipSyncMouthForm = Math.min(1, averageAmplitude / 750);
        } else {
            lipSyncMouthY = 0;
            lipSyncMouthForm = 0;
        }


        if (model) {
            model.internalModel.coreModel.setParameterValueById('ParamMouthOpenY', lipSyncMouthY);
            model.internalModel.coreModel.setParameterValueById('ParamMouthForm', lipSyncMouthForm);
        }

        requestAnimationFrame(updateLipSync);
    }

    audio.onplay = () => {
        audioContext.resume();
        updateLipSync();
    };
}

const app = new PIXI.Application({
    view: document.getElementById('character'),
    autoStart: true,
    backgroundAlpha: 0,
    resizeTo: document.getElementById('character')
});

PIXI.live2d.Live2DModel.from('/static/hiyori_pro_ko/runtime/hiyori_pro_t11.model3.json')
.then(loadedModel => {
    model = loadedModel;
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

    startLipSync();
})
.catch(error => {
    console.error('Failed to load model:', error);
});