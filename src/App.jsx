import { useState, useEffect, useCallback, createContext, useContext, useRef } from "react";

// ─── INLINE SVG ICONS ──────────────────────────────────────────────────────────
const Ic = ({ d, size=16, color="currentColor", fill="none", strokeWidth=2, style={} }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={color}
    strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0,...style}}>
    {Array.isArray(d) ? d.map((p,i)=><path key={i} d={p}/>) : <path d={d}/>}
  </svg>
);

const PATHS = {
  cart:      "M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4zM3 6h18M16 10a4 4 0 0 1-8 0",
  search:    "M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z",
  x:         "M18 6 6 18M6 6l12 12",
  plus:      "M12 5v14M5 12h14",
  minus:     "M5 12h14",
  trash:     "M3 6h18M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6M10 11v6M14 11v6M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2",
  heart:     "M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z",
  eye:       "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8zM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z",
  star:      "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
  chevR:     "M9 18l6-6-6-6",
  chevL:     "M15 18l-6-6 6-6",
  chevD:     "M6 9l6 6 6-6",
  shield:    "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
  truck:     "M1 3h15v13H1zM16 8h4l3 3v5h-7V8zM5.5 21a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5zM18.5 21a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z",
  refresh:   "M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15",
  check:     "M22 11.08V12a10 10 0 1 1-5.93-9.14M22 4 12 14.01l-3-3",
  phone:     "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z",
  mail:      "M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zM22 6l-10 7L2 6",
  pin:       "M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0zM12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6z",
  clock:     "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM12 6v6l4 2",
  zap:       "M13 2 3 14h9l-1 8 10-12h-9l1-8z",
  award:     "M12 15a7 7 0 1 0 0-14 7 7 0 0 0 0 14zM8.21 13.89 7 23l5-3 5 3-1.21-9.12",
  trend:     "M23 6l-9.5 9.5-5-5L1 18M17 6h6v6",
  pkg:       "M16.5 9.4 7.55 4.24M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16zM3.27 6.96 12 12.01l8.73-5.05M12 22.08V12",
  lock:      "M19 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2zM7 11V7a5 5 0 0 1 10 0v4",
  wifi:      "M5 12.55a11 11 0 0 1 14.08 0M1.42 9a16 16 0 0 1 21.16 0M8.53 16.11a6 6 0 0 1 6.95 0M12 20h.01",
  cam:       "M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2zM12 17a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
  batt:      "M23 7h-1a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9h1V7zM7 12h10",
  cpu:       "M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2V9M9 21H5a2 2 0 0 1-2-2V9m0 0h18",
  arrow:     "M5 12h14M12 5l7 7-7 7",
  msg:       "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z",
  sliders:   "M21 4H14M10 4H3M21 12h-7M10 12H3M21 20h-9M8 20H3M14 2v4M10 2v4M14 10v4M10 10v4M12 18v4M8 18v4",
  flame:     "M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z",
  card:      "M1 4h22v16H1zM1 9h22",
  globe:     "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z",
  layers:    "M12 2 2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5",
  activity:  "M22 12h-4l-3 9L9 3l-3 9H2",
  radio:     "M12 12m-2 0a2 2 0 1 0 4 0 2 2 0 0 0-4 0M4.93 4.93a10 10 0 0 0 0 14.14M19.07 4.93a10 10 0 0 1 0 14.14",
  grid:      "M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z",
  list:      "M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01",
  scan:      "M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2",
  phone2:    "M12 18H12.01M8 21h8a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2z",
  monitor:   "M20 3H4a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2zM8 21h8M12 17v4",
  gem:       "M6 3h12l4 6-10 13L2 9 6 3zM2 9h20M6 3l4 6M18 3l-4 6",
  crown:     "M2 20h20M5 20V10l7-7 7 7v10",
  badge:     "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10zM9 12l2 2 4-4",
  fb:        "M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z",
  barChart:  "M12 20V10M18 20V4M6 20v-6",
  mpesa:     "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z",
  smartphone:"M17 2H7a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2zM12 18h.01",
  signal:    "M1 6l4.5 4.5M22.5 1.5 18 6M6 1l5 5M19 6l-5 5M11 6l1 1M13 12l1 1",
  checkCirc: "M22 11.08V12a10 10 0 1 1-5.93-9.14M22 4 12 14.01l-3-3",
  loader:    "M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83",
  warning:   "M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4M12 17h.01",
  info:      "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM12 8h.01M12 12v4",
};

const Icon = ({ name, size=16, color="currentColor", fill="none", strokeWidth=2, style={} }) => {
  const d = PATHS[name];
  if (!d) return null;
  return <Ic d={d} size={size} color={color} fill={fill} strokeWidth={strokeWidth} style={style} />;
};

// ─── DESIGN TOKENS ───────────────────────────────────────────────────────────
const D = {
  bg:          "#020509",
  surface:     "#060A14",
  card:        "#0A1022",
  cardHover:   "#0E1630",
  border:      "rgba(255,255,255,0.055)",
  borderGlow:  "rgba(99,102,241,0.4)",
  borderGreen: "rgba(52,211,153,0.3)",
  accent:      "#6366F1",
  accentB:     "#818CF8",
  accentSoft:  "rgba(99,102,241,0.1)",
  emerald:     "#10B981",
  emeraldB:    "#34D399",
  emeraldSoft: "rgba(16,185,129,0.1)",
  gold:        "#F59E0B",
  goldSoft:    "rgba(245,158,11,0.1)",
  rose:        "#F43F5E",
  roseSoft:    "rgba(244,63,94,0.1)",
  cyan:        "#06B6D4",
  violet:      "#8B5CF6",
  text:        "#F1F5F9",
  textMid:     "#7C8BA3",
  textDim:     "#2E3A4E",
  white:       "#FFFFFF",
  lipa:        "#F59E0B",
  lipaSoft:    "rgba(245,158,11,0.08)",
  lipaBorder:  "rgba(245,158,11,0.25)",
  mpesa:       "#00A651",
  mpesaSoft:   "rgba(0,166,81,0.1)",
  mpesaBorder: "rgba(0,166,81,0.3)",
  mpesaLight:  "#00C761",
};

const WA      = "254752127744";
const FB_LINK = "https://www.facebook.com/profile.php?id=61578060444321";
const DEPOSIT = 3000;
const DAILY   = 50;
const fmt = n => "KSh " + n.toLocaleString("en-KE");
const lipaDays = price => Math.ceil((price - DEPOSIT) / DAILY);

