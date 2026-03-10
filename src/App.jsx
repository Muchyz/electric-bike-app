import { useState, useEffect, useRef } from "react";
import "./App.css";

const WA_NUM  = "254754465744";
const WA_BASE = `https://wa.me/${WA_NUM}`;
const WA_URL  = `${WA_BASE}?text=Hello!%20I'm%20interested%20in%20your%20electric%20bikes.`;
const fmt     = (p) => `KSh ${Number(p).toLocaleString()}`;

// Helper: gradient fallback when image fails
const imgError = (e, color) => {
  e.target.style.display = "none";
  e.target.parentElement.style.background = `linear-gradient(135deg, ${color}cc, ${color}44)`;
};

const BIKES = [
  {
    id: 1, name: "Thunderbolt X1 Pro", price: 85000, orig: 95000,
    cat: "Mountain", rating: 4.9, reviews: 128, badge: "Best Seller",
    brand: "Himiway Cobra Pro",
    desc: "Dominate every trail with raw electric power. The Thunderbolt X1 Pro combines cutting-edge motor technology with full suspension for the ultimate off-road experience.",
    specs: { Motor: "750W Brushless", Battery: "48V 20Ah", Range: "80 km", Speed: "45 km/h", Weight: "22 kg", "Charge Time": "4–6 hrs" },
    feats: ["Hydraulic Disc Brakes", "Full Suspension", '5" LCD Display', "5 Assist Levels"],
    img: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?auto=format&fit=crop&w=800&q=80",
    color: "#C4531A",
  },
  {
    id: 2, name: "CityRider S2 Elite", price: 65000, orig: 72000,
    cat: "Commuter", rating: 4.7, reviews: 96, badge: "New Arrival",
    brand: "KBO Breeze",
    desc: "The ultimate urban commuter. Sleek, fast, and smart — the CityRider S2 Elite makes every commute feel like a luxury experience.",
    specs: { Motor: "500W Brushless", Battery: "36V 15Ah", Range: "60 km", Speed: "35 km/h", Weight: "18 kg", "Charge Time": "3–5 hrs" },
    feats: ["Smart Lights", "Color Display", "USB-C Charging", "Anti-theft Alarm"],
    img: "https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?auto=format&fit=crop&w=800&q=80",
    color: "#2D6A4F",
  },
  {
    id: 3, name: "Summit Peak 4000", price: 120000, orig: 135000,
    cat: "Mountain", rating: 4.8, reviews: 64, badge: "Premium",
    brand: "Specialized Turbo Levo",
    desc: "Built for the most demanding mountain adventures. The Summit Peak 4000 is the pinnacle of electric mountain biking engineering.",
    specs: { Motor: "1000W Mid-Drive", Battery: "52V 25Ah", Range: "100 km", Speed: "50 km/h", Weight: "24 kg", "Charge Time": "5–7 hrs" },
    feats: ["Bosch Performance Motor", "100 km Range", "Magura Brakes", "Fox Factory Suspension"],
    img: "https://images.unsplash.com/photo-1571068316344-75bc76f77890?auto=format&fit=crop&w=800&q=80",
    color: "#8B5E3C",
  },
  {
    id: 4, name: "VoltStream Road R3", price: 75000, orig: 82000,
    cat: "Road", rating: 4.6, reviews: 87, badge: "Popular",
    brand: "Trek Domane+",
    desc: "Aerodynamic, powerful and elegant. Designed for speed enthusiasts who crave the thrill of road racing with seamless electric assist.",
    specs: { Motor: "600W Brushless", Battery: "36V 17Ah", Range: "70 km", Speed: "40 km/h", Weight: "16 kg", "Charge Time": "3–4 hrs" },
    feats: ["Carbon Fiber Fork", "Aero Race Frame", "Shimano 105", "Integrated Power Meter"],
    img: "https://images.unsplash.com/photo-1593764592116-bfb2a97c642a?auto=format&fit=crop&w=800&q=80",
    color: "#B5451B",
  },
  {
    id: 5, name: "FoldMaster Urban F1", price: 55000, orig: 62000,
    cat: "Folding", rating: 4.5, reviews: 143, badge: "Compact",
    brand: "Brompton Electric",
    desc: "The smartest folding e-bike ever made. Perfect for city dwellers who need ultimate flexibility without compromising on performance.",
    specs: { Motor: "350W Hub Drive", Battery: "36V 10Ah", Range: "45 km", Speed: "30 km/h", Weight: "14 kg", "Charge Time": "2–3 hrs" },
    feats: ["Folds in 10 Seconds", "App Connected", "Regenerative Braking", "Carry-On Friendly"],
    img: "https://images.unsplash.com/photo-1544191696-15693072e0b2?auto=format&fit=crop&w=800&q=80",
    color: "#1B4332",
  },
  {
    id: 6, name: "Trailblazer E-MTB", price: 98000, orig: 110000,
    cat: "Mountain", rating: 4.9, reviews: 52, badge: "Top Rated",
    brand: "Canyon Spectral:ON",
    desc: "Engineered for riders who push limits. Advanced terrain sensing and adaptive motor control make every trail your personal playground.",
    specs: { Motor: "850W Mid-Drive", Battery: "48V 22Ah", Range: "90 km", Speed: "48 km/h", Weight: "23 kg", "Charge Time": "4–6 hrs" },
    feats: ["Terrain Sensing AI", "Adaptive Motor Control", "Fox 36 Factory", "SRAM Eagle AXS"],
    img: "https://images.unsplash.com/photo-1622227922682-56de71ead5c1?auto=format&fit=crop&w=800&q=80",
    color: "#6D4C2A",
  },
  {
    id: 7, name: "NightRider Stealth V2", price: 79000, orig: 88000,
    cat: "Commuter", rating: 4.7, reviews: 78, badge: "Trending",
    brand: "Velotric Discover 1",
    desc: "Silent. Fast. Unstoppable. The NightRider Stealth V2 is built for those who prefer roads less traveled, at any hour of the day.",
    specs: { Motor: "500W Ultra-Quiet", Battery: "48V 15Ah", Range: "65 km", Speed: "38 km/h", Weight: "19 kg", "Charge Time": "3–5 hrs" },
    feats: ["Ultra-Silent Motor", "Night Vision Lights", "Stealth Mode", "IP67 Waterproof"],
    img: "https://images.unsplash.com/photo-1611144701479-62ff25e34d9e?auto=format&fit=crop&w=800&q=80",
    color: "#2C4A3E",
  },
  {
    id: 8, name: "SpeedForce Pro SX", price: 115000, orig: 128000,
    cat: "Road", rating: 4.8, reviews: 41, badge: "Elite",
    brand: "Ribble Endurance SL e",
    desc: "Professional-grade performance in a breathtaking package. When motorsport engineering meets elite e-cycling, the SpeedForce Pro SX is born.",
    specs: { Motor: "750W Racing Motor", Battery: "52V 20Ah", Range: "85 km", Speed: "55 km/h", Weight: "17 kg", "Charge Time": "4–5 hrs" },
    feats: ["Race-Tuned ECU", "Titanium Frame", "Ceramic Bearings", "Electronic Shifting"],
    img: "https://images.unsplash.com/photo-1558981852-426c18f14dc1?auto=format&fit=crop&w=800&q=80",
    color: "#9B3922",
  },
  {
    id: 9, name: "EcoRide Classic C1", price: 45000, orig: 52000,
    cat: "Commuter", rating: 4.4, reviews: 215, badge: "Best Value",
    brand: "Aventon Pace 500",
    desc: "Style meets sustainability. The EcoRide Classic C1 offers everything you need for daily commuting wrapped in a timeless, beautiful design.",
    specs: { Motor: "300W Hub Drive", Battery: "36V 12Ah", Range: "50 km", Speed: "28 km/h", Weight: "17 kg", "Charge Time": "3–4 hrs" },
    feats: ["Heritage Design", "Eco Pedal Assist", "7-Speed Shimano", "Full Fender Set"],
    img: "https://images.unsplash.com/photo-1637859578900-84e56fe15339?auto=format&fit=crop&w=800&q=80",
    color: "#4A7C59",
  },
  {
    id: 10, name: "AlphaWave AWX Pro", price: 145000, orig: 160000,
    cat: "Mountain", rating: 5.0, reviews: 29, badge: "Ultimate",
    brand: "Specialized S-Works Levo",
    desc: "The crown jewel of our collection. The AlphaWave AWX Pro is the absolute pinnacle of electric bike engineering — uncompromising in every detail.",
    specs: { Motor: "1200W Full-Power", Battery: "52V 30Ah", Range: "120 km", Speed: "60 km/h", Weight: "26 kg", "Charge Time": "6–8 hrs" },
    feats: ["1200W Flagship Motor", "120 km Range", "Öhlins Suspension", "Proprietary Alpha Drive"],
    img: "https://images.unsplash.com/photo-1673439782067-5e4c5f3b3d90?auto=format&fit=crop&w=800&q=80",
    color: "#7B3F00",
  },
];

