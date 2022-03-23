import * as THREE from "three";
import { BufferGeometry, FlatShading } from "three";
import {RoundedBoxGeometry} from "three/examples/jsm/geometries/RoundedBoxGeometry"
import { perlin_2d_noise, perlin_3d_noise } from "../../utils/shader";
//基本数值
const G = 8.16E-6
const M_sun = 1.5E12
const AU = 15000



const vshader=`
precision mediump float;
precision mediump int;

varying vec3 vPosition;
varying vec3 vNormal;
varying float vNoise;


vec3 mod289(vec3 x)
{
    return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 mod289(vec4 x)
{
    return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 permute(vec4 x)
{
    return mod289(((x*34.0)+1.0)*x);
}

vec4 taylorInvSqrt(vec4 r)
{
    return 1.79284291400159 - 0.85373472095314 * r;
}

vec3 fade(vec3 t) {
    return t*t*t*(t*(t*6.0-15.0)+10.0);
}

// Classic Perlin noise
float cnoise(vec3 P)
{
    vec3 Pi0 = floor(P); // Integer part for indexing
    vec3 Pi1 = Pi0 + vec3(1.0); // Integer part + 1
    Pi0 = mod289(Pi0);
    Pi1 = mod289(Pi1);
    vec3 Pf0 = fract(P); // Fractional part for interpolation
    vec3 Pf1 = Pf0 - vec3(1.0); // Fractional part - 1.0
    vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
    vec4 iy = vec4(Pi0.yy, Pi1.yy);
    vec4 iz0 = Pi0.zzzz;
    vec4 iz1 = Pi1.zzzz;

    vec4 ixy = permute(permute(ix) + iy);
    vec4 ixy0 = permute(ixy + iz0);
    vec4 ixy1 = permute(ixy + iz1);

    vec4 gx0 = ixy0 * (1.0 / 7.0);
    vec4 gy0 = fract(floor(gx0) * (1.0 / 7.0)) - 0.5;
    gx0 = fract(gx0);
    vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
    vec4 sz0 = step(gz0, vec4(0.0));
    gx0 -= sz0 * (step(0.0, gx0) - 0.5);
    gy0 -= sz0 * (step(0.0, gy0) - 0.5);

    vec4 gx1 = ixy1 * (1.0 / 7.0);
    vec4 gy1 = fract(floor(gx1) * (1.0 / 7.0)) - 0.5;
    gx1 = fract(gx1);
    vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
    vec4 sz1 = step(gz1, vec4(0.0));
    gx1 -= sz1 * (step(0.0, gx1) - 0.5);
    gy1 -= sz1 * (step(0.0, gy1) - 0.5);

    vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);
    vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);
    vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);
    vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);
    vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);
    vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);
    vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);
    vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);

    vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));
    g000 *= norm0.x;
    g010 *= norm0.y;
    g100 *= norm0.z;
    g110 *= norm0.w;
    vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));
    g001 *= norm1.x;
    g011 *= norm1.y;
    g101 *= norm1.z;
    g111 *= norm1.w;

    float n000 = dot(g000, Pf0);
    float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
    float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
    float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
    float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));
    float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
    float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));
    float n111 = dot(g111, Pf1);

    vec3 fade_xyz = fade(Pf0);
    vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);
    vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
    float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x); 
    return 2.2 * n_xyz;
}

// Classic Perlin noise, periodic variant
float pnoise(vec3 P, vec3 rep)
{
    vec3 Pi0 = mod(floor(P), rep); // Integer part, modulo period
    vec3 Pi1 = mod(Pi0 + vec3(1.0), rep); // Integer part + 1, mod period
    Pi0 = mod289(Pi0);
    Pi1 = mod289(Pi1);
    vec3 Pf0 = fract(P); // Fractional part for interpolation
    vec3 Pf1 = Pf0 - vec3(1.0); // Fractional part - 1.0
    vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
    vec4 iy = vec4(Pi0.yy, Pi1.yy);
    vec4 iz0 = Pi0.zzzz;
    vec4 iz1 = Pi1.zzzz;

    vec4 ixy = permute(permute(ix) + iy);
    vec4 ixy0 = permute(ixy + iz0);
    vec4 ixy1 = permute(ixy + iz1);

    vec4 gx0 = ixy0 * (1.0 / 7.0);
    vec4 gy0 = fract(floor(gx0) * (1.0 / 7.0)) - 0.5;
    gx0 = fract(gx0);
    vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
    vec4 sz0 = step(gz0, vec4(0.0));
    gx0 -= sz0 * (step(0.0, gx0) - 0.5);
    gy0 -= sz0 * (step(0.0, gy0) - 0.5);

    vec4 gx1 = ixy1 * (1.0 / 7.0);
    vec4 gy1 = fract(floor(gx1) * (1.0 / 7.0)) - 0.5;
    gx1 = fract(gx1);
    vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
    vec4 sz1 = step(gz1, vec4(0.0));
    gx1 -= sz1 * (step(0.0, gx1) - 0.5);
    gy1 -= sz1 * (step(0.0, gy1) - 0.5);

    vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);
    vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);
    vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);
    vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);
    vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);
    vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);
    vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);
    vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);

    vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));
    g000 *= norm0.x;
    g010 *= norm0.y;
    g100 *= norm0.z;
    g110 *= norm0.w;
    vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));
    g001 *= norm1.x;
    g011 *= norm1.y;
    g101 *= norm1.z;
    g111 *= norm1.w;

    float n000 = dot(g000, Pf0);
    float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
    float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
    float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
    float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));
    float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
    float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));
    float n111 = dot(g111, Pf1);

    vec3 fade_xyz = fade(Pf0);
    vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);
    vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
    float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x); 
    return 2.2 * n_xyz;
}

float turbulence( vec3 p ) {
    float w = 100.0;
    float t = -.5;
    for (float f = 1.0 ; f <= 10.0 ; f++ ){
        float power = pow( 2.0, f );
        t += abs( pnoise( vec3( power * p ), vec3( 10.0, 10.0, 10.0 ) ) / power );
    }
    return t;
}

void main() {
    // vNoise = turbulence(vec3(uv,1.0));
    // vNoise = cnoise(vec3(uv*5.0,1.0)) ;
    vNoise = cnoise(normal)+1.0;
    vNoise = smoothstep(0.6,0.7,vNoise);
    vPosition = position;
    vec3 newPos = position +normal*vNoise*3.0;
    gl_Position = projectionMatrix * modelViewMatrix * vec4( newPos, 1.0 );
    vNormal = normal;
}
`
const vshader2=`
precision mediump float;
precision mediump int;

varying vec3 vNormal;

void main(){
    vNormal = normal;
    gl_Position =vec4(vec3(uv*2.0-1.0,1),1);
}
`

