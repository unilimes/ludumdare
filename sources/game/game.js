import { Renderer } from './../engine/renderer.js';
import { Tween, Easing } from './../engine/tween.js';

export class Game extends Renderer {
    constructor(selector) {
        super(selector);

        // Setting
        this.camera.position.z = -400;

        this.controls.minDistance = 200;
        this.controls.maxDistance = 1000;

        // Fog
        this.scene.fog = new THREE.FogExp2(0x000000, 0.000085);

        // Light
        this.hemisphere = new THREE.HemisphereLight(0xfff8ed, 0x222222, 0.8);
        this.hemisphere.name = 'Hemisphere';
        this.hemisphere.position.set(0, 20, 1);
        this.scene.add(this.hemisphere);

        this.spotlight = new THREE.SpotLight(0xfffef4, 0.3, 0, Math.PI / 2);
        this.spotlight.name = 'Spot';
        this.spotlight.position.set(12, 12, 10).multiplyScalar(3);
        this.spotlight.target.position.set(0, 0, 0);
        this.spotlight.castShadow = true;
        this.spotlight.shadow = new THREE.LightShadow(new THREE.PerspectiveCamera(45, 1, 1, 1000));
        this.spotlight.shadow.bias = 0.0001;
        this.spotlight.shadow.mapSize.width = 2048;
        this.spotlight.shadow.mapSize.height = 2048;
        this.camera.add(this.spotlight);

        // Space
        this.space = new THREE.Mesh(
            new THREE.SphereBufferGeometry(10000, 32, 32),
            new THREE.MeshBasicMaterial({
                map: this.loader.loadTexture('resources/textures/sphere/stars.jpg')
            })
        );
        this.space.geometry.scale(-1, 1, 1);
        this.scene.add(this.space);

        // Audio
        let soundClick = new THREE.Audio(this.camera.listener);

        new THREE.AudioLoader().load('resources/audio/Project_Utopia.ogg', function (buffer) {
            soundClick.setBuffer(buffer);
            soundClick.setVolume(0.5);
        });

        this.events.on('pointerup', () => {
            if (!soundClick.isPlaying) {
                soundClick.play();
            }
        });

        // Sun
        let sunMaterial = new THREE.MeshPhongMaterial({
            map: this.loader.loadTexture('resources/models/planet/sun.jpg'),
            normalMap: this.loader.loadTexture('resources/models/planet/sun-normal.png'),
            normalScale: new THREE.Vector2(-1, 1),
            shading: THREE.FlatShading
        });

        this.loader.loadObj('resources/models/planet/planet', {
            position: [250, 0, 250],
            scale: 0.5
        }, (object) => {
            object.name = 'Sun';

            object.children.forEach((child) => {
                child.material = sunMaterial;
            });

            object.animation = new Tween(object.rotation)
                .to({y: -Math.PI * 2}, 25000)
                .repeat(Infinity)
                .start();

            object.orbit = new THREE.Group();
            object.orbit.position.set(0, 0, 0);
            object.orbit.animation = new Tween(object.orbit.rotation)
                .to({y: -Math.PI * 2}, 25000)
                .repeat(Infinity)
                .start();

            let soundSun = new THREE.PositionalAudio(this.camera.listener);

            new THREE.AudioLoader().load('resources/audio/Bad_Cat_Maste.ogg', (buffer) => {
                soundSun.setLoop(true);
                soundSun.setBuffer(buffer);
                soundSun.setRefDistance(250); // radius
                soundSun.play();
            });

            object.add(soundSun);

            object.orbit.add(object);
            this.scene.add(object.orbit);
        });

        // Planet
        let planetMaterial = new THREE.MeshPhongMaterial({
            map: this.loader.loadTexture('resources/models/planet/mars.png'),
            normalMap: this.loader.loadTexture('resources/models/planet/mars-normal.png'),
            normalScale: new THREE.Vector2(-1, 1),
            shading: THREE.FlatShading
        });

        this.loader.loadObj('resources/models/planet/planet', {
            position: [0, 0, 0],
            scale: 1.0
        }, (object) => {
            object.name = 'Planet';

            object.children.forEach((child) => {
                child.material = planetMaterial;
            });

            object.animation = new Tween(object.rotation)
                .to({y: Math.PI * 2}, 50000)
                .repeat(Infinity)
                .start();

            this.scene.add(object);
        });
    }

    update(delta) {
        super.update(delta);
        Tween.update();
    }
}
