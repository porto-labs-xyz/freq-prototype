import assert from 'node:assert/strict';
import {chromium} from 'playwright';
import {readFile} from 'node:fs/promises';
import vm from 'node:vm';
import {execFileSync} from 'node:child_process';
// Execute the complete plugin against an API-shaped harness. This detects blank
// imports, missing child trees, bad dimensions and broken navigation targets.
let id=0;const all=[];let closed;let finish;const done=new Promise(resolve=>finish=resolve);
function node(type){const n={type,id:String(++id),width:100,height:100,children:[],appendChild(child){child.parent=this;this.children.push(child);},resize(w,h){assert(Number.isFinite(w)&&w>0&&Number.isFinite(h)&&h>0);this.width=w;this.height=h;},setPluginData(){},async setReactionsAsync(r){this.reactions=r;}};all.push(n);return n;}
const figma={currentPage:node('PAGE'),loadFontAsync:async()=>{},createPage:()=>node('PAGE'),setCurrentPageAsync:async p=>{figma.currentPage=p;},createFrame:()=>node('FRAME'),createText:()=>node('TEXT'),createNodeFromSvg:s=>{assert(s.includes('<svg'));return node('VECTOR');},createPaintStyle:()=>({}),viewport:{scrollAndZoomIntoView(){}},notify:m=>{throw new Error(m);},closePlugin:m=>{closed=m;finish();}};
vm.runInNewContext(await readFile('figma/code.js','utf8'),{figma,console});await done;assert(closed.includes('9 editable'));assert.equal(figma.currentPage.children.length,9);assert.equal(figma.currentPage.children[7].width,390);assert.equal(figma.currentPage.flowStartingPoints.length,1);for(const f of figma.currentPage.children)assert(f.children.length>2,f.name+' blank');assert(all.filter(n=>n.type==='TEXT').length>80);const links=all.filter(n=>n.reactions);assert(links.length>=12);for(const n of links)assert(all.some(f=>f.id===n.reactions[0].actions[0].destinationId));
execFileSync('npx',['tsc','--allowJs','--checkJs','--noEmit','--target','es2020','--lib','es2020','--skipLibCheck','--types','@figma/plugin-typings','figma/code.js'],{stdio:'inherit'});
console.log(`Verified 9 Figma frames, native API type compatibility and ${links.length} Figma navigation links. Native Figma execution remains unverified.`);
