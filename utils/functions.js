let G=6.67*10**-11

G=G**(0.5)

G=8.16E-6

console.log('以下数据均为标准单位')
console.log("G="+G.toExponential())

const M_sun = 1.5E12
const AU = 15000


//轨道周期和半径
const orbital_period = 3200
const orbital_radius = 15000

//地球半径和地球表面加速度以及自转周期
const radius = 32
const g=10
const rotation_period= 300


//根据表面加速度和天体半径，计算天体密度
function cal_ruo(surface_a,R){
    let t= 4*Math.PI*R*G
    return surface_a/t
}

//根据轨道周期和轨道半径，计算中心天体质量
function cal_M(t,r){
    return 4*(Math.PI**2)*(r**3)/(G*t**2)
}

let density=cal_ruo(g,radius)
let mass=g*radius**2/G
let first_universe_velocity = (G*mass/radius)**(0.5)
let v2 = first_universe_velocity*2**0.5
let equator_velocity = 2*Math.PI*radius/rotation_period

console.log("地球密度为"+density)
console.log('地球质量为'+mass.toExponential())
console.log('第一宇宙速度为'+first_universe_velocity)
console.log('第二宇宙速度为'+v2)
// console.log('第三宇宙速度为'+v3)
console.log('地球赤道线速度为'+equator_velocity)



let center_mass= 4*Math.PI**2*orbital_radius**3/(G*orbital_period**2)
let linear_velocity = 2*Math.PI*orbital_radius/orbital_period
let escape_v = (G*center_mass*2/orbital_radius)**0.5 
console.log("中心天体质量为"+center_mass.toExponential())
console.log('地球轨道线速度为'+linear_velocity)
console.log('太阳逃逸速度为'+escape_v)