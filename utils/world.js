import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import Stats from 'three/examples/jsm/libs/stats.module'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { DirectionalLightHelper } from 'three';

export class World{
    renderer = new THREE.WebGLRenderer({antialias:true});
    camera ;
    world_scene = new THREE.Scene();
    go_list=[];
    canvas;
    window;
    stats;
    debugdiv;
    logs=[];
    rtt_buffer;

    constructor(fast_setup=true){
        //setup scene
        const scope = this;

        this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
        document.body.appendChild( this.renderer.domElement );
        this.canvas = this.renderer.domElement;
        this.camera.position.set(0,0,3);
        this.camera.lookAt(new THREE.Vector3(0,0,0))
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMap=true
        let control;
        this.renderer.setPixelRatio(window.devicePixelRatio);

        if(fast_setup){
            const AmbientLight = new THREE.AmbientLight(0xffffff,0.2)
            const directLight = new THREE.DirectionalLight(0xffffff,1)
            this.renderer.setClearColor(0xaaaaaa)
            this.world_scene.add(AmbientLight)
            this.world_scene.add(directLight)
            directLight.castShadow=true
            directLight.position.set(5,5,5)
            this.world_scene.add(new DirectionalLightHelper(directLight))
            control = new OrbitControls(this.camera,this.renderer.domElement)
        }

        //set for debug
        this.stats = new Stats()
        document.body.appendChild(this.stats.dom)
        this.debugging=false

        this.debugdiv = document.createElement('div')
        this.debugdiv.style.cssText="word-break: keep-all;position:fixed;top:0;right:0;opacity:0.9;border: solid 2px;width:30%;height:20%;overflow:scroll;font-size: x-small;"
        this.debugdiv.style.background='#ffffffa4'
        this.debugdiv.innerHTML="debug"
        document.body.appendChild(this.debugdiv)

        //trigger to enable debug
        this.debug_trigger=document.createElement('div')
        this.debug_trigger.style.cssText="-moz-user-select: none;position:fixed;top:25%;left:0;width:50px;height:25px;"
        this.debug_trigger.style.background='#6666ff'
        this.debug_trigger.style.borderRadius='0 12px 12px 0';
        
        function toggleDeubg(e){
            scope.debugging=!scope.debugging
            // scope.log(scope.debugging)
            if(scope.debugging){
                scope.stats.dom.style.display="block"
                scope.debug_trigger.style.background='#6666ff'
                scope.debugdiv.style.display="block"
            }
            else{
                scope.stats.dom.style.display="none"
                scope.debug_trigger.style.background='#ffffffa4'
                scope.debugdiv.style.display="none"
            }

        }
        scope.stats.dom.style.display="none"
        scope.debug_trigger.style.background='#ffffffa4'
        scope.debugdiv.style.display="none"

        this.debug_trigger.onclick=toggleDeubg
        document.body.appendChild(this.debug_trigger)





        //set for fullscreen
        function requestFullScreen(element) {
            // Supports most browsers and their versions.
            var requestMethod = element.requestFullScreen || element.webkitRequestFullScreen || element.mozRequestFullScreen || element.msRequestFullScreen;
        
            if (requestMethod) { // Native full screen.
                requestMethod.call(element);
            } else if (typeof window.ActiveXObject !== "undefined") { // Older IE.
                var wscript = new ActiveXObject("WScript.Shell");
                if (wscript !== null) {
                    wscript.SendKeys("{F11}");
                }
            }
        }
       
        
        
        window.addEventListener("resize",()=>{
            this.camera.aspect = window.innerWidth / window.innerHeight
            this.camera.updateProjectionMatrix()
            this.renderer.setSize(window.innerWidth, window.innerHeight)
        });

    }

    onResize(){
        console.log(this);
        this.camera.aspect = this.window.innerWidth / this.window.innerHeight
        this.camera.updateProjectionMatrix()
        this.renderer.setSize(window.innerWidth, window.innerHeight)
    }

    rtt(rtTexture, rttCamera, rttScene, width, height){
        if( this.rtt_buffer == null){
            this.rtt_buffer = new Uint8Array(width*height);

        }
        this.renderer.setRenderTarget(rtTexture)
        this.renderer.clear();
        this.renderer.render(rttScene,rttCamera);
        this.renderer.readRenderTargetPixels(rtTexture,0,0,width,height,this.rtt_buffer)
        return this.rtt_buffer;
    }


    render(){
        this.renderer.render( this.world_scene, this.camera );
        this.stats.update()
    }

    //打印到debugui
    log(text){
        this.logs.push(this.logs.length+1+"> "+text)
        this.debugdiv.innerHTML=this.logs.join('<br>');
        if(this.logs.length>100) this.logs.length=0;
        this.debugdiv.scrollTo(0,this.debugdiv.scrollHeight)
    }
}

export const Loader = new GLTFLoader();

