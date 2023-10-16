import * as THREE from 'three';
import { Player } from './Player';
import store from '../store'
import { setGameOver } from '../features/gameSlice';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls';
import { Collision } from './Collision';

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

    constructor() {


        this.isGameStart = false
        this.activeKeyDown = []


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


        const geometry = new THREE.BoxGeometry( 1, 4, 4 ); 
        const material = new THREE.MeshStandardMaterial()
        material.metalness = 0.45
        material.roughness = 0.65
        
        const cube = new THREE.Mesh( geometry, material ); 
        cube.position.set(10,2,1)
        cube.receiveShadow = true;
        cube.castShadow = true;

        this.scene.add(cube);

        this.animate();

        

        document.querySelector("#screen").appendChild( this.renderer.domElement );
        this.lockControls = new PointerLockControls( this.camera, this.renderer.domElement );

        document.querySelector("#screen").addEventListener("click", (e) => {
            this.lockControls.lock()
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
    playerJump() {


        if (this.player.isJump == true && this.camera.position.y < 5) {
            this.camera.position.y += 0.1
            this.player.velocity.y += 0.1
        } else {
            this.player.velocity.y = 0
            this.camera.position.y -= this.camera.position.y > 3 ? 0.1 : 0
        }
    }


    private playerMove() {


        if (this.activeKeyDown.length == 0) {
            this.player.isMove = false
        }
        
        if (this.player.isMove == false) {
            return 0
        }

        const isCollision: any = this.checkCollision()


        const position = this.getPlayerMovePosition()
        this.player.velocity.x = (position.x * this.player.speed) * (isCollision ? -1.2 : 1)
        this.player.velocity.z = (position.y * this.player.speed) * (isCollision ? -1.2 : 1)
        
        const x = this.camera.position.x + this.player.velocity.x 
        const y = this.camera.position.y + this.player.velocity.y
        const z = this.camera.position.z + this.player.velocity.z

        this.camera.position.set(x, y, z)
        this.player.position = {
            x:x, y:y, z:z
        }

        // this.player.direction = this.getCameraDirection().radian

    }

    checkCollision() {
        const box = {
            minX: 9.5,
            minY: -1,
            maxX: 10.5,
            maxY: 3
        }

        const playerBox = {
            minX: this.camera.position.x - 0.5,
            minY: this.camera.position.z - 0.5,
            maxX: this.camera.position.x + 0.5,
            maxY: this.camera.position.z + 0.5
        }

        const isCollide = this.collisionDetect.checkAABB({
            box1: box,
            box2: playerBox
        })

        return isCollide

    }




    private animate() {
        requestAnimationFrame( this.animate.bind(this) );

        this.playerMove()
        this.playerJump()
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