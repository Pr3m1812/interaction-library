export const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
export function advance(s,tx,ty,dt,reduced=false){
 const k=reduced?150:115,d=reduced?25:19;
 s.vx+=(k*(tx-s.x)-d*s.vx)*dt;s.vy+=(k*(ty-s.y)-d*s.vy)*dt;
 s.x+=s.vx*dt;s.y+=s.vy*dt;
}
export function boundary(angle){return 1+.11*Math.cos(angle)+.055*Math.sin(2*angle);}
export function contains(dx,dy,r,strain={xx:0,xy:0,yy:0}){const lx=dx-strain.xx*dx-strain.xy*dy,ly=dy-strain.xy*dx-strain.yy*dy;dx=lx;dy=ly;const a=-.32,c=Math.cos(a),s=Math.sin(a),x=(c*dx-s*dy)/r/1.06,y=(s*dx+c*dy)/r/.9;return Math.hypot(x,y)<boundary(Math.atan2(y,x));}

// Critically damped strain tensor: retains travel direction while stress relaxes.
export function advanceStrain(s,vx,vy,dt,reduced=false){
 const speed=Math.hypot(vx,vy),amount=clamp((speed-45)/855,0,reduced?.025:.10);
 const x=speed>1?vx/speed:1,y=speed>1?vy/speed:0;
 const target={xx:amount*(1.4*x*x-.4),xy:amount*1.4*x*y,yy:amount*(1.4*y*y-.4)};
 for(const key of ['xx','xy','yy']){const v='v'+key;s[v]+=(225*(target[key]-s[key])-30*s[v])*dt;s[key]+=s[v]*dt;}
}
