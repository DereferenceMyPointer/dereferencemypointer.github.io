import * as THREE from './three.js';

const three = new THREE.WebGLRenderer();

class WorldElement{
    constructor(scene){
        this(scene, new THREE.Vector3(0, 0, 0));
    }
    constructor(scene, position){
        this.scene = scene;
        this.position = position;
    }

    setPosition(pos){
        this.position = pos;
    }

}

class ModeledElement extends WorldElement{
    constructor(scene, path, fbx, position){
        super(scene);
        this.path = path;
        this.fbx = fbx;
        this.position = position;
        this.isLoaded = false;
    }
    constructor(scene, path){
        this(scene, path, null, new THREE.Vector3(0, 0, 0));
    }
    constructor(scene, path, position){
        super(scene, position);
        this.path = path;
        this.fbx = fbx;
    }

    load(loader, scene){
        loader.load(path, (fbx) => {
            fbx.scale.setScalar(0.1);
            fbx.traverse(c => {
                c.castShadow = true;
            });
            scene.add(fbx);
        })
    }

}

class AnimatedElement extends ModeledElement{
    constructor(scene, path, fbx, position){
        super(scene, path, null);
    }

    constructor(scene, path, position){
        this(scene, path, fbx, position)
    }

    loadAnimation(loader, path){
        if(this.fbx == null){
            throw new console.error("No model for specified object");
        }
    }
}