export class Loader {
    constructor(anisotropy) {
        this.anisotropy = anisotropy || 1;

        this.obj = new THREE.OBJLoader();
        this.mtl = new THREE.MTLLoader();

        this.textures = {};
    }

    loadObj(model, options, done) {
        let name = model.split("/").pop();
        let path = `${model.substring(0, model.lastIndexOf("/"))}/`;

        this.mtl.setPath(path);
        this.mtl.load(`${name}.mtl`, (materials) => {
            materials.preload();

            this.obj.setMaterials(materials);
            this.obj.setPath(path);
            this.obj.load(`${name}.obj`, (object) => {
                if (typeof options == 'function') {
                    done = options;
                    options = {};
                }

                object.name = options.name || "Object";

                object.position.fromArray(options.position || [0, 0, 0]);
                object.rotation.fromArray(options.rotation || [0, 0, 0]);
                object.scale.set(options.scale || 1, options.scale || 1, options.scale || 1);

                object.traverse((child) => {
                    if (child instanceof THREE.Mesh) {
                        child.current = {};

                        child.original = {};
                        child.original.material = child.material.clone();

                        child.receiveShadow = false;
                        child.castShadow = true;
                    }
                });

                done(object, materials.materials);
            });
        });
    }

    loadTexture(file, done) {
        file = `${file}`;

        if (this.textures[file]) {
            if (typeof done === "function") {
                done(this.textures[file]);
            }

            return this.textures[file];
        } else {
            this.textures[file] = new THREE.TextureLoader().load(file, (texture) => {
                texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
                texture.repeat.set(1, 1);
                texture.anisotropy = this.anisotropy;

                this.textures[file] = texture;

                if (typeof done === "function") {
                    done(this.textures[file]);
                }
            });

            return this.textures[file];
        }
    }
}
