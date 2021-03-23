import * as THREE from './three.js';
import {FBXLoader} from 'https://cdn.jsdelivr.net/npm/three@0.118.3/examples/jsm/loaders/FBXLoader.js';

const three = new THREE.WebGLRenderer();

class WorldElement{
    constructor(scene){
        this(scene, new THREE.Vector3(0, 0, 0));
    }
    constructor(scene, position){
        this.scene = scene;
        this.position = position;
        this.updates = [];
        this.updates.add(this.update);
    }

    setPosition(pos){
        this.position = pos;
    }

    update();

}

class ModeledElement extends WorldElement{
    constructor(scene, path, fbx, position){
        super(scene, position);
        this.path = path;
        this.fbx = fbx;
        this.position = position;
        this.isLoaded = false;
    }
    constructor(scene, path){
        this(scene, path, null, new THREE.Vector3(0, 0, 0));
    }
    constructor(scene, path, position){
        super(scene, path, null, position);
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
        super(scene, path, fbx, null, position);
        this.animations = [];
    }

    constructor(scene, path, position){
        this(scene, path, fbx, position)
    }

    loadAnimation(loader, path, name){
        if(this.fbx == null){
            throw new console.error("No model for specified object");
        }
        this.animations.add({
            name: name,
            animation: new THREE.AnimationMixer(this.fbx)
        });
    }
}

export {WorldElement};
export {ModeledElement};
export {AnimatedElement};