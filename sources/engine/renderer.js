import { Loader } from "./loader.js";
import { Events } from "./events.js";
import { Raycaster } from "./raycaster.js";

export class Renderer {
    constructor(selector) {
        // Init
        this.mode = "normal";

        this.container = (typeof selector == "string" ? document.querySelector(selector) : selector) || document.body;

        this.width = window.innerWidth;
        this.height = window.innerHeight;

        // Scene
        this.scene = new THREE.Scene();
        this.scene.name = "Scene";

        // Clock
        this.clock = new THREE.Clock();

        // Renderer
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true
        });
        this.renderer.setClearColor(0xffffff, 1.0);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(this.width, this.height);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.container.appendChild(this.renderer.domElement);

        // Anisotropy
        this.anisotropy = this.renderer.getMaxAnisotropy();

        // Loader
        this.loader = new Loader(this.anisotropy);

        // Events
        this.events = new Events(this.renderer);

        // Stereo
        this.stereo = new THREE.OculusRiftEffect(this.renderer);

        let hmd = this.stereo.getHMD();

        hmd.hResolution = this.width;
        hmd.vResolution = this.height;

        this.stereo.setHMD(hmd);

        this.stereo.setSize(this.width, this.height);

        // Camera
        this.camera = new THREE.PerspectiveCamera(75, this.width / this.height, 1, 50000);
        this.camera.name = "Camera";
        this.camera.position.set(0, 0, -1);
        this.camera.listener = new THREE.AudioListener();
        this.camera.add(this.camera.listener);
        this.scene.add(this.camera);

        // Raycaster
        this.raycaster = new Raycaster(this.camera, this.renderer);

        // Controls
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.controls.device = false;
        this.controls.inverse = false;
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.25;
        this.controls.target = new THREE.Vector3(0, 0, 0);
        this.controls.update();

        // Transform
        //this.transform = new THREE.TransformControls(this.camera, this.renderer.domElement);
        //this.transform.name = "Transform";
        //this.scene.add(this.transform);

        // Function
        this.listen();
        this.render();
        this.debug();
    }

    listen() {
        this.events.on("orientationchange, resize", () => {
            this.width = window.innerWidth;
            this.height = window.innerHeight;

            this.camera.aspect = this.width / this.height;
            this.camera.updateProjectionMatrix();

            if (this.mode == "vr") {
                let hmd = this.stereo.getHMD();

                hmd.hResolution = this.width;
                hmd.vResolution = this.height;

                this.stereo.setHMD(hmd);

                this.stereo.setSize(this.width, this.height);
            } else {
                this.renderer.setSize(this.width, this.height);
            }
        });
    }

    update(delta) {
        this.events.emit("update", delta);
    }

    render() {
        if (this.mode == "vr") {
            this.stereo.render(this.scene, this.camera);
        } else {
            this.renderer.render(this.scene, this.camera);
        }

        window.requestAnimationFrame(() => {
            let delta = this.clock.getDelta();

            this.controls.update();
            //this.transform.update();

            this.update(delta);
            this.render();
        });
    }

    debug() {
        window.scene = this.scene;
    }
}
