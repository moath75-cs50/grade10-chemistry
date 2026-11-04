// @ts-nocheck
import React from 'react';
import {C, Tx, DPath, Arrow, Tube, Flame, N2, H2, NH3, Scene, useT, seg, ease, easeOut, lerp, clamp, mix, fade, pop, rnd, bounce, bez, alongLine} from './lib';

// ======================================================= 1 reversible
export const Reversible = () => { const t = useT(); const id = 'rv';
  const top = [[215, 118], [280, 40], [360, 40], [425, 118]], bot = [[425, 162], [360, 240], [280, 240], [215, 162]];
  const dots = [];
  for (let i = 0; i < 5; i++) {
    if (t > 1.7) { const k = ((t - 1.7) / 2.6 + i / 5) % 1; const [x, y] = bez(...top, k); dots.push(<circle key={'a' + i} cx={x} cy={y} r={8} fill={C.or} opacity={Math.sin(k * Math.PI) * 1.3} />); }
    if (t > 3.8) { const k = ((t - 3.8) / 2.6 + i / 5) % 1; const [x, y] = bez(...bot, k); dots.push(<circle key={'b' + i} cx={x} cy={y} r={8} fill={C.blue} opacity={Math.sin(k * Math.PI) * 1.3} />); }
  }
  const s1 = pop(t, .2), s2 = pop(t, .5);
  return <Scene id={id} steps={[[0, 'Reactants turn into products: the FORWARD reaction'], [2.9, 'Products turn back into reactants: the REVERSE reaction'], [5.3, '⇌ means BOTH directions happen at the same time']]}>
    <g transform={`translate(125,140) scale(${s1}) translate(-125,-140)`}><rect x={40} y={105} width={170} height={70} rx={10} fill="#fff4e8" stroke={C.or} strokeWidth={2} /><Tx x={125} y={147} s="REACTANTS" size={20} fill={C.or} w={800} /></g>
    <g transform={`translate(515,140) scale(${s2}) translate(-515,-140)`}><rect x={430} y={105} width={170} height={70} rx={10} fill="#eaf7f5" stroke={C.teal} strokeWidth={2} /><Tx x={515} y={147} s="PRODUCTS" size={20} fill={C.teal} w={800} /></g>
    <DPath d="M215,118 C280,40 360,40 425,118" k={seg(t, .9, 1.7)} stroke={C.or} w={3} mk="aho" id={id} />
    <Tx x={320} y={42} s="forward reaction →" size={17} fill={C.or} w={700} op={fade(t, 1.2)} />
    <DPath d="M425,162 C360,240 280,240 215,162" k={seg(t, 3, 3.8)} stroke={C.blue} w={3} mk="ahb" id={id} />
    <Tx x={320} y={262} s="← reverse reaction" size={17} fill={C.blue} w={700} op={fade(t, 3.3)} />
    <g transform={`translate(320,155) scale(${pop(t, 5.3)})`}><Tx x={0} y={14} s="⇌" size={52} w={700} /></g>
    {dots}
  </Scene>; };

// ======================================================= 2 ammonium chloride
export const Ammonium = () => { const t = useT(); const id = 'ac'; const x = 190;
  const k = seg(t, 1.5, 9.5);
  const gas = []; for (let i = 0; i < 12; i++) { if (t < 1.5) break; const ph = rnd('g' + i); const q = ((t - 1.5) / 2.4 + ph) % 1; const dx = 8 + rnd('d' + i) * 24;
    gas.push(<circle key={i} cx={x + dx + 3 * Math.sin(t * 3 + ph * 9)} cy={205 - q * 150} r={3.3} fill={C.grey} opacity={q > .92 ? 0 : 1} />); }
  return <Scene id={id} steps={[[0, 'Heat white solid ammonium chloride, NH4Cl'], [1.6, 'HOT bottom: NH4Cl breaks down into two gases, NH3 and HCl'], [4.6, 'COOL top: the gases join again and the white solid forms AGAIN'], [7.6, 'Hot and cold push the reaction in OPPOSITE directions']]}>
    <Flame cx={x + 20} y={272} s={1.2} t={t} />
    <Tube x={x} y={25} w={40} h={200} />
    <ellipse cx={x + 20} cy={210} rx={15 * (1 - k * .75)} ry={9 * (1 - k * .75)} fill="#f0f0f0" stroke="#9aa" strokeWidth={1} />
    <rect x={x + 2} y={44} width={36} height={15} fill="#f0f0f0" stroke="#9aa3b1" strokeDasharray="3 2" opacity={clamp(seg(t, 4.6, 8) * 1.2)} />
    {gas}
    <g opacity={fade(t, 1.6)}><Arrow x1={330} y1={205} x2={x + 50} y2={205} col={C.or} mk="aho" id={id} /><Tx x={345} y={188} s="HOT bottom" size={17} fill={C.or} w={800} anchor="start" /><Tx x={345} y={214} s="NH4Cl → NH3 + HCl" size={22} w={800} anchor="start" /><Tx x={345} y={238} s="solid breaks down into gases" size={15} fill={C.muted} anchor="start" /></g>
    <g opacity={fade(t, 4.6)}><Arrow x1={330} y1={52} x2={x + 50} y2={52} col={C.blue} mk="ahb" id={id} /><Tx x={345} y={36} s="COOL top" size={17} fill={C.blue} w={800} anchor="start" /><Tx x={345} y={62} s="NH3 + HCl → NH4Cl" size={22} w={800} anchor="start" /><Tx x={345} y={86} s="white solid forms AGAIN" size={15} fill={C.muted} anchor="start" /></g>
  </Scene>; };

