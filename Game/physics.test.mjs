import test from 'node:test';
import assert from 'node:assert/strict';
import {body,collide,barrier} from './physics.mjs';
test('rear impact conserves momentum and separates unequal masses',()=>{const a=body('car',0,0),b=body('truck',0,6);a.vz=70;b.vz=18;const momentum=a.mass*a.vz+b.mass*b.vz;assert.ok(collide(a,b));assert.ok(a.vz<70);assert.ok(b.vz>18);assert.ok(b.z-a.z>=(a.length+b.length)/2);assert.ok(Math.abs(a.mass*a.vz+b.mass*b.vz-momentum)<1e-6);});
test('side impact transfers momentum without adding energy',()=>{const a=body('bike',0,0),b=body('bus',1.5,0);a.vx=8;const energy=.5*a.mass*a.vx**2;assert.ok(collide(a,b));assert.ok(b.vx>0);assert.ok(.5*a.mass*a.vx**2+.5*b.mass*b.vx**2<=energy);assert.ok(b.x-a.x>=(a.width+b.width)/2);});
test('separated vehicles and separating contacts receive no impulse',()=>{const a=body('car',0,0),b=body('car',4,0);assert.equal(collide(a,b),null);b.x=1.8;b.vx=3;assert.equal(collide(a,b),null);assert.equal(b.vx,3);});
test('barriers rebound velocity and contain every vehicle size',()=>{for(const type of ['car','truck','bus','bike']){const b=body(type,7,0);b.vx=5;b.vz=30;assert.equal(barrier(b),5);assert.ok(b.vx<0);assert.ok(b.x+b.width/2<=6.9);assert.ok(b.vz<30);}});
test('120 Hz stepping prevents high-speed tunnelling into stopped bus',()=>{const a=body('car',0,0),b=body('bus',0,15);a.vz=94;let hit=false;for(let i=0;i<60;i++){a.z+=a.vz/120;b.z+=b.vz/120;hit=!!collide(a,b)||hit;}assert.ok(hit);assert.ok(a.z<b.z);});
