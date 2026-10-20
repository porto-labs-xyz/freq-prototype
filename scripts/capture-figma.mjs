import {chromium} from 'playwright';
import {writeFile,readFile} from 'node:fs/promises';
const browser=await chromium.launch();const page=await browser.newPage();const screens=[];
for(const name of ['Main', 'ShowMore', 'Pair', 'Start', 'Submit', 'Recap', 'Taste', 'Profile', 'Gestures']){
 await page.setViewportSize({width:390,height:844});
 await page.goto('http://127.0.0.1:8137/'+name+'.dc.html');await page.evaluate(()=>document.fonts.ready);
 screens.push(await page.evaluate((name)=>{
  const root=document.querySelector('body>div');const origin=root.getBoundingClientRect();
  function box(r,parent){return {x:r.x-parent.x,y:r.y-parent.y,w:r.width,h:r.height};}
  function walk(el,parent){
   const r=el.getBoundingClientRect(),s=getComputedStyle(el);if(!r.width||!r.height||s.display==='none'||el.hidden)return null;
   const node={type:'frame',name:el.getAttribute('aria-label')||el.tagName.toLowerCase(),...box(r,parent),fill:s.backgroundColor,border:s.borderTopColor,borderWidth:parseFloat(s.borderTopWidth),radii:[s.borderTopLeftRadius,s.borderTopRightRadius,s.borderBottomRightRadius,s.borderBottomLeftRadius].map(x=>x.includes('%')?Math.min(r.width,r.height)/2:parseFloat(x)),clip:s.overflow==='hidden',children:[]};
   if(el.tagName.toLowerCase()==='svg'){node.type='svg';node.svg=new XMLSerializer().serializeToString(el);return node;}
   if(el.hasAttribute('href'))node.target=el.getAttribute('href').replace('.dc.html','');
   for(const child of el.childNodes){
    if(child.nodeType===Node.ELEMENT_NODE){if(child.tagName==='BR')continue;const c=walk(child,r);if(c)node.children.push(c);}
    else if(child.nodeType===Node.TEXT_NODE&&child.textContent.trim()){
     const range=document.createRange();range.selectNode(child);const tr=range.getBoundingClientRect();
     const text=child.textContent.replace(/\s+/g,' ').trim();node.children.push({type:'text',name:text.slice(0,55),text,...box(tr,r),family:s.fontFamily.includes('IBM Plex')?'IBM Plex Mono':'Space Grotesk',weight:parseInt(s.fontWeight),size:parseFloat(s.fontSize),lineHeight:parseFloat(s.lineHeight)||parseFloat(s.fontSize)*1.2,tracking:parseFloat(s.letterSpacing)||0,color:s.color,align:s.textAlign});
    }
   }
   if(el.tagName==='INPUT'){node.children.push({type:'text',name:'Placeholder',text:el.getAttribute('placeholder')||'',x:14,y:14,w:r.width-28,h:24,family:'Space Grotesk',weight:400,size:15,lineHeight:20,tracking:0,color:'rgb(142,142,154)',align:'left'});}
   return node;
  }
  return {name,width:origin.width,height:origin.height,tree:walk(root,origin)};
 },name));
}
await browser.close();await writeFile('figma/screens.json',JSON.stringify(screens,null,2)+'\n');
const runtime=await readFile('figma/import-runtime.js','utf8');await writeFile('figma/code.js','const SCREENS = '+JSON.stringify(screens)+';\n'+runtime);console.log('Captured '+screens.length+' rendered screens with editable geometry.');