// ======================================================= 3/4 hydrated salts
const Hydrate = ({id, hyd, anh, fh, fa, nh, na, eq}) => { const t = useT(); const cx = 320, y = 160;
  const k = t < 1.2 ? 0 : t < 4.6 ? ease(seg(t, 1.2, 4.6)) : t < 7 ? 1 : t < 9 ? 1 - ease(seg(t, 7, 9)) : 0;
  const col = mix(hyd, anh, k); const heating = t >= 1.2 && t < 4.7; const hot = t >= 7 && t < 9.6;
  const pos = [-60, -40, -20, 0, 20, 40, 60, -50, -30, -10, 10, 30, 50, -38, -18, 2, 22, 42];
  const label = k > .5 ? fa : fh; const lcol = k > .5 ? (anh === C.white ? C.grey : anh) : hyd;
  return <Scene id={id} steps={[[0, `Hydrated salt: ${nh} (water is locked inside the crystals)`], [1.2, 'HEAT it: water is driven off (endothermic)', '#ffb38f'], [4.6, `Now it is anhydrous: ${na}`], [6.2, 'Add water back…'], [7, 'It turns back and gets HOT (exothermic)', '#8fbaff'], [9.6, `${nh} again: the reaction went BACKWARDS`]]}>
    <Tx x={320} y={32} s={eq} size={22} w={800} />
    <path d={`M${cx - 95},${y} Q${cx},${y + 55} ${cx + 95},${y}`} fill="#eef1f5" stroke={C.navy} strokeWidth={2.2} />
    {pos.map((dx, i) => { const yy = y + 3 + (i > 6 ? 9 : 0) + (i > 12 ? 8 : 0); return <rect key={i} x={cx + dx - 8} y={yy - 9} width={16} height={13} rx={2} fill={col} stroke="#335" strokeWidth={.6} transform={`rotate(${(i * 23) % 40 - 20} ${cx + dx} ${yy})`} />; })}
    <Flame cx={cx} y={275} s={1.25} t={t} op={heating ? 1 : 0} />
    {[0, 1, 2, 3].map((i) => { const yy = y - 22 - ((t * 32 + i * 14) % 46); const x = cx - 45 + i * 30; return <path key={i} d={`M${x},${yy + 22} q7,-7 0,-14 q-7,-7 0,-14`} stroke="#9fb6cf" strokeWidth={2.4} fill="none" opacity={heating && t > 1.9 ? .9 : 0} />; })}
    <path d={`M${cx},60 C${cx + 10},75 ${cx + 10},85 ${cx},85 C${cx - 10},85 ${cx - 10},75 ${cx},60 Z`} fill="#7cc0f0" transform={`translate(0,${seg(t, 6.2, 7) * 65})`} opacity={t >= 6.1 && t < 7.05 ? 1 : 0} />
    {[0, 1, 2].map((i) => { const x = cx - 70 + i * 70; const yy = y - 28 - ((t * 28) % 16); return <path key={i} d={`M${x},${yy} q6,-6 0,-12 q-6,-6 0,-12`} stroke={C.or} strokeWidth={3} fill="none" opacity={hot ? 1 : 0} />; })}
    <Tx x={105} y={150} s={label} size={26} w={800} fill={lcol} />
    <Tx x={105} y={178} s={k > .5 ? 'anhydrous' : 'hydrated'} size={16} fill={C.muted} />
    <rect x={480} y={128} width={110} height={44} rx={22} fill={col} stroke={C.line} />
    <Tx x={535} y={157} s={k > .5 ? na.toUpperCase() : nh.toUpperCase()} size={20} w={800} fill={k > .5 && anh === C.white ? C.navy : '#fff'} />
  </Scene>; };
export const Copper = () => <Hydrate id="cu" hyd={C.cublue} anh={C.white} fh="CuSO4·5H2O" fa="CuSO4" nh="blue" na="white" eq="CuSO4·5H2O  ⇌  CuSO4 + 5H2O" />;
export const Cobalt = () => <Hydrate id="co" hyd={C.pink} anh={C.coblue} fh="CoCl2·6H2O" fa="CoCl2" nh="pink" na="blue" eq="CoCl2·6H2O  ⇌  CoCl2 + 6H2O" />;

