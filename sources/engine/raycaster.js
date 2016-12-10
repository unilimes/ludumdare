export class Raycaster {
    constructor(camera, renderer) {
        this.camera = camera;
        this.renderer = renderer;

        this.raycaster = new THREE.Raycaster();
    }

    hit(event, object, done) {
        let size = this.renderer.getSize();

        let mouse = new THREE.Vector2(
            (event.offsetX / size.width) * 2 - 1,
            -(event.offsetY / size.height) * 2 + 1
        );

        this.raycaster.setFromCamera(mouse, this.camera);

        let intersects = this.raycaster.intersectObject(object, true);

        done(intersects);
    }
}
