import * as THREE from './three.js';
import {FBXLoader} from 'https://cdn.jsdelivr.net/npm/three@0.118.3/examples/jsm/loaders/FBXLoader.js';


class WorldElement{
    constructor(scene, position, name){
        this.scene = scene;
        this.position = position;
        this.name = name;
        this.updates = {};
    }

    static WorldElement2(scene, name){
        return new WorldElement(scene, new THREE.Vector3(0, 0, 0), name);
    }

    setPosition(pos){
        this.position = pos;
    }

}

class ModeledElement extends WorldElement{
    constructor(scene, name, path, fbx, position){
        super(scene, position);
        this.path = path;
        this.fbx = fbx;
        this.position = position;
        this.name = name;
        this.isLoaded = false;
    }
    static ModeledElement2(scene, name, path){
        return new ModeledElement(scene, name, path, null, new THREE.Vector3(0, 0, 0));
    }
    static ModeledElement3(scene, name, path, position){
        return new ModeledElement(scene, name, path, null, position);
    }

    load(loader, scene){
        loader.load(this.path, (fbx) => {
            fbx.scale.setScalar(0.1);
            fbx.traverse(c => {
                c.castShadow = true;
            });
            if(this.position === null){
                fbx.position.set(0, 0, 0);
            } else {
                fbx.position.set(this.position.x, this.position.y, this.position.z);
            }
            scene.add(fbx);
            this.fbx = fbx;
            this.isLoaded = true;
        });
    }

}

class AnimatedElement extends ModeledElement{
    constructor(scene, name, path, fbx, position){
        super(scene, name, path, fbx, null, position);
        this.animations = {};
    }

    static AnimatedElement2(scene, name, path, position){
        return new AnimatedElement(scene, name, path, null, position)
    }

    loadAnimation(loader, path, name){
        if(this.fbx == null){
            console.log('Model not yet loaded');
            return;
        }
        loader.load(path, (anim) => {
            const m = new THREE.AnimationMixer(fbx);
            this.animations[name] = m.clipAction(anim.animations[0]);
        })
    }

    playAnimation(name){
        this.animations[name].play();
    }

}

export {WorldElement};
export {ModeledElement};
export {AnimatedElement};