// ======================================================= 5 water tests
export const WaterTests = () => { const t = useT(); const id = 'wt';
  const dk = seg(t, 1, 2); const k = ease(seg(t, 2, 3.4));
  return <Scene id={id} steps={[[0, 'Two tests for WATER'], [1, 'Add a drop of the liquid…'], [2.4, 'Colour change = water is present ✓']]}>
    <rect x={10} y={10} width={300} height={265} rx={12} fill="#fff" stroke="#c7d6f3" /><rect x={330} y={10} width={300} height={265} rx={12} fill="#fff" stroke="#c7d6f3" />
    <Tx x={160} y={40} s="Anhydrous copper(II) sulfate" size={17} fill={C.blue} w={800} /><Tx x={480} y={40} s="Cobalt(II) chloride paper" size={17} fill={C.blue} w={800} />
    <path d="M85,170 Q160,210 235,170" fill="#eef1f5" stroke={C.navy} strokeWidth={2} /><path d="M95,172 Q160,150 225,172 Q160,192 95,172 Z" fill={mix(C.white, C.cublue, k)} stroke="#b9bfca" />
    <defs><clipPath id="paper"><rect x={440} y={100} width={80} height={100} rx={4} /></clipPath></defs>
    <rect x={440} y={100} width={80} height={100} rx={4} fill={C.coblue} /><circle cx={480} cy={140} r={k * 75} fill={C.pink} clipPath="url(#paper)" />
    {[[160, 70, 95], [480, 60, 70]].map(([x, y0, d], i) => <path key={i} d={`M${x},${y0} C${x + 9},${y0 + 14} ${x + 9},${y0 + 22} ${x},${y0 + 22} C${x - 9},${y0 + 22} ${x - 9},${y0 + 14} ${x},${y0} Z`} fill="#7cc0f0" transform={`translate(0,${dk * d})`} opacity={t > .9 && t < 2.05 ? 1 : 0} />)}
    <Tx x={160} y={245} s={k > .5 ? 'WHITE → BLUE' : 'WHITE'} size={22} w={800} fill={k > .5 ? C.cublue : C.grey} />
    <Tx x={480} y={245} s={k > .5 ? 'BLUE → PINK' : 'BLUE'} size={22} w={800} fill={k > .5 ? '#d55d91' : C.coblue} />
  </Scene>; };

// ======================================================= 6 cobalt practical
export const CobaltPractical = () => { const t = useT(); const id = 'cp';
  const cold = [117, 95], hot = [507, 95]; let x, y;
  if (t < 2) [x, y] = cold; else if (t < 4) { const m = ease(seg(t, 2, 4)); x = lerp(cold[0], hot[0], m); y = cold[1] - 75 * Math.sin(m * Math.PI); } else if (t < 7) [x, y] = hot; else if (t < 9) { const m = ease(seg(t, 7, 9)); x = lerp(hot[0], cold[0], m); y = cold[1] - 75 * Math.sin(m * Math.PI); } else [x, y] = cold;
  const k = t < 4 ? 0 : t < 7 ? ease(seg(t, 4, 5.6)) : t < 9 ? 1 : 1 - ease(seg(t, 9, 10.6));
  const Beaker = ({bx, col}) => <g><rect x={bx + 2} y={140} width={136} height={108} fill={col} /><path d={`M${bx - 7},108 L${bx},113 L${bx},250 L${bx + 140},250 L${bx + 140},108`} fill="none" stroke={C.navy} strokeWidth={2.2} /></g>;
  return <Scene id={id} steps={[[0, 'Cobalt chloride solution: pink ⇌ blue (forward = endothermic)'], [2, 'Move the tube to HOT water…'], [4.2, 'HOT → endothermic direction → it turns BLUE', '#8fb0ff'], [7, 'Move it back to ICE…'], [9.2, 'COLD → exothermic direction → PINK again', '#ffb0d0']]}>
    <Beaker bx={60} col="#e3f2fd" /><Beaker bx={450} col="#ffe7d6" />
    {[[80, 160], [110, 195], [165, 165], [145, 220], [180, 210], [90, 228]].map(([a, b], i) => <rect key={i} x={a} y={b} width={18} height={15} rx={3} fill="#fff" stroke="#9cc6e8" />)}
    {[0, 1, 2].map((i) => { const xx = 485 + i * 35, yy = 100 - ((t * 22 + i * 10) % 28); return <path key={i} d={`M${xx},${yy} q7,-9 0,-18 q-7,-9 0,-18`} stroke="#c9a28a" strokeWidth={2} fill="none" />; })}
    <Tx x={130} y={274} s="ICE-COLD water" size={17} fill={C.blue} w={800} /><Tx x={520} y={274} s="HOT water" size={17} fill={C.or} w={800} />
    <g transform={`translate(${x},${y})`}><Tube x={0} y={0} w={30} h={140} fill={mix(C.pink, C.coblue, k)} frac={.55} /></g>
    <Tx x={320} y={60} s="pink ⇌ blue" size={24} w={800} fill={mix('#d55d91', C.coblue, k)} />
  </Scene>; };

