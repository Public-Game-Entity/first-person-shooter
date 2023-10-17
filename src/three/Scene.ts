import * as THREE from 'three';
import { Player } from './Player';
import store from '../store'
import { setGameOver } from '../features/gameSlice';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls';
import { Collision } from './Collision';

type BoxType = {
    minX: number, minY: number, maxX: number, maxY: number, minZ: number, maxZ: number
}

class Scene {
    scene: any
    camera: any
    renderer: any
    controls: any

    player: Player;
    activeKeyDown: any[];
    isGameStart: boolean;
    lockControls: PointerLockControls;
    collisionDetect: Collision;
    collisionArray: any[]

    constructor() {


        this.isGameStart = false
        this.activeKeyDown = []
        this.collisionArray = []


        const screen = document.querySelector("#screen")
        
        window.addEventListener("resize", this.handleWindowResize.bind(this) )



        document.addEventListener("keydown", this.handleKeyDown.bind(this))
        document.addEventListener("keyup", this.handleKeyUp.bind(this))

        // screen.addEventListener("touchstart", this.handleTouchDown.bind(this));
        // screen.addEventListener("touchend", this.handleTouchUp.bind(this));
        // screen.addEventListener("touchmove", this.handleTouchMove.bind(this));

        this.init()

    }


    private init() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color( 0x000000 );
        this.scene.fog = new THREE.Fog( 0xa0a0a0, 10, 50 );

        this.player = new Player(this.scene)
    
        const clock = new THREE.Clock();
    
        this.camera = new THREE.PerspectiveCamera( 90, window.innerWidth / window.innerHeight, 0.1, 100 );
        this.camera.position.set( 0, 3, 0 );


        this.scene.add(this.camera);
    
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize( window.innerWidth, window.innerHeight );
        this.renderer.shadowMap.enabled = true
    
        const dirLight = new THREE.DirectionalLight( 0xffffff );
        dirLight.position.set( -40, 400, -70 );
        dirLight.shadow.camera.top = 150;
        dirLight.shadow.camera.right = 150;
        dirLight.shadow.camera.bottom = -150;
        dirLight.shadow.camera.left = -150;
        dirLight.castShadow = true;
        this.scene.add(dirLight);
        
        const hemiLight = new THREE.HemisphereLight( 0x707070, 0x444444 );
        hemiLight.position.set( 0, 120, 0 );
        this.scene.add(hemiLight);
        
        const mesh = new THREE.Mesh( new THREE.PlaneGeometry( 100, 100 ),new THREE.MeshPhongMaterial( { color: 0x999999, depthWrite: true} ) );
        mesh.rotation.x = - Math.PI / 2;
        mesh.receiveShadow = true;
        
        this.scene.add(mesh);
    
        const helper = new THREE.CameraHelper( dirLight.shadow.camera );
        this.scene.add( helper );

        this.collisionDetect = new Collision()


        const weight = {
            x: 10,
            y: 2,
            z: 1,

            xw: 1,
            yw: 4,
            zw: 4
        }


        this.createCube({ weight: weight })
        this.createCube({ weight: {
            x: -10,
            y: 2,
            z: 10,

            xw: 10,
            yw: 40,
            zw: 8
        }})

        this.createCube({ weight: {
            x: -10,
            y: 0,
            z: -10,

            xw: 10,
            yw: 6,
            zw: 8
        }})



                //     minX: 9,
        //     minY: -2,
        //     maxX: 11,
        //     maxY: 4

        this.animate();

        

        document.querySelector("#screen").appendChild( this.renderer.domElement );
        this.lockControls = new PointerLockControls( this.camera, this.renderer.domElement );