const TESTIMONIALS = [
  { name: "John Kamau", city: "Nairobi", rating: 5, init: "JK", text: "Best investment I've ever made! The Thunderbolt X1 Pro completely changed my morning commute. Electric bikes are absolutely the future!" },
  { name: "Sarah Wanjiku", city: "Mombasa", rating: 5, init: "SW", text: "The Lipa Mdogo Mdogo plan made owning my dream bike so easy. Customer service on WhatsApp is incredibly fast and helpful!" },
  { name: "Michael Odhiambo", city: "Kisumu", rating: 5, init: "MO", text: "Summit Peak 4000 is an absolute beast on mountain trails. Quality is world-class. These guys deliver what they promise!" },
  { name: "Grace Njeri", city: "Nakuru", rating: 5, init: "GN", text: "Was skeptical at first, but now I'm a complete convert. Smooth, powerful, and the design is breathtaking. Absolutely love it!" },
];

// ── STARS ──
const Stars = ({ n }) => (
  <div style={{ display: "flex", gap: 2 }}>
    {[1,2,3,4,5].map(i => (
      <span key={i} style={{ color: i <= Math.round(n) ? "#D4A853" : "#3a3228", fontSize: 12 }}>★</span>
    ))}
  </div>
);

// ── PRODUCT CARD ──
const ProductCard = ({ bike, onView, onCart }) => {
  const [added, setAdded] = useState(false);
  const [liked, setLiked] = useState(false);
  const discount = Math.round(((bike.orig - bike.price) / bike.orig) * 100);

  const handleAdd = (e) => {
    e.stopPropagation();
    onCart(bike);
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  };

  return (
    <article className="pcard" onClick={() => onView(bike)}>
      <div className="pcard-img">
        <img
          src={bike.img}
          alt={bike.name}
          loading="lazy"
          referrerPolicy="no-referrer"
          onError={e => imgError(e, bike.color)}
        />
        <div className="pcard-img-tint" style={{ background: `linear-gradient(to top, ${bike.color}cc, transparent)` }} />
        <span className="pcard-badge">{bike.badge}</span>
        <button className="pcard-wish" onClick={e => { e.stopPropagation(); setLiked(!liked); }}>
          {liked ? "♥" : "♡"}
        </button>
        <div className="pcard-overlay">
          <button className="pcard-quick" onClick={e => { e.stopPropagation(); onView(bike); }}>
            View Details →
          </button>
        </div>
        <div className="pcard-discount">-{discount}%</div>
      </div>
      <div className="pcard-body">
        <div className="pcard-meta">
          <span className="pcard-cat">{bike.cat}</span>
          <Stars n={bike.rating} />
        </div>
        <h3 className="pcard-name">{bike.name}</h3>
        <div className="pcard-brand">{bike.brand}</div>
        <div className="pcard-range">⚡ {bike.specs.Range} range</div>
        <div className="pcard-footer">
          <div>
            <div className="pcard-price">{fmt(bike.price)}</div>
            <div className="pcard-orig">{fmt(bike.orig)}</div>
          </div>
          <button className={`pcard-btn ${added ? "done" : ""}`} onClick={handleAdd}>
            {added ? "✓" : "+"}
          </button>
        </div>
      </div>
    </article>
  );
};

