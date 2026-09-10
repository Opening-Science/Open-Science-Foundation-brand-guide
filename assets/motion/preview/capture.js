// SPDX-FileCopyrightText: 2026 Open Science Stiftung (Open Science Foundation)
// SPDX-License-Identifier: Apache-2.0
return (async () => {
const ids=['hero','openness','transparency','collaboration','reproducibility','logo'];
const frames=Object.fromEntries(ids.map(id=>[id,[]]));
for(let ms=0;ms<=10000;ms+=50){
 await window.renderMotionAt(ms);
 if(ms===500)document.querySelector('#logo .logo-stage>div').dispatchEvent(new MouseEvent('mouseenter'));
 if(ms===8000)document.querySelector('#logo .logo-stage>div').dispatchEvent(new MouseEvent('mouseleave'));
 for(const id of ids){
  const source=document.querySelector('#'+id+' canvas');
  const canvas=document.createElement('canvas');
  canvas.width=id==='logo'?160:600;canvas.height=id==='logo'?160:600;
  const ctx=canvas.getContext('2d');ctx.fillStyle='#ffffff';ctx.fillRect(0,0,canvas.width,canvas.height);
  const scale=Math.min(canvas.width/source.width,canvas.height/source.height);
  const w=source.width*scale,h=source.height*scale;
  ctx.drawImage(source,(canvas.width-w)/2,(canvas.height-h)/2,w,h);
  frames[id].push(canvas.toDataURL('image/png').split(',')[1]);
 }
}
return JSON.stringify({fps:20,frames});
})()
