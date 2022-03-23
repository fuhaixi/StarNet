export const perlin_3d_noise=`
vec3 random( vec3 p ) {
    p = vec3(
            dot(p,vec3(127.1,311.7,69.5)),
            dot(p,vec3(269.5,183.3,132.7)), 
            dot(p,vec3(247.3,108.5,96.5)) 
            );
    return -1.0 + 2.0*fract(sin(p)*43758.5453123);
}
float pnoise (vec3 p) {
    vec3 i = floor(p);
    vec3 s = fract(p);

    // 3D网格有8个顶点
    float a = dot(random(i),s);
    float b = dot(random(i + vec3(1, 0, 0)),s - vec3(1, 0, 0));
    float c = dot(random(i + vec3(0, 1, 0)),s - vec3(0, 1, 0));
    float d = dot(random(i + vec3(0, 0, 1)),s - vec3(0, 0, 1));
    float e = dot(random(i + vec3(1, 1, 0)),s - vec3(1, 1, 0));
    float f = dot(random(i + vec3(1, 0, 1)),s - vec3(1, 0, 1));
    float g = dot(random(i + vec3(0, 1, 1)),s - vec3(0, 1, 1));
    float h = dot(random(i + vec3(1, 1, 1)),s - vec3(1, 1, 1));

    // Smooth Interpolation
    vec3 u = smoothstep(0.,1.,s);

    // 根据八个顶点进行插值
    return mix(mix(mix( a, b, u.x),
                mix( c, e, u.x), u.y),
            mix(mix( d, f, u.x),
                mix( g, h, u.x), u.y), u.z);
}
float noise_turbulence(vec3 p)
{
    float f = 0.0;
    float a = 1.;
    p = 4.0 * p;
    for (int i = 0; i < 5; i++) {
        f += a * abs(pnoise(p));
        p = 2.0 * p;
        a /= 2.;
    }
    return f;
}
`

export const perlin_2d_noise=`
vec2 random(vec2 p){
    return 0.5 + 0.5*fract(
        sin(
            vec2(
                dot(p, vec2(127.1, 311.7)),
                dot(p, vec2(269.5, 183.3))
            )
        )*43758.5453
    );
}

float pnoise(vec2 p){
    vec2 i = floor(p);
    vec2 f = fract(p);

    float c00 = dot(random(i), f);
    float c01 = dot(random(i + vec2(0.0, 1.0)), f - vec2(0.0, 1.0));
    float c11 = dot(random(i + vec2(1.0, 1.0)), f - vec2(1.0, 1.0));
    float c10 = dot(random(i + vec2(1.0, 0.0)), f - vec2(1.0, 0.0));
    // f = smoothstep(0.0, 1.0, f);
    return mix(mix(c00, c10, f.x), mix(c01, c11, f.x), f.y);
}
`