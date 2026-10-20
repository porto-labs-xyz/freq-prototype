// Local development import. Native nodes, never flattened screen images.
function css(raw=''){return Object.fromEntries(raw.split(';').map(x=>x.split(/:(.*)/s).slice(0,2).map(y=>y.trim())).filter(x=>x.length===2));}
function num(v,d=0){return Number.parseFloat(v)||d;}
function paint(value){const m=(value||'').match(/#([0-9a-f]{6})/i);if(!m)return [];const n=parseInt(m[1],16);return [{type:'SOLID',color:{r:(n>>16)/255,g:((n>>8)&255)/255,b:(n&255)/255}}];}
const pending=[];
let fonts={};
async function build(spec,parent,inherited,screen){
  if(spec.tag==='text'){
    const t=figma.createText();parent.appendChild(t);t.fontName=fonts[(inherited.family||'Space Grotesk')+':'+(inherited.weight||400)]||fonts.fallback;
    t.fontSize=inherited.size||14;t.characters=spec.text;t.fills=paint(inherited.color||'#F4F2ED');t.textAutoResize='HEIGHT';
    t.resize(Math.max(20,parent.width-parent.paddingLeft-parent.paddingRight),Math.max(16,t.height));
    if(inherited.tracking)t.letterSpacing={unit:'PERCENT',value:inherited.tracking*100};
    if(inherited.lineHeight)t.lineHeight={unit:'PERCENT',value:inherited.lineHeight*100};
    return t;
  }
  const a=spec.attrs||{},s=css(a.style); if(['script','style','meta','link'].includes(spec.tag))return null;
  if(spec.tag==='figure'&&a['data-svg']!==undefined){let svg=screen.svgs[Number(a['data-svg'])];if(!svg.includes('xmlns='))svg=svg.replace('<svg','<svg xmlns="http://www.w3.org/2000/svg"');const n=figma.createNodeFromSvg(svg);parent.appendChild(n);return n;}
  const n=figma.createFrame();parent.appendChild(n);n.name=a.href?'Link / '+a.href.replace('.dc.html',''):spec.tag;
  n.fills=paint(s.background);n.clipsContent=s.overflow==='hidden';n.layoutMode=s['flex-direction']==='column'?'VERTICAL':'HORIZONTAL';
  if(!s.display||s.display!=='flex')n.layoutMode='VERTICAL';
  n.primaryAxisSizingMode='AUTO';n.counterAxisSizingMode='FIXED';
  const available=Math.max(20,parent.width-(parent.paddingLeft||0)-(parent.paddingRight||0));
  n.resize(Math.max(1,s.width?num(s.width,available):available),Math.max(1,num(s.height,24)));
  if(s.height){n.primaryAxisSizingMode='FIXED';n.counterAxisSizingMode='FIXED';}
  n.itemSpacing=num(s.gap); const pad=(s.padding||'0').split(/\s+/).map(x=>num(x));
  n.paddingTop=pad[0];n.paddingRight=pad[1]??pad[0];n.paddingBottom=pad[2]??pad[0];n.paddingLeft=pad[3]??pad[1]??pad[0];
  for(const [key,prop] of [['padding-top','paddingTop'],['padding-bottom','paddingBottom']])if(s[key])n[prop]=num(s[key]);
  n.primaryAxisAlignItems=s['justify-content']==='space-between'?'SPACE_BETWEEN':s['justify-content']==='center'?'CENTER':'MIN';
  n.counterAxisAlignItems=s['align-items']==='center'?'CENTER':'MIN';
  n.cornerRadius=s['border-radius']==='50%'?Math.min(n.width,n.height)/2:num(s['border-radius']);
  if(s.border){n.strokes=paint(s.border);n.strokeWeight=num(s.border,1);}
  if(s.position==='absolute'){n.layoutPositioning='ABSOLUTE';n.x=num(s.left,num(s.inset));n.y=num(s.top,num(s.inset));if(s.inset)n.resize(Math.max(1,parent.width-2*num(s.inset)),Math.max(1,parent.height-2*num(s.inset)));}
  const next={...inherited};
  if(s['font-family'])next.family=s['font-family'].includes('IBM')?'IBM Plex Mono':'Space Grotesk';
  if(s['font-size'])next.size=num(s['font-size'],14);
  if(s['font-weight'])next.weight=num(s['font-weight'],400);
  if(s.color)next.color=s.color;
  if(s['letter-spacing'])next.tracking=num(s['letter-spacing']);
  if(s['line-height'])next.lineHeight=num(s['line-height']);
  for(const c of spec.children||[])await build(c,n,next,screen);
  if(s['flex-grow'])n.layoutGrow=1;
  if(a.href)pending.push([n,a.href.replace('.dc.html','')]);
  return n;
}
async function run(){
  await figma.loadFontAsync({family:'Inter',style:'Regular'});fonts.fallback={family:'Inter',style:'Regular'};
  for(const family of ['Space Grotesk','IBM Plex Mono'])for(const [weight,style] of [[400,'Regular'],[500,'Medium'],[700,'Bold']]){
    try{await figma.loadFontAsync({family,style});fonts[family+':'+weight]={family,style};}catch{fonts[family+':'+weight]=fonts.fallback;}
  }
  const page=figma.createPage();page.name='FREQ / Source screens / Review required';await figma.setCurrentPageAsync(page);
  const frames={};
  for(let i=0;i<SCREENS.length;i++){
    const s=SCREENS[i],host=figma.createFrame();page.appendChild(host);host.name=s.name;host.resize(390,844);host.x=(i%4)*470;host.y=Math.floor(i/4)*940;host.fills=paint('#0B0B0D');
    await build(s.tree,host,{family:'Space Grotesk',size:14,color:'#F4F2ED',weight:400},s);frames[s.name]=host;
  }
  for(const [node,target] of pending)if(frames[target])await node.setReactionsAsync([{trigger:{type:'ON_CLICK'},actions:[{type:'NODE',destinationId:frames[target].id,navigation:'NAVIGATE',transition:null,preserveScrollPosition:false}]}]);
  figma.currentPage.selection=Object.values(frames);figma.viewport.scrollAndZoomIntoView(Object.values(frames));figma.closePlugin('Imported 8 editable FREQ frames. Review layout and fonts before publishing.');
}
run().catch(e=>{figma.notify(String(e),{error:true});figma.closePlugin();});
