import * as THREE from 'three';
import store from '../store';


class Player {
    model: any;
    scene: any;
    isMove: boolean;
    radian: number;
    force: number;
    isJump: boolean;
    fadeForce: number;
    interval: NodeJS.Timer;
    fadeJump: number;

    constructor(scene: any) {
        this.model = undefined
        this.interval = undefined
        this.isMove = false
        this.isJump = false

        this.radian = 0
        this.force = 0
        this.fadeForce = 0.6
        this.fadeJump = 0



        this.scene = scene

    }





    public move() {
        if (this.isMove == false) {
            return 0
        }
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