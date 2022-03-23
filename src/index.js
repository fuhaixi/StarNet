import * as THREE from "three";
import { Loader, World } from "../utils/world"; 
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as Universe from './core/Universe'



const world = new World(true)
// Loader.load('/asset/moon/moon.gltf',(gltf)=>{
//     world.world_scene.add(gltf.scene)
//     console.log(gltf.scene)
//     gltf.scene.traverse((obj)=>{
//         obj.receiveShadow=true;
//         obj.castShadow=true;
//     })
// })

// const planet = Universe.randomPlanet()
// world.world_scene.add(planet)

// const {points, mesh} = new Universe.genGrid(3,3);
// world.world_scene.add(points);
// world.world_scene.add(mesh);

world.world_scene.add(Universe.genRoundedCube())

document.onkeydown = (e)=>{
    // var dataURL = rttCanvas.toDataURL();
    
    if(e.key=='a'){
        // window.open(url)
    }
}

// window.open(dataURL)

update()
function update(){
    requestAnimationFrame(update)
    world.render();    

}