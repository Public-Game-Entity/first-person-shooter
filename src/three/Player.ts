import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

import store from '../store';


class Player {
    model: any;
    scene: any;
    isMove: boolean;
    radian: number;
    speed: number;
    isJump: boolean;
    velocity: { x: number; y: number; z: number; };
    gun: Gun;
    position: { x: number; y: number; z: number; };
    direction: { x: number; y: number; z: number; };
    acceleration: { x: number; y: number; z: number; };
    timeoutAim: NodeJS.Timeout;

    constructor(scene: any, camera: any) {
        this.model = undefined
        
        this.isMove = false
        this.isJump = false

        this.speed = 0.1
        this.direction = {
            x: 0, 
            y: 0,
            z: 0
        }

        this.acceleration = {
            x: 0, 
            y: 0,
            z: 0
        }

        this.velocity = {
            x: 0, 
            y: 0,
            z: 0
        }

        this.position = {
            x: 0, 
            y: 3,
            z: 0
        }


        this.scene = scene

        this.gun = new Gun(scene, camera)

        document.querySelector("#screen").addEventListener("click", (e) => {
            this.gun.shot({
                position: this.position,
                direction: this.direction
            })


            clearTimeout(this.timeoutAim)
            this.gun.aim.isAim = true

            this.timeoutAim = setTimeout(() => {
                this.gun.aim.isAim = false

            }, 500)

            this.gun.isLock = false
  

        })

    }


    public speedUp() {
        this.speed = 0.3
    }

    public speedDown() {
        this.speed = 0.1
    }


}


class Gun {
    model: any;
    scene: any;
    isLock: boolean;
    isAvailableModel: boolean;
    camera: any;
    aim: { isAim: boolean; aimRate: number; };

    constructor(scene: any, camera: any) {
        this.scene = scene
        this.model = undefined
        this.isLock = true
        this.isAvailableModel = false
        this.camera = camera
        this.aim = {
            isAim: false,
            aimRate: 0
        }

        this.loadModel()
    }


    // "Custom M4A1 COD Warzone" (https://skfb.ly/oLs6M) by BRAVO6Ghost is licensed under Creative Commons Attribution (http://creativecommons.org/licenses/by/4.0/).
    private loadModel() {
        const loader = new GLTFLoader();
        const scale = 0.05

        loader.load('/public/gun.glb', ( gltf ) => {

            this.model = gltf.scene;
            this.model.scale.x = scale
            this.model.scale.y = scale
            this.model.scale.z = scale

            // this.scene.add(this.model)
            this.camera.add(this.model)
            this.isAvailableModel = true
        } );
    }

    public shot({ position, direction }: any) {
        if (this.isLock == true) {
            return 0
        }

        const newBullet = new Bullet({
            position: position,
            direction: direction
        })
        this.scene.add(newBullet.model)
    }
}

class Bullet {
    model: any;
    position: any;
    direction: any;

    constructor({ position, direction }: any) {
        this.model = this.addModel()
        this.position = position
        this.direction = direction

        this.model.position.x = this.position.x
        this.model.position.y = this.position.y
        this.model.position.z = this.position.z

        const mx = new THREE.Matrix4().lookAt(direction,new THREE.Vector3(0,0,0),new THREE.Vector3(0,1,0));
        const qt = new THREE.Quaternion().setFromRotationMatrix(mx);
        this.model.rotation.setFromQuaternion( qt )

        this.animate()
    }

    private addModel() {
        const geometry = new THREE.BoxGeometry( 0.1, 0.1, 1 ); 
        const material = new THREE.MeshBasicMaterial( {color: 0x00ff00} ); 
        const cube = new THREE.Mesh( geometry, material ); 
        return cube
    }

    private move() {
        const speed = 1
        this.model.position.x += this.direction.x * speed
        this.model.position.y += this.direction.y * speed
        this.model.position.z += this.direction.z * speed

    }

    private animate() {
        requestAnimationFrame( this.animate.bind(this) );

        this.move()
    }
    
}

export { Player }