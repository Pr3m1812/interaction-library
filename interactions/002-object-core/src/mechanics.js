export const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
export const smooth=(a,b,v)=>{const t=clamp((v-a)/(b-a));return t*t*(3-2*t);};
export const damp=(a,b,k,dt)=>a+(b-a)*(1-Math.exp(-k*dt));
export function stages(p){return {unlock:smooth(0,.18,p),shell:smooth(.12,.4,p),rings:smooth(.4,.62,p),stabilizers:smooth(.62,.82,p),full:smooth(.82,1,p)};}
export function operatingTarget(active,requested,p){return active?Math.max(0,Math.min(requested,1200+11200*smooth(.64,.98,p)))*smooth(.34,.62,p):0;}
// A documented 1:120 temporal scale keeps instrument RPM legible on a 60 Hz display.
// The same conversion drives every rotor frame, rather than unrelated decorative motion.
export const rotorRadians=(rpm,dt,reduced=false)=>rpm/60*Math.PI*2*dt/120*(reduced?.18:1);
export const phaseName=p=>p<.015?'ASSEMBLED':p<.2?'UNLOCKING':p<.4?'SHELL CLEAR':p<.62?'GYRO ASSEMBLY':p<.82?'CORE EXPOSED':'EXPLODED';

// Engagement order is elapsed-time based, independent of the requested RPM.
export function engagement(seconds){return [smooth(1.65,2.45,seconds),smooth(.95,1.65,seconds),smooth(.32,.95,seconds)];}
export function regulation(rpm){return {resistance:.35+.60*smooth(800,12400,rpm),inward:.04+.12*smooth(1200,12400,rpm),field:smooth(4300,11000,rpm)};}