        document.querySelector("#screen").addEventListener("click", (e) => {
            this.lockControls.lock()
        })

    }

    private createCube({ weight }: any) {
        const geometry = new THREE.BoxGeometry( weight.xw, weight.yw, weight.zw ); 
        const material = new THREE.MeshStandardMaterial()
        material.metalness = 0.45
        material.roughness = 0.65
        
        const cube = new THREE.Mesh( geometry, material ); 
        cube.position.set(weight.x, weight.y, weight.z)
        cube.receiveShadow = true;
        cube.castShadow = true;
        this.scene.add(cube);

        this.collisionArray.push({
            minX: weight.x - weight.xw/2 - 0.5, 
            minZ: weight.z - weight.zw/2 - 0.5,
            maxX: weight.x + weight.xw/2 + 0.5, 
            maxZ: weight.z + weight.zw/2 + 0.5,

            maxY: weight.y + weight.yw/2 + 0.5, 
            minY: weight.y - weight.yw/2 - 0.5,
        })
    }

    private getCameraDirection() {        
        const vector = this.camera.getWorldDirection(new THREE.Vector3(0,0,0));

        return {
            radian: Math.atan2(vector.z, vector.x) 
        }
    }

    private transformRadianTo2DPosition({ radian }: any) {
        return {
            x: Math.cos(radian),
            y: Math.sin(radian)
        }
    }

    private transformPositionToRadian({ x, y }: any) {
        return {
            radian: Math.atan2(x, y)
        }
    }

    private getRadianFromActiveKey() {

        const totalDirection = {
            x: 0,
            y: 0
        }
        const direction: any = {
            "KeyW": { x: 1, y: 0 },
            "KeyS": { x: -1, y: 0 },
            "KeyD": { x: 0, y: -1 },
            "KeyA": { x: 0, y: 1 },
        }

        for (let index = 0; index < this.activeKeyDown.length; index++) {
            totalDirection.x += direction[this.activeKeyDown[index]].x
            totalDirection.y += direction[this.activeKeyDown[index]].y
        }

        return this.transformPositionToRadian(totalDirection).radian - Math.PI / 2
    }

    private getPlayerMovePosition() {
        const keyRadian = this.getRadianFromActiveKey()
        const radian = this.getCameraDirection().radian + keyRadian
        const position = this.transformRadianTo2DPosition({ radian: radian })

        return {
            x: position.x,
            y: position.y
        }
    }

    private pushActiveKey({ keyCode }: any) {
        const set = new Set([...this.activeKeyDown,keyCode ]);
        const uniqueSet = Array.from(set);
        this.activeKeyDown = uniqueSet
    }

    private removeActiveKey({ keyCode }: any) {
        const index = this.activeKeyDown.indexOf(keyCode)
        if (index > -1) this.activeKeyDown.splice(index, 1)
    }



    updatePlayerDirection() {
        const vector = this.camera.getWorldDirection(new THREE.Vector3(0,0,0));

        this.player.direction = {
            x: vector.x,
            y: vector.y,
            z: vector.z

        }
    }


    //NOTE: 이후 콜리전 설정과 병합 필요 (임시책)
    updatePlayerJump() {


        if (this.player.isJump == true && this.camera.position.y < 50) {
            this.camera.position.y += 0.1
            // this.player.velocity.y += 0.01
        } else {
            // this.player.velocity.y = this.camera.position.y > 3 ? -0.01 : 0
            this.camera.position.y -= this.camera.position.y > 3 ? 0.1 : 0
        }
    }


    private updatePlayerMove() {
        if (this.activeKeyDown.length == 0) {
            this.player.isMove = false
        }
        
        const dt = 1/60
        const k = 0.92
        const position = this.getPlayerMovePosition()
        this.player.acceleration.x = (position.x * this.player.speed * 100) - (k * this.player.velocity.x)
        this.player.acceleration.z = (position.y * this.player.speed * 100) - (k * this.player.velocity.z)  


        if (this.player.isMove == false) {
            this.player.acceleration.x = 0
            this.player.acceleration.z = 0
        }

        this.player.velocity.x += this.player.acceleration.x * dt
        this.player.velocity.y += this.player.acceleration.y * dt
        this.player.velocity.z +=  this.player.acceleration.z * dt
        
        let x = this.camera.position.x + this.player.velocity.x * dt
        let y = this.camera.position.y + this.player.velocity.y * dt
        let z = this.camera.position.z + this.player.velocity.z * dt

        for (let index = 0; index < this.collisionArray.length; index++) {
            const box = this.collisionArray[index];
            
            const isCollision: any = this.checkCollision({ box: box })

            const finalPosition = this.blockCollision({
                isCollision: isCollision,
                x: x,
                y: y,
                z: z,
                box: box
            })

            x = finalPosition.x
            y = finalPosition.y
            z = finalPosition.z
        }

        this.camera.position.set(x, y, z)
        this.player.position = {
            x:x, y:y, z:z
        }

        // this.player.direction = this.getCameraDirection().radian

    }

    blockCollision({ isCollision, x, y, z, box }: any) {
        const padding = 0.5
        if (isCollision) {
            if (x > box.minX && x < box.minX + padding) {
                x = box.minX
                return { x: x,y: y, z: z }
            }

            if (x > box.maxX - padding && x < box.maxX) {
                x = box.maxX
                return { x: x,y: y, z: z }
            }

            if (z > box.minZ && z < box.minZ + padding) {
                z = box.minZ
                return { x: x,y: y, z: z }
            }

            if (z > box.maxZ - padding && z < box.maxZ) {
                z = box.maxZ
                return { x: x,y: y, z: z }
            }


            if (y > box.minY && y < box.minY + padding) {
                y = box.minY
                return { x: x,y: y, z: z }
            }

            if (y > (box.maxY+2) - padding && y < (box.maxY+2)) {
                y = (box.maxY+2)
                return { x: x,y: y, z: z }
            }
        }

        return { x: x,y: y, z: z }
    }

    checkCollision({ box }: {box: BoxType}) {
        const playerBox = {
            minX: this.camera.position.x - 1,
            minZ: this.camera.position.z - 1,
            maxX: this.camera.position.x +1,
            maxZ: this.camera.position.z +1,
            maxY: this.camera.position.y + 1,
            minY: this.camera.position.y - 3
        }
        
        const isCollide = this.collisionDetect.checkAABB({
            box1: box,
            box2: playerBox
        })

        return isCollide
    }




    private animate() {
        requestAnimationFrame( this.animate.bind(this) );

        this.updatePlayerMove()
        this.updatePlayerJump()
        this.updatePlayerDirection()


        this.renderer.render( this.scene, this.camera );
    }




    private handleKeyDown(e: any) {
        const speed = 0.1
        console.log(e.code)

        const functionKey: any = {
            "KeyW": () => {
                this.pushActiveKey({ keyCode: e.code })
                this.player.isMove = true
            },
            "KeyS": () => {
                this.pushActiveKey({ keyCode: e.code })

                this.player.isMove = true
            },
            "KeyD": () => {
                this.pushActiveKey({ keyCode: e.code })

                this.player.isMove = true
            },
            "KeyA": () => {
                this.pushActiveKey({ keyCode: e.code })

                this.player.isMove = true
            },
            "ShiftLeft": () => {
                this.player.speedUp()
            },
            "Space": () => {
                this.player.isJump = true

            }
        }

        if (functionKey[e.code] == undefined) {
            return 0
        }

        functionKey[e.code]()
    }

    private handleKeyUp(e: any) {
        const functionKey: any = {
            "KeyA": () => {
                this.removeActiveKey({ keyCode: e.code })
            },
            "KeyD": () => {
                this.removeActiveKey({ keyCode: e.code })

            },
            "KeyW": () => {
                this.removeActiveKey({ keyCode: e.code })

            },
            "KeyS": () => {
                this.removeActiveKey({ keyCode: e.code })

            },
            "ShiftLeft": () => {
                this.player.speedDown()
            },
            "Space": () => {
                this.player.isJump = false

            }
        }

        if (this.activeKeyDown.length == 0) {
            this.player.isMove = false
        }

        if (functionKey[e.code] == undefined) {
            return 0
        }

        functionKey[e.code]()
    }

    private handleWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight
        this.camera.updateProjectionMatrix()
        this.renderer.setSize(window.innerWidth, window.innerHeight)
    }

}






export { Scene }