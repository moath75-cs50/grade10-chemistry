import {renderMedia, selectComposition} from '@remotion/renderer';
const B='/tmp/bundle', exe='/opt/pw-browsers/chromium-1243/chrome-linux64/chrome';
const ids=['reversible','ammonium-chloride','copper-sulfate','cobalt-chloride','water-tests','cobalt-practical','open-closed','equilibrium-graphs','dynamic','escalator','pressure','concentration','catalyst','haber','contact'];
for (const id of ids) { const t0=Date.now(); const comp=await selectComposition({serveUrl:B,id,browserExecutable:exe});
  await renderMedia({composition:comp,serveUrl:B,codec:'h264',crf:28,x264Preset:'veryfast',outputLocation:`/home/claude/site/ch2/v/${id}.mp4`,browserExecutable:exe,concurrency:2,pixelFormat:'yuv420p'});
  console.log(id, ((Date.now()-t0)/1000).toFixed(0)+'s'); }