const fshader = `
precision mediump float;
precision mediump int;

uniform float ratio;

varying vec3 vPosition;
varying vec3 vNormal;
varying float vNoise;

void main() {
    // vec3 center = vec3( 0.0,0.0,0.0 );
    // float dist=  distance(vPosition,center)/100.0; 
    // dist = clamp(dist,0.0,1.0); 
    // float color = 1.0-dist ; 
    gl_FragColor = vec4( vec3(vNoise), 1 );
    // gl_FragColor = vec4( vec3(vNoise+1.0), 1 );
    
}
`

const fshader2=`
precision mediump float;
precision mediump int;

varying vec3 vNormal;

void main(){
    
    gl_FragColor = vec4(vNormal,1.0);
}
`


export function randomPlanet(){
    // const planst = new THREE.Object3D()
    // const sphereg = 
    const geometry = new THREE.SphereGeometry(1,256,256)
    // const material = new THREE.MeshBasicMaterial({color:0xff0000})
    const material = new THREE.ShaderMaterial({
        uniforms:{
            ratio:{value:1},
        },
        vertexShader:vshader2,
        fragmentShader: fshader2
    })

    const planet = new THREE.Mesh(geometry, material)
    
    return planet;
}

export function genGrid(width, height){
    const vertices = new Int8Array(width*height*3);
    for (let y = 0, n=0; y < height; y++) {
        for(let x=0; x<width; x++, n++){
            console.log(y)
            vertices[3*n] = x;
            vertices[3*n +1] = y;
            vertices[3*n + 2] = 0;
        }
    }

    const indices = []
    for (let y = 0; y < height-1; y++) {
        for (let x = 0; x < width-1; x++) {
            let n = x+y*width;

            indices.push(n, n+1, n+width, n+1, n+width+1, n+width)
        }
    }

    console.log(indices)

    console.log(vertices)
    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3, false))
    geometry.setIndex(indices)

    const material = new THREE.PointsMaterial({color:0xff0000, size: 5, sizeAttenuation: false })
    const points = new THREE.Points(geometry, material)

    const mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({color:0xffffff}))

    return {points, mesh};
}

const shader={
    vshader:`
    precision mediump float;
    precision mediump int;

    varying float noise;
    varying vec2 vUV;
    varying vNormal;

    ${perlin_3d_noise}

    void main(){
        vNormal = normal;
        vUV = uv;
        noise =0.5+0.5*pnoise(normal);
        noise = smoothstep(0.5,0.55, noise);
        vec3 newPos = position +normal*noise*0.1;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(newPos, 1.0);
        // gl_Position = vec4(vec3(uv, 0.0), 1.0);
    }
    `,
    fshader:`
    precision mediump float;
    precision mediump int;
    varying vec2 vUV;
    varying float noise;

    void main(){
        gl_FragColor = vec4(vec3(vUV, 1.), 1.0);
    }
    `
}

export function genRoundedCube(){
    const geometry = new RoundedBoxGeometry(1,1,1,20,0.5);
    // const material = new THREE.MeshLambertMaterial()
    // material.wireframe=true;
    // const material = new THREE.ShaderMaterial({
    //     vertexShader:shader.vshader,
    //     fragmentShader:shader.fshader
    // })
    const map = new THREE.TextureLoader().load( 'asset/uv-test.png' );
    const material = new THREE.MeshPhongMaterial( { map: map, side: THREE.DoubleSide } );
    return new THREE.Mesh(geometry, material);
}