// ======================================================= 7 open / closed
export const OpenClosed = () => { const t = useT(); const id = 'oc';
  const op = []; for (let i = 0; i < 8; i++) { const ph = rnd('o' + i); const q = ((t / 3) + ph) % 1; const x = 125 + rnd('ox' + i) * 70;
    op.push(<circle key={i} cx={x + 6 * Math.sin(t * 2 + ph * 7)} cy={215 - q * 205} r={6} fill={C.grey} opacity={q > .85 ? 1 - (q - .85) / .15 : 1} />); }
  const cl = []; for (let i = 0; i < 8; i++) cl.push(<circle key={i} cx={bounce(455 + rnd('cx' + i) * 50, (rnd('vx' + i) - .5) * 90, t, 455, 505)} cy={bounce(165 + rnd('cy' + i) * 55, (rnd('vy' + i) - .5) * 90, t, 165, 222)} r={6} fill={C.grey} />);
  return <Scene id={id} steps={[[0, 'Heat calcium carbonate: CaCO3 ⇌ CaO + CO2'], [2.6, 'OPEN: the CO2 gas escapes — it can never come back', '#ffaaaa'], [5.3, 'CLOSED: nothing escapes — equilibrium CAN be reached', '#8fe0d2']]}>
    <rect x={10} y={10} width={300} height={265} rx={12} fill="#fff" stroke={C.line} strokeWidth={2} opacity={t < 5.3 ? 1 : .55} />
    <rect x={330} y={10} width={300} height={265} rx={12} fill="#fff" stroke={C.line} strokeWidth={2} opacity={t > 2.6 && t < 5.3 ? .55 : 1} />
    <Tx x={160} y={42} s="OPEN system" size={22} fill={C.red} w={800} /><Tx x={480} y={42} s="CLOSED system" size={22} fill={C.teal} w={800} />
    <path d="M110,110 L110,240 L210,240 L210,110" fill="none" stroke={C.navy} strokeWidth={2.2} /><rect x={112} y={212} width={96} height={26} fill="#e2e2e2" />
    <path d="M462,85 L462,130 L415,210 Q408,240 430,240 L530,240 Q552,240 545,210 L498,130 L498,85" fill="none" stroke={C.navy} strokeWidth={2.2} /><rect x={456} y={74} width={48} height={17} rx={3} fill="#7a5537" />
    <path d="M412,222 L548,222 Q552,238 530,238 L430,238 Q408,238 412,222 Z" fill="#e2e2e2" />
    {op}{cl}
    <Tx x={160} y={265} s="CO2 escapes ✗" size={17} w={800} fill={C.red} op={fade(t, 2.6)} /><Tx x={480} y={265} s="nothing escapes ✓" size={17} w={800} fill={C.teal} op={fade(t, 5.3)} />
  </Scene>; };

// ======================================================= 8 graphs
export const Graphs = () => { const t = useT(); const id = 'gr'; const k = clamp(t / 6.5); const N = 80;
  const F = [(x) => 150 * Math.exp(-x * 3.2) + 75 * (1 - Math.exp(-x * 3.2)), (x) => 75 * (1 - Math.exp(-x * 3.2)), (x) => 160 - 85 * (1 - Math.exp(-x * 3.2)), (x) => 110 * (1 - Math.exp(-x * 3.2))];
  const ox = [55, 55, 375, 375], oy = 245, W = 230; const cols = [C.or, C.blue, C.or, C.teal];
  const d = (i) => { let s = ''; for (let j = 0; j <= N * k; j++) { const x = j / N; s += (j ? 'L' : 'M') + (ox[i] + x * W).toFixed(1) + ',' + (oy - F[i](x)).toFixed(1); } return s; };
  const done = fade(t, 5.6);
  return <Scene id={id} steps={[[0, 'Start: forward reaction FAST, reverse reaction slow'], [2.7, 'Forward rate falls… reverse rate rises…'], [5.6, 'EQUILIBRIUM: rates EQUAL, concentrations stop changing', '#8fe0d2']]}>
    {[[55, 'A: the two RATES', 'rate'], [375, 'B: the CONCENTRATIONS', 'concentration']].map(([x, tt, yl]) => <g key={x}>
      <path d={`M${x},45 L${x},${oy} L${x + W},${oy}`} fill="none" stroke={C.navy} strokeWidth={2} /><Tx x={x + W / 2} y={265} s="time" size={15} /><Tx x={x + W / 2} y={24} s={tt} size={18} w={800} />
      <g transform={`rotate(-90 ${x - 16} 150)`}><Tx x={x - 16} y={150} s={yl} size={15} /></g>
      <line x1={x + k * W} x2={x + k * W} y1={45} y2={oy} stroke={C.grey} strokeDasharray="5 4" /></g>)}
    {[0, 1, 2, 3].map((i) => <path key={i} d={d(i)} fill="none" stroke={cols[i]} strokeWidth={4} />)}
    <Tx x={120} y={68} s="forward" size={16} fill={C.or} w={800} op={fade(t, .4)} /><Tx x={120} y={232} s="reverse" size={16} fill={C.blue} w={800} op={fade(t, 1.2)} />
    <Tx x={440} y={66} s="reactants" size={16} fill={C.or} w={800} op={fade(t, .4)} /><Tx x={440} y={232} s="products" size={16} fill={C.teal} w={800} op={fade(t, 1.2)} />
    <Tx x={230} y={150} s="EQUAL" size={20} fill={C.teal} w={800} op={done} /><Tx x={545} y={115} s="flat lines" size={18} w={800} op={done} />
  </Scene>; };

