export const SPECS={car:{width:1.9,length:4.4,mass:1450,max:78,accel:13,grip:8},bike:{width:.8,length:2.3,mass:260,max:86,accel:17,grip:11},truck:{width:2.5,length:8,mass:8500,max:48,accel:6,grip:4},bus:{width:2.5,length:10,mass:12000,max:43,accel:5,grip:3.5}};
export function body(type,x,z){return {type,...SPECS[type],x,z,vx:0,vz:0,impact:0};}
// Metres, seconds and kilograms. Impulses plus positional contact correction.
export function collide(a,b){
 const dx=b.x-a.x,dz=b.z-a.z,ox=(a.width+b.width)/2-Math.abs(dx),oz=(a.length+b.length)/2-Math.abs(dz);
 if(ox<=0||oz<=0)return null;
 const side=ox<oz,nx=side?(Math.sign(dx)||1):0,nz=side?0:(Math.sign(dz)||1),ia=1/a.mass,ib=1/b.mass,sum=ia+ib,depth=(side?ox:oz)+.001;
 a.x-=nx*depth*ia/sum;a.z-=nz*depth*ia/sum;b.x+=nx*depth*ib/sum;b.z+=nz*depth*ib/sum;
 const closing=(b.vx-a.vx)*nx+(b.vz-a.vz)*nz;if(closing>=0)return null;
 const j=-1.12*closing/sum;a.vx-=j*nx*ia;a.vz-=j*nz*ia;b.vx+=j*nx*ib;b.vz+=j*nz*ib;
 const tx=-nz,tz=nx,slip=(b.vx-a.vx)*tx+(b.vz-a.vz)*tz,f=Math.max(-j*.24,Math.min(j*.24,-slip/sum));
 a.vx-=f*tx*ia;a.vz-=f*tz*ia;b.vx+=f*tx*ib;b.vz+=f*tz*ib;
 a.impact=Math.max(a.impact,Math.min(1,j*ia/18));b.impact=Math.max(b.impact,Math.min(1,j*ib/18));return {strength:-closing,x:(a.x+b.x)/2,z:(a.z+b.z)/2};
}
export function barrier(b,halfRoad=6.9){const edge=halfRoad-b.width/2;if(Math.abs(b.x)<=edge)return 0;const side=Math.sign(b.x),hit=Math.max(0,b.vx*side);b.x=side*edge;if(hit>0){b.vx=-side*hit*.28;b.vz*=Math.max(.65,1-hit*.025);b.impact=Math.min(1,hit/7);}return hit;}
