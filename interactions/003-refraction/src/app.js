import {advance,advanceStrain,clamp,contains} from './motion.js';
const canvas=document.querySelector('#field'),gl=canvas.getContext('webgl',{alpha:false,antialias:false,depth:false,powerPreference:'low-power'});
if(!gl){document.querySelector('#error').hidden=false;document.querySelector('#error').textContent='This optical study requires WebGL. Please enable hardware acceleration in your browser.';throw Error('WebGL unavailable');}
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
const vertex=`attribute vec2 position;void main(){gl_Position=vec4(position,0.,1.);}`;
const fragment=`precision highp float;
uniform sampler2D field;uniform vec2 resolution;uniform float dpr;uniform vec2 center;uniform vec3 strain;uniform float radius;uniform float pressure;uniform float energy;
vec3 sampleField(vec2 p){return texture2D(field,clamp(vec2(p.x/resolution.x,1.-p.y/resolution.y),vec2(.001),vec2(.999))).rgb;}
void main(){
 vec2 p=vec2(gl_FragCoord.x/dpr,resolution.y-gl_FragCoord.y/dpr);
 vec2 delta=p-center;
 // Damped directional strain elongates along travel and compresses across it.
 vec2 local=delta-mat2(strain.x,strain.y,strain.y,strain.z)*delta;
 float c=cos(-.32),s=sin(-.32);vec2 q=mat2(c,s,-s,c)*local/radius;
 q/=vec2(1.06,.9)*(1.-pressure*.025);
 float angle=atan(q.y,q.x);float edge=1.+.11*cos(angle)+.055*sin(2.*angle);
 float r=length(q)/edge;float px=1.3/radius;
 float mask=1.-smoothstep(1.-px,1.+px,r);
 // Clear magnifying core, nonlinear middle, and a steep peripheral displacement.
 float power=1.+pressure*.32+energy*.13;
 float bend=(.105+.15*r*r+.24*pow(min(r,1.),7.))*power;
 vec2 warped=center+delta*(1.-bend);
 warped+=vec2(-delta.y,delta.x)*.021*sin(r*3.14159)*pressure;
 float split=(.35+energy*2.0+pressure*.45)*(.15+pow(min(r,1.),5.)*1.9);
 vec2 normal=normalize(delta+vec2(.0001));
 vec3 refracted=vec3(sampleField(warped+normal*split).r,sampleField(warped).g,sampleField(warped-normal*split).b);
 vec3 base=sampleField(p);vec3 color=mix(base,refracted,mask);
 // A narrow edge response describes thickness without tinting or frosting the body.
 float rim=exp(-pow((r-.992)/(.85/radius),2.));
 float light=dot(normal,normalize(vec2(-.7,-1.)));
 color+=rim*mix(-.025,.035,light*.5+.5);
 float contact=exp(-pow((r-1.012)/(.9/radius),2.))*.006;
 color-=contact;
 gl_FragColor=vec4(color,1.);
}`;
function shader(type,source){const s=gl.createShader(type);gl.shaderSource(s,source);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw Error(gl.getShaderInfoLog(s));return s;}
const program=gl.createProgram();gl.attachShader(program,shader(gl.VERTEX_SHADER,vertex));gl.attachShader(program,shader(gl.FRAGMENT_SHADER,fragment));gl.linkProgram(program);if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw Error(gl.getProgramInfoLog(program));gl.useProgram(program);
const buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),gl.STATIC_DRAW);const attribute=gl.getAttribLocation(program,'position');gl.enableVertexAttribArray(attribute);gl.vertexAttribPointer(attribute,2,gl.FLOAT,false,0,0);
const uniforms=Object.fromEntries(['field','resolution','dpr','center','strain','radius','pressure','energy'].map(n=>[n,gl.getUniformLocation(program,n)]));
const texture=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,texture);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,true);
const source=document.createElement('canvas'),ctx=source.getContext('2d');let w=innerWidth,h=innerHeight,dpr=1,radius=160;
const state={x:w*.56,y:h*.46,vx:0,vy:0,tx:w*.56,ty:h*.46,pressure:0,energy:0};
const strain={xx:0,xy:0,yy:0,vxx:0,vxy:0,vyy:0};
const pointer={x:-9999,y:-9999,down:false,id:null,ox:0,oy:0,key:false};
function field(){
 source.width=Math.round(w*dpr);source.height=Math.round(h*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);ctx.fillStyle='#e9e7df';ctx.fillRect(0,0,w,h);
 const left=w*.055,right=w*.945,top=h*.205,bottom=h*.805,step=Math.max(24,w/34);
 ctx.strokeStyle='#c5c8bd';ctx.lineWidth=.65;ctx.beginPath();
 for(let x=left;x<=right;x+=step){ctx.moveTo(x,top);ctx.lineTo(x,bottom);}for(let y=top;y<=bottom;y+=step){ctx.moveTo(left,y);ctx.lineTo(right,y);}ctx.stroke();
 ctx.strokeStyle='#939b8e';ctx.lineWidth=.75;ctx.strokeRect(left,top,right-left,bottom-top);
 ctx.fillStyle='#252924';ctx.font='500 100px "Helvetica Neue", Helvetica, sans-serif';const size=100*(w*.92)/ctx.measureText('PERCEPTION').width;ctx.font=`500 ${size}px "Helvetica Neue", Helvetica, sans-serif`;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('PERCEPTION',w*.5,h*.445);
 // One geometric resolution target: closely spaced ruled lines inside a solid disc.
 const cx=w*.735,cy=h*.677,rr=Math.min(h*.108,w*.145);ctx.save();ctx.beginPath();ctx.arc(cx,cy,rr,0,Math.PI*2);ctx.clip();ctx.fillStyle='#28332d';ctx.fillRect(cx-rr,cy-rr,rr*2,rr*2);ctx.strokeStyle='#e9e7df';ctx.lineWidth=1.1;ctx.beginPath();for(let x=-rr*2;x<rr*2;x+=5){ctx.moveTo(cx+x,cy-rr);ctx.lineTo(cx+x+rr*.65,cy+rr);}ctx.stroke();ctx.restore();
 ctx.fillStyle='#70786b';ctx.font='9px Consolas, monospace';ctx.textAlign='left';ctx.fillText('01 / TYPE',left,top-14);ctx.fillText('02 / SPATIAL GRID',left,bottom+20);ctx.textAlign='right';ctx.fillText('03 / RESOLUTION',right,bottom+20);
 gl.bindTexture(gl.TEXTURE_2D,texture);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,source);
}
function resize(){const oldW=w,oldH=h;w=innerWidth;h=innerHeight;dpr=Math.min(devicePixelRatio||1,1.8,gl.getParameter(gl.MAX_TEXTURE_SIZE)/Math.max(w,h));radius=Math.min(190,Math.max(88,w*.155),h*.25);state.x*=w/oldW;state.tx*=w/oldW;state.y*=h/oldH;state.ty*=h/oldH;canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);gl.viewport(0,0,canvas.width,canvas.height);field();}
canvas.addEventListener('pointerdown',e=>{if(pointer.down||!contains(e.clientX-state.x,e.clientY-state.y,radius,strain))return;pointer.down=true;pointer.id=e.pointerId;pointer.ox=state.x-e.clientX;pointer.oy=state.y-e.clientY;pointer.x=e.clientX;pointer.y=e.clientY;canvas.setPointerCapture(e.pointerId);canvas.focus({preventScroll:true});});
canvas.addEventListener('pointermove',e=>{if(pointer.down&&e.pointerId!==pointer.id)return;pointer.x=e.clientX;pointer.y=e.clientY;if(pointer.down){state.tx=clamp(e.clientX+pointer.ox,radius*.6,w-radius*.6);state.ty=clamp(e.clientY+pointer.oy,radius*.6,h-radius*.6);}canvas.style.cursor=pointer.down?'grabbing':contains(e.clientX-state.x,e.clientY-state.y,radius,strain)?'grab':'default';});
function release(){if(pointer.down){state.tx=clamp(state.tx+clamp(state.vx*(reduced.matches?.005:.025),-18,18),radius*.6,w-radius*.6);state.ty=clamp(state.ty+clamp(state.vy*(reduced.matches?.005:.025),-18,18),radius*.6,h-radius*.6);}pointer.down=false;pointer.id=null;}
canvas.addEventListener('pointerup',release);canvas.addEventListener('pointercancel',release);canvas.addEventListener('lostpointercapture',release);canvas.addEventListener('pointerleave',()=>{if(!pointer.down)pointer.x=pointer.y=-9999;});
canvas.addEventListener('keydown',e=>{if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown',' '].includes(e.key))e.preventDefault();if(e.key===' ')pointer.key=true;if(e.key==='ArrowLeft')state.tx-=18;if(e.key==='ArrowRight')state.tx+=18;if(e.key==='ArrowUp')state.ty-=18;if(e.key==='ArrowDown')state.ty+=18;state.tx=clamp(state.tx,radius*.6,w-radius*.6);state.ty=clamp(state.ty,radius*.6,h-radius*.6);});canvas.addEventListener('keyup',e=>{if(e.key===' ')pointer.key=false;});canvas.addEventListener('blur',()=>{pointer.key=false;release();});
let previous=0;function frame(now){requestAnimationFrame(frame);if(document.hidden){previous=0;return;}const dt=Math.min((now-(previous||now-16))/1000,.04);previous=now;
 const dx=pointer.x-state.tx,dy=pointer.y-state.ty,dist=Math.hypot(dx,dy),near=pointer.down?0:Math.max(0,1-dist/(radius*2.1));
 const tx=state.tx+dx*near*.035,ty=state.ty+dy*near*.035;
 const steps=Math.ceil(dt/.008);for(let i=0;i<steps;i++){advance(state,tx,ty,dt/steps,reduced.matches);advanceStrain(strain,state.vx,state.vy,dt/steps,reduced.matches);}
 state.pressure+=((pointer.down||pointer.key?1:0)-state.pressure)*(1-Math.exp(-dt*9));const speed=Math.hypot(state.vx,state.vy);state.energy+=(Math.min(speed/900,reduced.matches?.25:1)-state.energy)*(1-Math.exp(-dt*12));
 gl.uniform2f(uniforms.resolution,w,h);gl.uniform1f(uniforms.dpr,dpr);gl.uniform2f(uniforms.center,state.x,state.y);gl.uniform3f(uniforms.strain,strain.xx,strain.xy,strain.yy);gl.uniform1f(uniforms.radius,radius);gl.uniform1f(uniforms.pressure,state.pressure);gl.uniform1f(uniforms.energy,state.energy);gl.drawArrays(gl.TRIANGLES,0,6);
}
canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();document.querySelector('#error').hidden=false;document.querySelector('#error').textContent='The graphics context was interrupted. Reload to restore the instrument.';});
window.addEventListener('resize',resize);document.addEventListener('visibilitychange',()=>{previous=0;if(document.hidden){pointer.key=false;release();}});
resize();requestAnimationFrame(frame);