// ======================================================= 9 dynamic particles
export const Dynamic = () => { const t = useT(); const id = 'dy'; const n = 26;
  const isR = Array.from({length: n}, (_, i) => i < 15); const flash = Array(n).fill(-9); let count = 0;
  for (let e = 0; ; e++) { const te = 1.5 + e * .55; if (te > t) break; const R = [], P = []; isR.forEach((r, i) => (r ? R : P).push(i));
    const a = R[Math.floor(rnd('a' + e) * R.length)], b = P[Math.floor(rnd('b' + e) * P.length)]; isR[a] = false; isR[b] = true; flash[a] = flash[b] = te; count += 2; }
  return <Scene id={id} steps={[[0, 'Inside a flask at equilibrium'], [1.6, 'Every flash = one particle reacting'], [4.6, 'Reactants → products AND products → reactants, at the SAME rate'], [7.6, 'So the totals never change: a DYNAMIC equilibrium', '#8fe0d2']]}>
    <rect x={15} y={12} width={415} height={262} rx={14} fill="#fff" stroke={C.line} strokeWidth={2} />
    {isR.map((r, i) => { const x = bounce(35 + rnd('x' + i) * 375, (rnd('vx' + i) - .5) * 110, t, 32, 413), y = bounce(30 + rnd('y' + i) * 225, (rnd('vy' + i) - .5) * 110, t, 30, 256); const fa = t - flash[i];
      return <g key={i}><circle cx={x} cy={y} r={12} fill={r ? C.or : C.teal} />{fa < .6 && <circle cx={x} cy={y} r={12 + fa * 34} fill="none" stroke="#f6c344" strokeWidth={4} opacity={1 - fa / .6} />}</g>; })}
    <rect x={450} y={30} width={180} height={225} rx={12} fill="#f5f7fa" stroke={C.line} />
    <Tx x={540} y={66} s="Reactants" size={19} fill={C.or} w={800} /><Tx x={540} y={108} s="15" size={40} fill={C.or} w={800} />
    <Tx x={540} y={148} s="Products" size={19} fill={C.teal} w={800} /><Tx x={540} y={190} s="11" size={40} fill={C.teal} w={800} />
    <Tx x={540} y={232} s={`reactions: ${count}`} size={16} fill={C.muted} w={600} />
  </Scene>; };

// ======================================================= 10 escalator
export const Escalator = () => { const t = useT(); const id = 'es'; const L = Math.hypot(380, 135), ux = 380 / L, uy = 135 / L;
  const x = 270, y = 60 + uy * (x - 90) / ux; const w = Math.sin(t * 8) * 12;
  return <Scene id={id} steps={[[0, 'The escalator moves DOWN = the reverse reaction', '#8fbaff'], [2.7, 'The person walks UP = the forward reaction', '#ffb38f'], [5.3, 'Same speed: stays in the same place — but BOTH keep moving!', '#8fe0d2']]}>
    <path d="M40,60 L90,60 L470,195 L560,195" fill="none" stroke={C.navy} strokeWidth={4} />
    {Array.from({length: 12}, (_, i) => { const d = ((i / 12) + t * .09) % 1 * L; const sx = 90 + ux * d, sy = 60 + uy * d; return <path key={i} d={`M${sx},${sy} l18,0 l0,8`} stroke={C.grey} strokeWidth={2} fill="none" />; })}
    <g transform={`translate(${x},${y - 20})`}><circle cx={0} cy={-44} r={11} fill={C.or} /><line x1={0} y1={-33} x2={0} y2={-4} stroke={C.or} strokeWidth={5} />
      <line x1={0} y1={-4} x2={-w} y2={18} stroke={C.or} strokeWidth={5} /><line x1={0} y1={-4} x2={w} y2={18} stroke={C.or} strokeWidth={5} />
      <line x1={0} y1={-24} x2={w * .9} y2={-8} stroke={C.or} strokeWidth={5} /><line x1={0} y1={-24} x2={-w * .9} y2={-8} stroke={C.or} strokeWidth={5} /></g>
    <g opacity={fade(t, 0)}><Arrow x1={360} y1={190} x2={440} y2={218} col={C.blue} mk="ahb" id={id} w={3.5} /><Tx x={400} y={250} s="escalator DOWN = reverse" size={18} fill={C.blue} w={800} /></g>
    <g opacity={fade(t, 2.7)}><Arrow x1={250} y1={36} x2={180} y2={12} col={C.or} mk="aho" id={id} w={3.5} /><Tx x={292} y={30} s="walks UP = forward" size={18} fill={C.or} w={800} anchor="start" /></g>
    <g opacity={fade(t, 5.3)}><rect x={470} y={40} width={160} height={110} rx={10} fill="#eaf7f5" stroke={C.teal} strokeWidth={2} /><Tx x={550} y={70} s="Same speed" size={18} fill={C.teal} w={800} /><Tx x={550} y={98} s="same place," size={16} /><Tx x={550} y={124} s="still moving!" size={16} w={800} /></g>
  </Scene>; };