// ── NAVBAR ──
const Navbar = ({ page, go, cartCount }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mob, setMob] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  const nav = p => { go(p); setMob(false); };

  return (
    <>
      <nav className={`nav ${scrolled ? "nav--solid" : ""}`}>
        <button className="nav-logo" onClick={() => nav("home")}>
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <polygon points="14,2 26,8 26,20 14,26 2,20 2,8" fill="none" stroke="#D4A853" strokeWidth="1.5"/>
            <text x="14" y="19" textAnchor="middle" fill="#D4A853" fontSize="12" fontWeight="900">⚡</text>
          </svg>
          <div className="nav-logo-text">
            <span className="nav-brand">ELECTRIC BIKE</span>
            <span className="nav-tagline">Lipa Mdogo Mdogo</span>
          </div>
        </button>

        <div className="nav-links">
          {["home","shop","account"].map(l => (
            <button key={l} className={`nav-link ${page===l?"active":""}`} onClick={() => nav(l)}>
              {l.charAt(0).toUpperCase()+l.slice(1)}
            </button>
          ))}
        </div>

        <div className="nav-right">
          <a href={WA_URL} target="_blank" rel="noopener noreferrer" className="nav-wa">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            Chat
          </a>
          <button className="nav-cart" onClick={() => nav("cart")}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
            {cartCount > 0 && <span className="nav-cart-badge">{cartCount}</span>}
          </button>
          <button className="hamburger" onClick={() => setMob(!mob)}>
            <span /><span /><span />
          </button>
        </div>
      </nav>

      {mob && (
        <div className="mob-menu">
          {["Home","Shop","Account","Cart"].map(l => (
            <button key={l} className="mob-item" onClick={() => nav(l.toLowerCase())}>
              {l}
              {l==="Cart" && cartCount>0 && <span className="mob-badge">{cartCount}</span>}
            </button>
          ))}
          <a href={WA_URL} target="_blank" rel="noopener noreferrer" className="mob-wa">
            WhatsApp Us
          </a>
        </div>
      )}
    </>
  );
};

// ── TOAST ──
const Toast = ({ msg, onHide }) => {
  useEffect(() => { const t = setTimeout(onHide, 2800); return () => clearTimeout(t); }, []);
  return <div className="toast">{msg}</div>;
};

// ── FOOTER ──
const Footer = ({ go }) => (
  <footer className="footer">
    <div className="footer-inner">
      <div className="footer-brand">
        <div className="footer-logo">
          <svg width="32" height="32" viewBox="0 0 28 28" fill="none">
            <polygon points="14,2 26,8 26,20 14,26 2,20 2,8" fill="none" stroke="#D4A853" strokeWidth="1.5"/>
            <text x="14" y="19" textAnchor="middle" fill="#D4A853" fontSize="12" fontWeight="900">⚡</text>
          </svg>
          <span className="footer-brand-name">EBIKE KE</span>
        </div>
        <p className="footer-brand-desc">Kenya's premium electric bike store. Ride the future today.</p>
        <a href={WA_URL} target="_blank" rel="noopener noreferrer" className="footer-wa">
          WhatsApp: 0754 465 744
        </a>
      </div>

      <div className="footer-cols">
        <div>
          <div className="footer-col-title">Navigate</div>
          {["Home","Shop","Account"].map(l => (
            <button key={l} className="footer-link" onClick={() => go(l.toLowerCase())}>{l}</button>
          ))}
        </div>
        <div>
          <div className="footer-col-title">Categories</div>
          {["Mountain","Commuter","Road","Folding"].map(l => (
            <button key={l} className="footer-link" onClick={() => go("shop")}>{l} Bikes</button>
          ))}
        </div>
        <div>
          <div className="footer-col-title">Support</div>
          {["Lipa Mdogo Mdogo","Warranty","Delivery","Returns","FAQs"].map(l => (
            <a key={l} href="#" className="footer-link">{l}</a>
          ))}
        </div>
      </div>
    </div>
    <div className="footer-bottom">
      <span>© 2025 Electric Bike Lipa Mdogo Mdogo. All rights reserved.</span>
      <div style={{display:"flex",gap:24}}>
        <a href="#" className="footer-legal">Privacy</a>
        <a href="#" className="footer-legal">Terms</a>
      </div>
    </div>
  </footer>
);

