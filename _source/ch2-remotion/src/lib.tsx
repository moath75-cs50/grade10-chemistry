// @ts-nocheck
import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring, random} from 'remotion';

export const C = {navy:'#18213a',or:'#ef6a3a',teal:'#1f9e8f',blue:'#2c6fd1',red:'#d94c4c',cublue:'#3d8fdc',pink:'#ef8db5',coblue:'#2f55c9',grey:'#8a93a6',white:'#f4f4f4',muted:'#545d70',line:'#dfe3ea'};
export const FONT = 'Inter, "DejaVu Sans", sans-serif';

export const useT = () => { const f = useCurrentFrame(); const {fps} = useVideoConfig(); return f / fps; };
export const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
export const lerp = (a, b, k) => a + (b - a) * k;
export const seg = (t, a, b) => clamp((t - a) / (b - a));
export const ease = (k) => (k < .5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2);
export const easeOut = (k) => 1 - Math.pow(1 - k, 3);
const hex = (c) => { c = c.replace('#', ''); return [0, 2, 4].map((i) => parseInt(c.slice(i, i + 2), 16)); };
export const mix = (a, b, k) => { const A = hex(a), B = hex(b); return `rgb(${A.map((v, i) => Math.round(lerp(v, B[i], k))).join(',')})`; };
export const fade = (t, a, d = .4) => clamp((t - a) / d);
export const pop = (t, a) => { const k = clamp((t - a) / .45); if (k <= 0) return 0; const s = 1.70158; const x = k - 1; return 1 + (s + 1) * x * x * x + s * x * x; };
export const rnd = (seed) => random(seed);
// bounce position inside [a,b] for a value moving linearly
export const bounce = (x0, v, t, a, b) => { const L = b - a; let p = ((x0 - a) + v * t) % (2 * L); if (p < 0) p += 2 * L; return a + (p <= L ? p : 2 * L - p); };
// cubic bezier point
export const bez = (p0, p1, p2, p3, k) => { const u = 1 - k; return [0, 1].map((i) => u * u * u * p0[i] + 3 * u * u * k * p1[i] + 3 * u * k * k * p2[i] + k * k * k * p3[i]); };
export const alongLine = (pts, k) => { // polyline
  const L = []; let tot = 0; for (let i = 1; i < pts.length; i++) { const d = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); L.push(d); tot += d; }
  let r = k * tot; for (let i = 0; i < L.length; i++) { if (r <= L[i]) { const q = r / L[i]; return [lerp(pts[i][0], pts[i + 1][0], q), lerp(pts[i][1], pts[i + 1][1], q)]; } r -= L[i]; }
  return pts[pts.length - 1]; };

// formula -> tspans (svg) / spans (html)
const parts = (s) => { const out = []; let i = 0; let buf = '';
  while (i < s.length) { const c = s[i];
    if (/\d/.test(c) && i > 0 && /[A-Za-z)]/.test(s[i - 1])) { if (buf) out.push([buf, 0]); buf = ''; let j = i; while (j < s.length && /\d/.test(s[j])) j++; out.push([s.slice(i, j), 1]); i = j; continue; }
    buf += c; i++; }
  if (buf) out.push([buf, 0]); return out; };
export const Tx = ({x, y, s, size = 16, fill = C.navy, w = 400, anchor = 'middle', op = 1, style = {}}) => (
  <text x={x} y={y} fontSize={size} fill={fill} fontWeight={w} textAnchor={anchor} fontFamily={FONT} opacity={op} style={style}>
    {parts(String(s)).map(([p, sub], i) => sub ? <tspan key={i} baselineShift="sub" fontSize="68%">{p}</tspan> : <tspan key={i}>{p}</tspan>)}
  </text>);
export const Chem = ({s}) => <>{parts(s).map(([p, sub], i) => sub ? <sub key={i} style={{fontSize: '65%'}}>{p}</sub> : <span key={i}>{p}</span>)}</>;

export const Markers = ({k}) => (
  <defs>{[['ah', C.navy], ['aho', C.or], ['ahb', C.blue], ['aht', C.teal], ['ahg', C.grey]].map(([id, col]) => (
    <marker key={id} id={id + k} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill={col} /></marker>))}</defs>);

// draw-in path
export const DPath = ({d, k = 1, stroke = C.navy, w = 2.5, mk, id, dash, op = 1, fill = 'none'}) => (
  <path d={d} pathLength={1} fill={fill} stroke={stroke} strokeWidth={w} opacity={op}
    strokeDasharray={dash ? undefined : '1 1'} strokeDashoffset={dash ? undefined : 1 - clamp(k)}
    markerEnd={mk && k > .97 ? `url(#${mk}${id})` : undefined} strokeLinecap="round" />);

