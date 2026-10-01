const vm=require('node:vm'),fs=require('node:fs');
const noop=()=>{},ctx=new Proxy({},{get:()=>noop,set:()=>true}),canvas={getContext:()=>ctx,addEventListener:noop,style:{}};
const sandbox={innerWidth:1440,innerHeight:900,devicePixelRatio:1,matchMedia:()=>({matches:false}),document:{querySelector:s=>s==='#field'?canvas:{addEventListener:noop},body:{classList:{add:noop,contains:()=>true}},addEventListener:noop},window:{addEventListener:noop},requestAnimationFrame:noop,Math,console};
vm.createContext(sandbox);vm.runInContext(fs.readFileSync(require('node:path').join(__dirname,'../src/app.js'),'utf8'),sandbox);
console.log(vm.runInContext(`(()=>{
 const report={nodes:nodes.length,edges:edges.length};
 function check(ok,message){if(!ok)throw Error(message);}
 function tick(n){for(let k=0;k<n;k++){if(k%4===0)rebuildGrid();step();}check(nodes.every(p=>Number.isFinite(p.x+p.y)&&Math.abs(p.x)<10000&&Math.abs(p.y)<10000),'Unstable simulation');}
 tick(600);check(!edges.some(e=>e.broken),'Idle rupture');
 let i=nearest(W/2,H/2,50);pin(i);nodes[i].tx+=120;tick(480);check(!edges.some(e=>e.broken),'Moderate drag must not tear');report.moderateDrag='120px, no tears';
 reset();tick(600);
 // Opposing grips sustain extreme stress and exercise the warning period.
 const e=edges.find(e=>nodes[e.a].x>W*.4&&nodes[e.a].x<W*.6&&nodes[e.a].y>H*.4);
 pin(e.a);pin(e.b);const a=nodes[e.a],b=nodes[e.b],dx=b.x-a.x,dy=b.y-a.y,d=Math.hypot(dx,dy),ux=dx/d,uy=dy/d;
 b.tx=a.x+ux*e.rest*(1+e.threshold*1.25);b.ty=a.y+uy*e.rest*(1+e.threshold*1.25);
 let warningStart=null,breakTime=null;
 for(let k=0;k<600;k++){tick(1);if(e.tension/e.threshold>=.78&&warningStart===null)warningStart=time;if(e.broken){breakTime=time;break;}}
 check(breakTime!==null,'Extreme sustained stress must rupture');check(breakTime-warningStart>=1,'Red warning must last at least one second');
 report.redWarningSeconds=+(breakTime-warningStart).toFixed(3);
 check(!a.neighbors.has(e)&&!b.neighbors.has(e),'Rupture must change topology');
 release(e.a);release(e.b);tick(870);check(e.broken,'Scar must persist for 7.25 seconds');
 const oldB=e.b;tick(1500);check(!e.broken,'Delayed adaptive repair');report.adaptiveNeighbor=e.b!==oldB;
 report.memory=+nodes.reduce((s,p)=>s+Math.hypot(p.mx,p.my),0).toFixed(2);check(report.memory>0,'Memory must persist');
 for(let j=0;j<9;j++)pin(j);check(anchors.length===6,'Anchor cap');reset();tick(700);check(!anchors.length&&edges.length===original.length,'Reset topology');check(nodes.every(p=>p.mx===0&&p.my===0),'Reset memory');
 report.resetError=+Math.max(...nodes.map(p=>Math.hypot(p.x-p.rx,p.y-p.ry))).toFixed(3);return report;
})()`,sandbox));
// Regression checks: unchanged rendering/threshold and bounded, qualified neighbor tears.
const before=fs.readFileSync(require('node:path').join(__dirname,'fixtures/rupture-before.js.txt'),'utf8'),after=fs.readFileSync(require('node:path').join(__dirname,'../src/app.js'),'utf8');
if(before.split('function draw(){')[1].split('function frame')[0]!==after.split('function draw(){')[1].split('function frame')[0])throw Error('Stress rendering changed');
if(!after.includes('threshold: 2.5+random()*.6'))throw Error('Threshold changed');
console.log(vm.runInContext(`(()=>{
 reset();resetting=0;tearQueue=[];
 nodes=Array.from({length:7},(_,i)=>({x:i?100:0,y:i*.1,rx:i?100:0,ry:i*.1,vx:0,vy:0,mx:0,my:0,anchor:false,neighbors:new Set(),light:0,damping:.984}));edges=[];
 for(let i=1;i<7;i++){const e=connect(0,i,20);e.threshold=2.5;e.tension=4;e.criticalTime=1.1;e.overloadTime=.7;}
 edges[5].overloadTime=0;
 breakEdge(edges[0]);
 if(tearQueue.length!==3)throw Error('Neighbor tear must cap at three');
 if(tearQueue.includes(edges[5]))throw Error('Insufficient dwell included');
 const queued=tearQueue[0];nodes[queued.b].x=20;
 if(canRupture(queued))throw Error('Unloaded neighbor must not fail');
 if(nodes[0].vx>=0||nodes[1].vx<=0)throw Error('Recoil must separate sides');
 if(edges[0].delay<7.5||edges[0].delay>9)throw Error('Scar duration');
 return {unchangedStressColors:true,unchangedThreshold:true,neighborCap:tearQueue.length,unloadedNeighborProtected:true};
})()`,sandbox));

const polishBefore=fs.readFileSync(require('node:path').join(__dirname,'fixtures/final-polish-before.js.txt'),'utf8');
for(const [start,end] of [['function build(){','function resize()'],['function pin(i)','function breakEdge('],['function draw(){','function reset()'],[' const strain=',' const idle=']]){
 if(polishBefore.split(start)[1].split(end)[0]!==after.split(start)[1].split(end)[0])throw Error('Protected behavior changed: '+start);
}
console.log({protectedBehaviorUnchanged:true});