// ─── CSS ─────────────────────────────────────────────────────────────────────
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Bebas+Neue&family=JetBrains+Mono:wght@400;500;700&family=Manrope:wght@400;500;600;700;800&display=swap');

  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
  html{scroll-behavior:smooth}
  body{background:#020509;color:#F1F5F9;font-family:'Manrope',sans-serif;-webkit-font-smoothing:antialiased;overflow-x:hidden}
  ::-webkit-scrollbar{width:3px;height:3px}
  ::-webkit-scrollbar-thumb{background:rgba(99,102,241,0.4);border-radius:4px}
  ::-webkit-scrollbar-track{background:transparent}
  button,a{-webkit-tap-highlight-color:transparent}
  .noscroll::-webkit-scrollbar{display:none}
  .noscroll{-ms-overflow-style:none;scrollbar-width:none}
  input{color:#F1F5F9;font-family:'Manrope',sans-serif}
  select{font-family:'Manrope',sans-serif}

  @keyframes fadeUp   {from{opacity:0;transform:translateY(28px)}to{opacity:1;transform:translateY(0)}}
  @keyframes fadeDown {from{opacity:0;transform:translateY(-20px)}to{opacity:1;transform:translateY(0)}}
  @keyframes fadeIn   {from{opacity:0}to{opacity:1}}
  @keyframes scaleIn  {from{opacity:0;transform:scale(.92) translateY(12px)}to{opacity:1;transform:scale(1) translateY(0)}}
  @keyframes pop      {0%{transform:scale(0)}60%{transform:scale(1.3)}100%{transform:scale(1)}}
  @keyframes shimmer  {0%{background-position:-800px 0}100%{background-position:800px 0}}
  @keyframes marquee  {0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
  @keyframes float    {0%,100%{transform:translateY(0) rotate(-4deg)}50%{transform:translateY(-16px) rotate(-4deg)}}
  @keyframes float2   {0%,100%{transform:translateY(0) rotate(3deg)}50%{transform:translateY(-10px) rotate(3deg)}}
  @keyframes ring     {0%,100%{box-shadow:0 0 0 0 rgba(0,166,81,0.6)}65%{box-shadow:0 0 0 22px rgba(0,166,81,0)}}
  @keyframes mpesaRing{0%,100%{box-shadow:0 0 0 0 rgba(0,166,81,0.5),0 8px 32px rgba(0,166,81,0.4)}65%{box-shadow:0 0 0 16px rgba(0,166,81,0),0 8px 32px rgba(0,166,81,0.4)}}
  @keyframes lipaGlow {0%,100%{box-shadow:0 6px 28px rgba(245,158,11,0.3)}50%{box-shadow:0 6px 42px rgba(245,158,11,0.6)}}
  @keyframes shine    {0%{background-position:-200% center}100%{background-position:200% center}}
  @keyframes spin     {from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
  @keyframes pulse    {0%,100%{opacity:1}50%{opacity:0.4}}
  @keyframes slideUp  {from{opacity:0;transform:translateY(40px)}to{opacity:1;transform:translateY(0)}}
  @keyframes checkPop {0%{stroke-dashoffset:40}100%{stroke-dashoffset:0}}
  @keyframes countDown{from{transform:scaleX(1)}to{transform:scaleX(0)}}
  @keyframes confetti {0%{transform:translateY(-10px) rotate(0deg);opacity:1}100%{transform:translateY(60px) rotate(720deg);opacity:0}}
  @keyframes numberPing{0%{box-shadow:0 0 0 0 rgba(244,63,94,0.5)}100%{box-shadow:0 0 0 10px rgba(244,63,94,0)}}

  .shimmer{background:linear-gradient(90deg,#0A1022 0%,#111C38 50%,#0A1022 100%);background-size:800px 100%;animation:shimmer 2s infinite}
  .lift{transition:transform .45s cubic-bezier(.16,1,.3,1),box-shadow .45s,border-color .3s,background .3s}
  .lift:hover{transform:translateY(-8px)}

  .btn-accent{background:linear-gradient(135deg,#6366F1,#818CF8);color:#fff;border:none;border-radius:12px;font-family:'Manrope',sans-serif;font-weight:700;cursor:pointer;transition:all .3s;display:inline-flex;align-items:center;justify-content:center;gap:8px}
  .btn-accent:hover{transform:translateY(-2px);box-shadow:0 12px 36px rgba(99,102,241,0.45)}

  .btn-mpesa{background:linear-gradient(135deg,#00A651,#00C761);color:#fff;border:none;border-radius:12px;font-family:'Manrope',sans-serif;font-weight:800;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;gap:8px;transition:all .3s;letter-spacing:.3px}
  .btn-mpesa:hover{transform:translateY(-2px);box-shadow:0 12px 36px rgba(0,166,81,0.5)}
  .btn-mpesa:active{transform:scale(.97)}

  .btn-lipa{background:linear-gradient(135deg,#F59E0B,#FCD34D,#F59E0B);background-size:200% auto;color:#1a0f00;border:none;border-radius:12px;font-family:'Manrope',sans-serif;font-weight:800;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;gap:8px;animation:lipaGlow 2.5s infinite;transition:all .3s}
  .btn-lipa:hover{transform:translateY(-2px);animation:none;box-shadow:0 12px 36px rgba(245,158,11,0.5)}

  .btn-out{background:rgba(255,255,255,0.04);color:#F1F5F9;border:1px solid rgba(255,255,255,0.07);border-radius:12px;font-family:'Manrope',sans-serif;font-weight:600;cursor:pointer;transition:all .2s;display:inline-flex;align-items:center;justify-content:center;gap:8px}
  .btn-out:hover{background:rgba(255,255,255,0.08);border-color:rgba(255,255,255,0.15)}

  .btn-wa{background:linear-gradient(135deg,#25D366,#128C7E);color:#fff;border:none;border-radius:12px;font-family:'Manrope',sans-serif;font-weight:700;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;gap:8px;transition:all .3s}
  .btn-wa:hover{transform:translateY(-2px);box-shadow:0 12px 36px rgba(37,211,102,0.4)}

  .icon-btn{background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.07);border-radius:10px;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .2s;color:#7C8BA3}
  .icon-btn:hover{background:rgba(99,102,241,0.12);border-color:rgba(99,102,241,0.35);color:#818CF8}

  .mono{font-family:'JetBrains Mono',monospace}
  .display{font-family:'Bebas Neue',cursive;letter-spacing:2px}
  .tag{font-family:'JetBrains Mono',monospace;font-size:9px;font-weight:500;letter-spacing:2px;text-transform:uppercase}
  .grad{background:linear-gradient(135deg,#818CF8,#C4B5FD,#F43F5E);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
  .grad-gold{background:linear-gradient(135deg,#F59E0B,#FCD34D,#F59E0B);background-size:200% auto;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;animation:shine 3s linear infinite}
  .grad-mpesa{background:linear-gradient(135deg,#00A651,#00C761,#00A651);background-size:200% auto;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;animation:shine 2s linear infinite}
  .grid-bg{background-image:linear-gradient(rgba(99,102,241,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(99,102,241,0.03) 1px,transparent 1px);background-size:48px 48px}

  .mpesa-input:focus{border-color:rgba(0,166,81,0.6)!important;background:rgba(0,166,81,0.06)!important;box-shadow:0 0 0 3px rgba(0,166,81,0.12)!important}
  .mpesa-input::placeholder{color:#2E3A4E}

  .phone-input-wrap:focus-within .phone-flag{border-color:rgba(0,166,81,0.4)}

  select option{background:#0A1022;color:#F1F5F9}
  
  .card-glow:hover{box-shadow:0 0 0 1px rgba(99,102,241,0.2),0 32px 80px rgba(0,0,0,0.6),0 0 60px rgba(99,102,241,0.04)}
`;

// ─── BREAKPOINT ───────────────────────────────────────────────────────────────
function useBP() {
  const [w, setW] = useState(typeof window !== "undefined" ? window.innerWidth : 1200);
  useEffect(() => {
    const fn = () => setW(window.innerWidth);
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);
  return { mob: w < 640, tab: w >= 640 && w < 1024, desk: w >= 1024 };
}

// ─── CONTEXT ──────────────────────────────────────────────────────────────────
const CartCtx = createContext(null);
const useCart = () => useContext(CartCtx);

// ─── DATA ─────────────────────────────────────────────────────────────────────
const PRODUCTS = [
  { id:1,  brand:"Apple",   cat:"apple",   name:"iPhone 15 Pro Max",   price:289000, badge:"Flagship",    bc:"#6366F1", img:"https://images.unsplash.com/photo-1695048133142-1a20484429be?w=600&q=80", desc:"Titanium, A17 Pro, 48MP ProRAW, Action Button. 256GB.", rating:4.9, reviews:523, hot:true,  specs:{ram:"8GB",storage:"256GB",cam:"48MP",bat:"4422mAh"}},
  { id:2,  brand:"Apple",   cat:"apple",   name:"iPhone 15",           price:209000, badge:"Popular",     bc:D.gold,    img:"https://images.unsplash.com/photo-1696446701796-da61339f4f30?w=600&q=80", desc:"USB-C, Dynamic Island, A16 Bionic. 128GB.",             rating:4.8, reviews:341, hot:false, specs:{ram:"6GB",storage:"128GB",cam:"48MP",bat:"3877mAh"}},
  { id:3,  brand:"Apple",   cat:"apple",   name:"iPhone 14 Pro Max",   price:199000, badge:"Best Seller", bc:D.rose,    img:"https://images.unsplash.com/photo-1678685888221-cda773a3dcdb?w=600&q=80", desc:"48MP ProRAW, A16 Bionic, Dynamic Island. 256GB.",       rating:4.9, reviews:712, hot:true,  specs:{ram:"6GB",storage:"256GB",cam:"48MP",bat:"4323mAh"}},
  { id:4,  brand:"Apple",   cat:"apple",   name:"iPhone 13",           price:118000, badge:"Hot Deal",    bc:"#EC4899", img:"https://images.unsplash.com/photo-1632661674596-df8be070a5c5?w=600&q=80", desc:"Dual 12MP, A15 Bionic, Ceramic Shield. 128GB.",        rating:4.8, reviews:489, hot:false, specs:{ram:"4GB",storage:"128GB",cam:"12MP",bat:"3227mAh"}},
  { id:5,  brand:"Apple",   cat:"apple",   name:"iPhone SE (2022)",    price:72000,  badge:"Best Value",  bc:D.emerald, img:"https://images.unsplash.com/photo-1591337676887-a217a6970a8a?w=600&q=80", desc:"A15 Bionic, Touch ID, 5G, 4.7\" Retina HD.",           rating:4.6, reviews:344, hot:false, specs:{ram:"4GB",storage:"64GB",cam:"12MP",bat:"2018mAh"}},
  { id:6,  brand:"Samsung", cat:"samsung", name:"Galaxy S24 Ultra",    price:219000, badge:"Ultra",       bc:"#6366F1", img:"https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=600&q=80", desc:"200MP AI camera, S Pen, Snapdragon 8 Gen 3. 512GB.",   rating:4.9, reviews:287, hot:true,  specs:{ram:"12GB",storage:"512GB",cam:"200MP",bat:"5000mAh"}},
  { id:7,  brand:"Samsung", cat:"samsung", name:"Galaxy S24+",         price:149000, badge:"New",         bc:D.cyan,    img:"https://images.unsplash.com/photo-1567581935884-3349723552ca?w=600&q=80", desc:"50MP AI, 6.7\" AMOLED 120Hz, Snapdragon 8 Gen 3.",    rating:4.8, reviews:199, hot:true,  specs:{ram:"12GB",storage:"256GB",cam:"50MP",bat:"4900mAh"}},
  { id:8,  brand:"Samsung", cat:"samsung", name:"Galaxy S23 Ultra",    price:175000, badge:"S Pen",       bc:"#8B5CF6", img:"https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=600&q=80", desc:"200MP, built-in S Pen, Snapdragon 8 Gen 2. 256GB.",    rating:4.8, reviews:267, hot:false, specs:{ram:"8GB",storage:"256GB",cam:"200MP",bat:"5000mAh"}},
  { id:9,  brand:"Samsung", cat:"samsung", name:"Galaxy A55 5G",       price:62000,  badge:"Value",       bc:D.emerald, img:"https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=600&q=80", desc:"50MP OIS, 6.6\" AMOLED 120Hz, 5000mAh, 45W charge.",  rating:4.7, reviews:542, hot:false, specs:{ram:"8GB",storage:"128GB",cam:"50MP",bat:"5000mAh"}},
  { id:10, brand:"Samsung", cat:"samsung", name:"Galaxy Z Fold 5",     price:248000, badge:"Foldable",    bc:D.rose,    img:"https://images.unsplash.com/photo-1610792516307-ea5acd9c3b00?w=600&q=80", desc:"7.6\" foldable AMOLED, Snapdragon 8 Gen 2. 512GB.",   rating:4.7, reviews:88,  hot:true,  specs:{ram:"12GB",storage:"512GB",cam:"50MP",bat:"4400mAh"}},
  { id:11, brand:"Google",  cat:"google",  name:"Pixel 8 Pro",         price:148000, badge:"AI Native",   bc:"#4285F4", img:"https://images.unsplash.com/photo-1666861193703-9d14f3760ffe?w=600&q=80", desc:"Tensor G3, 50MP, Gemini AI, 7yr updates. 512GB.",      rating:4.8, reviews:231, hot:true,  specs:{ram:"12GB",storage:"512GB",cam:"50MP",bat:"5050mAh"}},
  { id:12, brand:"Google",  cat:"google",  name:"Pixel 8a",            price:82000,  badge:"Clean UI",    bc:"#34A853", img:"https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=600&q=80", desc:"Tensor G3, 64MP, pure Android 14, 7-year updates.",   rating:4.7, reviews:287, hot:true,  specs:{ram:"8GB",storage:"128GB",cam:"64MP",bat:"4492mAh"}},
  { id:13, brand:"Xiaomi",  cat:"xiaomi",  name:"14 Ultra",            price:142000, badge:"Leica Pro",   bc:"#EF4444", img:"https://images.unsplash.com/photo-1533228100845-08145b01de14?w=600&q=80", desc:"Leica 1\" sensor, 50MP×4, Snapdragon 8 Gen 3. 512GB.",rating:4.8, reviews:189, hot:true,  specs:{ram:"16GB",storage:"512GB",cam:"50MP",bat:"5000mAh"}},
  { id:14, brand:"Xiaomi",  cat:"xiaomi",  name:"Redmi Note 13 Pro+",  price:58000,  badge:"Value Pick",  bc:"#EC4899", img:"https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&q=80", desc:"200MP, 6.67\" AMOLED 120Hz, Dimensity 7200. 256GB.",  rating:4.7, reviews:567, hot:false, specs:{ram:"8GB",storage:"256GB",cam:"200MP",bat:"5000mAh"}},
  { id:15, brand:"OnePlus", cat:"oneplus", name:"OnePlus 12",          price:128000, badge:"Hasselblad",  bc:"#F97316", img:"https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=600&q=80", desc:"Hasselblad 50MP, Snapdragon 8 Gen 3, 100W charge.",   rating:4.8, reviews:312, hot:true,  specs:{ram:"12GB",storage:"256GB",cam:"50MP",bat:"5400mAh"}},
  { id:16, brand:"Tecno",   cat:"tecno",   name:"Camon 40 Pro",        price:72000,  badge:"ON OFFER",    bc:D.lipa,    img:"https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600&q=80", desc:"64MP AI cam, 6.8\" AMOLED, 5000mAh, 33W charge. OFFER!",rating:4.8,reviews:214, hot:true,  specs:{ram:"8GB",storage:"256GB",cam:"64MP",bat:"5000mAh"}},
  { id:17, brand:"Infinix", cat:"infinix", name:"Zero 30 5G",          price:42000,  badge:"5G Ready",    bc:D.cyan,    img:"https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=600&q=80", desc:"108MP, 6.78\" AMOLED 144Hz, 68W fast charge.",        rating:4.6, reviews:178, hot:false, specs:{ram:"8GB",storage:"256GB",cam:"108MP",bat:"5000mAh"}},
  { id:18, brand:"Infinix", cat:"infinix", name:"GT 20 Pro",           price:32000,  badge:"Gaming",      bc:"#EF4444", img:"https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&q=80", desc:"64MP gaming cam, 6.67\" AMOLED 144Hz, Dimensity 8200.",rating:4.5,reviews:231, hot:true,  specs:{ram:"8GB",storage:"256GB",cam:"64MP",bat:"5000mAh"}},
];

const CATS = [
  { key:"all",     label:"All",     icon:"grid"   },
  { key:"apple",   label:"Apple",   icon:"phone2" },
  { key:"samsung", label:"Samsung", icon:"monitor"},
  { key:"google",  label:"Google",  icon:"globe"  },
  { key:"xiaomi",  label:"Xiaomi",  icon:"layers" },
  { key:"oneplus", label:"OnePlus", icon:"zap"    },
  { key:"tecno",   label:"Tecno",   icon:"radio"  },
  { key:"infinix", label:"Infinix", icon:"activity"},
];

// ─── MPESA MODAL ─────────────────────────────────────────────────────────────
function MpesaModal({ open, onClose, amount, items, mode="cart", product=null }) {
  const {mob} = useBP();
  // stages: "form" | "sending" | "waiting" | "success" | "failed"
  const [stage, setStage] = useState("form");
  const [phone, setPhone] = useState("07");
  const [error, setError] = useState("");
  const [dots, setDots]   = useState(0);
  const [countdown, setCd] = useState(60);
  const timerRef = useRef(null);
  const cdRef    = useRef(null);
  const isDeposit = mode === "deposit";
  const payAmount = isDeposit ? DEPOSIT : amount;

  useEffect(() => {
    if (!open) { setStage("form"); setPhone("07"); setError(""); }
  }, [open]);

  useEffect(() => {
    if (stage === "sending") {
      const t = setTimeout(() => setStage("waiting"), 2200);
      return () => clearTimeout(t);
    }
    if (stage === "waiting") {
      timerRef.current = setInterval(() => setDots(d => (d+1)%4), 500);
      setCd(60);
      cdRef.current = setInterval(() => setCd(c => {
        if (c <= 1) { clearInterval(cdRef.current); setStage("failed"); return 0; }
        return c - 1;
      }), 1000);
      // Simulate success after 6s
      const success = setTimeout(() => {
        clearInterval(timerRef.current);
        clearInterval(cdRef.current);
        setStage("success");
      }, 6000);
      return () => { clearInterval(timerRef.current); clearInterval(cdRef.current); clearTimeout(success); };
    }
  }, [stage]);

  const validate = () => {
    const clean = phone.replace(/\s/g,"");
    if (!/^(07|01|2547|2541)\d{8}$/.test(clean) && !/^\+?(254)?(7|1)\d{8}$/.test(clean)) {
      setError("Enter a valid Safaricom/M-Pesa number");
      return false;
    }
    setError("");
    return true;
  };

  const handleSend = () => {
    if (!validate()) return;
    setStage("sending");
  };

  const fmtPhone = v => {
    let d = v.replace(/\D/g,"");
    if (d.startsWith("254")) d = "0" + d.slice(3);
    if (d.startsWith("0")) d = d.slice(0,4) + " " + d.slice(4,7) + " " + d.slice(7,11);
    return d;
  };

  if (!open) return null;

  const itemLabel = product ? product.name : items?.map(i=>i.name).join(", ");

  return (
    <div onClick={onClose} style={{position:"fixed",inset:0,zIndex:3000,background:"rgba(0,0,0,0.92)",
      backdropFilter:"blur(18px)",display:"flex",alignItems:"center",justifyContent:"center",
      padding:"16px",animation:"fadeIn .2s ease"}}>
      <div onClick={e=>e.stopPropagation()} style={{
        background:"linear-gradient(160deg,#060F1C 0%,#020E0A 100%)",
        borderRadius:24,border:`1px solid ${D.mpesaBorder}`,
        maxWidth:440,width:"100%",overflow:"hidden",position:"relative",
        boxShadow:`0 0 0 1px ${D.mpesaBorder},0 60px 120px rgba(0,0,0,0.8),0 0 80px rgba(0,166,81,0.08)`,
        animation:"scaleIn .3s cubic-bezier(.16,1,.3,1)"}}>

        {/* Glow orb */}
        <div style={{position:"absolute",top:-60,left:"50%",transform:"translateX(-50%)",
          width:280,height:280,borderRadius:"50%",
          background:"radial-gradient(circle,rgba(0,166,81,0.12) 0%,transparent 70%)",
          pointerEvents:"none"}} />

        {/* Header */}
        <div style={{padding:"22px 24px 18px",borderBottom:`1px solid rgba(0,166,81,0.12)`,
          display:"flex",alignItems:"center",justifyContent:"space-between",position:"relative"}}>
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            {/* M-Pesa logo area */}
            <div style={{width:44,height:44,borderRadius:14,
              background:"linear-gradient(135deg,#00A651,#00C761)",
              display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,
              boxShadow:"0 6px 20px rgba(0,166,81,0.4)"}}>
              <span style={{fontFamily:"'Bebas Neue',cursive",fontSize:11,color:"#fff",letterSpacing:1}}>M</span>
            </div>
            <div>
              <h3 style={{fontFamily:"'Manrope',sans-serif",fontWeight:800,fontSize:17,color:D.white,marginBottom:1}}>M-Pesa Payment</h3>
              <p className="tag" style={{color:D.mpesa,letterSpacing:2}}>Lipa na M-Pesa · STK Push</p>
            </div>
          </div>
          <button onClick={onClose} className="icon-btn" style={{width:34,height:34,flexShrink:0}}><Icon name="x" size={13} /></button>
        </div>

        {/* Body */}
        <div style={{padding:"20px 24px 24px",position:"relative"}}>
          {/* Amount display */}
          <div style={{padding:"14px 18px",background:"rgba(0,166,81,0.07)",
            border:`1px solid ${D.mpesaBorder}`,borderRadius:14,marginBottom:20,
            display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <div>
              <p className="tag" style={{color:D.textDim,marginBottom:5}}>
                {isDeposit ? "Deposit Amount" : "Total to Pay"}
              </p>
              <p style={{fontFamily:"'JetBrains Mono',monospace",fontSize:24,fontWeight:700,color:D.mpesaLight,letterSpacing:-.5}}>
                {fmt(payAmount)}
              </p>
              {isDeposit && (
                <p style={{fontSize:10.5,color:D.textDim,marginTop:3}}>
                  Then KSh 50/day · Balance: {fmt(amount - DEPOSIT)}
                </p>
              )}
            </div>
            <div style={{textAlign:"right"}}>
              <p className="tag" style={{color:D.textDim,marginBottom:5}}>For</p>
              <p style={{fontSize:11,color:D.textMid,fontWeight:600,maxWidth:120,textAlign:"right",lineHeight:1.4}}>{itemLabel}</p>
            </div>
          </div>

          {/* STAGE: FORM */}
          {stage === "form" && (
            <div style={{animation:"fadeUp .3s ease"}}>
              <div style={{marginBottom:16}}>
                <label style={{display:"block",fontSize:12,fontWeight:700,color:D.textMid,marginBottom:8,letterSpacing:.3}}>
                  M-Pesa Phone Number
                </label>
                <div className="phone-input-wrap" style={{display:"flex",alignItems:"center",
                  background:"rgba(255,255,255,0.04)",border:`1px solid ${error?"rgba(244,63,94,0.5)":D.mpesaBorder}`,
                  borderRadius:12,overflow:"hidden",transition:"all .2s"}}>
                  <div className="phone-flag" style={{padding:"0 14px",borderRight:`1px solid rgba(0,166,81,0.2)`,
                    display:"flex",alignItems:"center",gap:7,height:"100%",background:"rgba(0,166,81,0.05)",transition:"border-color .2s"}}>
                    <span style={{fontSize:18}}>🇰🇪</span>
                    <span className="mono" style={{fontSize:12,color:D.textMid,fontWeight:600}}>+254</span>
                  </div>
                  <input
                    className="mpesa-input"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="0712 345 678"
                    maxLength={13}
                    style={{flex:1,border:"none",background:"transparent",padding:"14px 14px",
                      fontSize:15,fontFamily:"'JetBrains Mono',monospace",fontWeight:600,
                      outline:"none",color:D.text,letterSpacing:.5,transition:"all .2s"}}
                  />
                  <div style={{padding:"0 14px"}}>
                    <Icon name="smartphone" size={15} color={D.mpesa} />
                  </div>
                </div>
                {error && (
                  <div style={{display:"flex",alignItems:"center",gap:6,marginTop:7}}>
                    <Icon name="warning" size={11} color={D.rose} />
                    <p style={{fontSize:11,color:D.rose,fontWeight:600}}>{error}</p>
                  </div>
                )}
              </div>

              {/* Info box */}
              <div style={{padding:"12px 14px",background:"rgba(99,102,241,0.06)",
                border:"1px solid rgba(99,102,241,0.15)",borderRadius:11,marginBottom:18}}>
                <div style={{display:"flex",alignItems:"flex-start",gap:9}}>
                  <Icon name="info" size={13} color={D.accentB} style={{marginTop:1,flexShrink:0}} />
                  <p style={{fontSize:11.5,color:D.textMid,lineHeight:1.7}}>
                    An <strong style={{color:D.text}}>M-Pesa STK push</strong> will be sent to your phone.
                    Enter your <strong style={{color:D.text}}>M-Pesa PIN</strong> to complete the payment.
                    Check your Safaricom messages for confirmation.
                  </p>
                </div>
              </div>

              <button onClick={handleSend} className="btn-mpesa"
                style={{width:"100%",padding:"15px",fontSize:15,borderRadius:13,
                  boxShadow:"0 8px 28px rgba(0,166,81,0.35)"}}>
                <Icon name="smartphone" size={17} color="#fff" />
                Send STK Push to My Phone
              </button>

              <div style={{display:"flex",gap:9,marginTop:10}}>
                <button onClick={onClose} className="btn-out"
                  style={{flex:1,padding:"12px",fontSize:13,borderRadius:12}}>
                  Cancel
                </button>
              </div>

              <p style={{textAlign:"center",marginTop:14,fontSize:10.5,color:D.textDim,display:"flex",alignItems:"center",justifyContent:"center",gap:5}}>
                <Icon name="lock" size={10} color={D.textDim} /> Secured by Safaricom M-Pesa
              </p>
            </div>
          )}

          {/* STAGE: SENDING */}
          {stage === "sending" && (
            <div style={{textAlign:"center",padding:"20px 0",animation:"fadeIn .3s ease"}}>
              <div style={{width:64,height:64,borderRadius:"50%",
                background:"linear-gradient(135deg,#00A651,#00C761)",
                display:"flex",alignItems:"center",justifyContent:"center",
                margin:"0 auto 16px",boxShadow:"0 8px 28px rgba(0,166,81,0.4)",
                animation:"spin 1s linear infinite"}}>
                <Icon name="loader" size={28} color="#fff" strokeWidth={2.5} />
              </div>
              <h4 style={{fontFamily:"'Manrope',sans-serif",fontWeight:800,fontSize:17,color:D.white,marginBottom:6}}>Sending Request...</h4>
              <p style={{fontSize:13,color:D.textMid}}>Connecting to M-Pesa servers</p>
            </div>
          )}

          {/* STAGE: WAITING */}
          {stage === "waiting" && (
            <div style={{animation:"fadeIn .3s ease"}}>
              <div style={{textAlign:"center",padding:"10px 0 16px"}}>
                {/* Phone animation */}
                <div style={{position:"relative",display:"inline-block",marginBottom:16}}>
                  <div style={{width:68,height:68,borderRadius:"50%",
                    background:"rgba(0,166,81,0.1)",border:`2px solid ${D.mpesa}`,
                    display:"flex",alignItems:"center",justifyContent:"center",
                    animation:"mpesaRing 2s infinite"}}>
                    <Icon name="smartphone" size={30} color={D.mpesa} />
                  </div>
                  <div style={{position:"absolute",top:-4,right:-4,width:22,height:22,borderRadius:"50%",
                    background:"linear-gradient(135deg,#F59E0B,#FCD34D)",
                    display:"flex",alignItems:"center",justifyContent:"center",
                    animation:"pulse 1s ease infinite",border:`2px solid ${D.surface}`}}>
                    <span style={{fontSize:10}}>🔔</span>
                  </div>
                </div>
                <h4 style={{fontFamily:"'Manrope',sans-serif",fontWeight:800,fontSize:17,color:D.white,marginBottom:6}}>
                  Check Your Phone!
                </h4>
                <p style={{fontSize:13,color:D.textMid,lineHeight:1.7,maxWidth:320,margin:"0 auto"}}>
                  An M-Pesa prompt has been sent to <strong style={{color:D.mpesaLight,fontFamily:"'JetBrains Mono',monospace"}}>{phone}</strong>. Enter your PIN to complete.
                </p>
              </div>

              {/* Steps */}
              <div style={{display:"flex",flexDirection:"column",gap:7,marginBottom:16}}>
                {[
                  ["1","Look for M-Pesa notification on your phone","✓"],
                  ["2","Tap on it and enter your M-Pesa PIN","•••"],
                  ["3","You'll receive an SMS confirmation","📩"],
                ].map(([n, text, badge]) => (
                  <div key={n} style={{display:"flex",alignItems:"center",gap:11,padding:"10px 13px",
                    background:"rgba(0,166,81,0.05)",border:"1px solid rgba(0,166,81,0.12)",borderRadius:10}}>
                    <div style={{width:24,height:24,borderRadius:"50%",background:"rgba(0,166,81,0.15)",
                      display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                      <span className="mono" style={{fontSize:10,fontWeight:700,color:D.mpesa}}>{n}</span>
                    </div>
                    <span style={{fontSize:12,color:D.textMid,flex:1,lineHeight:1.5}}>{text}</span>
                    <span style={{fontSize:11,color:D.textDim,fontFamily:"'JetBrains Mono',monospace"}}>{badge}</span>
                  </div>
                ))}
              </div>

              {/* Waiting indicator */}
              <div style={{padding:"12px 16px",background:"rgba(245,158,11,0.07)",
                border:"1px solid rgba(245,158,11,0.2)",borderRadius:11,marginBottom:14}}>
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:7}}>
                  <span style={{fontSize:11.5,color:D.gold,fontWeight:700,display:"flex",alignItems:"center",gap:6}}>
                    <span style={{animation:"pulse 1s infinite"}}>⏱</span>
                    Waiting for PIN{".".repeat(dots)}
                  </span>
                  <span className="mono" style={{fontSize:12,color:countdown<10?D.rose:D.textDim}}>{countdown}s</span>
                </div>
                {/* Progress bar */}
                <div style={{height:3,background:"rgba(245,158,11,0.15)",borderRadius:2,overflow:"hidden"}}>
                  <div style={{height:"100%",background:D.gold,borderRadius:2,
                    width:`${(countdown/60)*100}%`,transition:"width 1s linear"}} />
                </div>
              </div>

              <button onClick={onClose} className="btn-out"
                style={{width:"100%",padding:"12px",fontSize:13,borderRadius:12,borderColor:"rgba(244,63,94,0.2)"}}>
                Cancel Transaction
              </button>
            </div>
          )}

          {/* STAGE: SUCCESS */}
          {stage === "success" && (
            <div style={{textAlign:"center",padding:"16px 0",animation:"fadeUp .4s ease"}}>
              {/* Success checkmark */}
              <div style={{width:80,height:80,borderRadius:"50%",
                background:"linear-gradient(135deg,#00A651,#00C761)",
                display:"flex",alignItems:"center",justifyContent:"center",
                margin:"0 auto 18px",
                boxShadow:"0 12px 40px rgba(0,166,81,0.5)",
                animation:"pop .5s cubic-bezier(.16,1,.3,1)"}}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6L9 17l-5-5" style={{strokeDasharray:40,strokeDashoffset:0,animation:"checkPop .5s .2s ease both"}} />
                </svg>
              </div>
              <h4 style={{fontFamily:"'Manrope',sans-serif",fontWeight:800,fontSize:20,color:D.white,marginBottom:6}}>
                Payment Successful! 🎉
              </h4>
              <p style={{fontSize:13,color:D.textMid,marginBottom:16,lineHeight:1.7}}>
                {fmt(payAmount)} received from <strong style={{color:D.mpesaLight}}>{phone}</strong>.
                Check your SMS for confirmation code.
              </p>
              <div style={{padding:"14px",background:"rgba(0,166,81,0.08)",
                border:"1px solid rgba(0,166,81,0.2)",borderRadius:12,marginBottom:16,textAlign:"left"}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
                  <span className="tag" style={{color:D.textDim}}>Transaction</span>
                  <span className="mono" style={{fontSize:11,color:D.mpesa,fontWeight:700}}>TXN{Math.random().toString(36).substr(2,8).toUpperCase()}</span>
                </div>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
                  <span className="tag" style={{color:D.textDim}}>Amount</span>
                  <span className="mono" style={{fontSize:11,color:D.text,fontWeight:700}}>{fmt(payAmount)}</span>
                </div>
                <div style={{display:"flex",justifyContent:"space-between"}}>
                  <span className="tag" style={{color:D.textDim}}>Status</span>
                  <span style={{fontSize:11,color:D.emerald,fontWeight:700,display:"flex",alignItems:"center",gap:4}}>
                    <div style={{width:6,height:6,borderRadius:"50%",background:D.emerald}} /> Confirmed
                  </span>
                </div>
              </div>
              {isDeposit && (
                <div style={{padding:"11px 14px",background:D.lipaSoft,border:`1px solid ${D.lipaBorder}`,borderRadius:11,marginBottom:14}}>
                  <p style={{fontSize:12,color:D.lipa,fontWeight:700,marginBottom:3}}>🏆 Lipa Mdogo Mdogo Activated!</p>
                  <p style={{fontSize:11,color:D.textMid}}>Pay KSh 50 daily · Our team will contact you for delivery.</p>
                </div>
              )}
              <button onClick={onClose} className="btn-mpesa"
                style={{width:"100%",padding:"13px",fontSize:14,borderRadius:12}}>
                <Icon name="check" size={16} color="#fff" /> Done · Continue Shopping
              </button>
            </div>
          )}

          {/* STAGE: FAILED */}
          {stage === "failed" && (
            <div style={{textAlign:"center",padding:"16px 0",animation:"fadeUp .3s ease"}}>
              <div style={{width:72,height:72,borderRadius:"50%",
                background:"rgba(244,63,94,0.1)",border:`2px solid rgba(244,63,94,0.4)`,
                display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 16px"}}>
                <Icon name="x" size={30} color={D.rose} />
              </div>
              <h4 style={{fontFamily:"'Manrope',sans-serif",fontWeight:800,fontSize:18,color:D.white,marginBottom:6}}>
                Request Timed Out
              </h4>
              <p style={{fontSize:13,color:D.textMid,marginBottom:20,lineHeight:1.7}}>
                No PIN entered within 60 seconds. Please try again.
              </p>
              <div style={{display:"flex",gap:9}}>
                <button onClick={()=>setStage("form")} className="btn-mpesa"
                  style={{flex:1,padding:"13px",fontSize:13,borderRadius:12}}>
                  <Icon name="refresh" size={14} color="#fff" /> Try Again
                </button>
                <button onClick={onClose} className="btn-out"
                  style={{flex:1,padding:"13px",fontSize:13,borderRadius:12}}>
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── STARS ────────────────────────────────────────────────────────────────────
function Stars({ r, size=11 }) {
  return (
    <span style={{display:"inline-flex",gap:2,alignItems:"center"}}>
      {[1,2,3,4,5].map(i => (
        <Icon key={i} name="star" size={size}
          fill={i<=Math.round(r) ? D.gold : "none"}
          color={i<=Math.round(r) ? D.gold : D.textDim}
          strokeWidth={1.5}
        />
      ))}
    </span>
  );
}

// ─── LIPA MINI ────────────────────────────────────────────────────────────────
function LipaMini({ price }) {
  const days = lipaDays(price);
  return (
    <div style={{background:D.lipaSoft,border:`1px solid ${D.lipaBorder}`,borderRadius:10,padding:"9px 11px"}}>
      <div style={{display:"flex",alignItems:"center",gap:5,marginBottom:5}}>
        <Icon name="crown" size={9} color={D.lipa} />
        <span className="tag" style={{color:D.lipa,letterSpacing:2}}>Lipa Mdogo Mdogo</span>
      </div>
      <div style={{display:"flex",gap:10,alignItems:"center",flexWrap:"wrap"}}>
        <span style={{fontSize:11,fontWeight:800,color:D.lipa,fontFamily:"'Manrope',sans-serif"}}>Dep. {fmt(DEPOSIT)}</span>
        <span style={{fontSize:10,color:D.textDim}}>+</span>
        <span style={{fontSize:11,fontWeight:800,color:D.gold,fontFamily:"'Manrope',sans-serif"}}>{fmt(DAILY)}/day</span>
        <span className="mono" style={{fontSize:9,color:D.textDim,marginLeft:2}}>~{Math.ceil(days/30)}mo</span>
      </div>
    </div>
  );
}

// ─── TOAST ────────────────────────────────────────────────────────────────────
function Toasts({ toasts }) {
  const {mob} = useBP();
  const icons = { lipa:"crown", ok:"checkCirc", mpesa:"checkCirc", info:"info", cart:"cart" };
  const colors = { lipa:D.lipa, ok:D.emerald, mpesa:D.mpesa, info:D.accentB, cart:D.accent };
  return (
    <div style={{position:"fixed",zIndex:9999,top:mob?"auto":24,bottom:mob?92:"auto",right:mob?10:24,left:mob?10:"auto",display:"flex",flexDirection:"column",gap:8,pointerEvents:"none"}}>
      {toasts.map(t => (
        <div key={t.id} style={{
          padding:"13px 16px",borderRadius:14,
          background:"rgba(6,10,20,0.98)",backdropFilter:"blur(24px)",
          border:`1px solid ${t.type==="lipa"?D.lipaBorder:t.type==="mpesa"?"rgba(0,166,81,0.3)":t.type==="ok"?"rgba(16,185,129,0.25)":"rgba(99,102,241,0.25)"}`,
          color:D.text,fontSize:13,fontWeight:600,
          display:"flex",alignItems:"center",gap:11,
          boxShadow:"0 24px 64px rgba(0,0,0,0.7)",
          animation:"scaleIn .3s cubic-bezier(.16,1,.3,1)",
          maxWidth:360,pointerEvents:"all",
        }}>
          <div style={{width:32,height:32,borderRadius:9,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,
            background:`${colors[t.type]||D.accent}12`,border:`1px solid ${colors[t.type]||D.accent}25`}}>
            <Icon name={icons[t.type]||"check"} size={14} color={colors[t.type]||D.accent} />
          </div>
          <span style={{flex:1,lineHeight:1.4}}>{t.message}</span>
        </div>
      ))}
    </div>
  );
}

// ─── PRODUCT CARD ─────────────────────────────────────────────────────────────
function PCard({ p, onAdd, onLipa, onQuick, onMpesa }) {
  const {mob} = useBP();
  const [hov, setHov] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [wished, setWished] = useState(false);

  return (
    <div className="lift card-glow"
      onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{background:hov?D.cardHover:D.card,borderRadius:20,
        border:`1px solid ${hov?"rgba(99,102,241,0.2)":D.border}`,
        boxShadow:hov?"0 32px 80px rgba(0,0,0,0.6)":"0 4px 24px rgba(0,0,0,0.3)",
        overflow:"hidden",display:"flex",flexDirection:"column",position:"relative",
        transition:"all .45s cubic-bezier(.16,1,.3,1)"}}>

      {p.hot && (
        <div style={{position:"absolute",top:10,left:10,zIndex:5,display:"flex",alignItems:"center",gap:5,
          background:"rgba(2,5,9,0.9)",backdropFilter:"blur(12px)",border:"1px solid rgba(245,158,11,0.3)",
          borderRadius:7,padding:"4px 9px"}}>
          <Icon name="flame" size={10} color={D.gold} fill={D.gold} />
          <span className="tag" style={{color:D.gold}}>Hot</span>
        </div>
      )}

      <button onClick={e=>{e.stopPropagation();setWished(w=>!w)}} className="icon-btn"
        style={{position:"absolute",top:10,right:10,zIndex:5,width:32,height:32,
          background:wished?"rgba(244,63,94,0.1)":"rgba(2,5,9,0.78)",backdropFilter:"blur(12px)",
          border:wished?"1px solid rgba(244,63,94,0.35)":`1px solid rgba(255,255,255,0.08)`}}>
        <Icon name="heart" size={13} fill={wished?D.rose:"none"} color={wished?D.rose:D.textMid} />
      </button>

      <div style={{position:"relative",height:mob?168:210,overflow:"hidden",background:"#05091A",flexShrink:0}}>
        {!loaded && <div className="shimmer" style={{position:"absolute",inset:0}} />}
        <img src={p.img} alt={p.name} onLoad={()=>setLoaded(true)}
          style={{width:"100%",height:"100%",objectFit:"cover",
            opacity:loaded?1:0,transition:"opacity .5s ease, transform .7s cubic-bezier(.16,1,.3,1)",
            transform:hov?"scale(1.09)":"scale(1)"}} />
        <div style={{position:"absolute",inset:0,background:"linear-gradient(to top,rgba(10,16,34,0.95) 0%,rgba(10,16,34,0.1) 40%,transparent 65%)"}} />
        <div style={{position:"absolute",inset:0,background:`radial-gradient(ellipse at top right,${p.bc}16 0%,transparent 65%)`}} />
        <div style={{position:"absolute",bottom:10,left:10,background:"rgba(2,5,9,0.92)",backdropFilter:"blur(14px)",
          border:`1px solid ${p.bc}38`,borderRadius:7,padding:"4px 9px",display:"flex",alignItems:"center",gap:5}}>
          <div style={{width:5,height:5,borderRadius:"50%",background:p.bc,boxShadow:`0 0 7px ${p.bc}`}} />
          <span className="tag" style={{color:p.bc}}>{p.badge}</span>
        </div>
        {hov && !mob && (
          <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",animation:"fadeIn .2s ease"}}>
            <button onClick={()=>onQuick(p)} className="btn-out"
              style={{padding:"9px 20px",fontSize:12,backdropFilter:"blur(14px)",
                background:"rgba(6,10,20,0.85)",borderColor:"rgba(255,255,255,0.18)",gap:7,fontWeight:700}}>
              <Icon name="eye" size={13} /> Quick View
            </button>
          </div>
        )}
      </div>

      <div style={{padding:mob?"12px 13px 15px":"16px 16px 18px",display:"flex",flexDirection:"column",gap:6,flex:1}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <span className="tag" style={{color:p.bc,letterSpacing:2}}>{p.brand}</span>
          <div style={{display:"flex",alignItems:"center",gap:4}}>
            <div style={{width:5,height:5,borderRadius:"50%",background:D.emerald,boxShadow:`0 0 6px ${D.emerald}`}} />
            <span className="tag" style={{color:D.emerald}}>In Stock</span>
          </div>
        </div>

        <h3 style={{fontSize:mob?13.5:15,fontWeight:800,color:D.text,lineHeight:1.3,letterSpacing:-.3}}>{p.name}</h3>
        <p style={{fontSize:mob?10.5:11.5,color:D.textMid,lineHeight:1.65}}>{p.desc}</p>

        {!mob && (
          <div style={{display:"flex",gap:4,flexWrap:"wrap",marginTop:2}}>
            {[["cpu",p.specs.ram],["pkg",p.specs.storage],["cam",p.specs.cam],["batt",p.specs.bat]].map(([ic,v])=>(
              <div key={v} style={{display:"flex",alignItems:"center",gap:4,padding:"3px 7px",
                background:"rgba(255,255,255,0.03)",border:`1px solid ${D.border}`,borderRadius:6}}>
                <Icon name={ic} size={8} color={D.textDim} />
                <span className="mono" style={{fontSize:9,color:D.textMid,fontWeight:500}}>{v}</span>
              </div>
            ))}
          </div>
        )}

        <div style={{display:"flex",alignItems:"center",gap:7,marginTop:1}}>
          <Stars r={p.rating} size={10} />
          <span className="mono" style={{fontSize:10,color:D.textDim}}>{p.rating} · {p.reviews.toLocaleString()}</span>
        </div>

        <div style={{marginTop:3}}>
          <span style={{fontSize:mob?19:23,fontWeight:800,color:D.white,letterSpacing:-.8,fontFamily:"'Manrope',sans-serif"}}>{fmt(p.price)}</span>
        </div>

        <div style={{marginTop:4}}>
          <LipaMini price={p.price} />
        </div>

        {/* Action buttons */}
        <div style={{display:"flex",gap:6,marginTop:9}}>
          <button onClick={()=>onMpesa(p,"full")} className="btn-mpesa"
            style={{flex:1.2,padding:mob?"9px 0":"11px 0",fontSize:mob?10.5:12,borderRadius:10,gap:5}}>
            <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:mob?9:10,fontWeight:700,opacity:.8}}>M</span>
            {mob?"Pay":"M-Pesa"}
          </button>
          <button onClick={()=>onLipa(p)} className="btn-lipa"
            style={{flex:1,padding:mob?"9px 0":"11px 0",fontSize:mob?10.5:12,borderRadius:10,gap:5}}>
            <Icon name="crown" size={12} /> {mob?"Lipa":"Lipa Mdogo"}
          </button>
          <button onClick={()=>onAdd(p)} className="icon-btn"
            style={{width:mob?38:42,height:mob?38:42,borderRadius:10,flexShrink:0}}>
            <Icon name="cart" size={14} color={D.accent} />
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── QUICK VIEW ───────────────────────────────────────────────────────────────
function QView({ p, onClose, onAdd, onLipa, onMpesa }) {
  const {mob} = useBP();
  if (!p) return null;
  return (
    <div onClick={onClose} style={{position:"fixed",inset:0,zIndex:2000,background:"rgba(0,0,0,0.9)",
      backdropFilter:"blur(16px)",display:"flex",alignItems:"center",justifyContent:"center",padding:16,animation:"fadeIn .25s ease"}}>
      <div onClick={e=>e.stopPropagation()} style={{background:D.surface,borderRadius:24,border:`1px solid ${D.border}`,
        maxWidth:720,width:"100%",display:"flex",flexDirection:mob?"column":"row",overflow:"hidden",
        boxShadow:"0 80px 160px rgba(0,0,0,0.8)",animation:"scaleIn .3s cubic-bezier(.16,1,.3,1)",
        maxHeight:"92vh",overflowY:"auto"}}>
        <div style={{flex:"0 0 290px",background:"#05091A",minHeight:mob?220:440,position:"relative",overflow:"hidden"}}>
          <img src={p.img} alt={p.name} style={{width:"100%",height:"100%",objectFit:"cover",position:"absolute",inset:0}} />
          <div style={{position:"absolute",inset:0,background:"linear-gradient(to right,transparent 50%,rgba(6,10,20,0.6) 100%)"}} />
          <div style={{position:"absolute",inset:0,background:`radial-gradient(ellipse at center,${p.bc}12 0%,transparent 70%)`}} />
        </div>
        <div style={{flex:1,padding:"28px 26px",display:"flex",flexDirection:"column",gap:14}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <div style={{width:7,height:7,borderRadius:"50%",background:p.bc,boxShadow:`0 0 9px ${p.bc}`}} />
              <span className="tag" style={{color:p.bc,letterSpacing:2}}>{p.brand}</span>
            </div>
            <button onClick={onClose} className="icon-btn" style={{width:36,height:36}}>
              <Icon name="x" size={14} />
            </button>
          </div>
          <h2 style={{fontWeight:800,fontSize:mob?21:26,color:D.white,lineHeight:1.15,letterSpacing:-.5}}>{p.name}</h2>
          <div style={{display:"flex",alignItems:"center",gap:9}}>
            <Stars r={p.rating} size={12} />
            <span className="mono" style={{fontSize:11.5,color:D.textMid}}>{p.rating} · {p.reviews.toLocaleString()} reviews</span>
          </div>
          <p style={{fontSize:13.5,color:D.textMid,lineHeight:1.8}}>{p.desc}</p>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
            {[["cpu","RAM",p.specs.ram],["pkg","Storage",p.specs.storage],["cam","Camera",p.specs.cam],["batt","Battery",p.specs.bat]].map(([ic,l,v])=>(
              <div key={l} style={{padding:"10px 12px",background:D.card,borderRadius:11,border:`1px solid ${D.border}`,display:"flex",gap:10,alignItems:"center"}}>
                <div style={{width:30,height:30,borderRadius:8,background:D.accentSoft,border:`1px solid ${D.borderGlow}`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                  <Icon name={ic} size={12} color={D.accent} />
                </div>
                <div>
                  <p className="tag" style={{color:D.textDim,marginBottom:2}}>{l}</p>
                  <p className="mono" style={{fontSize:12,color:D.text,fontWeight:700}}>{v}</p>
                </div>
              </div>
            ))}
          </div>
          <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
            {[["badge","100% Genuine"],["truck","Countrywide"],["refresh","7-Day Return"],["award","1yr Warranty"]].map(([ic,t])=>(
              <div key={t} style={{display:"flex",alignItems:"center",gap:5,padding:"4px 10px",
                background:D.emeraldSoft,border:`1px solid ${D.borderGreen}`,borderRadius:20}}>
                <Icon name={ic} size={10} color={D.emerald} />
                <span style={{fontSize:10,color:D.emerald,fontWeight:700}}>{t}</span>
              </div>
            ))}
          </div>
          <div style={{fontSize:28,fontWeight:800,color:D.white,letterSpacing:-1}}>{fmt(p.price)}</div>
          <LipaMini price={p.price} />
          {/* CTA buttons */}
          <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
            <button onClick={()=>{onMpesa(p,"full");onClose();}} className="btn-mpesa"
              style={{flex:1,minWidth:120,padding:"13px",borderRadius:11,fontSize:13.5,
                boxShadow:"0 8px 28px rgba(0,166,81,0.35)"}}>
              <span className="mono" style={{fontSize:12}}>M</span> Pay Now (M-Pesa)
            </button>
            <button onClick={()=>{onLipa(p);onClose();}} className="btn-lipa"
              style={{flex:1,minWidth:120,padding:"13px",borderRadius:11,fontSize:13.5}}>
              <Icon name="crown" size={15} /> Lipa Mdogo
            </button>
          </div>
          <button onClick={()=>{onAdd(p);onClose();}} className="btn-out"
            style={{padding:"11px",borderRadius:11,fontSize:13}}>
            <Icon name="cart" size={14} /> Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── CART DRAWER ──────────────────────────────────────────────────────────────
function CartDrawer({ open, onClose, onWA, onLipaWA, onMpesaCart }) {
  const { cart, remove, upd } = useCart();
  const {mob} = useBP();
  const total = cart.reduce((s,i)=>s+i.price*i.qty,0);
  const count = cart.reduce((s,i)=>s+i.qty,0);

  return (
    <>
      {open && <div onClick={onClose} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.78)",zIndex:1000,backdropFilter:"blur(10px)",animation:"fadeIn .25s ease"}} />}
      <div style={{
        position:"fixed",top:mob?"auto":0,bottom:mob?0:"auto",right:0,left:mob?0:"auto",
        width:mob?"100%":"min(480px,100vw)",height:mob?"93dvh":"100dvh",
        background:D.surface,zIndex:1001,
        transform:open?"translate(0,0)":mob?"translateY(100%)":"translateX(100%)",
        transition:"transform .42s cubic-bezier(.16,1,.3,1)",
        display:"flex",flexDirection:"column",
        borderLeft:mob?"none":`1px solid ${D.border}`,
        borderTop:mob?`1px solid ${D.border}`:"none",
        borderRadius:mob?"22px 22px 0 0":0,
        boxShadow:"-24px 0 80px rgba(0,0,0,0.6)",overflow:"hidden"}}>
        {mob && <div style={{padding:"12px 0 0",display:"flex",justifyContent:"center"}}><div style={{width:36,height:4,background:D.border,borderRadius:2}} /></div>}
        <div style={{padding:"22px 24px 18px",borderBottom:`1px solid ${D.border}`,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div>
            <h2 style={{fontWeight:800,fontSize:20,color:D.white,letterSpacing:-.3}}>Your Cart</h2>
            <p className="mono" style={{fontSize:11,color:D.textDim,marginTop:3}}>{count} item{count!==1?"s":""}</p>
          </div>
          <button onClick={onClose} className="icon-btn" style={{width:38,height:38}}><Icon name="x" size={15} /></button>
        </div>

        <div style={{flex:1,overflowY:"auto",padding:"14px 18px",display:"flex",flexDirection:"column",gap:9}}>
          {cart.length===0 ? (
            <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",height:"100%",gap:16,padding:"40px 20px"}}>
              <div style={{width:80,height:80,borderRadius:22,background:D.card,border:`1px solid ${D.border}`,display:"flex",alignItems:"center",justifyContent:"center"}}>
                <Icon name="cart" size={30} color={D.textDim} strokeWidth={1.5} />
              </div>
              <div style={{textAlign:"center"}}>
                <h3 style={{fontWeight:700,fontSize:18,color:D.text,marginBottom:6}}>Cart is empty</h3>
                <p style={{fontSize:13,color:D.textDim}}>Add some phones to get started</p>
              </div>
              <button onClick={onClose} className="btn-accent" style={{padding:"12px 30px",fontSize:13,borderRadius:11}}>
                Browse Phones <Icon name="arrow" size={14} />
              </button>
            </div>
          ) : cart.map(item=>(
            <div key={item.id} style={{display:"flex",gap:12,padding:13,background:D.card,borderRadius:14,border:`1px solid ${D.border}`}}>
              <div style={{width:70,height:70,borderRadius:12,overflow:"hidden",background:"#05091A",flexShrink:0}}>
                <img src={item.img} alt={item.name} style={{width:"100%",height:"100%",objectFit:"cover"}} />
              </div>
              <div style={{flex:1,minWidth:0}}>
                <p style={{fontWeight:800,fontSize:12.5,color:D.text,marginBottom:2,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{item.name}</p>
                <p style={{fontSize:14,fontWeight:800,color:D.accentB,marginBottom:4}}>{fmt(item.price)}</p>
                <div style={{display:"flex",alignItems:"center",gap:5,marginBottom:8}}>
                  <Icon name="crown" size={9} color={D.lipa} />
                  <span className="mono" style={{fontSize:9.5,color:D.lipa,fontWeight:700}}>Dep.{fmt(DEPOSIT)} + {fmt(DAILY)}/day</span>
                </div>
                <div style={{display:"flex",alignItems:"center",gap:7}}>
                  <button onClick={()=>upd(item.id,-1)} className="icon-btn" style={{width:26,height:26,borderRadius:7}}><Icon name="minus" size={10} /></button>
                  <span className="mono" style={{fontWeight:700,fontSize:13,minWidth:20,textAlign:"center",color:D.text}}>{item.qty}</span>
                  <button onClick={()=>upd(item.id,1)} className="icon-btn" style={{width:26,height:26,borderRadius:7}}><Icon name="plus" size={10} /></button>
                  <span className="mono" style={{fontSize:10.5,color:D.textDim}}>{fmt(item.price*item.qty)}</span>
                </div>
              </div>
              <button onClick={()=>remove(item.id)} className="icon-btn" style={{width:30,height:30,alignSelf:"flex-start",flexShrink:0,borderColor:"rgba(244,63,94,0.2)"}}>
                <Icon name="trash" size={12} color={D.rose} />
              </button>
            </div>
          ))}
        </div>

        {cart.length>0 && (
          <div style={{padding:"14px 20px 20px",borderTop:`1px solid ${D.border}`,background:"rgba(6,10,20,0.6)",backdropFilter:"blur(12px)"}}>
            <div style={{padding:"12px 16px",background:D.card,borderRadius:12,marginBottom:10,border:`1px solid ${D.border}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <span style={{fontSize:13,color:D.textMid,fontWeight:600}}>Total</span>
              <span style={{fontSize:22,fontWeight:800,color:D.white,letterSpacing:-.8}}>{fmt(total)}</span>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:7}}>
              {/* M-Pesa primary CTA */}
              <button onClick={()=>onMpesaCart(cart,total)} className="btn-mpesa"
                style={{width:"100%",padding:"14px",fontSize:14,borderRadius:12,
                  boxShadow:"0 8px 28px rgba(0,166,81,0.35)"}}>
                <span className="mono" style={{fontSize:12,fontWeight:700}}>M-PESA</span> Pay {fmt(total)} Now
              </button>
              <button onClick={()=>onLipaWA(cart,total)} className="btn-lipa"
                style={{width:"100%",padding:"13px",fontSize:13.5,borderRadius:12}}>
                <Icon name="crown" size={16} /> Lipa Mdogo Mdogo
              </button>
              <button onClick={()=>onWA(cart,total)} className="btn-wa"
                style={{width:"100%",padding:"13px",fontSize:13.5,borderRadius:12,
                  boxShadow:"0 6px 20px rgba(37,211,102,0.25)"}}>
                <Icon name="msg" size={16} color="#fff" /> Order via WhatsApp
              </button>
            </div>
            <p style={{textAlign:"center",fontSize:11,color:D.textDim,marginTop:11,display:"flex",alignItems:"center",justifyContent:"center",gap:5}}>
              <Icon name="lock" size={10} color={D.textDim} /> 256-bit SSL · Secured M-Pesa checkout
            </p>
          </div>
        )}
      </div>
    </>
  );
}

// ─── NAVBAR ───────────────────────────────────────────────────────────────────
function Navbar({ count, onCart, search, setSearch }) {
  const {mob,tab} = useBP();
  const [scrolled, setScrolled] = useState(false);
  const [sOpen, setSOpen]       = useState(false);
  const compact = mob||tab;

  useEffect(()=>{
    const fn=()=>setScrolled(window.scrollY>24);
    window.addEventListener("scroll",fn);
    return ()=>window.removeEventListener("scroll",fn);
  },[]);

  return (
    <nav style={{position:"fixed",top:0,left:0,right:0,zIndex:900,
      background:scrolled?"rgba(2,5,9,0.97)":"rgba(2,5,9,0.55)",
      backdropFilter:"blur(32px)",
      borderBottom:`1px solid ${scrolled?"rgba(255,255,255,0.06)":"transparent"}`,
      transition:"all .35s ease"}}>
      <div style={{maxWidth:1440,margin:"0 auto",padding:"0 22px",display:"flex",alignItems:"center",justifyContent:"space-between",height:compact?62:72,gap:18}}>
        <a href="#" style={{textDecoration:"none",display:"flex",alignItems:"center",gap:11,flexShrink:0}}>
          <div style={{width:38,height:38,borderRadius:11,background:"linear-gradient(135deg,#6366F1,#818CF8)",
            display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 4px 20px rgba(99,102,241,0.45)"}}>
            <Icon name="gem" size={18} color="#fff" />
          </div>
          <div>
            <div style={{fontWeight:800,fontSize:compact?18:21,color:D.white,letterSpacing:-.8,lineHeight:1,fontFamily:"'Manrope',sans-serif"}}>GlowCart</div>
            {!compact && <div className="tag" style={{color:D.textDim,letterSpacing:2.5,marginTop:2}}>Lipa Mdogo Mdogo · Kenya</div>}
          </div>
        </a>

        {!compact && (
          <div style={{flex:"0 1 480px",display:"flex",alignItems:"center",background:"rgba(255,255,255,0.034)",
            borderRadius:11,padding:"0 16px",gap:9,border:`1px solid ${D.border}`,transition:"all .2s"}}
            onFocusCapture={e=>{e.currentTarget.style.borderColor="rgba(99,102,241,0.45)";e.currentTarget.style.background="rgba(99,102,241,0.06)"}}
            onBlurCapture={e=>{e.currentTarget.style.borderColor=D.border;e.currentTarget.style.background="rgba(255,255,255,0.034)"}}>
            <Icon name="search" size={13} color={D.textDim} />
            <input value={search} onChange={e=>setSearch(e.target.value)}
              placeholder="Search iPhone, Galaxy S24, Camon 40..."
              style={{border:"none",background:"transparent",fontSize:13,outline:"none",flex:1,padding:"13px 0",fontWeight:500}} />
            {search && <button onClick={()=>setSearch("")} className="icon-btn" style={{width:20,height:20,border:"none",borderRadius:5}}><Icon name="x" size={10} /></button>}
          </div>
        )}

        <div style={{display:"flex",alignItems:"center",gap:8}}>
          {!compact && (
            <>
              <div style={{display:"flex",alignItems:"center",gap:6,padding:"7px 13px",background:D.lipaSoft,border:`1px solid ${D.lipaBorder}`,borderRadius:9}}>
                <Icon name="crown" size={12} color={D.lipa} />
                <span style={{fontSize:11.5,fontWeight:700,color:D.lipa}}>Lipa Mdogo Mdogo</span>
              </div>
              <a href={FB_LINK} target="_blank" rel="noreferrer" className="icon-btn" style={{width:38,height:38,textDecoration:"none"}}>
                <Icon name="fb" size={15} color="#1877F2" />
              </a>
            </>
          )}
          {compact && (
            <button onClick={()=>setSOpen(s=>!s)} className="icon-btn" style={{width:40,height:40,background:sOpen?D.accentSoft:undefined,borderColor:sOpen?D.borderGlow:undefined}}>
              <Icon name="search" size={16} color={sOpen?D.accent:D.textMid} />
            </button>
          )}
          <button onClick={onCart} className="btn-accent"
            style={{position:"relative",padding:compact?"9px 15px":"11px 22px",fontSize:compact?12.5:13.5,borderRadius:10,gap:6}}>
            <Icon name="cart" size={15} color="#fff" />
            {!compact && "Cart"}
            {count>0 && ` (${count})`}
            {count>0 && (
              <span style={{position:"absolute",top:-7,right:-7,background:D.rose,color:"#fff",borderRadius:"50%",
                width:20,height:20,fontSize:9,fontWeight:900,display:"flex",alignItems:"center",justifyContent:"center",
                border:`2px solid ${D.bg}`,animation:"pop .3s ease",fontFamily:"'JetBrains Mono',monospace",
                boxShadow:"0 0 0 0",animationTimingFunction:"cubic-bezier(.16,1,.3,1)"}}
                onAnimationEnd={e=>e.target.style.animation="numberPing 1.5s infinite"}>{count}</span>
            )}
          </button>
        </div>
      </div>
      {compact && sOpen && (
        <div style={{padding:"0 14px 12px",animation:"fadeDown .2s ease"}}>
          <div style={{display:"flex",alignItems:"center",background:"rgba(255,255,255,0.04)",borderRadius:10,padding:"0 14px",gap:8,border:`1px solid ${D.border}`}}>
            <Icon name="search" size={13} color={D.textDim} />
            <input autoFocus value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search phones..."
              style={{border:"none",background:"transparent",fontSize:13,outline:"none",flex:1,padding:"12px 0"}} />
            {search && <button onClick={()=>setSearch("")} className="icon-btn" style={{width:20,height:20,border:"none",borderRadius:5}}><Icon name="x" size={10} /></button>}
          </div>
        </div>
      )}
    </nav>
  );
}

// ─── TICKER ───────────────────────────────────────────────────────────────────
function Ticker() {
  const items = ["M-Pesa Payments Accepted","Lipa Mdogo Mdogo","Dep. KSh 3,000","KSh 50/Day","Delivery Countrywide","0752 127 744","100% Genuine","4.9 Rated","7-Day Returns","Follow on Facebook","Tecno Camon 40 Pro ON OFFER","STK Push Checkout"];
  const doubled = [...items,...items];
  return (
    <div style={{background:"linear-gradient(90deg,#00A651,#00C761,#00A651)",padding:"9px 0",overflow:"hidden"}}>
      <div style={{display:"flex",animation:"marquee 28s linear infinite",width:"max-content"}}>
        {doubled.map((l,i)=>(
          <span key={i} style={{display:"inline-flex",alignItems:"center",gap:6,fontWeight:700,fontSize:11,
            color:"rgba(0,30,15,0.9)",whiteSpace:"nowrap",padding:"0 24px",
            borderRight:"1px solid rgba(0,30,15,0.15)",fontFamily:"'Manrope',sans-serif",letterSpacing:.3}}>
            <span style={{fontSize:9,fontFamily:"'JetBrains Mono',monospace",opacity:.7}}>●</span> {l}
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── HERO ─────────────────────────────────────────────────────────────────────
function Hero({ onScroll }) {
  const {mob} = useBP();
  const [slide, setSlide] = useState(0);
  const [key, setKey] = useState(0);

  const slides = [
    { eyebrow:"M-Pesa · Lipa Mdogo Mdogo · All Phones", h1:"Pata Simu Yako", h2:"Leo Hii!", sub:"Pay now with M-Pesa STK Push or deposit KSh 3,000 tu, lipa KSh 50 kila siku. Delivery Kenya nzima. 0752 127 744", img:"https://images.unsplash.com/photo-1695048133142-1a20484429be?w=800&q=80", accent:D.mpesa, stat:"M-Pesa · Dep 3K" },
    { eyebrow:"Tecno Camon 40 Pro · ON OFFER", h1:"Camon 40 Pro,", h2:"Bei Nafuu!", sub:"64MP AMOLED display. Lipa deposit KSh 3,000 au lipa mzima kwa M-Pesa moja kwa moja!", img:"https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&q=80", accent:"#EF4444", stat:"64MP · AMOLED" },
    { eyebrow:"WhatsApp: 0752 127 744", h1:"Any Phone.", h2:"Any Budget.", sub:"STK Push M-Pesa payment. Piga simu 0752 127 744. Delivery countrywide Kenya nzima.", img:"https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800&q=80", accent:D.accent, stat:"Kenya Nationwide" },
  ];

  const go = useCallback(d=>{setSlide(s=>(s+d+slides.length)%slides.length);setKey(k=>k+1);},[slides.length]);
  useEffect(()=>{const t=setInterval(()=>go(1),6500);return()=>clearInterval(t);},[go]);
  const s = slides[slide];

  return (
    <section className="grid-bg" style={{
      minHeight:mob?"100svh":"96vh",
      background:`radial-gradient(ellipse 80% 60% at 70% 30%,${s.accent}14 0%,transparent 65%),linear-gradient(160deg,#030814 0%,${D.bg} 100%)`,
      display:"flex",alignItems:"center",
      padding:mob?"80px 18px 70px":"100px 44px 60px",
      position:"relative",overflow:"hidden",transition:"background 1.2s ease"}}>

      <div style={{maxWidth:1440,margin:"0 auto",width:"100%",display:"flex",alignItems:"center",
        gap:mob?0:80,justifyContent:"space-between",position:"relative",zIndex:1}}>
        <div style={{flex:1,maxWidth:590}}>
          <div key={key} style={{animation:"fadeUp .7s cubic-bezier(.16,1,.3,1)"}}>
            <div style={{display:"inline-flex",alignItems:"center",gap:8,padding:"6px 14px 6px 10px",borderRadius:9,
              background:D.mpesaSoft,border:`1px solid ${D.mpesaBorder}`,marginBottom:26}}>
              <div style={{width:6,height:6,borderRadius:"50%",background:D.mpesa,boxShadow:`0 0 8px ${D.mpesa}`,animation:"pulse 1.5s infinite"}} />
              <span className="tag" style={{color:D.mpesa,letterSpacing:2}}>{s.eyebrow}</span>
            </div>

            <h1 style={{fontWeight:800,
              fontSize:mob?"clamp(34px,9vw,52px)":"clamp(44px,5vw,76px)",
              color:D.white,lineHeight:1.05,letterSpacing:-2.5,marginBottom:20,fontFamily:"'Manrope',sans-serif"}}>
              {s.h1}<br/><span className="grad-gold">{s.h2}</span>
            </h1>

            <p style={{fontSize:mob?14:16.5,color:D.textMid,lineHeight:1.85,marginBottom:28,maxWidth:490,fontWeight:400}}>{s.sub}</p>

            {/* Payment options mini */}
            <div style={{display:"flex",gap:mob?10:16,flexWrap:"wrap",marginBottom:28}}>
              <div style={{display:"flex",alignItems:"center",gap:7,padding:"10px 16px",
                background:D.mpesaSoft,border:`1px solid ${D.mpesaBorder}`,borderRadius:11}}>
                <div style={{width:28,height:28,borderRadius:8,background:"linear-gradient(135deg,#00A651,#00C761)",
                  display:"flex",alignItems:"center",justifyContent:"center"}}>
                  <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,fontWeight:800,color:"#fff"}}>M</span>
                </div>
                <div>
                  <p className="tag" style={{color:D.textDim,marginBottom:1}}>Pay Full</p>
                  <p style={{fontSize:12,fontWeight:800,color:D.mpesaLight}}>M-Pesa STK</p>
                </div>
              </div>
              <div style={{display:"flex",alignItems:"center",gap:7,padding:"10px 16px",
                background:D.lipaSoft,border:`1px solid ${D.lipaBorder}`,borderRadius:11}}>
                <div style={{width:28,height:28,borderRadius:8,background:D.lipa,
                  display:"flex",alignItems:"center",justifyContent:"center"}}>
                  <Icon name="crown" size={12} color="#1a0f00" />
                </div>
                <div>
                  <p className="tag" style={{color:D.textDim,marginBottom:1}}>Lipa Mdogo</p>
                  <p style={{fontSize:12,fontWeight:800,color:D.lipa}}>Dep. KSh 3K</p>
                </div>
              </div>
            </div>

            <div style={{display:"flex",gap:11,flexWrap:"wrap"}}>
              <button onClick={onScroll} className="btn-mpesa"
                style={{padding:mob?"13px 22px":"16px 32px",fontSize:mob?13:15,borderRadius:12,gap:9,
                  boxShadow:"0 12px 36px rgba(0,166,81,0.4)"}}>
                <span className="mono" style={{fontWeight:800}}>M</span> Pay with M-Pesa
              </button>
              <a href={`https://wa.me/${WA}`} target="_blank" rel="noreferrer"
                style={{display:"inline-flex",alignItems:"center",gap:8,padding:mob?"13px 20px":"16px 28px",
                  background:"rgba(255,255,255,0.05)",border:`1px solid ${D.border}`,color:D.text,
                  borderRadius:12,fontWeight:700,fontSize:mob?13:15,textDecoration:"none",letterSpacing:.3}}>
                <Icon name="msg" size={14} /> 0752 127 744
              </a>
            </div>

            <div style={{display:"flex",gap:mob?20:44,marginTop:mob?40:60,paddingTop:mob?24:34,borderTop:`1px solid ${D.border}`,flexWrap:"wrap"}}>
              {[["32+","Phones"],["1.2K+","Orders"],["4.9★","Rating"],["M-Pesa","Payments"]].map(([v,l])=>(
                <div key={l}>
                  <div style={{fontSize:mob?22:30,fontWeight:800,color:D.white,letterSpacing:-1,lineHeight:1}}>{v}</div>
                  <div className="tag" style={{color:D.textDim,letterSpacing:1.5,marginTop:4}}>{l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {!mob && (
          <div style={{flexShrink:0,position:"relative",width:340,height:480}}>
            <div key={`img-${slide}`} style={{width:224,height:420,borderRadius:38,overflow:"hidden",
              border:"1px solid rgba(255,255,255,0.06)",
              boxShadow:`0 60px 120px rgba(0,0,0,0.75),0 0 0 1px ${s.accent}10`,
              position:"absolute",left:"50%",top:"50%",
              transform:"translateX(-50%) translateY(-50%) rotate(-5deg)",
              animation:"float 6.5s ease-in-out infinite"}}>
              <img src={s.img} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}} />
              <div style={{position:"absolute",inset:0,background:"linear-gradient(to top,rgba(2,5,9,0.4) 0%,transparent 50%)"}} />
            </div>
            {/* M-Pesa badge */}
            <div style={{position:"absolute",bottom:24,left:-30,zIndex:10,
              background:"rgba(6,10,20,0.97)",border:`1px solid ${D.mpesaBorder}`,
              borderRadius:16,padding:"13px 16px",backdropFilter:"blur(22px)",
              display:"flex",alignItems:"center",gap:12,minWidth:195,
              animation:"float2 7.5s ease-in-out infinite",
              boxShadow:"0 20px 50px rgba(0,0,0,0.5),0 0 20px rgba(0,166,81,0.08)"}}>
              <div style={{width:38,height:38,borderRadius:11,background:"linear-gradient(135deg,#00A651,#00C761)",
                display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,
                boxShadow:"0 6px 20px rgba(0,166,81,0.4)"}}>
                <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:13,fontWeight:800,color:"#fff"}}>M</span>
              </div>
              <div>
                <p style={{fontSize:12,fontWeight:800,color:D.mpesaLight,marginBottom:1}}>M-Pesa STK Push</p>
                <p className="tag" style={{color:D.textDim,letterSpacing:1.5}}>Instant checkout</p>
              </div>
            </div>
            <div style={{position:"absolute",top:24,right:-30,zIndex:10,
              background:"rgba(6,10,20,0.97)",border:`1px solid ${D.border}`,
              borderRadius:14,padding:"12px 15px",backdropFilter:"blur(22px)",
              boxShadow:"0 20px 50px rgba(0,0,0,0.5)"}}>
              <Stars r={5} size={13} />
              <p style={{fontSize:12,fontWeight:800,color:D.white,marginTop:6}}>1,200+ Reviews</p>
            </div>
            <div style={{position:"absolute",top:"46%",right:-44,transform:"translateY(-50%)",
              background:`linear-gradient(135deg,${s.accent}EE,${s.accent}99)`,
              borderRadius:9,padding:"7px 14px",boxShadow:`0 10px 28px ${s.accent}40`}}>
              <span className="tag" style={{color:"rgba(255,255,255,0.95)",letterSpacing:1.5}}>{s.stat}</span>
            </div>
          </div>
        )}
      </div>

      <div style={{position:"absolute",bottom:28,left:"50%",transform:"translateX(-50%)",display:"flex",alignItems:"center",gap:13}}>
        <button onClick={()=>go(-1)} className="icon-btn" style={{width:32,height:32,borderRadius:8}}><Icon name="chevL" size={14} /></button>
        <div style={{display:"flex",gap:5}}>
          {slides.map((_,i)=>(
            <button key={i} onClick={()=>{setSlide(i);setKey(k=>k+1);}} style={{
              width:i===slide?28:6,height:6,borderRadius:3,border:"none",
              background:i===slide?D.mpesa:"rgba(255,255,255,0.15)",
              cursor:"pointer",transition:"all .38s cubic-bezier(.16,1,.3,1)",padding:0}} />
          ))}
        </div>
        <button onClick={()=>go(1)} className="icon-btn" style={{width:32,height:32,borderRadius:8}}><Icon name="chevR" size={14} /></button>
      </div>
    </section>
  );
}

// ─── TRUST STRIP ──────────────────────────────────────────────────────────────
function Trust() {
  const {mob} = useBP();
  const items = [
    ["smartphone","M-Pesa STK Push",   "Instant secure payment",      D.mpesa  ],
    ["crown",     "Lipa Mdogo Mdogo",  "Dep. KSh 3,000 + KSh 50/day",D.lipa   ],
    ["truck",     "Delivery Countrywide","All 47 counties Kenya",      D.accent ],
    ["badge",     "100% Authentic",    "Manufacturer guaranteed",      D.emerald],
    ["refresh",   "7-Day Returns",     "No questions asked",           D.gold   ],
    ["lock",      "Secure Checkout",   "SSL + M-Pesa protected",       D.violet ],
  ];
  return (
    <section style={{background:D.surface,padding:mob?"32px 14px":"52px 30px",borderBottom:`1px solid ${D.border}`}}>
      <div style={{maxWidth:1440,margin:"0 auto",display:"grid",
        gridTemplateColumns:mob?"repeat(2,1fr)":"repeat(6,1fr)",gap:mob?9:12}}>
        {items.map(([ic,title,sub,c])=>(
          <div key={title} style={{padding:mob?"13px 11px":"18px 14px",background:D.card,borderRadius:14,
            border:`1px solid ${D.border}`,display:"flex",flexDirection:"column",alignItems:"flex-start",gap:12,
            transition:"all .28s",cursor:"default"}}
            onMouseEnter={e=>{e.currentTarget.style.borderColor=c+"38";e.currentTarget.style.transform="translateY(-3px)";e.currentTarget.style.boxShadow=`0 12px 40px rgba(0,0,0,0.4)`}}
            onMouseLeave={e=>{e.currentTarget.style.borderColor=D.border;e.currentTarget.style.transform="none";e.currentTarget.style.boxShadow="none"}}>
            <div style={{width:38,height:38,borderRadius:10,background:`${c}10`,border:`1px solid ${c}22`,
              display:"flex",alignItems:"center",justifyContent:"center"}}>
              <Icon name={ic} size={16} color={c} />
            </div>
            <div>
              <p style={{fontSize:mob?11:12.5,fontWeight:700,color:D.text,marginBottom:3}}>{title}</p>
              <p style={{fontSize:mob?9.5:10.5,color:D.textDim}}>{sub}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── TESTIMONIALS ─────────────────────────────────────────────────────────────
function Testimonials() {
  const {mob} = useBP();
  const reviews = [
    { name:"Faith M.", loc:"Nairobi CBD", r:5, text:"Nililipa kwa M-Pesa moja kwa moja. STK push ilikuja haraka, niliingiza PIN, done! Delivered same day!", init:"FM", c:D.accent },
    { name:"Brian K.", loc:"Westlands",   r:5, text:"M-Pesa payment ilikuwa smooth sana. Deposit 3K tu kwa lipa mdogo. S24 Ultra yangu imefika!", init:"BK", c:D.emerald },
    { name:"Amina S.", loc:"Mombasa",     r:5, text:"Walinitumia STK push, niliingiza PIN, confirmation ilikuja. Pixel 8 Pro imefika Mombasa in 2 days!", init:"AS", c:D.gold },
    { name:"David O.", loc:"Kilimani",    r:5, text:"Best phone shop Kenya. M-Pesa direct. Lipa mdogo plan ya KSh 50/day ni rahisi sana. Recommended!", init:"DO", c:D.rose },
  ];
  return (
    <section style={{background:D.surface,padding:mob?"48px 14px":"80px 30px",borderTop:`1px solid ${D.border}`}}>
      <div style={{maxWidth:1440,margin:"0 auto"}}>
        <div style={{textAlign:"center",marginBottom:mob?30:52}}>
          <div style={{display:"inline-flex",alignItems:"center",gap:7,padding:"5px 13px 5px 9px",
            borderRadius:9,background:D.mpesaSoft,border:`1px solid ${D.mpesaBorder}`,marginBottom:14}}>
            <div style={{width:6,height:6,borderRadius:"50%",background:D.mpesa,animation:"pulse 1.5s infinite"}} />
            <span className="tag" style={{color:D.mpesa,letterSpacing:2}}>Verified M-Pesa Buyers</span>
          </div>
          <h2 style={{fontWeight:800,fontSize:mob?26:42,color:D.white,letterSpacing:-1.5}}>Loved by Kenyans</h2>
        </div>
        <div style={{display:"grid",gridTemplateColumns:mob?"1fr":"repeat(4,1fr)",gap:mob?10:14}}>
          {reviews.map((r,i)=>(
            <div key={i} style={{background:D.card,borderRadius:18,padding:"20px 18px",border:`1px solid ${D.border}`,display:"flex",flexDirection:"column",gap:14,
              transition:"all .28s"}}
              onMouseEnter={e=>{e.currentTarget.style.borderColor=`${r.c}28`;e.currentTarget.style.transform="translateY(-4px)"}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor=D.border;e.currentTarget.style.transform="none"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                <div style={{display:"flex",alignItems:"center",gap:11}}>
                  <div style={{width:44,height:44,borderRadius:13,background:`${r.c}14`,border:`1px solid ${r.c}28`,
                    display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                    <span style={{fontSize:15,fontWeight:800,color:r.c}}>{r.init}</span>
                  </div>
                  <div>
                    <p style={{fontWeight:800,fontSize:13.5,color:D.white,marginBottom:2}}>{r.name}</p>
                    <div style={{display:"flex",alignItems:"center",gap:4}}>
                      <Icon name="pin" size={10} color={D.textDim} />
                      <span style={{fontSize:10.5,color:D.textDim}}>{r.loc}</span>
                    </div>
                  </div>
                </div>
                <div style={{padding:"2px 8px",background:D.mpesaSoft,border:`1px solid ${D.mpesaBorder}`,borderRadius:5,flexShrink:0}}>
                  <span className="tag" style={{color:D.mpesa,letterSpacing:1}}>M-PESA ✓</span>
                </div>
              </div>
              <Stars r={r.r} size={11} />
              <p style={{fontSize:13,color:D.textMid,lineHeight:1.78}}>"{r.text}"</p>
            </div>
          ))}
        </div>
        <div style={{display:"flex",justifyContent:"center",alignItems:"center",gap:14,marginTop:36,flexWrap:"wrap"}}>
          <Stars r={4.9} size={16} />
          <span style={{fontWeight:800,fontSize:26,color:D.white,letterSpacing:-.5}}>4.9 / 5</span>
          <span style={{width:1,height:22,background:D.border}} />
          <span style={{fontSize:13,color:D.textMid}}>from 1,200+ verified M-Pesa purchases across Kenya</span>
        </div>
      </div>
    </section>
  );
}

// ─── CTA SECTION ──────────────────────────────────────────────────────────────
function CTA({ onMpesa }) {
  const {mob} = useBP();
  return (
    <section style={{padding:mob?"60px 18px":"96px 30px",background:D.surface,position:"relative",overflow:"hidden",borderTop:`1px solid ${D.border}`}}>
      <div style={{position:"absolute",width:600,height:600,borderRadius:"50%",
        background:"radial-gradient(circle,rgba(0,166,81,0.06) 0%,transparent 70%)",
        top:"50%",left:"50%",transform:"translate(-50%,-50%)",pointerEvents:"none"}} />
      <div style={{maxWidth:640,margin:"0 auto",textAlign:"center",position:"relative"}}>
        <div style={{display:"inline-flex",alignItems:"center",gap:7,padding:"6px 14px 6px 10px",borderRadius:9,
          background:D.mpesaSoft,border:`1px solid ${D.mpesaBorder}`,marginBottom:22}}>
          <div style={{width:6,height:6,borderRadius:"50%",background:D.mpesa,animation:"pulse 1.5s infinite"}} />
          <span className="tag" style={{color:D.mpesa,letterSpacing:2}}>M-Pesa · Lipa Mdogo Mdogo</span>
        </div>
        <h2 style={{fontWeight:800,
          fontSize:mob?"clamp(24px,7vw,34px)":"clamp(28px,4vw,50px)",
          color:D.white,letterSpacing:-1.5,marginBottom:16}}>Anza na KSh 3,000 Tu!</h2>
        <p style={{fontSize:mob?14:16,color:D.textMid,marginBottom:28,lineHeight:1.85,maxWidth:500,margin:"0 auto 28px"}}>
          Pata simu yoyote kwa M-Pesa STK Push au deposit KSh 3,000 tu, lipa KSh 50 kila siku. Delivery countrywide.
        </p>
        <div style={{display:"flex",gap:11,justifyContent:"center",flexWrap:"wrap"}}>
          <button onClick={()=>onMpesa({name:"Selected Phone",price:DEPOSIT},"deposit")} className="btn-mpesa"
            style={{padding:mob?"14px 22px":"17px 36px",fontSize:mob?13:15,borderRadius:12,
              gap:9,boxShadow:"0 12px 36px rgba(0,166,81,0.4)"}}>
            <span className="mono" style={{fontWeight:800}}>M-PESA</span> Pay Deposit Now
          </button>
          <a href={`https://wa.me/${WA}?text=${encodeURIComponent("Hello GlowCart! 👋 Nataka kuomba simu kwa Lipa Mdogo Mdogo. Deposit KSh 3,000 na KSh 50 kila siku. Tafadhali nisaidie!")}`}
            target="_blank" rel="noreferrer" className="btn-wa"
            style={{padding:mob?"14px 22px":"17px 36px",fontSize:mob?13:15,borderRadius:12,
              textDecoration:"none",boxShadow:"0 12px 36px rgba(37,211,102,0.28)"}}>
            <Icon name="msg" size={17} color="#fff" /> WhatsApp: 0752 127 744
          </a>
        </div>
      </div>
    </section>
  );
}

// ─── FOOTER ───────────────────────────────────────────────────────────────────
function Footer() {
  const {mob} = useBP();
  return (
    <footer style={{background:D.bg,padding:mob?"52px 14px 100px":"72px 30px 48px",borderTop:`1px solid ${D.border}`}}>
      <div style={{maxWidth:1440,margin:"0 auto"}}>
        <div style={{display:"grid",gridTemplateColumns:mob?"1fr 1fr":"2.4fr 1fr 1fr 1.5fr",gap:mob?"32px 20px":"52px 60px",marginBottom:52}}>
          <div style={{gridColumn:mob?"1/-1":"auto"}}>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:18}}>
              <div style={{width:36,height:36,borderRadius:10,background:"linear-gradient(135deg,#6366F1,#818CF8)",display:"flex",alignItems:"center",justifyContent:"center"}}>
                <Icon name="gem" size={17} color="#fff" />
              </div>
              <span style={{fontWeight:800,fontSize:20,color:D.white,letterSpacing:-.5}}>GlowCart</span>
            </div>
            <p style={{fontSize:13,color:D.textDim,lineHeight:1.9,maxWidth:270,marginBottom:16}}>
              Kenya's trusted premium phone store. M-Pesa STK Push & Lipa Mdogo Mdogo — deposit KSh 3,000, pay KSh 50/day.
            </p>
            <div style={{display:"flex",gap:7,marginBottom:16,flexWrap:"wrap"}}>
              {[
                ["M-Pesa","rgba(0,166,81,0.1)","rgba(0,166,81,0.28)",D.mpesa,"M"],
                ["WhatsApp","rgba(37,211,102,0.1)","rgba(37,211,102,0.28)","#25D366","msg"],
                ["Facebook","rgba(24,119,242,0.1)","rgba(24,119,242,0.28)","#1877F2","fb"],
              ].map(([label,bg,border,color,icon])=>(
                <a key={label} href={label==="WhatsApp"?`https://wa.me/${WA}`:label==="Facebook"?FB_LINK:"#"} target="_blank" rel="noreferrer"
                  style={{display:"flex",alignItems:"center",gap:6,padding:"6px 12px",
                    background:bg,border:`1px solid ${border}`,borderRadius:8,textDecoration:"none"}}>
                  {icon==="M"?<span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,fontWeight:800,color}}>M</span>:<Icon name={icon} size={12} color={color} />}
                  <span style={{fontSize:11,fontWeight:700,color,fontFamily:"'Manrope',sans-serif"}}>{label}</span>
                </a>
              ))}
            </div>
            <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
              {["M-Pesa","Visa","Mastercard","Paystack"].map(m=>(
                <span key={m} style={{padding:"4px 10px",background:D.card,borderRadius:6,fontSize:10.5,fontWeight:700,color:D.textDim,border:`1px solid ${D.border}`,fontFamily:"'JetBrains Mono',monospace"}}>{m}</span>
              ))}
            </div>
          </div>

          {[
            {title:"Shop",links:["Apple iPhones","Samsung Galaxy","Google Pixel","Xiaomi Redmi","OnePlus","Tecno Camon 40 Pro","Infinix"]},
            {title:"Support",links:["Track My Order","Returns & Refunds","Warranty Info","Contact Support","FAQ","Lipa Mdogo Mdogo","M-Pesa Payments"]},
          ].map(col=>(
            <div key={col.title}>
              <h4 style={{fontWeight:700,fontSize:13.5,color:D.text,marginBottom:18,letterSpacing:-.2}}>{col.title}</h4>
              <ul style={{listStyle:"none",display:"flex",flexDirection:"column",gap:11}}>
                {col.links.map(l=>(
                  <li key={l}><a href="#" style={{fontSize:12.5,color:D.textDim,textDecoration:"none",fontWeight:500,transition:"color .2s"}}
                    onMouseEnter={e=>e.target.style.color=D.accentB}
                    onMouseLeave={e=>e.target.style.color=D.textDim}>{l}</a></li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h4 style={{fontWeight:700,fontSize:13.5,color:D.text,marginBottom:18}}>Contact</h4>
            <div style={{display:"flex",flexDirection:"column",gap:11}}>
              {[
                ["phone",  "+254 752 127 744", `tel:+254752127744`],
                ["msg",    "WhatsApp Order",   `https://wa.me/${WA}`],
                ["fb",     "Facebook Page",    FB_LINK],
                ["pin",    "Nairobi, Kenya",   "#"],
                ["clock",  "Mon–Sat 8am–8pm",  "#"],
              ].map(([ic,t,h])=>(
                <a key={t} href={h} target={h.startsWith("http")?"_blank":undefined} rel="noreferrer"
                  style={{display:"flex",alignItems:"center",gap:10,textDecoration:"none",transition:"opacity .2s"}}
                  onMouseEnter={e=>e.currentTarget.style.opacity=".7"}
                  onMouseLeave={e=>e.currentTarget.style.opacity="1"}>
                  <div style={{width:32,height:32,borderRadius:8,background:D.card,border:`1px solid ${D.border}`,
                    display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                    <Icon name={ic} size={13} color={D.textDim} />
                  </div>
                  <span style={{fontSize:12.5,color:D.textDim,fontWeight:500}}>{t}</span>
                </a>
              ))}
            </div>
            <div style={{display:"flex",gap:7,marginTop:20,flexWrap:"wrap"}}>
              {[["smartphone","M-Pesa Ready"],["crown","Lipa Mdogo"],["badge","Verified"]].map(([ic,t])=>(
                <div key={t} style={{display:"flex",alignItems:"center",gap:5,padding:"4px 10px",
                  background:D.mpesaSoft,border:`1px solid ${D.mpesaBorder}`,borderRadius:6}}>
                  <Icon name={ic} size={10} color={D.mpesa} />
                  <span style={{fontSize:10,color:D.mpesa,fontWeight:700}}>{t}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div style={{borderTop:`1px solid ${D.border}`,paddingTop:26,display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:11}}>
          <p style={{fontSize:11.5,color:D.textDim}}>© 2025 GlowCart Phones · M-Pesa & Lipa Mdogo Mdogo · Built in Kenya 🇰🇪</p>
          <p className="mono" style={{fontSize:11,color:D.textDim}}>Bei zote ni Kenya Shillings (KSh)</p>
        </div>
      </div>
    </footer>
  );
}

// ─── APP ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [cart, setCart]         = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [search, setSearch]     = useState("");
  const [cat, setCat]           = useState("all");
  const [sort, setSort]         = useState("default");
  const [toasts, setToasts]     = useState([]);
  const [qview, setQview]       = useState(null);
  const [vmode, setVmode]       = useState("grid");
  const [mpesa, setMpesa]       = useState({ open:false, amount:0, items:[], mode:"cart", product:null });
  const {mob, tab}              = useBP();

  const toast = useCallback((msg, type="ok")=>{
    const id=Date.now()+Math.random();
    setToasts(t=>[...t,{id,message:msg,type}]);
    setTimeout(()=>setToasts(t=>t.filter(x=>x.id!==id)),3800);
  },[]);

  const addToCart = useCallback(p=>{
    setCart(c=>{const ex=c.find(i=>i.id===p.id);return ex?c.map(i=>i.id===p.id?{...i,qty:i.qty+1}:i):[...c,{...p,qty:1}];});
    toast(`${p.name} added to cart`,"cart");
  },[toast]);

  const remove = useCallback(id=>{ setCart(c=>c.filter(i=>i.id!==id)); toast("Item removed","info"); },[toast]);
  const upd    = useCallback((id,d)=>{ setCart(c=>c.map(i=>{if(i.id!==id)return i;const q=i.qty+d;return q<1?null:{...i,qty:q};}).filter(Boolean)); },[]);

  const openMpesa = useCallback((p, payMode="full") => {
    if (payMode === "full") {
      setMpesa({ open:true, amount:p.price, items:[p], mode:"full", product:p });
    } else {
      setMpesa({ open:true, amount:p.price, items:[p], mode:"deposit", product:p });
    }
  }, []);

  const openMpesaCart = useCallback((items, total) => {
    setMpesa({ open:true, amount:total, items, mode:"cart", product:null });
  }, []);

  const handleLipa = useCallback(p=>{
    const days=lipaDays(p.price);
    const months=Math.ceil(days/30);
    const msg=`Hello GlowCart! 👋\n\n*LIPA MDOGO MDOGO ORDER* 🏆\n\n📱 *${p.name}*\n💰 Bei: ${fmt(p.price)}\n\n✅ *Masharti:*\n📌 Deposit: ${fmt(DEPOSIT)}\n📌 Kila siku: ${fmt(DAILY)}\n📌 Muda: Siku ${days} (~Miezi ${months})\n\n📦 Niambie delivery location yangu.\n\nAsante! ✅`;
    window.open(`https://wa.me/${WA}?text=${encodeURIComponent(msg)}`,"_blank");
    toast(`Lipa Mdogo Mdogo request sent for ${p.name}!`,"lipa");
  },[toast]);

  const handleLipaCart = useCallback((items,total)=>{
    const lines=items.map(i=>`• ${i.name} ×${i.qty} — ${fmt(i.price*i.qty)}`).join("\n");
    const msg=`Hello GlowCart! 👋\n\n*LIPA MDOGO MDOGO ORDER* 🏆\n\n${lines}\n\n💰 *Jumla: ${fmt(total)}*\n\n✅ Deposit: ${fmt(DEPOSIT)} + ${fmt(DAILY)}/day kwa kila simu\n\nAsante! ✅`;
    window.open(`https://wa.me/${WA}?text=${encodeURIComponent(msg)}`,"_blank");
    toast("Lipa Mdogo Mdogo order sent!","lipa");
  },[toast]);

  const handleWA = useCallback((items,total)=>{
    const lines=items.map(i=>`• ${i.name} ×${i.qty} — ${fmt(i.price*i.qty)}`).join("\n");
    window.open(`https://wa.me/${WA}?text=${encodeURIComponent(`Hello GlowCart! 👋\n\n*My Order:*\n${lines}\n\n*Total: ${fmt(total)}*\n\nPlease confirm!`)}`,"_blank");
  },[]);

  const count = cart.reduce((s,i)=>s+i.qty,0);

  const filtered = PRODUCTS.filter(p=>{
    const q=search.toLowerCase();
    return(!q||p.name.toLowerCase().includes(q)||p.brand.toLowerCase().includes(q)||p.desc.toLowerCase().includes(q))
      &&(cat==="all"||p.cat===cat);
  }).sort((a,b)=>{
    if(sort==="low")    return a.price-b.price;
    if(sort==="high")   return b.price-a.price;
    if(sort==="rating") return b.rating-a.rating;
    if(sort==="pop")    return b.reviews-a.reviews;
    return 0;
  });

  const cols = vmode==="list"?"1fr":mob?"repeat(2,1fr)":tab?"repeat(3,1fr)":"repeat(4,1fr)";

  return (
    <CartCtx.Provider value={{cart,addToCart,remove,upd}}>
      <style>{CSS}</style>
      <Toasts toasts={toasts} />

      {/* M-Pesa Modal */}
      <MpesaModal
        open={mpesa.open}
        onClose={()=>setMpesa(m=>({...m,open:false}))}
        amount={mpesa.amount}
        items={mpesa.items}
        mode={mpesa.mode}
        product={mpesa.product}
      />

      {qview && <QView p={qview} onClose={()=>setQview(null)} onAdd={addToCart} onLipa={handleLipa} onMpesa={openMpesa} />}

      <Ticker />
      <Navbar count={count} onCart={()=>setCartOpen(true)} search={search} setSearch={setSearch} />
      <CartDrawer open={cartOpen} onClose={()=>setCartOpen(false)} onWA={handleWA} onLipaWA={handleLipaCart} onMpesaCart={openMpesaCart} />

      <main style={{paddingTop:mob?62:72}}>
        <Hero onScroll={()=>document.getElementById("products")?.scrollIntoView({behavior:"smooth"})} />
        <Trust />

        {/* ── Products ── */}
        <section id="products" style={{padding:mob?"52px 14px 80px":"88px 30px 108px",background:D.bg}}>
          <div style={{maxWidth:1440,margin:"0 auto"}}>
            {/* Header */}
            <div style={{marginBottom:mob?32:56,display:"flex",alignItems:"flex-end",justifyContent:"space-between",flexWrap:"wrap",gap:18}}>
              <div>
                <div style={{display:"inline-flex",alignItems:"center",gap:7,padding:"5px 13px 5px 9px",
                  borderRadius:9,background:D.mpesaSoft,border:`1px solid ${D.mpesaBorder}`,marginBottom:16}}>
                  <div style={{width:6,height:6,borderRadius:"50%",background:D.mpesa,animation:"pulse 1.5s infinite"}} />
                  <span className="tag" style={{color:D.mpesa,letterSpacing:2}}>M-Pesa · Lipa Mdogo Mdogo</span>
                </div>
                <h2 style={{fontWeight:800,
                  fontSize:mob?"clamp(24px,7vw,36px)":"clamp(32px,4vw,52px)",
                  color:D.white,letterSpacing:-2,lineHeight:1.05}}>
                  Pata Simu Yako<br/><span className="grad-gold">Sasa Hivi</span>
                </h2>
              </div>
              <div style={{padding:"14px 18px",background:D.mpesaSoft,border:`1px solid ${D.mpesaBorder}`,borderRadius:13,maxWidth:260}}>
                <p style={{fontSize:12,color:D.mpesa,fontWeight:700,marginBottom:5,display:"flex",alignItems:"center",gap:6}}>
                  <span className="mono" style={{fontWeight:800}}>M</span> M-Pesa STK Push Available
                </p>
                <p style={{fontSize:11,color:D.textMid,lineHeight:1.65}}>Pay directly or Deposit KSh 3,000 + KSh 50 kila siku. <strong style={{color:D.lipa}}>0752 127 744</strong></p>
              </div>
            </div>

            {/* Filters */}
            <div style={{display:"flex",flexDirection:mob?"column":"row",gap:9,marginBottom:24,alignItems:mob?"stretch":"center"}}>
              <div className="noscroll" style={{display:"flex",gap:5,overflowX:"auto",flex:1}}>
                {CATS.map(c=>{
                  const active=cat===c.key;
                  return (
                    <button key={c.key} onClick={()=>setCat(c.key)} style={{
                      padding:mob?"8px 13px":"9px 17px",borderRadius:9,flexShrink:0,border:"none",
                      background:active?"linear-gradient(135deg,#6366F1,#818CF8)":"rgba(255,255,255,0.04)",
                      color:active?"#fff":D.textMid,fontWeight:700,fontSize:mob?11.5:12.5,cursor:"pointer",
                      boxShadow:active?"0 4px 18px rgba(99,102,241,0.4)":"none",
                      transition:"all .22s",
                      outline:active?"none":`1px solid ${D.border}`,
                      display:"flex",alignItems:"center",gap:6}}>
                      <Icon name={c.icon} size={10} color={active?"#fff":D.textDim} /> {c.label}
                    </button>
                  );
                })}
              </div>
              <div style={{display:"flex",gap:7,alignItems:"center",flexShrink:0}}>
                {!mob && (
                  <div style={{display:"flex",gap:3}}>
                    {[["grid","grid"],["list","list"]].map(([m,ic])=>(
                      <button key={m} onClick={()=>setVmode(m)} className="icon-btn"
                        style={{width:36,height:36,background:vmode===m?D.accentSoft:undefined,borderColor:vmode===m?D.borderGlow:undefined}}>
                        <Icon name={ic} size={13} color={vmode===m?D.accent:D.textDim} />
                      </button>
                    ))}
                  </div>
                )}
                <div style={{position:"relative"}}>
                  <Icon name="sliders" size={12} color={D.textDim}
                    style={{position:"absolute",left:11,top:"50%",transform:"translateY(-50%)",pointerEvents:"none"}} />
                  <select value={sort} onChange={e=>setSort(e.target.value)} style={{
                    padding:"10px 14px 10px 33px",borderRadius:10,
                    border:`1px solid ${D.border}`,background:D.card,
                    fontWeight:600,fontSize:12.5,
                    color:D.text,cursor:"pointer",outline:"none",
                    minWidth:mob?"100%":175,appearance:"none"}}>
                    <option value="default">Featured</option>
                    <option value="low">Price: Low → High</option>
                    <option value="high">Price: High → Low</option>
                    <option value="rating">Top Rated</option>
                    <option value="pop">Most Reviewed</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Search results */}
            {search && (
              <div style={{marginBottom:18,padding:"12px 16px",background:D.accentSoft,borderRadius:11,
                display:"flex",alignItems:"center",justifyContent:"space-between",border:`1px solid ${D.borderGlow}`}}>
                <div style={{display:"flex",alignItems:"center",gap:8}}>
                  <Icon name="scan" size={13} color={D.accent} />
                  <span style={{fontSize:12.5,fontWeight:600,color:D.accentB}}>
                    {filtered.length} result{filtered.length!==1?"s":""} for <strong>"{search}"</strong>
                  </span>
                </div>
                <button onClick={()=>setSearch("")} className="icon-btn" style={{width:24,height:24,border:"none"}}>
                  <Icon name="x" size={11} />
                </button>
              </div>
            )}

            {/* Grid */}
            {filtered.length===0 ? (
              <div style={{textAlign:"center",padding:"100px 20px"}}>
                <div style={{width:80,height:80,borderRadius:22,background:D.card,border:`1px solid ${D.border}`,
                  display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 22px"}}>
                  <Icon name="pkg" size={30} color={D.textDim} strokeWidth={1.5} />
                </div>
                <h3 style={{color:D.text,fontSize:20,margin:"0 0 8px",fontWeight:800}}>No phones found</h3>
                <p style={{color:D.textDim,fontSize:13.5}}>Try a different search or category</p>
                <button onClick={()=>{setSearch("");setCat("all");setSort("default");}} className="btn-accent"
                  style={{margin:"24px auto 0",padding:"12px 28px",fontSize:13.5,borderRadius:11}}>
                  <Icon name="refresh" size={14} color="#fff" /> Reset Filters
                </button>
              </div>
            ) : (
              <>
                <div style={{display:"grid",gridTemplateColumns:cols,gap:mob?10:18}}>
                  {filtered.map(p=>(
                    <PCard key={p.id} p={p} onAdd={addToCart} onLipa={handleLipa} onQuick={setQview} onMpesa={openMpesa} />
                  ))}
                </div>
                <p className="mono" style={{textAlign:"center",marginTop:28,fontSize:11,color:D.textDim}}>
                  Showing {filtered.length}/{PRODUCTS.length} devices · All support M-Pesa & Lipa Mdogo Mdogo
                </p>
              </>
            )}
          </div>
        </section>

        <Testimonials />
        <CTA onMpesa={(p,mode)=>setMpesa({open:true,amount:p.price||DEPOSIT,items:[p],mode,product:p})} />
        <Footer />
      </main>

      {/* Mobile bottom nav */}
      {mob && (
        <div style={{position:"fixed",bottom:0,left:0,right:0,zIndex:850,
          background:"rgba(2,5,9,0.98)",backdropFilter:"blur(28px)",
          borderTop:`1px solid ${D.border}`,
          padding:"9px 0 calc(9px + env(safe-area-inset-bottom))",
          display:"flex",justifyContent:"space-around",alignItems:"center"}}>
          {[
            {ic:"trend",  l:"Home",   fn:()=>window.scrollTo({top:0,behavior:"smooth"}) },
            {ic:"phone2", l:"Phones", fn:()=>document.getElementById("products")?.scrollIntoView({behavior:"smooth"}) },
          ].map(({ic,l,fn})=>(
            <button key={l} onClick={fn} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:3,background:"none",border:"none",cursor:"pointer",padding:"3px 14px"}}>
              <Icon name={ic} size={20} color={D.textMid} />
              <span className="tag" style={{color:D.textMid,letterSpacing:1}}>{l}</span>
            </button>
          ))}
          <button onClick={()=>setCartOpen(true)} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:3,background:"none",border:"none",cursor:"pointer",padding:"3px 14px",position:"relative"}}>
            <Icon name="cart" size={20} color={D.accent} />
            <span className="tag" style={{color:D.accent,letterSpacing:1}}>Cart</span>
            {count>0 && (
              <span style={{position:"absolute",top:0,right:8,background:D.rose,color:"#fff",borderRadius:"50%",
                width:17,height:17,fontSize:8,fontWeight:900,display:"flex",alignItems:"center",justifyContent:"center",
                border:`2px solid ${D.bg}`,fontFamily:"'JetBrains Mono',monospace"}}>{count}</span>
            )}
          </button>
          <a href={`https://wa.me/${WA}`} target="_blank" rel="noreferrer"
            style={{display:"flex",flexDirection:"column",alignItems:"center",gap:3,textDecoration:"none",padding:"3px 14px"}}>
            <Icon name="msg" size={20} color="#25D366" />
            <span className="tag" style={{color:"#25D366",letterSpacing:1}}>Chat</span>
          </a>
          <button onClick={()=>setMpesa({open:true,amount:0,items:[],mode:"cart",product:null})}
            style={{display:"flex",flexDirection:"column",alignItems:"center",gap:3,background:"none",border:"none",cursor:"pointer",padding:"3px 14px"}}>
            <div style={{width:20,height:20,display:"flex",alignItems:"center",justifyContent:"center"}}>
              <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:12,fontWeight:800,color:D.mpesa}}>M</span>
            </div>
            <span className="tag" style={{color:D.mpesa,letterSpacing:1}}>M-Pesa</span>
          </button>
        </div>
      )}

      {/* Floating WhatsApp (desktop) */}
      {!mob && (
        <div style={{position:"fixed",bottom:30,right:30,zIndex:800,display:"flex",flexDirection:"column",gap:12,alignItems:"flex-end"}}>
          {/* M-Pesa float */}
          <button onClick={()=>setMpesa({open:true,amount:0,items:[],mode:"cart",product:null})}
            style={{width:48,height:48,borderRadius:"50%",
              background:"linear-gradient(135deg,#00A651,#00C761)",
              border:"none",display:"flex",alignItems:"center",justifyContent:"center",
              boxShadow:"0 8px 28px rgba(0,166,81,0.45)",cursor:"pointer",
              transition:"all .3s"}}
            onMouseEnter={e=>{e.target.style.transform="scale(1.1)"}}
            onMouseLeave={e=>{e.target.style.transform="scale(1)"}}>
            <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:14,fontWeight:800,color:"#fff"}}>M</span>
          </button>
          {/* WhatsApp float */}
          <a href={`https://wa.me/${WA}?text=${encodeURIComponent("Hello GlowCart! Nataka kununua simu.")}`}
            target="_blank" rel="noreferrer"
            style={{width:54,height:54,borderRadius:"50%",
              background:"linear-gradient(135deg,#25D366,#128C7E)",
              display:"flex",alignItems:"center",justifyContent:"center",
              boxShadow:"0 8px 28px rgba(37,211,102,0.45)",
              textDecoration:"none",animation:"ring 2.5s infinite"}}>
            <Icon name="msg" size={22} color="#fff" fill="#fff" strokeWidth={1.5} />
          </a>
        </div>
      )}
    </CartCtx.Provider>
  );
}
