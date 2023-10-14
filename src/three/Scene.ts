import * as THREE from 'three';
import { Player } from './Player';
import store from '../store'
import { setGameOver } from '../features/gameSlice';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls';

class Scene {
    scene: any
    camera: any
    renderer: any
    controls: any
    
    player: Player;
    activeKeyDown: any[];
    isGameStart: boolean;
    lockControls: PointerLockControls;

    constructor() {


        this.isGameStart = false


        const screen = document.querySelector("#screen")
        
        window.addEventListener("resize", this.handleWindowResize.bind(this) )



        // document.addEventListener("keydown", this.handleKeyDown.bind(this))
        // document.addEventListener("keyup", this.handleKeyUp.bind(this))
        // document.addEventListener("keypress", this.handleKeyPress.bind(this))

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
    
        this.camera = new THREE.PerspectiveCamera( 90, window.innerWidth / window.innerHeight, 1, 100 );
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


        
        this.animate();

        document.querySelector("#screen").appendChild( this.renderer.domElement );
        this.lockControls = new PointerLockControls( this.camera, this.renderer.domElement );

        document.querySelector("#screen").addEventListener("click", (e) => {
            this.lockControls.lock()
        })

    }



    private handleWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight
        this.camera.updateProjectionMatrix()
        this.renderer.setSize(window.innerWidth, window.innerHeight)
    }

    private animate() {
        requestAnimationFrame( this.animate.bind(this) );


        this.renderer.render( this.scene, this.camera );
    }





}






export { Scene }