// ======================================================= 11 pressure
export const Pressure = () => { const t = useT(); const id = 'pr';
  const right = t < 2 ? 380 : t < 4.2 ? lerp(380, 245, ease(seg(t, 2, 4.2))) : t < 11 ? 245 : lerp(245, 380, ease(seg(t, 11, 12)));
  const r = t < 4.6 || t > 11 ? 0 : ease(seg(t, 4.8, 7.4));
  const mols = [['N2', 1], ['N2', 0], ['H2', 1], ['H2', 1], ['H2', 1], ['H2', 0], ['H2', 0], ['H2', 0], ['NH3', 0], ['new', 0], ['new', 0]];
  const X0 = 58, Y0 = 82, Y1 = 158;
  const n = r > .5 ? 7 : 9;
  return <Scene id={id} steps={[[0, 'N2 + 3H2 ⇌ 2NH3 in a syringe: 9 gas molecules'], [2, 'Push the plunger in: the PRESSURE goes UP'], [4.8, 'Equilibrium shifts to the side with FEWER molecules', '#8fe0d2'], [7.6, '1 N2 + 3 H2 → 2 NH3: now only 7 molecules']]}>
    <rect x={40} y={65} width={right - 40} height={110} rx={4} fill="#fff" stroke={C.navy} strokeWidth={2.5} />
    <rect x={24} y={113} width={16} height={14} fill="#cfd6e2" stroke={C.navy} />
    <g transform={`translate(${right},0)`}><rect x={0} y={74} width={14} height={92} fill="#cfd6e2" stroke={C.navy} /><rect x={14} y={114} width={130} height={12} fill="#cfd6e2" stroke={C.navy} /><rect x={144} y={90} width={10} height={60} fill="#cfd6e2" stroke={C.navy} /></g>
    {t > 2 && t < 4.2 && <path d={`M${right + 205},120 l-30,0`} stroke={C.or} strokeWidth={5} markerEnd={`url(#aho${id})`} />}
    {mols.map(([type, used], i) => { const fx = bounce(rnd('px' + i), (rnd('pvx' + i) - .5) * .5, t, 0, 1), y = bounce(Y0 + rnd('py' + i) * (Y1 - Y0), (rnd('pvy' + i) - .5) * 60, t, Y0, Y1);
      const x = X0 + fx * (right - X0 - 22); const o = type === 'new' ? r : used ? 1 - r : 1;
      return type === 'N2' ? <N2 key={i} x={x} y={y} op={o} /> : type === 'H2' ? <H2 key={i} x={x} y={y} op={o} /> : <NH3 key={i} x={x} y={y} op={o} />; })}
    <Tx x={590} y={112} s={String(n)} size={52} w={800} fill={n === 7 ? C.teal : C.navy} /><Tx x={590} y={140} s="molecules" size={15} fill={C.muted} />
    <Tx x={320} y={218} s="N2 + 3H2  ⇌  2NH3" size={24} w={800} />
    <Tx x={210} y={250} s="4 molecules" size={18} w={800} fill={C.or} /><Tx x={430} y={250} s="2 molecules" size={18} w={800} fill={C.teal} />
    <Arrow x1={275} y1={244} x2={360} y2={244} col={C.teal} mk="aht" id={id} w={3} />
    <N2 x={190} y={274} /><Tx x={205} y={280} s="N2" size={13} anchor="start" /><H2 x={300} y={274} /><Tx x={312} y={280} s="H2" size={13} anchor="start" /><NH3 x={410} y={272} /><Tx x={424} y={280} s="NH3" size={13} anchor="start" />
  </Scene>; };

