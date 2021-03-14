import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.118/build/three.module.js';

import {OrbitControls} from 'https://cdn.jsdelivr.net/npm/three@0.118/examples/jsm/controls/OrbitControls.js';
import {GLTFLoader} from 'https://cdn.jsdelivr.net/npm/three@0.118.3/examples/jsm/loaders/GLTFLoader.js';
import {FBXLoader} from 'https://cdn.jsdelivr.net/npm/three@0.118.3/examples/jsm/loaders/FBXLoader.js'

class MainGame{
    constructor(){
        this.Initialize();
    }

    Initialize(){
        this.three = new THREE.WebGLRenderer({
            antialias: true,
        });
        this.three.outputEncoding = THREE.sRGBEncoding;
        this.three.gammaFactor = 2.2;
        this.three.shadowMap.enabled = true;
        this.three.shadowMap.type = THREE.PCFSoftShadowMap;
        this.three.setPixelRatio(window.devicePixelRatio);
        this.three.setSize(window.innerWidth, window.innerHeight);
        this.three.domElement.id = 'three';

        document.body.appendChild(this.three.domElement);

        const fov = 60;
        const aspect = 1920 / 1080;
        const near = 1.0;
        const far = 1000.0;
        this.camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
        this.camera.position.set(75, 20, 0);

        this.scene = new THREE.Scene();

        let light = new THREE.DirectionalLight(0xFFFFFF);
        light.position.set(100, 100, 100);
        light.target.position.set(0, 0, 0);
        light.castShadow = true;
        light.shadow.bias = -0.01;
        light.shadow.mapSize.width = 2048;
        light.shadow.mapSize.height = 2048;
        light.shadow.camera.far = 500;
        light.shadow.camera.left = 200;
        light.shadow.camera.right = -200;
        light.shadow.camera.top = 200;
        light.shadow.camera.bottom = -200;
        this.scene.add(light);

        light = new THREE.AmbientLight(0x404040);
        this.scene.add(light);

        const controls = new OrbitControls(this.camera, this.three.domElement);
        controls.target.set(0, 0, 0);
        controls.update();
        
        const geometry = new THREE.BoxGeometry(5, 5, 5);
        const material = new THREE.MeshStandardMaterial( { color: 0x00ff00 } );
        const cube = new THREE.Mesh( geometry, material );
        cube.position.set(0, 5, 0);
        cube.castShadow = true;
        cube.receiveShadow = true;
        this.scene.add(cube);

        const plane = new THREE.Mesh(
            new THREE.PlaneGeometry(100, 100, 1, 1),
            new THREE.MeshStandardMaterial( {color: 0xFFFFFF} )
        );
        plane.castShadow = false;
        plane.receiveShadow = true;
        plane.rotation.x = -Math.PI / 2;
        this.scene.add(plane);

        this.LoadAnimatedModel();

        this.RAF();

    }

    OnWindowResize(){
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.three.setSize(window.innerWidth, window.innerHeight);
    }

    RAF(){
        requestAnimationFrame(() => {
            this.three.render(this.scene, this.camera);
            this.RAF();
        })
    }

    LoadAnimatedModel(){
        const loader = new FBXLoader();
        loader.setPath('/Models/');
        loader.load('Guy.fbx', (fbx) => {
            fbx.scale.setScalar(0.1);
            fbx.traverse(c => {
                c.castShadow = true;
            });

            const anim = new FBXLoader();
            anim.setPath('/Animations/');
            anim.load('Dance.fbx', (anim) => {
                this.mixer = new THREE.AnimationMixer(fbx);
                const dance = this.mixer.clipAction(anim.animations[0]);
                dance.play();
            });
            this.scene.add(fbx);
        })
    }

}

let APP = null;

window.addEventListener('DOMContentLoaded', () => {
  APP = new MainGame();
});