export const Arrow = ({x1, y1, x2, y2, col = C.navy, mk = 'ah', id, w = 2.5, k = 1}) => {
  const x = lerp(x1, x2, clamp(k)), y = lerp(y1, y2, clamp(k));
  return k <= 0 ? null : <line x1={x1} y1={y1} x2={x} y2={y} stroke={col} strokeWidth={w} markerEnd={`url(#${mk}${id})`} />; };

export const Tube = ({x, y, w = 34, h = 150, fill, frac = .5}) => { const r = w / 2; const top = y + h - h * frac;
  return <g>{fill && <path d={`M${x + 2},${top} L${x + 2},${y + h - r} A${r - 2},${r - 2} 0 0 0 ${x + w - 2},${y + h - r} L${x + w - 2},${top} Z`} fill={fill} />}
    <path d={`M${x},${y} L${x},${y + h - r} A${r},${r} 0 0 0 ${x + w},${y + h - r} L${x + w},${y}`} fill="none" stroke={C.navy} strokeWidth={2} /></g>; };
export const Flame = ({cx, y, s = 1, t = 0, op = 1}) => { const k = 1 + .08 * Math.sin(t * 14);
  return <g opacity={op} transform={`translate(${cx},${y}) scale(${s},${s * k})`}>
    <path d="M0,-30 C14,-14 12,0 0,0 C-12,0 -14,-14 0,-30 Z" fill="#f6a23c" /><path d="M0,-18 C7,-9 6,0 0,0 C-6,0 -7,-9 0,-18 Z" fill="#3c7be0" /></g>; };
export const N2 = ({x, y, op = 1}) => <g transform={`translate(${x},${y})`} opacity={op}><circle cx={-6} cy={0} r={8} fill={C.blue} stroke="#123" strokeWidth={.8} /><circle cx={6} cy={0} r={8} fill={C.blue} stroke="#123" strokeWidth={.8} /></g>;
export const H2 = ({x, y, op = 1}) => <g transform={`translate(${x},${y})`} opacity={op}><circle cx={-4} cy={0} r={5.2} fill="#fff" stroke="#123" strokeWidth={.9} /><circle cx={4} cy={0} r={5.2} fill="#fff" stroke="#123" strokeWidth={.9} /></g>;
export const NH3 = ({x, y, op = 1}) => <g transform={`translate(${x},${y})`} opacity={op}>{[[-8, 6], [8, 6], [0, -8]].map(([a, b], i) => <circle key={i} cx={a} cy={b} r={4.6} fill="#fff" stroke="#123" strokeWidth={.9} />)}<circle cx={0} cy={0} r={8} fill={C.blue} stroke="#123" strokeWidth={.8} /></g>;

// ------------------------------------------------ the frame every video uses
export const Scene = ({steps, children, H = 285, id = 'x'}) => {
  const t = useT();
  let cur = 0; steps.forEach((s, i) => { if (t >= s[0]) cur = i; });
  const start = steps[cur][0]; const next = steps[cur + 1] ? steps[cur + 1][0] : 1e9;
  const op = Math.min(clamp((t - start) / .35), clamp((next - t) / .25));
  const col = steps[cur][2] || '#fff';
  return (
    <AbsoluteFill style={{background: '#fff', fontFamily: FONT}}>
      <svg viewBox={`0 0 640 ${H}`} style={{position: 'absolute', left: 20, top: 8, width: 1240, height: 552}}>
        <Markers k={id} />{children}
      </svg>
      <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 152, background: C.navy, display: 'flex', alignItems: 'center', padding: '0 54px'}}>
        <div style={{display: 'flex', gap: 10, position: 'absolute', top: 16, left: 54}}>
          {steps.map((s, i) => <div key={i} style={{width: i === cur ? 34 : 12, height: 12, borderRadius: 6, background: i <= cur ? C.or : '#3a4563'}} />)}
        </div>
        <div style={{position: 'absolute', top: 12, right: 40, color: C.or, fontWeight: 800, fontSize: 22}}>@chemistmoath</div>
        <div style={{color: col, fontSize: 40, fontWeight: 700, lineHeight: 1.18, opacity: op, marginTop: 22}}><Chem s={steps[cur][1]} /></div>
      </div>
    </AbsoluteFill>);
};