// ======================================================= 12 concentration
export const Concentration = () => { const t = useT(); const id = 'cn'; const v = [70, 90, 60];
  if (t >= 2) v[0] += 60 * ease(seg(t, 2, 3));
  if (t >= 3.2) { const k = ease(seg(t, 3.2, 6)); v[0] -= 20 * k; v[1] -= 30 * k; v[2] += 30 * k; }
  if (t >= 8.3) v[2] -= 60 * ease(seg(t, 8.3, 9.3));
  if (t >= 9.5) { const k = ease(seg(t, 9.5, 12.3)); v[0] -= 12 * k; v[1] -= 24 * k; v[2] += 24 * k; }
  const shifting = (t > 3.2 && t < 6) || (t > 9.5 && t < 12.3);
  return <Scene id={id} steps={[[0, 'N2 + 3H2 ⇌ 2NH3 at equilibrium'], [2, 'ADD more N2…', '#ffb38f'], [3.2, 'Shifts RIGHT to use up the extra N2 → MORE NH3', '#8fe0d2'], [8.3, 'REMOVE NH3…', '#ffb38f'], [9.5, 'Shifts RIGHT to make more NH3 again', '#8fe0d2'], [13, 'ADD → shift away. REMOVE → shift towards.']]}>
    <Tx x={320} y={34} s="N2  +  3H2  ⇌  2NH3" size={26} w={800} />
    <Tx x={320} y={72} s="→ → →" size={30} w={800} fill={C.teal} op={shifting ? .5 + .5 * Math.sin(t * 9) : 0} />
    <path d="M110,250 L530,250" stroke={C.navy} strokeWidth={2} />
    {[['N2', C.blue, 180], ['H2', '#9aa6b8', 320], ['NH3', C.teal, 460]].map(([l, c, x], i) => <g key={l}><rect x={x - 45} y={250 - v[i]} width={90} height={v[i]} rx={5} fill={c} /><Tx x={x} y={275} s={l} size={19} w={800} /></g>)}
  </Scene>; };

// ======================================================= 13 catalyst
export const Catalyst = () => { const t = useT(); const id = 'ca'; const k = clamp(t / 7); const N = 100; const ox = 70, oy = 230, W = 420, Hh = 170;
  let a = '', b = ''; for (let j = 0; j <= N * k; j++) { const x = j / N, X = ox + x * W; a += (j ? 'L' : 'M') + X + ',' + (oy - Hh * (1 - Math.exp(-x * 9))); b += (j ? 'L' : 'M') + X + ',' + (oy - Hh * (1 - Math.exp(-x * 3.6))); }
  return <Scene id={id} steps={[[0, 'Two identical reactions: one WITH a catalyst, one without'], [2.6, 'With a catalyst: equilibrium is reached SOONER', '#8fe0d2'], [6.3, 'Same height: the SAME amount of product', '#ffd28f']]}>
    <path d={`M${ox},30 L${ox},${oy} L${ox + W},${oy}`} fill="none" stroke={C.navy} strokeWidth={2} /><Tx x={ox + W / 2} y={256} s="time" size={15} />
    <g transform={`rotate(-90 48 130)`}><Tx x={48} y={130} s="amount of product" size={15} /></g>
    <path d={a} fill="none" stroke={C.teal} strokeWidth={4.5} /><path d={b} fill="none" stroke={C.or} strokeWidth={4} strokeDasharray="10 6" />
    <Tx x={ox + .3 * W} y={48} s="✓ catalyst: there!" size={16} fill={C.teal} w={800} op={fade(t, 2.6)} />
    <line x1={ox} x2={ox + W} y1={oy - Hh} y2={oy - Hh} stroke={C.grey} strokeDasharray="4 4" opacity={fade(t, 6.3)} /><Tx x={ox + W - 4} y={oy - Hh - 10} s="SAME height" size={17} w={800} anchor="end" op={fade(t, 6.3)} />
    <rect x={510} y={70} width={122} height={84} rx={8} fill="#fff" stroke={C.line} />
    <line x1={522} x2={552} y1={98} y2={98} stroke={C.teal} strokeWidth={4.5} /><Tx x={560} y={104} s="catalyst" size={15} anchor="start" />
    <line x1={522} x2={552} y1={130} y2={130} stroke={C.or} strokeWidth={4} strokeDasharray="8 5" /><Tx x={560} y={136} s="none" size={15} anchor="start" />
  </Scene>; };

