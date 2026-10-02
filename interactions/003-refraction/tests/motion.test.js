import test from 'node:test';import assert from 'node:assert/strict';import {advance,contains,boundary} from '../src/motion.js';
test('body settles without snapping or numerical drift',()=>{for(const reduced of [false,true]){const s={x:0,y:0,vx:0,vy:0};advance(s,200,80,1/120,reduced);assert.ok(s.x>0&&s.x<10);for(let i=0;i<1200;i++)advance(s,200,80,1/120,reduced);assert.ok(Math.abs(s.x-200)<.01);assert.ok(Math.abs(s.y-80)<.01);}});
test('asymmetric body hit area excludes background',()=>{assert.ok(contains(0,0,160));assert.ok(!contains(400,0,160));assert.notEqual(boundary(0),boundary(Math.PI));for(let i=0;i<360;i++)assert.ok(boundary(i*Math.PI/180)>.8);});

import {advanceStrain} from '../src/motion.js';
test('velocity strain is directional, delayed, bounded and settles',()=>{
 const s={xx:0,xy:0,yy:0,vxx:0,vxy:0,vyy:0};
 advanceStrain(s,1200,0,1/240);assert.ok(s.xx>0&&s.xx<.005);assert.ok(s.yy<0);
 for(let i=0;i<240;i++)advanceStrain(s,1200,0,1/240);
 assert.ok(s.xx>.099&&s.xx<=.10001);assert.ok(s.yy<-.039&&s.yy>=-.04001);assert.equal(s.xy,0);
 for(let i=0;i<160;i++)advanceStrain(s,0,0,1/240);
 assert.ok(Math.abs(s.xx)<.0002&&Math.abs(s.yy)<.0002);
 for(let i=0;i<240;i++)advanceStrain(s,0,1200,1/240);
 assert.ok(s.yy>.099&&s.xx<-.039);
});
