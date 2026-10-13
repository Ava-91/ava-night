#!/usr/bin/env node
// Dependency-free PNG snapshot comparison for screenshots captured by capture-screenshots.js.
// Set UPDATE_SCREENSHOT_BASELINES=1 only when the current screenshots have been reviewed and accepted.
const fs=require('node:fs');
const path=require('node:path');
const zlib=require('node:zlib');
const root=path.resolve(__dirname,'..');
const current=path.join(root,'tests','results','screenshots');
const baseline=path.join(root,'tests','visual-baselines');
const names=['ava-night.png','moonlit.png','eclipse.png','afterglow.png'];
const fail=message=>{console.error('VISUAL REGRESSION:',message);process.exitCode=1;};
function decode(file){
  const b=fs.readFileSync(file);
  if(b.toString('hex',0,8)!=='89504e470d0a1a0a')throw new Error('not a PNG');
  let offset=8,width=0,height=0,depth=0,type=0,interlace=0;const chunks=[];
  while(offset<b.length){const length=b.readUInt32BE(offset);const name=b.toString('ascii',offset+4,offset+8);const start=offset+8;
    if(name==='IHDR'){width=b.readUInt32BE(start);height=b.readUInt32BE(start+4);depth=b[start+8];type=b[start+9];interlace=b[start+12];}
    if(name==='IDAT')chunks.push(b.subarray(start,start+length));
    offset=start+length+4;if(name==='IEND')break;
  }
  if(depth!==8||![2,6].includes(type)||interlace!==0)throw new Error('only non-interlaced 8-bit RGB/RGBA PNGs are supported');
  const channels=type===6?4:3,bpp=channels,stride=width*channels,raw=zlib.inflateSync(Buffer.concat(chunks));
  const pixels=Buffer.alloc(height*stride);let pos=0;
  const paeth=(a,b,c)=>{const p=a+b-c,pa=Math.abs(p-a),pb=Math.abs(p-b),pc=Math.abs(p-c);return pa<=pb&&pa<=pc?a:pb<=pc?b:c;};
  for(let y=0;y<height;y++){const filter=raw[pos++],row=y*stride;
    for(let x=0;x<stride;x++){const v=raw[pos++],left=x>=bpp?pixels[row+x-bpp]:0,up=y?pixels[row-stride+x]:0,ul=y&&x>=bpp?pixels[row-stride+x-bpp]:0;
      pixels[row+x]=(v+(filter===0?0:filter===1?left:filter===2?up:filter===3?Math.floor((left+up)/2):filter===4?paeth(left,up,ul):(()=>{throw new Error('unknown PNG filter')})()))&255;
    }
  }
  return {width,height,channels,pixels};
}
if(process.env.UPDATE_SCREENSHOT_BASELINES==='1'){
  fs.mkdirSync(baseline,{recursive:true});let copied=0;
  for(const name of names){const src=path.join(current,name);if(!fs.existsSync(src)){fail(`missing screenshot ${src}; run npm run screenshots first`);continue;}fs.copyFileSync(src,path.join(baseline,name));copied++;}
  if(!process.exitCode)console.log(`Updated ${copied} screenshot baselines. Review the changes before committing them.`);
  process.exit(process.exitCode||0);
}
const available=names.filter(name=>fs.existsSync(path.join(baseline,name)));
if(!available.length){console.log('Visual regression skipped: no approved PNG baselines yet. Capture and review screenshots, then run UPDATE_SCREENSHOT_BASELINES=1 npm run visual:regression.');process.exit(0);}
for(const name of names){
  const a=path.join(current,name),b=path.join(baseline,name);
  if(!fs.existsSync(a)||!fs.existsSync(b)){fail(`${name}: current screenshot or baseline missing`);continue;}
  try{
    const x=decode(a),y=decode(b);
    if(x.width!==y.width||x.height!==y.height){fail(`${name}: dimensions changed ${y.width}x${y.height} -> ${x.width}x${x.height}`);continue;}
    let changed=0,total=x.width*x.height;
    for(let i=0;i<total;i++){const xi=i*x.channels,yi=i*y.channels;let diff=false;for(let c=0;c<3;c++)if(x.pixels[xi+c]!==y.pixels[yi+c]){diff=true;break;}if(diff)changed++;}
    const percent=changed/total*100;
    console.log(`${name}: ${changed}/${total} pixels changed (${percent.toFixed(3)}%)`);
    const limit=Number(process.env.VISUAL_DIFF_LIMIT_PERCENT||0.5);
    if(percent>limit)fail(`${name}: pixel difference ${percent.toFixed(3)}% exceeds ${limit}% threshold`);
  }catch(e){fail(`${name}: ${e.message}`);}
}
if(!process.exitCode)console.log('Visual snapshot comparison passed.');
