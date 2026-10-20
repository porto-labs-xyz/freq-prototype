import assert from 'node:assert/strict';
import {chromium} from 'playwright';
import {readFile} from 'node:fs/promises';
import vm from 'node:vm';
import {execFileSync} from 'node:child_process';
const base=process.env.BASE_URL||'http://127.0.0.1:8137';
const browser=await chromium.launch();const page=await browser.newPage({viewport:{width:1440,height:1120}});const errors=[];
page.on('pageerror',e=>errors.push(e.message));
const names=['Start','Taste','Pair','Main','Visualiser','Submit','Recap','Gestures'];
for(const name of names){
 await page.goto(base+'/'+name+'.dc.html');await page.evaluate(()=>document.fonts.ready);
 assert(!(await page.locator('body').innerText()).includes('{{'),name+' has unresolved template text');
 const box=await page.locator('body>div').first().boundingBox();assert.equal(box.width,name==='Gestures'?1240:390);assert.equal(box.height,name==='Gestures'?620:844);
 for(const href of await page.locator('a[href]').evaluateAll(els=>els.map(e=>e.getAttribute('href'))))assert((await page.request.get(base+'/'+href)).ok(),name+' broken link '+href);
}
await page.goto(base+'/');const frame=page.frameLocator('iframe');await frame.getByRole('link',{name:'Start A ROOM'}).click();await frame.getByRole('button',{name:'House',exact:true}).click();assert.equal(await frame.getByRole('button',{name:'House',exact:true}).getAttribute('aria-pressed'),'true');await frame.getByRole('link',{name:'Build my engine'}).click();await frame.getByRole('link').first().click();
// Direct links and in-frame navigation must both update the surrounding preview.
await page.locator('[data-screen=Visualiser]').click();await frame.getByRole('button',{name:'RINGS',exact:true}).click();assert.equal(await frame.getByRole('button',{name:'RINGS',exact:true}).getAttribute('aria-pressed'),'true');await frame.getByRole('button',{name:'Thicken the visual'}).click();assert((await frame.locator('body').innerText()).includes('60%'));
await page.locator('[data-screen=Submit]').click();await frame.getByRole('button',{name:'+ POOL'}).first().click();assert.equal(await frame.getByRole('button',{name:'ADDED',exact:true}).count(),1);await frame.locator('#q').fill('Low Tide');assert.equal(await frame.getByRole('button',{name:'+ POOL'}).count(),0);
await page.goto(base+'/#Taste');assert.equal(await frame.getByRole('button',{name:'House',exact:true}).getAttribute('aria-pressed'),'true');
await page.setViewportSize({width:390,height:844});assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));await page.screenshot({path:'/tmp/freq-mobile-verified.png',fullPage:true});await page.setViewportSize({width:1440,height:1120});await page.screenshot({path:'/tmp/freq-desktop-verified.png',fullPage:true});
await page.goto(base+'/figma/');assert((await page.locator('body').innerText()).includes('manifest.json'));
assert.equal(errors.length,0,errors.join('\n'));await browser.close();
// Execute the complete plugin against an API-shaped harness. This detects blank
// imports, missing child trees, bad dimensions and broken navigation targets.
let id=0;const all=[];let closed;let finish;const done=new Promise(resolve=>finish=resolve);
function node(type){const n={type,id:String(++id),width:100,height:100,children:[],appendChild(child){child.parent=this;this.children.push(child);},resize(w,h){assert(Number.isFinite(w)&&w>0&&Number.isFinite(h)&&h>0);this.width=w;this.height=h;},setPluginData(){},async setReactionsAsync(r){this.reactions=r;}};all.push(n);return n;}
const figma={currentPage:node('PAGE'),loadFontAsync:async()=>{},createPage:()=>node('PAGE'),setCurrentPageAsync:async p=>{figma.currentPage=p;},createFrame:()=>node('FRAME'),createText:()=>node('TEXT'),createNodeFromSvg:s=>{assert(s.includes('<svg'));return node('VECTOR');},createPaintStyle:()=>({}),viewport:{scrollAndZoomIntoView(){}},notify:m=>{throw new Error(m);},closePlugin:m=>{closed=m;finish();}};
vm.runInNewContext(await readFile('figma/code.js','utf8'),{figma,console});await done;assert(closed.includes('8 editable'));assert.equal(figma.currentPage.children.length,8);assert.equal(figma.currentPage.children[7].width,1240);assert.equal(figma.currentPage.flowStartingPoints.length,1);for(const f of figma.currentPage.children)assert(f.children.length>2,f.name+' blank');assert(all.filter(n=>n.type==='TEXT').length>80);const links=all.filter(n=>n.reactions);assert(links.length>=12);for(const n of links)assert(all.some(f=>f.id===n.reactions[0].actions[0].destinationId));
execFileSync('npx',['tsc','--allowJs','--checkJs','--noEmit','--target','es2020','--lib','es2020','--skipLibCheck','--types','@figma/plugin-typings','figma/code.js'],{stdio:'inherit'});
console.log(`Verified 8 browser screens, interactive flow, local state, mobile layout and ${links.length} Figma navigation links. Native Figma execution remains unverified.`);
