const names=['Main', 'ShowMore', 'Pair', 'Start', 'Submit', 'Recap', 'Taste', 'Profile', 'Gestures'];
const frame=document.querySelector('iframe'),device=document.querySelector('#device');
let current;
function scale(){const wide=false,w=wide?1240:390,h=wide?620:844;const available=document.querySelector('.viewport').clientWidth;const factor=Math.min(1,available/w);device.style.width=w+'px';device.style.height=h+'px';frame.style.width=w+'px';frame.style.height=h+'px';device.style.transform=`scale(${factor})`;document.querySelector('.viewport').style.height=h*factor+'px';device.style.borderRadius=wide?'6px':'20px';}
function show(name,navigate=true){if(!names.includes(name))name='Main';current=name;if(navigate)frame.src=name+'.dc.html';frame.title='FREQ '+(name==='Main'?'Room':name)+' screen';document.querySelectorAll('[data-screen]').forEach(a=>a.setAttribute('aria-current',a.dataset.screen===name));document.querySelector('#current').textContent=String(names.indexOf(name)+1).padStart(2,'0')+' / '+(name==='Main'?'ROOM':name.toUpperCase());document.querySelector('#open-screen').href=name+'.dc.html';scale();}
window.onhashchange=()=>show(decodeURIComponent(location.hash.slice(1)));
window.addEventListener('message',e=>{if(e.origin===location.origin&&e.source===frame.contentWindow&&e.data?.type==='freq-screen'&&names.includes(e.data.screen)){history.replaceState(null,'','#'+e.data.screen);show(e.data.screen,false);}});
new ResizeObserver(scale).observe(document.querySelector('.viewport'));show(location.hash.slice(1));
