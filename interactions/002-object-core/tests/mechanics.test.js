import test from 'node:test';
import assert from 'node:assert/strict';
import {stages,operatingTarget,rotorRadians,damp,phaseName} from '../src/mechanics.js';
test('mechanical stages clear in order and reverse precisely',()=>{
 const home=stages(0);assert.ok(Object.values(home).every(v=>v===0));
 assert.equal(stages(.4).shell,1);assert.equal(stages(.4).rings,0);
 assert.equal(stages(.62).rings,1);assert.equal(stages(.62).stabilizers,0);
 assert.ok(Object.values(stages(1)).every(v=>v===1));
 for(let p=0;p<=1;p+=.001){const s=stages(p);if(s.rings>0)assert.equal(s.shell,1);if(s.stabilizers>0)assert.equal(s.rings,1);}
 assert.equal(phaseName(0),'ASSEMBLED');assert.equal(phaseName(1),'EXPLODED');
});
test('speed tracks RPM and closure removes power',()=>{
 assert.equal(operatingTarget(false,12400,1),0);assert.equal(operatingTarget(true,12400,0),0);
 assert.equal(operatingTarget(true,12400,1),12400);assert.equal(operatingTarget(true,1200,1),1200);
 assert.ok(Math.abs(rotorRadians(7400,1)/rotorRadians(3800,1)-7400/3800)<1e-12);
 assert.ok(rotorRadians(12400,1,true)<rotorRadians(12400,1));
 for(let p=0;p<=1;p+=.01)assert.ok(operatingTarget(true,12400,p)<=12400);
});
test('weighted ramps are timestep-independent and bounded',()=>{
 let a=0,b=0;for(let i=0;i<60;i++)a=damp(a,12400,1.45,1/60);for(let i=0;i<120;i++)b=damp(b,12400,1.45,1/120);
 assert.ok(Math.abs(a-b)<1e-8);assert.ok(a>0&&a<12400);
});

import {engagement,regulation} from '../src/mechanics.js';
import {readFileSync} from 'node:fs';
test('rotor leads inner, middle, then outer ring engagement',()=>{
 assert.deepEqual(engagement(0),[0,0,0]);
 assert.ok(engagement(.7)[2]>0);assert.equal(engagement(.7)[1],0);
 assert.equal(engagement(1.2)[2],1);assert.ok(engagement(1.2)[1]>0);assert.equal(engagement(1.2)[0],0);
 assert.deepEqual(engagement(2.5),[1,1,1]);
});
test('RPM increases resistance, stabilizer travel and high-speed field',()=>{
 const loads=[1200,3800,7400,12400].map(regulation);
 for(let i=1;i<loads.length;i++){assert.ok(loads[i].resistance>loads[i-1].resistance);assert.ok(loads[i].inward>loads[i-1].inward);}
 assert.equal(loads[1].field,0);assert.ok(loads[2].field>0);assert.equal(loads[3].field,1);
});
test('shell geometry, framing and input architecture are preserved',()=>{
 const before=readFileSync(new URL('./refinement-baseline.txt',import.meta.url),'utf8');
 const after=readFileSync(new URL('../src/app.js',import.meta.url),'utf8');
 for(const [start,end] of [['function shellGeometry(){','const panelGeometry='],["canvas.addEventListener('wheel'",'let previous='],[' floor.position.y=-2.1-stage.shell*2.5;',' // Focus is']]){
 assert.equal(after.split(start)[1].split(end)[0],before.split(start)[1].split(end)[0]);
 }
});
