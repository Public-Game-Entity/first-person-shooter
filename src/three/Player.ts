import * as THREE from 'three';
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

    constructor(scene: any) {
        this.model = undefined
        
        this.isMove = false
        this.isJump = false

        this.speed = 0.1
        this.direction = {
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

        this.gun = new Gun(scene)

        document.querySelector("#screen").addEventListener("click", (e) => {
            this.gun.shot({
                position: this.position,
                direction: this.direction
            })
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

    constructor(scene: any) {
        this.scene = scene
        this.model = undefined
        this.isLock = true
    }

    shot({ position, direction }: any) {
        if (this.isLock == true) {
            return 0
        }
        console.log("DDD", direction)
        const newBullet = new Bullet({
            position: position,
            direction: direction
        })
        this.scene.add(newBullet.model)
        console.log("D")
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
        // this.model.rotation.y = direction
        // this.model.rotation.set(direction)
        var mx = new THREE.Matrix4().lookAt(direction,new THREE.Vector3(0,0,0),new THREE.Vector3(0,1,0));
        var qt = new THREE.Quaternion().setFromRotationMatrix(mx);
        console.log(qt)
        this.model.rotation.setFromQuaternion( qt )

        this.animate()
    }

    addModel() {
        const geometry = new THREE.BoxGeometry( 0.1, 0.1, 1 ); 
        const material = new THREE.MeshBasicMaterial( {color: 0x00ff00} ); 
        const cube = new THREE.Mesh( geometry, material ); 
        return cube
    }

    move() {
        
        this.model.position.x += this.direction.x / 3
        this.model.position.y += this.direction.y / 3
        this.model.position.z += this.direction.z / 3

        // this.model.position.z += Math.sin(this.direction) / 30

    }

    animate() {
        requestAnimationFrame( this.animate.bind(this) );

        this.move()
    }
    
}

export { Player }