import * as THREE from 'three';
import store from '../store';


class Player {
    model: any;
    scene: any;
    isMove: boolean;
    radian: number;
    force: number;
    isJump: boolean;
    velocity: { x: number; y: number; z: number; };

    constructor(scene: any) {
        this.model = undefined
        
        this.isMove = false
        this.isJump = false

        this.radian = 0
        this.force = 0

        this.velocity = {
            x: 0, 
            y: 0,
            z: 0
        }

        this.scene = scene
        

    }


    public jump() {
        this.isJump = true
    }
 
    public setMove({ radian, force }: any) {

        this.radian = radian
        this.force = force
    }



}

export { Player }