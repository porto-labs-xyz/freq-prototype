// Editable native Figma nodes from measured browser geometry. No network access.
/** @type {Record<string, FontName>} */
const fonts = {};
/** @param {string} value @returns {SolidPaint[]} */
function paint(value) {
  const channels = (value || '').match(/[\d.]+/g);
  if (!channels || channels.length < 3) return [];
  const [r,g,b,a=1] = channels.map(Number);
  return a ? [{type:'SOLID',color:{r:r/255,g:g/255,b:b/255},opacity:a}] : [];
}
/** @param {any} spec @param {BaseNode & ChildrenMixin} parent @returns {Promise<SceneNode>} */
async function build(spec, parent) {
  let node;
  if (spec.type === 'svg') {
    node = figma.createNodeFromSvg(spec.svg);
    parent.appendChild(node);
    node.resize(Math.max(0.01,spec.w),Math.max(0.01,spec.h));
  } else if (spec.type === 'text') {
    node = figma.createText();parent.appendChild(node);
    node.fontName = fonts[spec.family+':'+spec.weight] || fonts.fallback;
    node.fontSize = spec.size;node.characters = spec.text;
    node.fills = paint(spec.color);node.textAutoResize='NONE';
    node.resize(Math.max(1,spec.w+0.5),Math.max(1,spec.h+2));
    node.lineHeight={unit:'PIXELS',value:spec.lineHeight};
    node.letterSpacing={unit:'PIXELS',value:spec.tracking};
    node.textAlignHorizontal=spec.align==='center'?'CENTER':spec.align==='right'?'RIGHT':'LEFT';
  } else {
    node=figma.createFrame();parent.appendChild(node);
    node.resize(Math.max(0.01,spec.w),Math.max(0.01,spec.h));
    node.fills=paint(spec.fill);node.clipsContent=spec.clip;
    [node.topLeftRadius,node.topRightRadius,node.bottomRightRadius,node.bottomLeftRadius]=spec.radii;
    if(spec.borderWidth){node.strokes=paint(spec.border);node.strokeWeight=spec.borderWidth;node.strokeAlign='INSIDE';}
    for(const child of spec.children)await build(child,node);
  }
  node.name=spec.name;node.x=spec.x;node.y=spec.y;
  if(spec.target && (node.type==='FRAME'||node.type==='TEXT'||node.type==='GROUP'))pending.push([node,spec.target]);
  return node;
}
/** @type {Array<[FrameNode | TextNode | GroupNode,string]>} */
const pending=[];
async function run(){
  await figma.loadFontAsync({family:'Inter',style:'Regular'});fonts.fallback={family:'Inter',style:'Regular'};
  let fallbacks=0;
  /** @type {Array<[number,string]>} */
  const weights=[[400,'Regular'],[500,'Medium'],[700,'Bold']];
  for(const family of ['Space Grotesk','IBM Plex Mono'])for(const [weight,style] of weights){
    try{await figma.loadFontAsync({family,style});fonts[family+':'+weight]={family,style};}catch{fonts[family+':'+weight]=fonts.fallback;fallbacks++;}
  }
  const page=figma.createPage();page.name='FREQ / Editable prototype';await figma.setCurrentPageAsync(page);
  /** @type {Record<string,SceneNode>} */
  const frames={};
  for(let i=0;i<SCREENS.length;i++){
    const spec=SCREENS[i];const frame=await build(spec.tree,page);frame.name=spec.name==='Main'?'Room':spec.name;frame.x=i<7?(i%4)*470:0;frame.y=i<7?Math.floor(i/4)*940:1880;frames[spec.name]=frame;
    frame.setPluginData('source',spec.name+'.dc.html');
  }
  for(const [node,target] of pending)if(frames[target]){
    /** @type {Reaction[]} */
    const reactions=[{trigger:{type:'ON_CLICK'},actions:[{type:'NODE',destinationId:frames[target].id,navigation:'NAVIGATE',transition:null,preserveScrollPosition:false}]}];
    await node.setReactionsAsync(reactions);
  }
  page.flowStartingPoints=[{nodeId:frames.Start.id,name:'FREQ / Start a room'}];
  // Local foundation styles complement the editable screen artwork.
  for(const [name,value] of Object.entries({'Canvas':'rgb(11,11,13)','Surface':'rgb(18,18,23)','Text':'rgb(244,242,237)','Muted':'rgb(142,142,154)','Lime':'rgb(200,255,77)','Warm':'rgb(255,138,76)'})){
    const style=figma.createPaintStyle();style.name='FREQ / '+name;style.paints=paint(value);
  }
  figma.currentPage.selection=Object.values(frames);figma.viewport.scrollAndZoomIntoView(Object.values(frames));
  figma.closePlugin('Imported 8 editable FREQ frames and clickable navigation.'+(fallbacks?' Some fonts use Inter. Install Space Grotesk and IBM Plex Mono, then re-import.':''));
}
run().catch(e=>{figma.notify(String(e),{error:true});figma.closePlugin();});
