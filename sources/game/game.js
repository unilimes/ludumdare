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

        //// Shadow
        //this.shadow = new THREE.Mesh(
        //    new THREE.CylinderBufferGeometry(18, 18, 0.1, 64),
        //    new THREE.ShadowMaterial()
        //);
        //this.shadow.material.opacity = 0.5;
        //this.shadow.name = 'Shadow';
        //this.shadow.position.set(0, 0.5, 0);
        //this.shadow.receiveShadow = true;
        //this.shadow.visible = true;
        //this.scene.add(this.shadow);

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

        // Sun
        let sunMaterial = new THREE.MeshPhongMaterial({
            map: this.loader.loadTexture('resources/models/planet/sun.jpg'),
            normalMap: this.loader.loadTexture('resources/models/planet/sun-normal.png'),
            normalScale: new THREE.Vector2(-1, 1),
            shading: THREE.FlatShading
        });

        this.loader.loadObj('resources/models/planet/planet', { position: [0, 0, 0], scale: 1.0 }, (object) => {
            object.name = 'Sun';

            object.children.forEach((child) => {
                child.material = sunMaterial;
            });

            object.animation = new Tween(object.rotation)
                .to({ y: Math.PI * 2 }, 50000)
                .repeat(Infinity)
                .start();

            this.orbit = new THREE.Group();
            this.orbit.position.set(-1000, 0 -1000);
            this.orbit.add(object);
            this.scene.add(this.orbit);
        });

        // Planet
        let planetMaterial = new THREE.MeshPhongMaterial({
            map: this.loader.loadTexture('resources/models/planet/mars.png'),
            normalMap: this.loader.loadTexture('resources/models/planet/mars-normal.png'),
            normalScale: new THREE.Vector2(-1, 1),
            shading: THREE.FlatShading
        });

        this.loader.loadObj('resources/models/planet/planet', { position: [0, 0, 0], scale: 1.0 }, (object) => {
            object.name = 'Planet';

            object.children.forEach((child) => {
                child.material = planetMaterial;
            });

            object.animation = new Tween(object.rotation)
                .to({ y: Math.PI * 2 }, 50000)
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