// ======================================================= flow diagrams
const Flow = ({id, boxes, pipes, steps, extra}) => { const t = useT(); let cur = 0; steps.forEach((s, i) => { if (t >= s[0]) cur = i; });
  return <Scene id={id} steps={steps}>
    {pipes.map(([pts, col, n, stage, dash], i) => <g key={'p' + i}>
      <polyline points={pts.map((p) => p.join(',')).join(' ')} fill="none" stroke={dash ? C.grey : '#c3c9d4'} strokeWidth={dash ? 2.5 : 7} strokeDasharray={dash ? '8 6' : undefined} strokeLinecap="round" strokeLinejoin="round" opacity={cur >= stage ? 1 : .3} />
      {cur >= stage && Array.from({length: n}, (_, j) => { const [x, y] = alongLine(pts, ((t / 2.4) + j / n) % 1); return <circle key={j} cx={x} cy={y} r={6} fill={col} stroke="#123" strokeWidth={.7} />; })}</g>)}
    {boxes.map(([x, y, w, h, title, fill, stroke, lines, stage], i) => { const on = cur === stage, seen = cur >= stage;
      return <g key={i} opacity={seen ? 1 : .35}>{on && <rect x={x - 5} y={y - 5} width={w + 10} height={h + 10} rx={12} fill="none" stroke={C.or} strokeWidth={4} opacity={.55 + .45 * Math.sin(t * 6)} />}
        <rect x={x} y={y} width={w} height={h} rx={9} fill={fill} stroke={stroke} strokeWidth={2.2} /><Tx x={x + w / 2} y={y + 24} s={title} size={16} w={800} />
        {lines.map((l, j) => <Tx key={j} x={x + w / 2} y={y + 46 + j * 19} s={l} size={14} fill="#2d3546" />)}</g>; })}
    {extra && extra(cur)}
  </Scene>; };

export const Haber = () => <Flow id="hb"
  steps={[[0, 'Nitrogen comes from the AIR'], [2.3, 'Hydrogen comes from methane (natural gas) + steam'], [4.6, 'Compressor: 20 000 kPa, N2 : H2 = 1 : 3'], [7, 'Converter: iron catalyst, 450 °C → only about 15% NH3'], [9.6, 'Cooler: NH3 turns to LIQUID and is removed', '#8fe0d2'], [12, 'Unreacted N2 and H2 are RECYCLED back']]}
  boxes={[[8, 28, 132, 62, 'AIR', '#eef4ff', C.blue, ['gives N2'], 0], [8, 142, 132, 82, 'NATURAL GAS', '#eef4ff', C.blue, ['methane + steam', 'gives H2'], 1],
    [172, 88, 132, 84, 'COMPRESSOR', '#fff4e8', C.or, ['N2 : H2 = 1 : 3', '20 000 kPa'], 2], [334, 64, 150, 132, 'CONVERTER', '#fff4e8', C.or, ['iron catalyst', '450 °C', 'N2 + 3H2 ⇌ 2NH3', '~15% NH3'], 3],
    [512, 84, 122, 92, 'COOLER', '#eaf7f5', C.teal, ['NH3 becomes', 'a liquid'], 4]]}
  pipes={[[[[140, 60], [172, 110]], C.blue, 3, 0], [[[140, 182], [172, 150]], '#ffffff', 3, 1], [[[304, 130], [334, 130]], '#7aa7e8', 2, 2], [[[484, 130], [512, 130]], C.teal, 2, 3], [[[573, 176], [573, 238]], C.teal, 3, 4],
    [[[573, 84], [573, 18], [238, 18], [238, 88]], C.grey, 5, 5, true]]}
  extra={(cur) => <><Tx x={573} y={262} s="liquid ammonia" size={17} fill={C.teal} w={800} op={cur >= 4 ? 1 : .3} /><Tx x={405} y={12} s="recycled N2 + H2" size={14} fill={C.muted} w={700} op={cur >= 5 ? 1 : 0} /></>} />;

export const Contact = () => <Flow id="ct"
  steps={[[0, 'Burner: burn sulfur in air → S + O2 → SO2'], [3, 'Converter: 2SO2 + O2 ⇌ 2SO3 (V2O5 catalyst, 450 °C, 200 kPa)'], [6.6, 'Absorber: SO3 dissolves in concentrated H2SO4 → oleum'], [9.3, 'Add water: oleum → sulfuric acid, H2SO4', '#8fe0d2']]}
  boxes={[[4, 60, 128, 92, 'BURNER', '#eef4ff', C.blue, ['sulfur + air', 'S + O2 → SO2'], 0], [160, 40, 165, 132, 'CONVERTER', '#fff4e8', C.or, ['+ more air', 'V2O5 catalyst', '450 °C · 200 kPa', '2SO2 + O2 ⇌ 2SO3'], 1],
    [352, 52, 150, 108, 'ABSORBER', '#eaf7f5', C.teal, ['SO3 + conc. H2SO4', '→ oleum', 'H2S2O7'], 2], [526, 60, 110, 92, 'WATER', '#eaf7f5', C.teal, ['H2S2O7 + H2O', '→ 2H2SO4'], 3]]}
  pipes={[[[[132, 106], [160, 106]], '#f6c344', 2, 0], [[[325, 106], [352, 106]], '#e8a23c', 2, 1], [[[502, 106], [526, 106]], C.teal, 2, 2], [[[581, 152], [581, 228]], C.teal, 3, 3]]}
  extra={(cur) => <Tx x={581} y={254} s="sulfuric acid" size={17} fill={C.teal} w={800} op={cur >= 3 ? 1 : .3} />} />;
