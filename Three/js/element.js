import * as THREE from './three.js';
import {FBXLoader} from 'https://cdn.jsdelivr.net/npm/three@0.118.3/examples/jsm/loaders/FBXLoader.js';


class WorldElement{
    constructor(scene, position){
        this.scene = scene;
        this.position = position;
        this.updates = [];
        this.updates.push(this.update);
    }

    static WorldElement2(scene){
        return new WorldElement(scene, new THREE.Vector3(0, 0, 0));
    }

    setPosition(pos){
        this.position = pos;
    }

}

class ModeledElement extends WorldElement{
    constructor(scene, path, fbx, position){
        super(scene, position);
        this.path = path;
        this.fbx = fbx;
        this.position = position;
        this.isLoaded = false;
    }
    static ModeledElement2(scene, path){
        return new ModeledElement(scene, path, null, new THREE.Vector3(0, 0, 0));
    }
    static ModeledElement3(scene, path, position){
        return new ModeledElement(scene, path, null, position);
    }

    load(loader, scene){
        loader.load(path, (fbx) => {
            fbx.scale.setScalar(0.1);
            fbx.traverse(c => {
                c.castShadow = true;
            });
            fbx = fbx.scene;
            fbx.position.set(this.position);
            scene.add(fbx);
            this.fbx = fbx;
        })
    }

}

class AnimatedElement extends ModeledElement{
    constructor(scene, path, fbx, position){
        super(scene, path, fbx, null, position);
        this.animations = [];
    }

    static AnimatedElement2(scene, path, position){
        return new AnimatedElement(scene, path, fbx, position)
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