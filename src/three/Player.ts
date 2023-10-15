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

    constructor(scene: any) {
        this.model = undefined
        
        this.isMove = false
        this.isJump = false

        this.speed = 0.1

        this.velocity = {
            x: 0, 
            y: 0,
            z: 0
        }

        this.scene = scene
        

    }


    public speedUp() {
        this.speed = 0.3
    }

    public speedDown() {
        this.speed = 0.1
    }


}

export { Player }