// ── HOME PAGE ──
const HomePage = ({ go, onCart, onView }) => {
  const [heroIdx, setHeroIdx] = useState(0);
  const heroData = [
    { bike: BIKES[0], headline: "Conquer Every Trail", sub: "Raw power meets precision engineering",
      bgImg: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?auto=format&fit=crop&w=1600&q=90" },
    { bike: BIKES[2], headline: "Summit Awaits You", sub: "100km range. Zero compromise.",
      bgImg: "https://images.unsplash.com/photo-1571068316344-75bc76f77890?auto=format&fit=crop&w=1600&q=90" },
    { bike: BIKES[1], headline: "Own the City", sub: "Your commute, reimagined",
      bgImg: "https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?auto=format&fit=crop&w=1600&q=90" },
  ];

  useEffect(() => {
    const t = setInterval(() => setHeroIdx(i => (i+1) % heroData.length), 6000);
    return () => clearInterval(t);
  }, []);

  const current = heroData[heroIdx];

  return (
    <div className="page-in">
      {/* HERO */}
      <section className="hero">
        <div className="hero-bg">
          {heroData.map((d, i) => (
            <div key={i} className={`hero-slide ${i===heroIdx?"active":""}`}
              style={{ backgroundImage: `url(${d.bgImg})` }} />
          ))}
          <div className="hero-mask" />
        </div>

        <div className="hero-content">
          <div className="hero-eyebrow">
            <span className="hero-dot-live" />
            Kenya's #1 Electric Bike Store
          </div>
          <h1 className="hero-h1">
            {current.headline.split(" ").map((word, i) => (
              <span key={`${heroIdx}-${i}`} className="hero-word" style={{ animationDelay: `${i * 0.07}s` }}>
                {word}{" "}
              </span>
            ))}
          </h1>
          <p className="hero-sub">{current.sub}</p>
          <div className="hero-price-tag">
            From <strong>{fmt(current.bike.price)}</strong>
            <span className="hero-lipa">or Lipa Mdogo Mdogo</span>
          </div>
          <div className="hero-ctas">
            <button className="cta-primary" onClick={() => go("shop")}>
              Shop Now
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </button>
            <button className="cta-ghost" onClick={() => onView(current.bike)}>
              View {current.bike.name}
            </button>
          </div>
        </div>

        <div className="hero-side">
          <div className="hero-bike-card">
            <img
              src={current.bike.img}
              alt={current.bike.name}
              className="hero-bike-img"
              referrerPolicy="no-referrer"
              onError={e => imgError(e, current.bike.color)}
            />
            <div className="hero-bike-info">
              <div className="hero-bike-name">{current.bike.name}</div>
              <div className="hero-bike-specs">
                <span>⚡ {current.bike.specs.Range}</span>
                <span>🏎 {current.bike.specs.Speed}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Indicators */}
        <div className="hero-nav">
          {heroData.map((_, i) => (
            <button key={i} className={`hero-pip ${i===heroIdx?"active":""}`} onClick={() => setHeroIdx(i)} />
          ))}
        </div>

        {/* Marquee */}
        <div className="hero-ticker">
          <div className="hero-ticker-inner">
            {Array(6).fill(null).map((_, i) => (
              <span key={i}>
                LIPA MDOGO MDOGO &nbsp;·&nbsp; 0% INTEREST &nbsp;·&nbsp; FREE DELIVERY NAIROBI &nbsp;·&nbsp; 2-YEAR WARRANTY &nbsp;·&nbsp;
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* STATS */}
      <div className="stats">
        {[
          { n: "2,500+", l: "Bikes Delivered", icon: "🚴" },
          { n: "98%", l: "Satisfaction Rate", icon: "⭐" },
          { n: "25+", l: "Cities Covered", icon: "📍" },
          { n: "0%", l: "Interest on Installments", icon: "💸" },
        ].map(({ n, l, icon }) => (
          <div key={l} className="stat">
            <span className="stat-icon">{icon}</span>
            <div className="stat-num">{n}</div>
            <div className="stat-label">{l}</div>
          </div>
        ))}
      </div>

      {/* FEATURED */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <div>
              <span className="eyebrow">OUR COLLECTION</span>
              <h2 className="section-title">Featured <em>Rides</em></h2>
            </div>
            <button className="see-all" onClick={() => go("shop")}>
              View all {BIKES.length} bikes →
            </button>
          </div>
          <div className="grid-4">
            {BIKES.slice(0, 4).map(b => (
              <ProductCard key={b.id} bike={b} onView={onView} onCart={onCart} />
            ))}
          </div>
        </div>
      </section>

      {/* EDITORIAL BANNER */}
      <div className="editorial">
        <div className="editorial-inner">
          <div className="editorial-text">
            <span className="eyebrow" style={{color:"#D4A853"}}>LIPA MDOGO MDOGO</span>
            <h2 className="editorial-title">Own Your Dream Bike<br/><em>Today</em></h2>
            <p className="editorial-desc">
              Don't let budget hold you back. Put down as little as 20% and pay the rest in comfortable monthly installments. No hidden fees. No stress. Just ride.
            </p>
            <div className="editorial-pills">
              <span>✓ From 20% deposit</span>
              <span>✓ 0% interest</span>
              <span>✓ 3–24 months</span>
              <span>✓ Same-day approval</span>
            </div>
            <a href={WA_URL} target="_blank" rel="noopener noreferrer" className="cta-wa">
              Apply on WhatsApp
            </a>
          </div>
          <div className="editorial-visual">
            <div className="editorial-card">
              <div className="editorial-card-top">0%</div>
              <div className="editorial-card-label">Interest Rate</div>
              <div className="editorial-card-divider"/>
              {[
                ["Down Payment","From 20%"],
                ["Duration","3–24 Months"],
                ["Processing","Same Day"],
                ["Documents","ID + Payslip"],
              ].map(([l,v]) => (
                <div key={l} className="editorial-card-row">
                  <span>{l}</span><strong>{v}</strong>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ALL BIKES PREVIEW */}
      <section className="section section--alt">
        <div className="container">
          <div className="section-header">
            <div>
              <span className="eyebrow">FULL LINEUP</span>
              <h2 className="section-title">Every Model, <em>Every Rider</em></h2>
            </div>
          </div>
          <div className="grid-3">
            {BIKES.slice(4).map(b => (
              <ProductCard key={b.id} bike={b} onView={onView} onCart={onCart} />
            ))}
          </div>
        </div>
      </section>

      {/* WHY US */}
      <section className="section">
        <div className="container">
          <div className="why-grid">
            <div className="why-left">
              <span className="eyebrow">WHY CHOOSE US</span>
              <h2 className="section-title">Built Different.<br/><em>Priced Fair.</em></h2>
              <p className="why-desc">
                We're not just another e-bike store. We're Kenya's electric revolution — bringing world-class bikes to every city, every rider, at prices that make sense.
              </p>
              <button className="cta-primary" onClick={() => go("shop")} style={{marginTop:32}}>
                Explore All Bikes
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </button>
            </div>
            <div className="why-right">
              {[
                { icon: "⚡", title: "Pure Electric Power", desc: "High-performance motors delivering instant torque from the very first pedal." },
                { icon: "🛡", title: "2-Year Full Warranty", desc: "Every bike fully covered. Ride with complete peace of mind, always." },
                { icon: "🏔", title: "Built for Kenya", desc: "Engineered for our roads, our terrain, our climate. Tested locally." },
                { icon: "💬", title: "WhatsApp Support 24/7", desc: "Real humans, not bots. We're always a message away on WhatsApp." },
              ].map(({ icon, title, desc }) => (
                <div key={title} className="why-card">
                  <div className="why-icon">{icon}</div>
                  <div>
                    <div className="why-title">{title}</div>
                    <div className="why-text">{desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="section section--alt">
        <div className="container">
          <div className="section-header">
            <div>
              <span className="eyebrow">RIDER REVIEWS</span>
              <h2 className="section-title">What They <em>Say</em></h2>
            </div>
          </div>
          <div className="testi-grid">
            {TESTIMONIALS.map(r => (
              <div key={r.name} className="testi">
                <div className="testi-quote">"</div>
                <p className="testi-text">{r.text}</p>
                <div className="testi-footer">
                  <div className="testi-avatar">{r.init}</div>
                  <div>
                    <div className="testi-name">{r.name}</div>
                    <div className="testi-city">{r.city}</div>
                  </div>
                  <Stars n={r.rating} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer go={go} />
    </div>
  );
};

// ── SHOP PAGE ──
const ShopPage = ({ go, onCart, onView }) => {
  const [search, setSearch] = useState("");
  const [cat, setCat] = useState("All");
  const [sort, setSort] = useState("popular");
  const CATS = ["All","Mountain","Commuter","Road","Folding"];

  const filtered = BIKES
    .filter(b => (cat==="All" || b.cat===cat) && b.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sort==="price-asc") return a.price - b.price;
      if (sort==="price-desc") return b.price - a.price;
      if (sort==="rating") return b.rating - a.rating;
      return b.reviews - a.reviews;
    });

  return (
    <div className="page-in">
      <div className="shop-hero">
        <span className="eyebrow">ALL ELECTRIC BIKES</span>
        <h1 className="shop-title">Find Your <em>Perfect Ride</em></h1>
        <p className="shop-sub">{BIKES.length} premium bikes — all with Lipa Mdogo Mdogo</p>
      </div>

      <div className="container" style={{paddingTop:40,paddingBottom:100}}>
        <div className="filters">
          <input className="filter-search" placeholder="Search bikes..." value={search} onChange={e => setSearch(e.target.value)} />
          <div className="cat-pills">
            {CATS.map(c => (
              <button key={c} className={`cat-pill ${cat===c?"active":""}`} onClick={() => setCat(c)}>{c}</button>
            ))}
          </div>
          <select className="filter-sort" value={sort} onChange={e => setSort(e.target.value)}>
            <option value="popular">Most Popular</option>
            <option value="rating">Top Rated</option>
            <option value="price-asc">Price: Low–High</option>
            <option value="price-desc">Price: High–Low</option>
          </select>
          <span className="filter-count">{filtered.length} results</span>
        </div>

        {filtered.length === 0 ? (
          <div className="empty">
            <div style={{fontSize:64,opacity:.3}}>🔍</div>
            <h3>No bikes found</h3>
            <p>Try a different search or category.</p>
            <button className="cta-primary" onClick={() => { setSearch(""); setCat("All"); }}>Clear Filters</button>
          </div>
        ) : (
          <div className="grid-4">
            {filtered.map(b => <ProductCard key={b.id} bike={b} onView={onView} onCart={onCart} />)}
          </div>
        )}
      </div>

      <Footer go={go} />
    </div>
  );
};

// ── PRODUCT DETAIL ──
const ProductDetail = ({ bike, go, onCart }) => {
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState("specs");
  const [added, setAdded] = useState(false);
  const save = bike.orig - bike.price;

  const handleCart = () => {
    onCart(bike, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="page-in">
      <div style={{height:78}}/>
      <div className="container" style={{paddingTop:40,paddingBottom:100}}>
        <nav className="breadcrumb">
          <button onClick={() => go("home")}>Home</button>
          <span>›</span>
          <button onClick={() => go("shop")}>Shop</button>
          <span>›</span>
          <span>{bike.name}</span>
        </nav>

        <div className="detail-layout">
          {/* Image */}
          <div className="detail-img-wrap">
            <img
              src={bike.img}
              alt={bike.name}
              className="detail-img"
              referrerPolicy="no-referrer"
              onError={e => imgError(e, bike.color)}
            />
            <div className="detail-img-overlay" style={{background:`linear-gradient(135deg, ${bike.color}33, transparent)`}}/>
            <div className="detail-badge-big">{bike.badge}</div>
          </div>

          {/* Info */}
          <div className="detail-info">
            <div className="detail-cat-row">
              <span className="detail-cat">{bike.cat}</span>
              <Stars n={bike.rating} />
              <span style={{color:"#8a7a6a",fontSize:13}}>{bike.reviews} reviews</span>
            </div>

            <h1 className="detail-name">{bike.name}</h1>

            <div className="detail-pricing">
              <span className="detail-price">{fmt(bike.price)}</span>
              <span className="detail-orig">{fmt(bike.orig)}</span>
              <span className="detail-save">Save {fmt(save)}</span>
            </div>

            <p className="detail-desc">{bike.desc}</p>

            <div className="detail-feats">
              {bike.feats.map(f => <span key={f} className="detail-feat">✓ {f}</span>)}
            </div>

            <div className="detail-qty">
              <span>Quantity</span>
              <div className="qty-ctrl">
                <button onClick={() => setQty(q => Math.max(1, q-1))}>−</button>
                <span>{qty}</span>
                <button onClick={() => setQty(q => q+1)}>+</button>
              </div>
            </div>

            <div className="detail-actions">
              <button className={`detail-cart-btn ${added?"added":""}`} onClick={handleCart}>
                {added ? "✓ Added to Cart" : "Add to Cart"}
              </button>
              <button className="detail-buy-btn" onClick={() => { onCart(bike, qty); go("checkout"); }}>
                Buy Now
              </button>
            </div>

            <a href={`${WA_BASE}?text=Hi!%20I'm%20interested%20in%20the%20${encodeURIComponent(bike.name)}.`}
              target="_blank" rel="noopener noreferrer" className="detail-wa">
              💬 Inquire on WhatsApp
            </a>

            {/* Tabs */}
            <div className="detail-tabs">
              {["specs","features"].map(t => (
                <button key={t} className={`detail-tab ${tab===t?"active":""}`} onClick={() => setTab(t)}>
                  {t.charAt(0).toUpperCase()+t.slice(1)}
                </button>
              ))}
            </div>

            {tab==="specs" && (
              <div className="spec-grid">
                {Object.entries(bike.specs).map(([k,v]) => (
                  <div key={k} className="spec-item">
                    <span className="spec-key">{k}</span>
                    <span className="spec-val">{v}</span>
                  </div>
                ))}
              </div>
            )}

            {tab==="features" && (
              <div className="feat-list">
                {bike.feats.map(f => (
                  <div key={f} className="feat-item">
                    <span className="feat-check">✓</span>
                    {f}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Related */}
        <div style={{marginTop:80}}>
          <h2 className="section-title" style={{marginBottom:32}}>You May Also <em>Like</em></h2>
          <div className="grid-3">
            {BIKES.filter(b => b.id!==bike.id && b.cat===bike.cat).slice(0,3).map(b => (
              <ProductCard key={b.id} bike={b} onView={b2=>{go("detail",b2)}} onCart={onCart}/>
            ))}
          </div>
        </div>
      </div>
      <Footer go={go}/>
    </div>
  );
};

// ── CART PAGE ──
const CartPage = ({ cart, setCart, go }) => {
  const updateQty = (id, delta) => setCart(c => c.map(i => i.id===id ? {...i, qty: Math.max(1, i.qty+delta)} : i));
  const remove = id => setCart(c => c.filter(i => i.id!==id));
  const subtotal = cart.reduce((s,i) => s + i.price*i.qty, 0);
  const shipping = subtotal > 0 ? 500 : 0;
  const total = subtotal + shipping;

  return (
    <div className="page-in">
      <div className="page-top">
        <span className="eyebrow">YOUR SELECTION</span>
        <h1 className="section-title">Shopping <em>Cart</em></h1>
      </div>

      <div className="container" style={{paddingTop:40,paddingBottom:100}}>
        {cart.length === 0 ? (
          <div className="empty">
            <div style={{fontSize:72,opacity:.3}}>🛒</div>
            <h3>Your cart is empty</h3>
            <p>Discover our premium electric bikes.</p>
            <button className="cta-primary" onClick={() => go("shop")}>Browse Bikes</button>
          </div>
        ) : (
          <div className="cart-layout">
            <div>
              <p style={{color:"#8a7a6a",marginBottom:20,fontSize:14}}>{cart.length} item{cart.length!==1?"s":""} in cart</p>
              {cart.map(item => (
                <div key={item.id} className="cart-item">
                  <img
                    className="cart-item-img"
                    src={item.img}
                    alt={item.name}
                    referrerPolicy="no-referrer"
                    onError={e => imgError(e, item.color)}
                  />
                  <div className="cart-item-info">
                    <div className="cart-item-cat">{item.cat}</div>
                    <div className="cart-item-name">{item.name}</div>
                    <div className="cart-item-price">{fmt(item.price)}</div>
                    <div className="qty-row">
                      <button className="qty-b" onClick={() => updateQty(item.id,-1)}>−</button>
                      <span>{item.qty}</span>
                      <button className="qty-b" onClick={() => updateQty(item.id,1)}>+</button>
                      <span style={{color:"#8a7a6a",fontSize:13,marginLeft:8}}>= {fmt(item.price*item.qty)}</span>
                    </div>
                  </div>
                  <button className="cart-remove" onClick={() => remove(item.id)}>✕</button>
                </div>
              ))}
            </div>

            <div className="order-summary">
              <h3>Order Summary</h3>
              <div className="sum-row"><span>Subtotal</span><span>{fmt(subtotal)}</span></div>
              <div className="sum-row"><span>Delivery</span><span>{fmt(shipping)}</span></div>
              <div className="sum-row" style={{color:"#4A7C59"}}><span>Lipa Mdogo Mdogo</span><span>Available ✓</span></div>
              <div className="sum-total"><span>Total</span><span>{fmt(total)}</span></div>
              <button className="cta-primary" style={{width:"100%",justifyContent:"center",marginTop:20}} onClick={() => go("checkout")}>
                Checkout →
              </button>
              <button className="cta-outline" style={{width:"100%",justifyContent:"center",marginTop:10}} onClick={() => go("shop")}>
                ← Continue Shopping
              </button>
              <a href={WA_URL} target="_blank" rel="noopener noreferrer" className="cta-wa" style={{display:"flex",justifyContent:"center",marginTop:10}}>
                Order via WhatsApp
              </a>
            </div>
          </div>
        )}
      </div>
      <Footer go={go}/>
    </div>
  );
};

// ── CHECKOUT ──
const CheckoutPage = ({ cart, go, onSuccess }) => {
  const [pay, setPay] = useState("mpesa");
  const [placing, setPlacing] = useState(false);
  const [form, setForm] = useState({ name:"", phone:"", email:"", address:"", city:"", notes:"" });
  const setF = (k,v) => setForm(f => ({...f,[k]:v}));
  const subtotal = cart.reduce((s,i) => s + i.price*i.qty, 0);
  const total = subtotal + 500;

  const place = () => {
    if (!form.name || !form.phone || !form.address || !form.city) { alert("Please fill required fields."); return; }
    setPlacing(true);
    setTimeout(() => { setPlacing(false); onSuccess(); }, 1800);
  };

  return (
    <div className="page-in">
      <div style={{height:78}}/>
      <div className="container" style={{paddingTop:40,paddingBottom:100}}>
        <h1 className="section-title" style={{marginBottom:8}}>Secure <em>Checkout</em></h1>
        <p style={{color:"#8a7a6a",marginBottom:40}}>Complete your order — delivery right to your door.</p>

        <div className="checkout-layout">
          <div>
            <div className="form-block">
              <h3 className="form-block-title">Customer Details</h3>
              <div className="form-row">
                <div>
                  <label className="form-label">Full Name *</label>
                  <input className="form-input" placeholder="John Kamau" value={form.name} onChange={e=>setF("name",e.target.value)}/>
                </div>
                <div>
                  <label className="form-label">Phone *</label>
                  <input className="form-input" placeholder="0712 345 678" value={form.phone} onChange={e=>setF("phone",e.target.value)}/>
                </div>
              </div>
              <label className="form-label">Email</label>
              <input className="form-input" type="email" placeholder="john@email.com" value={form.email} onChange={e=>setF("email",e.target.value)}/>
            </div>

            <div className="form-block">
              <h3 className="form-block-title">Delivery</h3>
              <label className="form-label">Address *</label>
              <input className="form-input" placeholder="Street, estate, building..." value={form.address} onChange={e=>setF("address",e.target.value)}/>
              <div className="form-row" style={{marginTop:14}}>
                <div>
                  <label className="form-label">City *</label>
                  <select className="form-input form-select" value={form.city} onChange={e=>setF("city",e.target.value)}>
                    <option value="">Select city</option>
                    {["Nairobi","Mombasa","Kisumu","Nakuru","Eldoret","Thika","Machakos"].map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="form-label">Notes</label>
                  <input className="form-input" placeholder="Landmark..." value={form.notes} onChange={e=>setF("notes",e.target.value)}/>
                </div>
              </div>
            </div>

            <div className="form-block">
              <h3 className="form-block-title">Payment Method</h3>
              <div className="pay-grid">
                {[
                  { id:"mpesa",icon:"📱",label:"M-Pesa" },
                  { id:"bank",icon:"🏦",label:"Bank Transfer" },
                  { id:"lipa",icon:"⚡",label:"Lipa Mdogo" },
                  { id:"cash",icon:"💵",label:"Cash on Delivery" },
                ].map(m => (
                  <div key={m.id} className={`pay-opt ${pay===m.id?"active":""}`} onClick={() => setPay(m.id)}>
                    <span>{m.icon}</span>
                    <span>{m.label}</span>
                  </div>
                ))}
              </div>
              {pay==="lipa" && (
                <div className="pay-note">
                  ✓ A team member will contact you within 2 hours to finalize your flexible payment plan.
                </div>
              )}
            </div>
          </div>

          <div className="order-summary" style={{alignSelf:"flex-start",position:"sticky",top:100}}>
            <h3>Order Summary</h3>
            {cart.map(item => (
              <div key={item.id} className="checkout-item">
                <img
                  src={item.img}
                  alt={item.name}
                  className="checkout-item-img"
                  referrerPolicy="no-referrer"
                  onError={e => imgError(e, item.color)}
                />
                <div style={{flex:1}}>
                  <div style={{fontWeight:700,fontSize:13}}>{item.name}</div>
                  <div style={{color:"#8a7a6a",fontSize:12}}>Qty: {item.qty}</div>
                </div>
                <div style={{color:"#C4531A",fontWeight:800,fontSize:14}}>{fmt(item.price*item.qty)}</div>
              </div>
            ))}
            <div className="sum-row"><span>Subtotal</span><span>{fmt(subtotal)}</span></div>
            <div className="sum-row"><span>Delivery</span><span>KSh 500</span></div>
            <div className="sum-total"><span>Total</span><span>{fmt(total)}</span></div>
            <button className="cta-primary" style={{width:"100%",justifyContent:"center",marginTop:20}} onClick={place} disabled={placing}>
              {placing ? "Processing..." : "Place Order →"}
            </button>
            <p style={{textAlign:"center",color:"#8a7a6a",fontSize:11,marginTop:12}}>🔒 Secure checkout · All transactions protected</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// ── SUCCESS MODAL ──
const SuccessModal = ({ go }) => (
  <div className="modal-bg">
    <div className="modal">
      <div className="modal-icon">🎉</div>
      <h2 className="modal-title">Order Placed!</h2>
      <p className="modal-desc">Our team will contact you within 2 hours to confirm delivery. You'll receive a WhatsApp confirmation shortly.</p>
      <a href={WA_URL} target="_blank" rel="noopener noreferrer" className="cta-wa" style={{display:"flex",justifyContent:"center",marginBottom:12}}>
        Chat on WhatsApp
      </a>
      <button className="cta-outline" style={{width:"100%",justifyContent:"center"}} onClick={() => go("home")}>
        Return to Home
      </button>
    </div>
  </div>
);

// ── ACCOUNT PAGE ──
const AccountPage = ({ go }) => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [tab, setTab] = useState("orders");
  const [authMode, setAuthMode] = useState("login");
  const [showPw, setShowPw] = useState(false);
  const [creds, setCreds] = useState({ email:"", password:"", name:"" });

  const ORDERS = [
    { id:"EB-2025-001", date:"Jan 15, 2025", items:["Thunderbolt X1 Pro"], total:85000, status:"delivered" },
    { id:"EB-2025-002", date:"Feb 20, 2025", items:["CityRider S2 Elite"], total:65000, status:"transit" },
    { id:"EB-2025-003", date:"Mar 01, 2025", items:["EcoRide Classic C1"], total:45000, status:"processing" },
  ];

  if (!loggedIn) return (
    <div className="page-in">
      <div className="page-top">
        <span className="eyebrow">MY ACCOUNT</span>
        <h1 className="section-title">Welcome <em>Back</em></h1>
      </div>
      <div className="container" style={{paddingTop:40,paddingBottom:100}}>
        <div className="auth-box">
          <div className="auth-switch">
            <button className={`auth-sw ${authMode==="login"?"active":""}`} onClick={() => setAuthMode("login")}>Sign In</button>
            <button className={`auth-sw ${authMode==="register"?"active":""}`} onClick={() => setAuthMode("register")}>Register</button>
          </div>

          {authMode==="register" && (
            <div style={{marginBottom:16}}>
              <label className="form-label">Full Name</label>
              <input className="form-input" placeholder="John Kamau" value={creds.name} onChange={e=>setCreds(c=>({...c,name:e.target.value}))}/>
            </div>
          )}
          <label className="form-label">Email Address</label>
          <input className="form-input" type="email" placeholder="john@email.com" value={creds.email} onChange={e=>setCreds(c=>({...c,email:e.target.value}))} style={{marginBottom:16}}/>
          <label className="form-label">Password</label>
          <div style={{position:"relative",marginBottom:28}}>
            <input className="form-input" type={showPw?"text":"password"} placeholder="Enter password" value={creds.password} onChange={e=>setCreds(c=>({...c,password:e.target.value}))} style={{paddingRight:44}}/>
            <button style={{position:"absolute",right:14,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",color:"#8a7a6a",fontSize:16}} onClick={() => setShowPw(!showPw)}>
              {showPw?"🙈":"👁"}
            </button>
          </div>

          <button className="cta-primary" style={{width:"100%",justifyContent:"center"}} onClick={() => setLoggedIn(true)}>
            {authMode==="login"?"Sign In →":"Create Account →"}
          </button>
          <div style={{textAlign:"center",margin:"20px 0",color:"#8a7a6a",fontSize:13}}>or</div>
          <a href={WA_URL} target="_blank" rel="noopener noreferrer" className="cta-wa" style={{display:"flex",justifyContent:"center"}}>
            Continue via WhatsApp
          </a>
        </div>
      </div>
      <Footer go={go}/>
    </div>
  );

  return (
    <div className="page-in">
      <div className="page-top">
        <span className="eyebrow">MY ACCOUNT</span>
        <h1 className="section-title">My <em>Dashboard</em></h1>
      </div>
      <div className="container" style={{paddingTop:40,paddingBottom:100}}>
        <div className="account-layout">
          <div className="account-side">
            <div className="account-avatar">JK</div>
            <div className="account-name">John Kamau</div>
            <div className="account-email">john@email.com</div>
            {[
              {id:"orders",label:"My Orders"},
              {id:"profile",label:"Profile"},
              {id:"lipa",label:"Lipa Mdogo Mdogo"},
              {id:"wishlist",label:"Wishlist"},
            ].map(t => (
              <button key={t.id} className={`acc-tab ${tab===t.id?"active":""}`} onClick={() => setTab(t.id)}>{t.label}</button>
            ))}
            <button className="acc-tab danger" onClick={() => setLoggedIn(false)}>Sign Out</button>
          </div>

          <div className="account-main">
            {tab==="orders" && (
              <div>
                <h2 className="panel-title">Order History</h2>
                {ORDERS.map(o => (
                  <div key={o.id} className="order-row">
                    <div>
                      <div className="order-id">{o.id}</div>
                      <div style={{color:"#8a7a6a",fontSize:12,marginTop:2}}>{o.date}</div>
                    </div>
                    <div style={{flex:1,padding:"0 20px",color:"#c8b89a",fontSize:14}}>{o.items.join(", ")}</div>
                    <div style={{textAlign:"right"}}>
                      <div style={{color:"#C4531A",fontWeight:800}}>{fmt(o.total)}</div>
                      <span className={`order-status ${o.status}`}>{
                        o.status==="delivered"?"✓ Delivered":
                        o.status==="transit"?"🚚 In Transit":
                        "⏳ Processing"
                      }</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {tab==="profile" && (
              <div>
                <h2 className="panel-title">Edit Profile</h2>
                <div className="form-block">
                  <div className="form-row">
                    <div><label className="form-label">First Name</label><input className="form-input" defaultValue="John"/></div>
                    <div><label className="form-label">Last Name</label><input className="form-input" defaultValue="Kamau"/></div>
                  </div>
                  <label className="form-label" style={{marginTop:14,display:"block"}}>Email</label>
                  <input className="form-input" defaultValue="john@email.com"/>
                  <button className="cta-primary" style={{marginTop:20}}>Save Changes</button>
                </div>
              </div>
            )}
            {tab==="lipa" && (
              <div className="empty" style={{padding:"60px 0"}}>
                <div style={{fontSize:52,opacity:.4}}>⚡</div>
                <h3>No Active Plans</h3>
                <p>Start your Lipa Mdogo Mdogo journey. 20% deposit, ride today.</p>
                <a href={WA_URL} target="_blank" rel="noopener noreferrer" className="cta-wa" style={{display:"inline-flex",marginTop:20}}>
                  Apply on WhatsApp
                </a>
              </div>
            )}
            {tab==="wishlist" && (
              <div className="empty" style={{padding:"60px 0"}}>
                <div style={{fontSize:52,opacity:.4}}>♡</div>
                <h3>Your wishlist is empty</h3>
                <p>Save bikes you love for easy access later.</p>
                <button className="cta-primary" style={{marginTop:20}} onClick={() => go("shop")}>Browse Bikes</button>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer go={go}/>
    </div>
  );
};

// ── ROOT ──
export default function App() {
  const [page, setPage] = useState("home");
  const [selectedBike, setSelectedBike] = useState(null);
  const [cart, setCart] = useState([]);
  const [toast, setToast] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const go = (p, data=null) => {
    setPage(p);
    if (data) setSelectedBike(data);
    window.scrollTo({ top:0, behavior:"smooth" });
  };

  const addToCart = (bike, qty=1) => {
    setCart(c => {
      const ex = c.find(i => i.id===bike.id);
      return ex ? c.map(i => i.id===bike.id ? {...i, qty:i.qty+qty} : i) : [...c, {...bike, qty}];
    });
    setToast(`${bike.name} added to cart`);
  };

  const viewBike = bike => { setSelectedBike(bike); setPage("detail"); window.scrollTo({top:0,behavior:"smooth"}); };
  const cartCount = cart.reduce((s,i) => s+i.qty, 0);

  return (
    <>
      <Navbar page={page} go={go} cartCount={cartCount}/>

      {/* Floating WA */}
      <a href={WA_URL} target="_blank" rel="noopener noreferrer" className="float-wa" title="Chat on WhatsApp">
        <svg width="26" height="26" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
      </a>

      {page==="home"     && <HomePage go={go} onCart={addToCart} onView={viewBike}/>}
      {page==="shop"     && <ShopPage go={go} onCart={addToCart} onView={viewBike}/>}
      {page==="detail"   && selectedBike && <ProductDetail bike={selectedBike} go={go} onCart={addToCart}/>}
      {page==="cart"     && <CartPage cart={cart} setCart={setCart} go={go}/>}
      {page==="checkout" && (
        cart.length===0
          ? <div className="page-in"><div className="empty" style={{paddingTop:160}}><div style={{fontSize:72,opacity:.3}}>🛒</div><h3>Cart is empty</h3><button className="cta-primary" style={{marginTop:20}} onClick={()=>go("shop")}>Browse Bikes</button></div></div>
          : <CheckoutPage cart={cart} go={go} onSuccess={() => { setShowSuccess(true); setCart([]); }}/>
      )}
      {page==="account"  && <AccountPage go={go}/>}

      {showSuccess && <SuccessModal go={p => { setShowSuccess(false); go(p); }}/>}
      {toast       && <Toast msg={toast} onHide={() => setToast(null)}/>}
    </>
  );
}
