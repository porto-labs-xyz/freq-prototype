// Local prototype interactions. No accounts, devices, audio or backend calls.
const screenName=location.pathname.split('/').pop().replace('.dc.html','');
const $=(s)=>document.querySelector(s);
function note(message){let el=$('.demo-note');if(!el){el=document.createElement('div');el.className='demo-note';el.setAttribute('role','status');document.body.append(el);}el.textContent=message;clearTimeout(note.timer);note.timer=setTimeout(()=>el.remove(),3500);}
function save(key,value){try{sessionStorage.setItem(key,JSON.stringify(value));}catch{}}
function read(key,fallback){try{return JSON.parse(sessionStorage.getItem(key))??fallback;}catch{return fallback;}}
if(screenName==='Taste'){
 const genres=['House','Techno','UK Garage','Ambient','Jazz','Soul','Afrobeats','Dub','Disco','Hip-hop','Jungle','Electronic','R&B','Experimental','Classical'];
 const chosen=new Set(read('freq-taste',[]));const holder=$('sc-for');holder.replaceChildren();
 for(const genre of genres){const b=document.createElement('button');b.type='button';b.textContent=genre;b.style.cssText='min-height:44px;padding:0 15px;border-radius:22px;cursor:pointer;font:500 14px Space Grotesk;background:#121217;color:#B9B9C4;border:1px solid #32323C';b.setAttribute('aria-pressed',chosen.has(genre));holder.append(b);b.onclick=()=>{chosen.has(genre)?chosen.delete(genre):chosen.add(genre);b.setAttribute('aria-pressed',chosen.has(genre));save('freq-taste',[...chosen]);update();};}
 const count=[...document.querySelectorAll('div')].find(e=>e.textContent==='{{countLabel}}');
 const fill=[...document.querySelectorAll('div')].find(e=>e.getAttribute('style')?.includes('{{fillWidth}}'));
 function update(){count.textContent=`${chosen.size} PICKED`;fill.style.width=`${chosen.size/genres.length*100}%`;}
 update();[...document.querySelectorAll('button')].find(b=>b.textContent.includes('SPOTIFY')).onclick=()=>note('Spotify connection is a concept. Pick genres above to try the flow.');
}
if(screenName==='Visualiser'){
 const blocks=[...document.querySelectorAll('sc-if')];const stage=blocks[0].parentElement;stage.classList.add('visual-stage');
 const label=[...stage.querySelectorAll('div')].find(e=>e.textContent==='{{formLabel}} · {{bloomLabel}}');
 const densityLabel=[...document.querySelectorAll('div')].find(e=>e.textContent.includes('{{densityLabel}}')&&!e.children.length);
 const fill=[...document.querySelectorAll('div')].find(e=>e.getAttribute('style')?.includes('{{densityWidth}}'));
 const modes=['bars','rings','weave'];let mode='bars',density=50,bloom=false;
 blocks.forEach((el,i)=>{el.dataset.mode=modes[i];el.innerHTML='<div></div>';});
 const buttons=[...document.querySelectorAll('button')];
 function render(){
  stage.dataset.bloom=bloom;label.textContent=`${mode.toUpperCase()} · ${bloom?'BLOOM':'STEADY'}`;densityLabel.textContent=`VISUAL DENSITY · ${density}%`;fill.style.width=`${density}%`;
  blocks.forEach((el,i)=>{el.hidden=modes[i]!==mode;const wrap=el.firstElementChild;wrap.replaceChildren();let count=mode==='bars'?8+Math.round(density/7):mode==='rings'?3+Math.round(density/20):4+Math.round(density/20);for(let n=0;n<count;n++){const bar=document.createElement('div');const color=n%3===0?'#C8FF4D':'#32323C';bar.style.cssText=mode==='bars'?`flex:1;height:${25+(n*37)%70}%;background:${color};border-radius:2px`:mode==='rings'?`position:absolute;inset:${24+n*17}px;border:${bloom?3:1.5}px solid ${color};border-radius:50%`:`width:${55+(n*19)%45}%;height:${8+density/7}px;background:${color};border-radius:2px;transform:translateX(${n%2?12:-12}px)`;wrap.append(bar);}});
  buttons.slice(0,3).forEach((b,i)=>b.setAttribute('aria-pressed',modes[i]===mode));
 }
 buttons.forEach(b=>{b.style.background='#121217';b.style.color='#F4F2ED';b.style.border='1px solid #32323C';});
 buttons.slice(0,3).forEach((b,i)=>b.onclick=()=>{mode=modes[i];render();});
 buttons[3].onclick=()=>{density=Math.max(0,density-10);render();};buttons[4].onclick=()=>{density=Math.min(100,density+10);render();};
 const bloomButton=buttons[5];bloomButton.setAttribute('aria-label','Bloom visual');bloomButton.querySelectorAll('circle').forEach(c=>{if(c.getAttribute('fill')!=='none')c.setAttribute('fill','#C8FF4D');c.setAttribute('stroke','#C8FF4D');});
 const setBloom=(v)=>{bloom=v;bloomButton.setAttribute('aria-pressed',v);render();};
 bloomButton.onpointerdown=e=>{bloomButton.setPointerCapture(e.pointerId);setBloom(true);};bloomButton.onpointerup=()=>setBloom(false);bloomButton.onpointercancel=()=>setBloom(false);bloomButton.onkeydown=e=>{if(e.key===' '||e.key==='Enter'){e.preventDefault();setBloom(true);}};bloomButton.onkeyup=()=>setBloom(false);bloomButton.onblur=()=>setBloom(false);
 stage.onpointerdown=e=>{stage.setPointerCapture(e.pointerId);};stage.onpointermove=e=>{if(e.buttons){const box=stage.getBoundingClientRect();density=Math.round(Math.max(0,Math.min(100,(e.clientX-box.left)/box.width*100)));render();}};
 render();
}
if(screenName==='Submit'){
 const poolButtons=[...document.querySelectorAll('button')];const rows=poolButtons.map(b=>b.parentElement);
 $('#q').oninput=e=>rows.forEach(r=>r.hidden=!r.textContent.toLowerCase().includes(e.target.value.toLowerCase()));
 poolButtons.forEach((b,i)=>{const title=b.parentElement.firstElementChild.firstElementChild.textContent;const key='freq-pool-'+i;const update=()=>{const added=read(key,false);b.textContent=added?'ADDED':'+ POOL';b.setAttribute('aria-pressed',added);};update();b.onclick=()=>{save(key,!read(key,false));update();note(`${title}: updated in this demo only.`);};});
}
if(screenName==='Pair')$('button').onclick=()=>note('QR pairing is illustrative. Use Enter room to continue.');
if(screenName==='Recap')$('button').onclick=async()=>{try{await navigator.clipboard.writeText(location.origin+'/#Recap');note('Recap preview link copied.');}catch{note('Share this preview: '+location.origin+'/#Recap');}};
if(screenName==='Main'){
 const b=$('button');b.onpointerdown=e=>{b.setPointerCapture(e.pointerId);b.style.background='#C8FF4D33';note('Flare sent in this demo.');};b.onpointerup=()=>b.style.background='#0B0B0D';b.onpointercancel=b.onpointerup;b.onclick=()=>note('Flare sent in this demo.');
}
// Let the surrounding preview keep its screen selector and deep link in sync.
if(parent!==window)parent.postMessage({type:'freq-screen',screen:screenName},location.origin);
