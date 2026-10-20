import {cp,mkdir,readdir,rm} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
await rm('dist',{recursive:true,force:true});await mkdir('dist/downloads',{recursive:true});
for(const file of await readdir('.'))if(/\.(html|css|js)$/.test(file)||['assets','figma','design-system','FONT-LICENSES.txt'].includes(file))await cp(file,'dist/'+file,{recursive:true});
execFileSync('python3',['-c',`from pathlib import Path
from zipfile import ZipFile,ZIP_DEFLATED
with ZipFile('dist/downloads/freq-figma-import.zip','w',ZIP_DEFLATED) as z:
 for p in sorted(Path('figma').glob('*')):
  if p.is_file(): z.write(p, 'freq-figma-import/'+p.name)
 z.write('FONT-LICENSES.txt','freq-figma-import/FONT-LICENSES.txt')
`]);
console.log('Built static prototype, design guide and Figma import download in dist/.');
