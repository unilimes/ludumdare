export class Events {
    constructor(renderer) {
        this.events = {};
        this.renderer = renderer;

        THREE.DefaultLoadingManager.onStart = () => {
            this.emit("start");
        };

        THREE.DefaultLoadingManager.onProgress = (item, loaded, total) => {
            let percent = (loaded / total * 100);

            this.emit("progress", percent, item, loaded, total);
        };

        THREE.DefaultLoadingManager.onLoad = () => {
            this.emit("load");
        };

        THREE.DefaultLoadingManager.onError = () => {
            this.emit("error");
        };

        this.renderer.domElement.addEventListener("click", (event) => this.emit("click", event), false);
        this.renderer.domElement.addEventListener("dblclick", (event) => this.emit("dblclick", event), false);
        this.renderer.domElement.addEventListener("contextmenu", (event) => this.emit("contextmenu", event), false);

        this.renderer.domElement.addEventListener("mouseup", (event) => this.emit("mouseup, pointerup", event), false);
        this.renderer.domElement.addEventListener("mouseout", (event) => this.emit("mouseout", event), false);
        this.renderer.domElement.addEventListener("touchend", (event) => this.emit("touchend, pointerup", event), false);
        this.renderer.domElement.addEventListener("touchcancel", (event) => this.emit("touchcancel", event), false);
        this.renderer.domElement.addEventListener("touchleave", (event) => this.emit("touchleave", event), false);

        this.renderer.domElement.addEventListener("mousedown", (event) => this.emit("mousedown, pointerdown", event), false);
        this.renderer.domElement.addEventListener("touchstart", (event) => this.emit("touchstart, pointerdown", event), false);

        this.renderer.domElement.addEventListener("mousemove", (event) => this.emit("mousemove, pointermove", event), false);

        window.addEventListener("orientationchange", () => this.emit("orientationchange"), false);
        window.addEventListener("resize", () => this.emit("resize"), false);
    }

    on(args, callback) {
        args.split(",").forEach((name) => {
            name = name.trim();

            if (this.events[name]) {
                this.events[name].push(callback);
            } else {
                this.events[name] = [callback];
            }
        });
    }

    emit(args, ...params) {
        args.split(",").forEach((name) => {
            name = name.trim();

            if (this.events[name]) {
                this.events[name].forEach((event) => {
                    event(...params);
                });
            }
        });
    }
}
