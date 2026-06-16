import { useState, useEffect, useCallback } from "react";

const C = {
  black: "#050505", charcoal: "#0d0d0f", surface: "#111115", surfaceHigh: "#1a1a20",
  red: "#8B0000", redBright: "#c0392b", gold: "#D4A24C", goldLight: "#e8c06e",
  white: "#f0ede8", muted: "#6b6b7a",
};
const LOGO_URL = "https://customer-assets.emergentagent.com/job_bgmi-esports-hub-4/artifacts/90hdzj1q_ZEROLT%20ZRT%20%E2%9A%94%EF%B8%8F%F0%9F%94%B1%2020260612_191635.jpg";

const WEBHOOK_URL = "https://discord.com/api/webhooks/1516283284378882068/vUMpj_77HA2TqAWGyHs49LJ_UHYzobzHKcs13ngGqc7iVd8oaDdfmsKe_1Pj-tpN_2FS";

async function sendToDiscord(reg) {
  const colorMap = { TOURNAMENT: 0xD4A24C, SCRIM: 0x8B0000 };
  const eventType = reg.eventName?.toUpperCase().includes("SCRIM") ? "SCRIM" : "TOURNAMENT";
  const payload = {
    username: "ZEROLT eSports",
    avatar_url: LOGO_URL,
    embeds: [{
      title: `⚔️ New Registration — ${reg.eventName}`,
      color: colorMap[eventType] ?? 0xD4A24C,
      fields: [
        { name: "🏷️ Team Name", value: `**${reg.teamName}**`, inline: true },
        { name: "👑 Captain", value: reg.userName, inline: true },
        { name: "📞 Contact", value: reg.contact || "—", inline: true },
        { name: "👥 Players", value: reg.players.map((p, i) => `${i + 1}. ${p.name}${p.uid ? ` *(${p.uid})*` : ""}`).join("\n") || "—", inline: false },
        { name: "🎮 Event", value: reg.eventName, inline: true },
        { name: "📅 Date", value: reg.date, inline: true },
        { name: "🟡 Status", value: "**Pending Review**", inline: true },
      ],
      footer: { text: "ZEROLT eSports · ZRT ⚔" },
      timestamp: new Date().toISOString(),
    }]
  };
  try {
    await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch (e) {
    console.error("Discord webhook error:", e);
  }
}

async function sendStatusToDiscord(reg, status) {
  const color = status === "approved" ? 0x2ecc40 : 0x8B0000;
  const emoji = status === "approved" ? "✅" : "❌";
  const payload = {
    username: "ZEROLT eSports",
    avatar_url: LOGO_URL,
    embeds: [{
      title: `${emoji} Registration ${status.toUpperCase()} — ${reg.eventName}`,
      color,
      fields: [
        { name: "Team", value: `**${reg.teamName}**`, inline: true },
        { name: "Captain", value: reg.userName, inline: true },
        { name: "Event", value: reg.eventName, inline: true },
      ],
      footer: { text: "ZEROLT eSports Admin · ZRT ⚔" },
      timestamp: new Date().toISOString(),
    }]
  };
  try {
    await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch (e) {
    console.error("Discord webhook error:", e);
  }
}

// ── Seed data ──────────────────────────────────────────────────
const SEED_ANN = [
  { id: "a1", title: "Season 3 Weekly Tournament — Registration Open", body: "All teams must register before June 20. Entry fee ₹200/team. Slots limited to 25 teams. DM ZRT admin on Discord to lock your slot.", date: "2026-06-15", tag: "TOURNAMENT" },
  { id: "a2", title: "Scrim Night — Friday 10 PM", body: "Custom rooms every Friday at 22:00 IST. Password drops in #scrim-room 15 min before. All ranks welcome.", date: "2026-06-13", tag: "SCRIM" },
  { id: "a3", title: "New Rule: No Teaming in Scrims", body: "Effective immediately, teaming within scrims is a permanent ban. Screenshots as proof must be submitted within 10 minutes of the incident.", date: "2026-06-10", tag: "RULE" },
];
const SEED_TEAMS = [
  { id: "t1", name: "PHANTOM SQUAD", slot: "A1", points: 148, matches: 8, wins: 4, players: [{ name: "ViperX", kills: 62, kd: 4.2, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=viper&backgroundColor=b6e3f4" }, { name: "ShadowKing", kills: 54, kd: 3.8, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=shadow&backgroundColor=b6e3f4" }, { name: "NightCrawler", kills: 47, kd: 3.1, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=night&backgroundColor=b6e3f4" }, { name: "DeathMark", kills: 39, kd: 2.7, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=death&backgroundColor=b6e3f4" }] },
  { id: "t2", name: "IRON WOLVES", slot: "B3", points: 134, matches: 8, wins: 3, players: [{ name: "BladeRunner", kills: 58, kd: 3.9, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=blade&backgroundColor=ffd5dc" }, { name: "StormEye", kills: 49, kd: 3.3, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=storm&backgroundColor=ffd5dc" }, { name: "FrostByte", kills: 43, kd: 2.9, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=frost&backgroundColor=ffd5dc" }, { name: "RedAlert", kills: 35, kd: 2.4, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=alert&backgroundColor=ffd5dc" }] },
  { id: "t3", name: "CRIMSON ACE", slot: "C2", points: 119, matches: 8, wins: 3, players: [{ name: "HexShot", kills: 51, kd: 3.6, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=hex&backgroundColor=d1f4d1" }, { name: "GhostWire", kills: 44, kd: 3.0, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=ghost&backgroundColor=d1f4d1" }, { name: "AceKing", kills: 40, kd: 2.8, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=ace&backgroundColor=d1f4d1" }, { name: "ZeroHour", kills: 32, kd: 2.2, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=zero&backgroundColor=d1f4d1" }] },
  { id: "t4", name: "DARK SAINTS", slot: "D4", points: 102, matches: 8, wins: 2, players: [{ name: "VortexX", kills: 46, kd: 3.2, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=vortex&backgroundColor=ffe4b5" }, { name: "Reckoner", kills: 39, kd: 2.6, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=reck&backgroundColor=ffe4b5" }, { name: "ColdBlood", kills: 34, kd: 2.3, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=cold&backgroundColor=ffe4b5" }, { name: "LastStand", kills: 28, kd: 1.9, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=last&backgroundColor=ffe4b5" }] },
  { id: "t5", name: "SERPENT LEGION", slot: "E5", points: 88, matches: 8, wins: 1, players: [{ name: "KingCobra", kills: 40, kd: 2.8, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=cobra&backgroundColor=e8d5ff" }, { name: "PoisonArrow", kills: 35, kd: 2.4, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=poison&backgroundColor=e8d5ff" }, { name: "Venom", kills: 30, kd: 2.0, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=venom&backgroundColor=e8d5ff" }, { name: "SilentFang", kills: 25, kd: 1.7, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=fang&backgroundColor=e8d5ff" }] },
];
const SEED_SCHEDULE = [
  { id: "s1", name: "ZRT Weekly #12", type: "TOURNAMENT", date: "2026-06-20", time: "20:00", prize: "₹5,000", mode: "TPP Squad", map: "Erangel", totalSlots: 25 },
  { id: "s2", name: "Friday Scrim Night", type: "SCRIM", date: "2026-06-21", time: "22:00", prize: "—", mode: "FPP Squad", map: "Miramar", totalSlots: 25 },
  { id: "s3", name: "ZRT Pro League S3", type: "TOURNAMENT", date: "2026-06-28", time: "19:00", prize: "₹12,000", mode: "TPP Squad", map: "Vikendi", totalSlots: 20 },
  { id: "s4", name: "Friday Scrim Night", type: "SCRIM", date: "2026-06-28", time: "22:00", prize: "—", mode: "TPP Squad", map: "Sanhok", totalSlots: 25 },
  { id: "s5", name: "ZRT Championship Open", type: "TOURNAMENT", date: "2026-07-05", time: "18:00", prize: "₹25,000", mode: "TPP Squad", map: "Erangel", totalSlots: 16 },
];

// ── Storage helpers ────────────────────────────────────────────
const SK = { ann: "zrt-ann", teams: "zrt-teams", sched: "zrt-sched", regs: "zrt-regs", users: "zrt-users" };

async function sGet(key, seed) {
  try { const r = await window.storage.get(key); return r ? JSON.parse(r.value) : seed; }
  catch { return seed; }
}
async function sSet(key, val) {
  try { await window.storage.set(key, JSON.stringify(val)); } catch {}
}

let _uid = Date.now();
const uid = () => String(++_uid);
const fmtDate = (d) => new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
const getDay = (d) => new Date(d).getDate();
const getMon = (d) => new Date(d).toLocaleString("en-US", { month: "short" }).toUpperCase();

// ── Global CSS ─────────────────────────────────────────────────
const GS = `
@import url('https://fonts.googleapis.com/css2?family=Oxanium:wght@400;600;700;800&family=Rajdhani:wght@400;500;600;700&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
body{background:${C.black};color:${C.white};font-family:'Rajdhani',sans-serif}
::-webkit-scrollbar{width:4px}::-webkit-scrollbar-track{background:${C.charcoal}}::-webkit-scrollbar-thumb{background:${C.red}}
.app{min-height:100vh;background:${C.black};overflow-x:hidden}

/* NAV */
.nav{position:fixed;top:0;left:0;right:0;z-index:100;background:rgba(5,5,5,0.93);backdrop-filter:blur(12px);border-bottom:1px solid rgba(212,162,76,0.15);display:flex;align-items:center;justify-content:space-between;padding:0 1.5rem;height:62px}
.nav-brand{display:flex;align-items:center;gap:10px;cursor:pointer}
.nav-logo{width:40px;height:40px;object-fit:cover;clip-path:polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%);border:2px solid ${C.gold}}
.nav-title{font-family:'Oxanium',sans-serif;font-weight:800;font-size:1.2rem;color:${C.gold};letter-spacing:.12em}
.nav-title span{color:${C.white}}
.nav-links{display:flex;gap:.1rem}
.nl{font-family:'Rajdhani',sans-serif;font-weight:600;font-size:.82rem;letter-spacing:.08em;padding:6px 12px;color:${C.muted};background:none;border:none;cursor:pointer;text-transform:uppercase;transition:color .2s}
.nl:hover,.nl.on{color:${C.gold}}
.nav-right{display:flex;gap:8px;align-items:center}
.admin-chip{font-family:'Oxanium',sans-serif;font-size:.6rem;padding:2px 8px;background:rgba(212,162,76,.12);color:${C.gold};border:1px solid rgba(212,162,76,.25);letter-spacing:.1em;text-transform:uppercase}

/* BUTTONS */
.btn{font-family:'Oxanium',sans-serif;font-weight:700;font-size:.78rem;letter-spacing:.1em;text-transform:uppercase;border:none;cursor:pointer;transition:all .2s;clip-path:polygon(0 0,calc(100% - 8px) 0,100% 8px,100% 100%,8px 100%,0 calc(100% - 8px))}
.btn-gold{background:${C.gold};color:${C.black};padding:10px 22px}
.btn-gold:hover{background:${C.goldLight}}
.btn-red{background:${C.red};color:${C.white};padding:10px 22px}
.btn-red:hover{background:${C.redBright}}
.btn-outline{background:transparent;color:${C.gold};border:1px solid ${C.gold};padding:9px 22px}
.btn-outline:hover{background:rgba(212,162,76,.1)}
.btn-ghost{background:transparent;color:${C.muted};border:1px solid rgba(255,255,255,.1);padding:9px 22px}
.btn-ghost:hover{color:${C.white};border-color:rgba(255,255,255,.3)}
.btn-danger{background:rgba(139,0,0,.3);color:#ff6b6b;border:1px solid rgba(139,0,0,.5)}
.btn-danger:hover{background:rgba(139,0,0,.6)}
.sm{font-size:.7rem!important;padding:6px 14px!important}
.full{width:100%}

/* HERO */
.hero{position:relative;min-height:100vh;display:flex;align-items:center;justify-content:center;overflow:hidden;padding-top:62px}
.hero-bg{position:absolute;inset:0;background:linear-gradient(135deg,#050505 0%,#1a0505 40%,#0d0005 70%,#050505 100%)}
.hero-wm{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;opacity:.055}
.hero-wm img{width:78vmin;height:78vmin;object-fit:contain;filter:sepia(1) saturate(2) hue-rotate(330deg)}
.hero-glow{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:580px;height:580px;background:radial-gradient(ellipse,rgba(139,0,0,.17) 0%,transparent 70%);border-radius:50%}
.hero-c{position:relative;z-index:2;text-align:center;padding:2rem;max-width:900px}
.eyebrow{font-family:'Oxanium',sans-serif;font-size:.72rem;letter-spacing:.3em;color:${C.gold};text-transform:uppercase;margin-bottom:1rem}
.hero-title{font-family:'Oxanium',sans-serif;font-weight:800;font-size:clamp(3rem,8vw,6.5rem);line-height:.95;color:${C.white};text-transform:uppercase;margin-bottom:1rem}
.hero-title .acc{color:${C.gold}}
.hero-title .sm2{font-size:.42em;display:block;color:${C.muted};letter-spacing:.25em;margin-top:.4em}
.hero-logo{width:130px;height:130px;object-fit:cover;clip-path:polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%);border:3px solid ${C.gold};box-shadow:0 0 40px rgba(212,162,76,.28);margin:1.5rem auto}
.hero-sub{font-size:1.1rem;color:${C.muted};max-width:480px;margin:0 auto 2rem;letter-spacing:.04em}
.hero-cta{display:flex;gap:12px;justify-content:center;flex-wrap:wrap}
.hero-stats{display:flex;gap:2px;margin-top:3.5rem}
.hstat{flex:1;background:rgba(255,255,255,.02);border:1px solid rgba(212,162,76,.1);padding:1.1rem;text-align:center;clip-path:polygon(0 0,calc(100% - 6px) 0,100% 6px,100% 100%,6px 100%,0 calc(100% - 6px))}
.hstat-v{font-family:'Oxanium',sans-serif;font-size:1.7rem;font-weight:800;color:${C.gold}}
.hstat-l{font-size:.68rem;text-transform:uppercase;letter-spacing:.15em;color:${C.muted};margin-top:2px}

/* SECTIONS */
.sec{padding:5rem 2rem;max-width:1200px;margin:0 auto}
.sec-hd{margin-bottom:2.5rem}
.sec-ey{font-family:'Oxanium',sans-serif;font-size:.7rem;letter-spacing:.3em;text-transform:uppercase;color:${C.gold};margin-bottom:.5rem;display:flex;align-items:center;gap:10px}
.sec-ey::before{content:'';display:block;width:22px;height:2px;background:${C.gold}}
.sec-title{font-family:'Oxanium',sans-serif;font-size:clamp(1.5rem,3.5vw,2.3rem);font-weight:800;text-transform:uppercase;color:${C.white}}
.divider{height:1px;background:linear-gradient(90deg,transparent,rgba(212,162,76,.3),transparent);margin:.8rem 0}
.sec-row{display:flex;justify-content:space-between;align-items:flex-end}

/* ANN */
.ann-grid{display:grid;gap:10px}
.ann-card{background:${C.surface};border:1px solid rgba(139,0,0,.22);clip-path:polygon(0 0,calc(100% - 12px) 0,100% 12px,100% 100%,12px 100%,0 calc(100% - 12px));padding:1.4rem;position:relative;overflow:hidden;transition:border-color .2s}
.ann-card::before{content:'';position:absolute;left:0;top:0;bottom:0;width:3px;background:linear-gradient(180deg,${C.gold},${C.red})}
.ann-card:hover{border-color:rgba(212,162,76,.3)}
.ann-top{display:flex;align-items:flex-start;justify-content:space-between;gap:1rem;margin-bottom:.7rem}
.tag{font-family:'Oxanium',sans-serif;font-size:.62rem;letter-spacing:.12em;padding:3px 9px;font-weight:700}
.tag.TOURNAMENT{background:rgba(212,162,76,.14);color:${C.gold};border:1px solid rgba(212,162,76,.28)}
.tag.SCRIM{background:rgba(139,0,0,.18);color:#ff7070;border:1px solid rgba(139,0,0,.38)}
.tag.RULE{background:rgba(255,255,255,.04);color:${C.muted};border:1px solid rgba(255,255,255,.09)}
.ann-date{font-size:.76rem;color:${C.muted};white-space:nowrap}
.ann-title{font-family:'Oxanium',sans-serif;font-size:.95rem;font-weight:700;color:${C.white};margin-bottom:.45rem}
.ann-body{font-size:.92rem;color:#8a8a9a;line-height:1.6}
.ann-acts{display:flex;gap:8px;margin-top:.9rem}

/* STANDINGS */
.stands{display:grid;gap:8px}
.tc{background:${C.surface};border:1px solid rgba(255,255,255,.06);clip-path:polygon(0 0,calc(100% - 14px) 0,100% 14px,100% 100%,14px 100%,0 calc(100% - 14px));overflow:hidden;transition:border-color .2s}
.tc:hover{border-color:rgba(212,162,76,.18)}
.tc.r1{border-color:rgba(212,162,76,.42);background:linear-gradient(135deg,rgba(212,162,76,.055) 0%,${C.surface} 40%)}
.tc.r2{border-color:rgba(192,192,192,.28)}
.tc.r3{border-color:rgba(205,127,50,.28)}
.tc-hd{display:grid;grid-template-columns:50px 1fr repeat(3,72px) 90px;align-items:center;gap:.8rem;padding:.9rem 1.2rem;cursor:pointer}
.tc-rank{font-family:'Oxanium',sans-serif;font-size:1.4rem;font-weight:800;color:${C.muted};text-align:center}
.tc-rank.g{color:${C.gold}}.tc-rank.s{color:#c0c0c0}.tc-rank.b{color:#cd7f32}
.tc-name{font-family:'Oxanium',sans-serif;font-size:.9rem;font-weight:700;color:${C.white};text-transform:uppercase;letter-spacing:.07em}
.tc-slot{font-size:.68rem;color:${C.muted};letter-spacing:.1em}
.sc{text-align:center}
.sc-v{font-family:'Oxanium',sans-serif;font-size:.95rem;font-weight:700;color:${C.white}}
.sc-v.gold{color:${C.gold}}
.sc-l{font-size:.62rem;text-transform:uppercase;letter-spacing:.1em;color:${C.muted}}
.tc-acts{display:flex;gap:5px;align-items:center;justify-content:flex-end}
.chev{font-size:.68rem;color:${C.muted};transition:transform .2s;margin-left:4px}
.chev.open{transform:rotate(180deg)}
.players-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(190px,1fr));gap:1px;border-top:1px solid rgba(255,255,255,.05)}
.pc{background:${C.charcoal};padding:.9rem;display:flex;align-items:center;gap:10px}
.pavatar{width:42px;height:42px;clip-path:polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%);flex-shrink:0;overflow:hidden;background:${C.surfaceHigh}}
.pavatar img{width:100%;height:100%;object-fit:cover}
.pname{font-family:'Oxanium',sans-serif;font-size:.76rem;font-weight:700;color:${C.white};text-transform:uppercase}
.pstats{display:flex;gap:6px;margin-top:3px}
.pchip{font-size:.68rem;padding:2px 7px}
.pchip.k{background:rgba(139,0,0,.22);color:#ff8080;border:1px solid rgba(139,0,0,.38)}
.pchip.kd{background:rgba(212,162,76,.13);color:${C.gold};border:1px solid rgba(212,162,76,.28)}

/* SCHEDULE */
.sched-grid{display:grid;gap:8px}
.sc-card{background:${C.surface};border:1px solid rgba(255,255,255,.06);clip-path:polygon(0 0,calc(100% - 10px) 0,100% 10px,100% 100%,10px 100%,0 calc(100% - 10px));padding:1rem 1.3rem;display:grid;grid-template-columns:56px 1fr auto;align-items:center;gap:1.3rem;transition:border-color .2s}
.sc-card:hover{border-color:rgba(212,162,76,.18)}
.sc-date{text-align:center;min-width:48px}
.sc-day{font-family:'Oxanium',sans-serif;font-size:1.45rem;font-weight:800;color:${C.white};line-height:1}
.sc-mon{font-size:.68rem;text-transform:uppercase;letter-spacing:.15em;color:${C.muted}}
.sc-name{font-family:'Oxanium',sans-serif;font-size:.9rem;font-weight:700;color:${C.white}}
.sc-meta{display:flex;flex-wrap:wrap;gap:7px;margin-top:4px}
.sc-mi{font-size:.72rem;color:${C.muted}}
.sc-right{text-align:right}
.sc-prize{font-family:'Oxanium',sans-serif;font-size:1.05rem;font-weight:700;color:${C.gold}}
.sc-slots{font-size:.7rem;margin-top:3px}
.slots-full{color:#ff7070}.slots-ok{color:${C.muted}}
.tbadge{display:inline-block;font-family:'Oxanium',sans-serif;font-size:.6rem;letter-spacing:.12em;padding:2px 8px;text-transform:uppercase;font-weight:700;margin-bottom:4px}
.tbadge.TOURNAMENT{background:rgba(212,162,76,.14);color:${C.gold};border:1px solid rgba(212,162,76,.28)}
.tbadge.SCRIM{background:rgba(139,0,0,.18);color:#ff7070;border:1px solid rgba(139,0,0,.38)}

/* REGISTRATION */
.reg-card{background:${C.surface};border:1px solid rgba(212,162,76,.18);clip-path:polygon(0 0,calc(100% - 14px) 0,100% 14px,100% 100%,14px 100%,0 calc(100% - 14px));padding:2rem}
.reg-title{font-family:'Oxanium',sans-serif;font-size:1.1rem;font-weight:800;text-transform:uppercase;color:${C.gold};margin-bottom:.3rem}
.reg-sub{font-size:.85rem;color:${C.muted};font-family:'Rajdhani',sans-serif;margin-bottom:1.5rem}
.players-input{display:grid;gap:6px}
.player-row{display:grid;grid-template-columns:auto 1fr 80px 70px;gap:8px;align-items:center}
.pnum{font-family:'Oxanium',sans-serif;font-size:.7rem;color:${C.muted};width:18px;text-align:right}
.pi-name{background:${C.charcoal};border:1px solid rgba(255,255,255,.1);color:${C.white};font-family:'Rajdhani',sans-serif;font-size:.88rem;padding:7px 10px;outline:none;clip-path:polygon(0 0,calc(100% - 5px) 0,100% 5px,100% 100%,5px 100%,0 calc(100% - 5px));transition:border-color .2s;width:100%}
.pi-name:focus{border-color:rgba(212,162,76,.35)}
.pi-name::placeholder{color:${C.muted}}
.pi-num{background:${C.charcoal};border:1px solid rgba(255,255,255,.1);color:${C.white};font-family:'Rajdhani',sans-serif;font-size:.88rem;padding:7px 10px;outline:none;width:100%;transition:border-color .2s}
.pi-num:focus{border-color:rgba(212,162,76,.35)}
.reg-badge{display:inline-block;font-family:'Oxanium',sans-serif;font-size:.62rem;padding:3px 10px;font-weight:700;letter-spacing:.1em;text-transform:uppercase}
.reg-badge.pending{background:rgba(212,162,76,.12);color:${C.gold};border:1px solid rgba(212,162,76,.28)}
.reg-badge.approved{background:rgba(0,180,0,.1);color:#5ef05e;border:1px solid rgba(0,180,0,.28)}
.reg-badge.rejected{background:rgba(139,0,0,.18);color:#ff7070;border:1px solid rgba(139,0,0,.35)}

/* ADMIN */
.adm-page{padding-top:62px;min-height:100vh;background:${C.black}}
.adm-hd{background:linear-gradient(135deg,rgba(139,0,0,.13) 0%,transparent 60%);border-bottom:1px solid rgba(212,162,76,.1);padding:1.8rem 2rem}
.adm-title{font-family:'Oxanium',sans-serif;font-size:1.7rem;font-weight:800;text-transform:uppercase;color:${C.white}}
.adm-title span{color:${C.gold}}
.adm-tabs{display:flex;gap:2px;padding:.8rem 2rem;border-bottom:1px solid rgba(255,255,255,.06);overflow-x:auto}
.adm-tab{font-family:'Oxanium',sans-serif;font-size:.75rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;padding:7px 18px;background:none;border:1px solid transparent;cursor:pointer;color:${C.muted};clip-path:polygon(0 0,calc(100% - 5px) 0,100% 5px,100% 100%,5px 100%,0 calc(100% - 5px));transition:all .2s;white-space:nowrap}
.adm-tab:hover{color:${C.gold};border-color:rgba(212,162,76,.18)}
.adm-tab.on{background:rgba(212,162,76,.1);color:${C.gold};border-color:rgba(212,162,76,.32)}
.adm-body{padding:1.5rem 2rem;max-width:1000px}
.adm-form{background:${C.surface};border:1px solid rgba(255,255,255,.06);clip-path:polygon(0 0,calc(100% - 12px) 0,100% 12px,100% 100%,12px 100%,0 calc(100% - 12px));padding:1.4rem;margin-bottom:1.8rem}
.adm-form-title{font-family:'Oxanium',sans-serif;font-size:.85rem;font-weight:700;text-transform:uppercase;color:${C.gold};letter-spacing:.08em;margin-bottom:1rem}
.form-acts{display:flex;gap:8px;margin-top:.9rem}
.reg-table{width:100%;border-collapse:collapse}
.reg-table th{font-family:'Oxanium',sans-serif;font-size:.65rem;letter-spacing:.12em;text-transform:uppercase;color:${C.muted};padding:.6rem .8rem;text-align:left;border-bottom:1px solid rgba(255,255,255,.06)}
.reg-table td{font-family:'Rajdhani',sans-serif;font-size:.88rem;color:${C.white};padding:.7rem .8rem;border-bottom:1px solid rgba(255,255,255,.04)}
.reg-table tr:hover td{background:rgba(255,255,255,.02)}
.players-list{font-size:.8rem;color:${C.muted};margin-top:2px}

/* FORM ELEMENTS */
.fg{margin-bottom:1rem}
.fl{font-family:'Rajdhani',sans-serif;font-size:.75rem;text-transform:uppercase;letter-spacing:.1em;color:${C.muted};display:block;margin-bottom:5px}
.fi{width:100%;background:${C.charcoal};border:1px solid rgba(255,255,255,.1);color:${C.white};font-family:'Rajdhani',sans-serif;font-size:.92rem;padding:9px 13px;outline:none;clip-path:polygon(0 0,calc(100% - 6px) 0,100% 6px,100% 100%,6px 100%,0 calc(100% - 6px));transition:border-color .2s}
.fi:focus{border-color:rgba(212,162,76,.38)}
.fi::placeholder{color:${C.muted}}
.ta{width:100%;background:${C.charcoal};border:1px solid rgba(255,255,255,.1);color:${C.white};font-family:'Rajdhani',sans-serif;font-size:.92rem;padding:9px 13px;outline:none;resize:vertical;min-height:80px;transition:border-color .2s}
.ta:focus{border-color:rgba(212,162,76,.38)}
.sel{width:100%;background:${C.charcoal};border:1px solid rgba(255,255,255,.1);color:${C.white};font-family:'Rajdhani',sans-serif;font-size:.92rem;padding:9px 13px;outline:none;cursor:pointer}
.sel:focus{border-color:rgba(212,162,76,.38)}
.fr{display:grid;grid-template-columns:1fr 1fr;gap:10px}

/* AUTH */
.auth-ov{position:fixed;inset:0;background:rgba(0,0,0,.84);z-index:200;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(6px)}
.auth-box{background:${C.surface};border:1px solid rgba(212,162,76,.2);clip-path:polygon(0 0,calc(100% - 16px) 0,100% 16px,100% 100%,16px 100%,0 calc(100% - 16px));padding:2.2rem;width:100%;max-width:390px;position:relative}
.auth-title{font-family:'Oxanium',sans-serif;font-size:1.35rem;font-weight:800;text-transform:uppercase;color:${C.white};margin-bottom:.2rem}
.auth-sub{font-size:.82rem;color:${C.muted};margin-bottom:1.7rem}
.auth-err{background:rgba(139,0,0,.18);border:1px solid rgba(139,0,0,.38);color:#ff8080;padding:9px;font-size:.82rem;margin-bottom:.9rem;font-family:'Rajdhani',sans-serif}
.auth-sw{text-align:center;margin-top:1.3rem;font-size:.82rem;color:${C.muted}}
.auth-sw button{background:none;border:none;color:${C.gold};cursor:pointer;font-family:'Rajdhani',sans-serif;font-size:.82rem;text-decoration:underline}
.hint{font-size:.72rem;color:${C.muted};margin-top:.3rem;font-family:'Rajdhani',sans-serif}

/* MODAL */
.modal-ov{position:fixed;inset:0;background:rgba(0,0,0,.8);z-index:300;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(4px);padding:1rem}
.modal-box{background:${C.surface};border:1px solid rgba(212,162,76,.2);clip-path:polygon(0 0,calc(100% - 14px) 0,100% 14px,100% 100%,14px 100%,0 calc(100% - 14px));padding:1.8rem;width:100%;max-width:500px;position:relative;max-height:88vh;overflow-y:auto}
.modal-title{font-family:'Oxanium',sans-serif;font-size:1rem;font-weight:800;text-transform:uppercase;color:${C.gold};margin-bottom:1.3rem}
.close-x{position:absolute;top:.9rem;right:.9rem;background:none;border:none;color:${C.muted};font-size:1.3rem;cursor:pointer;line-height:1}
.close-x:hover{color:${C.white}}

/* TOAST */
.toast{position:fixed;bottom:1.8rem;right:1.8rem;background:rgba(212,162,76,.14);border:1px solid rgba(212,162,76,.38);color:${C.gold};padding:11px 18px;font-family:'Oxanium',sans-serif;font-size:.78rem;letter-spacing:.08em;z-index:500;clip-path:polygon(0 0,calc(100% - 8px) 0,100% 8px,100% 100%,8px 100%,0 calc(100% - 8px))}

/* FOOTER */
.footer{background:${C.charcoal};border-top:1px solid rgba(212,162,76,.1);padding:2.5rem 2rem 1.5rem}
.footer-in{max-width:1200px;margin:0 auto;display:grid;grid-template-columns:1fr 1fr 1fr;gap:2rem}
.f-brand{display:flex;align-items:center;gap:9px;margin-bottom:.7rem}
.f-logo{width:32px;height:32px;object-fit:cover;clip-path:polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%);border:1px solid rgba(212,162,76,.35)}
.f-name{font-family:'Oxanium',sans-serif;font-weight:800;font-size:1rem;color:${C.gold}}
.f-desc{font-size:.82rem;color:${C.muted};line-height:1.6}
.f-col-title{font-family:'Oxanium',sans-serif;font-size:.72rem;text-transform:uppercase;letter-spacing:.15em;color:${C.gold};margin-bottom:.8rem}
.f-link{display:block;font-size:.85rem;color:${C.muted};margin-bottom:.35rem;cursor:pointer;transition:color .2s;background:none;border:none;text-align:left;font-family:'Rajdhani',sans-serif}
.f-link:hover{color:${C.white}}
.f-bottom{max-width:1200px;margin:1.5rem auto 0;padding-top:1.2rem;border-top:1px solid rgba(255,255,255,.06);display:flex;justify-content:space-between;align-items:center}
.f-copy{font-size:.75rem;color:${C.muted};font-family:'Rajdhani',sans-serif}

/* WM */
.wm{position:relative;overflow:hidden}
.wm::after{content:'ZRT';position:absolute;right:-1rem;bottom:-2rem;font-family:'Oxanium',sans-serif;font-size:9rem;font-weight:800;color:rgba(212,162,76,.025);pointer-events:none;line-height:1;user-select:none}

/* PAGE */
.pw{padding-top:62px}
.loading{display:flex;align-items:center;justify-content:center;min-height:60vh;font-family:'Oxanium',sans-serif;font-size:.85rem;color:${C.muted};letter-spacing:.2em;text-transform:uppercase}
.empty{text-align:center;padding:3rem;color:${C.muted};font-family:'Oxanium',sans-serif;font-size:.85rem;letter-spacing:.1em;text-transform:uppercase}
.filter-row{display:flex;gap:8px;margin-bottom:1.3rem;flex-wrap:wrap}
.fb{font-family:'Oxanium',sans-serif;font-size:.68rem;letter-spacing:.1em;padding:5px 13px;border:1px solid rgba(255,255,255,.09);background:none;color:${C.muted};cursor:pointer;text-transform:uppercase;clip-path:polygon(0 0,calc(100% - 5px) 0,100% 5px,100% 100%,5px 100%,0 calc(100% - 5px));transition:all .2s}
.fb:hover,.fb.on{border-color:rgba(212,162,76,.38);color:${C.gold};background:rgba(212,162,76,.07)}
`;

// ── Toast ──────────────────────────────────────────────────────
function Toast({ msg, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 2800); return () => clearTimeout(t); }, []);
  return <div className="toast">{msg}</div>;
}

// ── Auth Modal ─────────────────────────────────────────────────
function AuthModal({ mode, onClose, onLogin, users, setUsers }) {
  const [tab, setTab] = useState(mode);
  const [email, setEmail] = useState(""); const [pass, setPass] = useState(""); const [name, setName] = useState(""); const [err, setErr] = useState("");

  const doLogin = () => {
    if (!email || !pass) { setErr("Fill all fields."); return; }
    if (email === "admin@zerolt.gg" && pass === "zrt2026") { onLogin({ id: "admin", name: "ZRT Admin", email, role: "admin" }); return; }
    const u = users.find(u => u.email === email && u.pass === pass);
    if (u) { onLogin({ id: u.id, name: u.name, email: u.email, role: u.role }); }
    else setErr("Wrong email or password.");
  };
  const doReg = async () => {
    if (!name || !email || !pass) { setErr("Fill all fields."); return; }
    if (pass.length < 6) { setErr("Password must be 6+ characters."); return; }
    if (users.find(u => u.email === email)) { setErr("Email already registered."); return; }
    const nu = { id: uid(), name, email, pass, role: "user" };
    const next = [...users, nu];
    setUsers(next);
    await sSet(SK.users, next);
    onLogin({ id: nu.id, name: nu.name, email: nu.email, role: "user" });
  };

  return (
    <div className="auth-ov" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="auth-box">
        <button className="close-x" onClick={onClose}>×</button>
        <div className="auth-title">{tab === "login" ? "Sign In" : "Join ZRT"}</div>
        <div className="auth-sub">{tab === "login" ? "Access your ZEROLT account" : "Create your ZEROLT account"}</div>
        {err && <div className="auth-err">{err}</div>}
        {tab === "register" && <div className="fg"><label className="fl">Display Name</label><input className="fi" placeholder="YourGamertag" value={name} onChange={e => setName(e.target.value)} /></div>}
        <div className="fg"><label className="fl">Email</label><input className="fi" type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} /></div>
        <div className="fg"><label className="fl">Password</label><input className="fi" type="password" placeholder="••••••••" value={pass} onChange={e => setPass(e.target.value)} onKeyDown={e => e.key === "Enter" && (tab === "login" ? doLogin() : doReg())} /></div>
        {tab === "login" && <div className="hint">Admin: admin@zerolt.gg / zrt2026</div>}
        <button className="btn btn-gold full" style={{marginTop:'1rem'}} onClick={tab === "login" ? doLogin : doReg}>{tab === "login" ? "Sign In" : "Create Account"}</button>
        <div className="auth-sw">{tab === "login" ? <>No account? <button onClick={() => { setTab("register"); setErr(""); }}>Register</button></> : <>Have one? <button onClick={() => { setTab("login"); setErr(""); }}>Sign In</button></>}</div>
      </div>
    </div>
  );
}

// ── Navbar ─────────────────────────────────────────────────────
function Navbar({ user, onAuth, onLogout, page, setPage }) {
  return (
    <nav className="nav">
      <div className="nav-brand" onClick={() => setPage("home")}>
        <img src={LOGO_URL} alt="ZRT" className="nav-logo" />
        <span className="nav-title">ZERO<span>LT</span></span>
      </div>
      <div className="nav-links">
        {[["home","Home"],["announcements","News"],["standings","Standings"],["schedule","Schedule"]].map(([p,l]) => (
          <button key={p} className={`nl${page===p?" on":""}`} onClick={() => setPage(p)}>{l}</button>
        ))}
        {user?.role === "admin" && <button className={`nl${page==="admin"?" on":""}`} onClick={() => setPage("admin")}>Admin</button>}
      </div>
      <div className="nav-right">
        {user ? (
          <>
            {user.role === "admin" && <span className="admin-chip">ADMIN</span>}
            <span style={{fontFamily:"'Rajdhani',sans-serif",fontSize:'.82rem',color:C.muted}}>{user.name}</span>
            <button className="btn btn-ghost sm" onClick={onLogout}>Logout</button>
          </>
        ) : (
          <>
            <button className="btn btn-ghost sm" onClick={() => onAuth("login")}>Sign In</button>
            <button className="btn btn-gold sm" onClick={() => onAuth("register")}>Register</button>
          </>
        )}
      </div>
    </nav>
  );
}

// ── Hero ───────────────────────────────────────────────────────
function Hero({ setPage, onAuth }) {
  return (
    <div className="hero">
      <div className="hero-bg" /><div className="hero-wm"><img src={LOGO_URL} alt="" /></div><div className="hero-glow" />
      <div className="hero-c">
        <div className="eyebrow">⚔ Battlegrounds Mobile India eSports</div>
        <img src={LOGO_URL} alt="ZRT" className="hero-logo" />
        <h1 className="hero-title"><span className="acc">ZEROLT</span><span className="sm2">eSports Organisation · Est. 2025</span></h1>
        <p className="hero-sub">India's premier BGMI scrim & tournament community. Compete. Dominate. Rise.</p>
        <div className="hero-cta">
          <button className="btn btn-gold" onClick={() => setPage("schedule")}>View Schedule</button>
          <button className="btn btn-outline" onClick={() => onAuth("register")}>Join ZRT</button>
        </div>
        <div className="hero-stats">
          {[["1,200+","Players"],["48","Teams"],["₹2L+","Prize Pool"],["12","Tournaments"]].map(([v,l]) => (
            <div className="hstat" key={l}><div className="hstat-v">{v}</div><div className="hstat-l">{l}</div></div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Announcements ──────────────────────────────────────────────
function Announcements({ ann, admin, onAdd, onEdit, onDelete, preview }) {
  const [filter, setFilter] = useState("ALL");
  const list = preview ? ann.slice(0,3) : (filter === "ALL" ? ann : ann.filter(a => a.tag === filter));
  return (
    <div className="sec wm">
      <div className="sec-hd">
        <div className="sec-ey">Latest Updates</div>
        <div className="sec-row">
          <h2 className="sec-title">Announcements</h2>
          {admin && <button className="btn btn-gold sm" onClick={onAdd}>+ New</button>}
        </div>
        <div className="divider" />
      </div>
      {!preview && <div className="filter-row">{["ALL","TOURNAMENT","SCRIM","RULE"].map(t => <button key={t} className={`fb${filter===t?" on":""}`} onClick={() => setFilter(t)}>{t}</button>)}</div>}
      {list.length === 0 && <div className="empty">No announcements yet</div>}
      <div className="ann-grid">
        {list.map(a => (
          <div className="ann-card" key={a.id}>
            <div className="ann-top"><span className={`tag ${a.tag}`}>{a.tag}</span><span className="ann-date">{fmtDate(a.date)}</span></div>
            <div className="ann-title">{a.title}</div>
            <div className="ann-body">{a.body}</div>
            {admin && <div className="ann-acts"><button className="btn btn-ghost sm" onClick={() => onEdit(a)}>Edit</button><button className="btn btn-danger sm" onClick={() => onDelete(a.id)}>Delete</button></div>}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Standings ──────────────────────────────────────────────────
function Standings({ teams, admin, onAdd, onEdit, onDelete, preview }) {
  const [exp, setExp] = useState({});
  const sorted = [...teams].sort((a,b) => b.points - a.points).slice(0, preview ? 3 : 999);
  const rk = (i) => i===0?"g":i===1?"s":i===2?"b":"";
  const rc = (i) => i===0?"tc r1":i===1?"tc r2":i===2?"tc r3":"tc";
  return (
    <div className="sec wm">
      <div className="sec-hd">
        <div className="sec-ey">Weekly Results</div>
        <div className="sec-row">
          <h2 className="sec-title">Team Standings</h2>
          {admin && <button className="btn btn-gold sm" onClick={onAdd}>+ Add Team</button>}
        </div>
        <div className="divider" />
      </div>
      <div style={{display:'grid',gridTemplateColumns:'50px 1fr repeat(3,72px) 90px',gap:'.8rem',padding:'.4rem 1.2rem',marginBottom:'.4rem'}}>
        {["#","TEAM","PTS","WINS","MTCH",""].map((h,i) => <div key={i} style={{fontFamily:"'Oxanium',sans-serif",fontSize:'.62rem',letterSpacing:'.15em',color:C.muted,textAlign:i>=2?'center':'left',textTransform:'uppercase'}}>{h}</div>)}
      </div>
      <div className="stands">
        {sorted.map((t,i) => (
          <div className={rc(i)} key={t.id}>
            <div className="tc-hd" onClick={() => setExp(p => ({...p,[t.id]:!p[t.id]}))}>
              <div className={`tc-rank ${rk(i)}`}>{i===0?"🥇":i===1?"🥈":i===2?"🥉":i+1}</div>
              <div><div className="tc-name">{t.name}</div><div className="tc-slot">Slot {t.slot}</div></div>
              <div className="sc"><div className="sc-v gold">{t.points}</div><div className="sc-l">PTS</div></div>
              <div className="sc"><div className="sc-v">{t.wins}</div><div className="sc-l">WINS</div></div>
              <div className="sc"><div className="sc-v">{t.matches}</div><div className="sc-l">MTCH</div></div>
              <div className="tc-acts">
                {admin && <><button className="btn btn-ghost sm" onClick={e=>{e.stopPropagation();onEdit(t)}} style={{fontSize:'.62rem',padding:'4px 9px'}}>Edit</button><button className="btn btn-danger sm" onClick={e=>{e.stopPropagation();onDelete(t.id)}} style={{fontSize:'.62rem',padding:'4px 9px'}}>Del</button></>}
                <span className={`chev${exp[t.id]?" open":""}`}>▼</span>
              </div>
            </div>
            {exp[t.id] && t.players?.length > 0 && (
              <div className="players-grid">
                {t.players.map((p,pi) => (
                  <div className="pc" key={pi}>
                    <div className="pavatar"><img src={p.avatar} alt={p.name} /></div>
                    <div><div className="pname">{p.name}</div><div className="pstats"><span className="pchip k">☠ {p.kills}</span><span className="pchip kd">KD {p.kd}</span></div></div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Registration Modal ─────────────────────────────────────────
function RegModal({ event, user, regs, onClose, onRegister }) {
  const [teamName, setTeamName] = useState("");
  const [contact, setContact] = useState("");
  const [players, setPlayers] = useState([
    { name: user?.name || "", uid: "" },
    { name: "", uid: "" }, { name: "", uid: "" }, { name: "", uid: "" }
  ]);
  const [err, setErr] = useState("");

  const alreadyReg = regs.some(r => r.eventId === event.id && r.userId === user?.id);
  const filled = (total) => regs.filter(r => r.eventId === event.id).length;
  const isFull = filled() >= event.totalSlots;

  const update = (i, field, val) => setPlayers(p => p.map((pl,idx) => idx===i ? {...pl,[field]:val} : pl));

  const submit = async () => {
    if (!teamName.trim()) { setErr("Enter team name."); return; }
    if (!contact.trim()) { setErr("Enter contact (Discord/phone)."); return; }
    if (players.filter(p => p.name.trim()).length < 2) { setErr("Add at least 2 players."); return; }
    if (isFull) { setErr("Event is full."); return; }
    if (alreadyReg) { setErr("Already registered for this event."); return; }
    const reg = {
      id: uid(), eventId: event.id, eventName: event.name, userId: user.id, userName: user.name,
      teamName: teamName.trim(), contact: contact.trim(),
      players: players.filter(p => p.name.trim()),
      date: new Date().toISOString().slice(0,10), status: "pending"
    };
    onRegister(reg);
    onClose();
  };

  return (
    <div className="modal-ov" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box">
        <button className="close-x" onClick={onClose}>×</button>
        <div className="modal-title">Register for {event.name}</div>
        {alreadyReg && <div style={{background:'rgba(0,180,0,.1)',border:'1px solid rgba(0,180,0,.28)',color:'#5ef05e',padding:'10px',fontSize:'.85rem',marginBottom:'1rem',fontFamily:'Rajdhani'}}>✅ You are already registered for this event!</div>}
        {isFull && !alreadyReg && <div style={{background:'rgba(139,0,0,.18)',border:'1px solid rgba(139,0,0,.38)',color:'#ff7070',padding:'10px',fontSize:'.85rem',marginBottom:'1rem',fontFamily:'Rajdhani'}}>⛔ This event is full.</div>}
        {err && <div style={{background:'rgba(139,0,0,.18)',border:'1px solid rgba(139,0,0,.38)',color:'#ff7070',padding:'9px',fontSize:'.82rem',marginBottom:'.9rem',fontFamily:'Rajdhani'}}>{err}</div>}
        <div className="fg"><label className="fl">Team Name</label><input className="fi" placeholder="YOUR TEAM NAME" value={teamName} onChange={e => setTeamName(e.target.value)} /></div>
        <div className="fg"><label className="fl">Contact (Discord ID / Phone)</label><input className="fi" placeholder="YourName#1234 or 9876543210" value={contact} onChange={e => setContact(e.target.value)} /></div>
        <div className="fg">
          <label className="fl">Players (min 2, max 4)</label>
          <div className="players-input">
            {players.map((p,i) => (
              <div className="player-row" key={i}>
                <span className="pnum">P{i+1}</span>
                <input className="pi-name" placeholder={i===0?"Captain (you)":"Player name"} value={p.name} onChange={e => update(i,'name',e.target.value)} />
                <input className="pi-num" placeholder="UID" value={p.uid} onChange={e => update(i,'uid',e.target.value)} />
              </div>
            ))}
          </div>
        </div>
        <div className="form-acts">
          <button className="btn btn-gold" onClick={submit} disabled={alreadyReg || isFull}>Confirm Registration</button>
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

// ── Schedule ───────────────────────────────────────────────────
function Schedule({ schedule, regs, user, onRegister, onAuth, preview }) {
  const [filter, setFilter] = useState("ALL");
  const [regEvent, setRegEvent] = useState(null);
  const list = preview ? schedule.slice(0,3) : (filter === "ALL" ? schedule : schedule.filter(s => s.type === filter));

  const slotsFilled = (eid) => regs.filter(r => r.eventId === eid).length;
  const userReg = (eid) => user && regs.some(r => r.eventId === eid && r.userId === user.id);

  return (
    <div className="sec wm">
      <div className="sec-hd">
        <div className="sec-ey">Upcoming Events</div>
        <h2 className="sec-title">Scrim & Tournament Schedule</h2>
        <div className="divider" />
      </div>
      {!preview && <div className="filter-row">{["ALL","TOURNAMENT","SCRIM"].map(t => <button key={t} className={`fb${filter===t?" on":""}`} onClick={() => setFilter(t)}>{t}</button>)}</div>}
      <div className="sched-grid">
        {list.map(e => {
          const filled = slotsFilled(e.id);
          const full = filled >= e.totalSlots;
          const myReg = userReg(e.id);
          return (
            <div className="sc-card" key={e.id}>
              <div className="sc-date"><div className="sc-day">{getDay(e.date)}</div><div className="sc-mon">{getMon(e.date)}</div></div>
              <div>
                <span className={`tbadge ${e.type}`}>{e.type}</span>
                <div className="sc-name">{e.name}</div>
                <div className="sc-meta">
                  <span className="sc-mi">🕐 {e.time} IST</span>
                  <span className="sc-mi">🗺 {e.map}</span>
                  <span className="sc-mi">🎮 {e.mode}</span>
                  <span className="sc-mi">👥 {filled}/{e.totalSlots} teams</span>
                </div>
              </div>
              <div className="sc-right">
                <div className="sc-prize">{e.prize !== "—" ? e.prize : <span style={{color:C.muted,fontSize:'.82rem'}}>Practice</span>}</div>
                <div className={`sc-slots ${full?"slots-full":"slots-ok"}`}>{full ? "FULL" : `${e.totalSlots - filled} slots left`}</div>
                {myReg
                  ? <button className="btn btn-ghost sm" style={{marginTop:8,color:'#5ef05e',borderColor:'rgba(0,180,0,.3)'}}>✅ Registered</button>
                  : full
                    ? <button className="btn btn-ghost sm" style={{marginTop:8}} disabled>Full</button>
                    : <button className="btn btn-outline sm" style={{marginTop:8}} onClick={() => user ? setRegEvent(e) : onAuth("login")}>Register</button>
                }
              </div>
            </div>
          );
        })}
      </div>
      {regEvent && <RegModal event={regEvent} user={user} regs={regs} onClose={() => setRegEvent(null)} onRegister={onRegister} />}
    </div>
  );
}

// ── Ann Modal ─────────────────────────────────────────────────
function AnnModal({ init, onSave, onClose }) {
  const [title, setTitle] = useState(init?.title || ""); const [body, setBody] = useState(init?.body || ""); const [tag, setTag] = useState(init?.tag || "SCRIM");
  return (
    <div className="modal-ov" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box">
        <button className="close-x" onClick={onClose}>×</button>
        <div className="modal-title">{init ? "Edit Announcement" : "New Announcement"}</div>
        <div className="fg"><label className="fl">Tag</label><select className="sel" value={tag} onChange={e => setTag(e.target.value)}>{["TOURNAMENT","SCRIM","RULE"].map(t=><option key={t}>{t}</option>)}</select></div>
        <div className="fg"><label className="fl">Title</label><input className="fi" value={title} onChange={e => setTitle(e.target.value)} placeholder="Announcement title..." /></div>
        <div className="fg"><label className="fl">Message</label><textarea className="ta" value={body} onChange={e => setBody(e.target.value)} placeholder="Details..." /></div>
        <div className="form-acts"><button className="btn btn-gold" onClick={() => title && body && onSave({title,body,tag})}>Save</button><button className="btn btn-ghost" onClick={onClose}>Cancel</button></div>
      </div>
    </div>
  );
}

// ── Team Modal ────────────────────────────────────────────────
function TeamModal({ init, onSave, onClose }) {
  const [name, setName] = useState(init?.name||""); const [slot, setSlot] = useState(init?.slot||""); const [points, setPoints] = useState(init?.points||0); const [matches, setMatches] = useState(init?.matches||0); const [wins, setWins] = useState(init?.wins||0);
  return (
    <div className="modal-ov" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box">
        <button className="close-x" onClick={onClose}>×</button>
        <div className="modal-title">{init ? "Edit Team" : "Add Team"}</div>
        <div className="fg"><label className="fl">Team Name</label><input className="fi" value={name} onChange={e => setName(e.target.value)} placeholder="TEAM NAME" /></div>
        <div className="fg"><label className="fl">Slot</label><input className="fi" value={slot} onChange={e => setSlot(e.target.value)} placeholder="A1" /></div>
        <div className="fr"><div className="fg"><label className="fl">Points</label><input className="fi" type="number" value={points} onChange={e => setPoints(+e.target.value)} /></div><div className="fg"><label className="fl">Wins</label><input className="fi" type="number" value={wins} onChange={e => setWins(+e.target.value)} /></div></div>
        <div className="fg"><label className="fl">Matches</label><input className="fi" type="number" value={matches} onChange={e => setMatches(+e.target.value)} /></div>
        <div className="form-acts"><button className="btn btn-gold" onClick={() => name && slot && onSave({name,slot,points,matches,wins,players:init?.players||[]})}>Save Team</button><button className="btn btn-ghost" onClick={onClose}>Cancel</button></div>
      </div>
    </div>
  );
}

// ── Admin Dashboard ────────────────────────────────────────────
function Admin({ ann, setAnn, teams, setTeams, regs, setRegs, setToast }) {
  const [tab, setTab] = useState("ann");
  const [annMod, setAnnMod] = useState(null);
  const [teamMod, setTeamMod] = useState(null);
  const [filter, setFilter] = useState("ALL");

  const saveAnn = async (data) => {
    let next;
    if (annMod?.data) { next = ann.map(a => a.id === annMod.data.id ? {...a,...data} : a); setToast("Updated"); }
    else { next = [{id:uid(), date:new Date().toISOString().slice(0,10), ...data}, ...ann]; setToast("Published"); }
    setAnn(next); await sSet(SK.ann, next); setAnnMod(null);
  };
  const delAnn = async (id) => { const next = ann.filter(a => a.id !== id); setAnn(next); await sSet(SK.ann, next); setToast("Deleted"); };

  const saveTeam = async (data) => {
    let next;
    if (teamMod?.data) { next = teams.map(t => t.id === teamMod.data.id ? {...t,...data} : t); setToast("Updated"); }
    else { next = [...teams, {id:uid(),...data}]; setToast("Added"); }
    setTeams(next); await sSet(SK.teams, next); setTeamMod(null);
  };
  const delTeam = async (id) => { const next = teams.filter(t => t.id !== id); setTeams(next); await sSet(SK.teams, next); setToast("Removed"); };

  const updateRegStatus = async (rid, status) => {
    const reg = regs.find(r => r.id === rid);
    const next = regs.map(r => r.id === rid ? {...r, status} : r);
    setRegs(next); await sSet(SK.regs, next); setToast(`Registration ${status}`);
    if (reg) {
      const emoji = status === "approved" ? "✅" : "❌";
      const color = status === "approved" ? 0x00b400 : 0x8B0000;
      try {
        await fetch("https://discord.com/api/webhooks/1516283284378882068/vUMpj_77HA2TqAWGyHs49LJ_UHYzobzHKcs13ngGqc7iVd8oaDdfmsKe_1Pj-tpN_2FS", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ embeds: [{ title: `${emoji} Registration ${status.charAt(0).toUpperCase()+status.slice(1)} — ${reg.teamName}`, color, fields: [{ name: "🏆 Event", value: reg.eventName, inline: true },{ name: "👤 Captain", value: reg.userName, inline: true },{ name: "📞 Contact", value: reg.contact, inline: true }], footer: { text: "ZEROLT eSports Admin · ZRT ⚔" }, timestamp: new Date().toISOString() }] }),
        });
      } catch (e) {}
    }
  };

  const filteredRegs = filter === "ALL" ? regs : regs.filter(r => r.status === filter.toLowerCase());

  return (
    <div className="adm-page">
      <div className="adm-hd">
        <div className="adm-title">Admin <span>Dashboard</span></div>
        <div style={{fontSize:'.82rem',color:C.muted,fontFamily:'Rajdhani',marginTop:3}}>ZEROLT eSports Control Panel</div>
      </div>
      <div className="adm-tabs">
        {[["ann","📢 Announcements"],["stands","🏆 Standings"],["regs","📋 Registrations"]].map(([k,l]) => (
          <button key={k} className={`adm-tab${tab===k?" on":""}`} onClick={() => setTab(k)}>{l} {k==="regs" && regs.filter(r=>r.status==="pending").length > 0 && <span style={{background:C.red,color:'#fff',borderRadius:'50%',fontSize:'.6rem',padding:'1px 5px',marginLeft:4}}>{regs.filter(r=>r.status==="pending").length}</span>}</button>
        ))}
      </div>
      <div className="adm-body">
        {tab === "ann" && (
          <>
            <div style={{marginBottom:'1.2rem'}}><button className="btn btn-gold" onClick={() => setAnnMod({})}>+ New Announcement</button></div>
            <Announcements ann={ann} admin onAdd={() => setAnnMod({})} onEdit={a => setAnnMod({data:a})} onDelete={delAnn} />
          </>
        )}
        {tab === "stands" && (
          <>
            <div style={{marginBottom:'1.2rem'}}><button className="btn btn-gold" onClick={() => setTeamMod({})}>+ Add Team</button></div>
            <Standings teams={teams} admin onAdd={() => setTeamMod({})} onEdit={t => setTeamMod({data:t})} onDelete={delTeam} />
          </>
        )}
        {tab === "regs" && (
          <div>
            <div style={{fontFamily:"'Oxanium',sans-serif",fontSize:'.75rem',color:C.muted,textTransform:'uppercase',letterSpacing:'.15em',marginBottom:'1rem'}}>
              Total: {regs.length} | Pending: {regs.filter(r=>r.status==="pending").length} | Approved: {regs.filter(r=>r.status==="approved").length}
            </div>
            <div className="filter-row">
              {["ALL","PENDING","APPROVED","REJECTED"].map(f => <button key={f} className={`fb${filter===f?" on":""}`} onClick={() => setFilter(f)}>{f}</button>)}
            </div>
            {filteredRegs.length === 0 && <div className="empty">No registrations</div>}
            <table className="reg-table" style={{width:'100%'}}>
              <thead>
                <tr>
                  <th>Team</th><th>Event</th><th>Captain</th><th>Contact</th><th>Players</th><th>Date</th><th>Status</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRegs.map(r => (
                  <tr key={r.id}>
                    <td><strong style={{fontFamily:"'Oxanium',sans-serif",fontSize:'.82rem'}}>{r.teamName}</strong></td>
                    <td style={{fontSize:'.8rem',color:C.muted}}>{r.eventName}</td>
                    <td style={{fontSize:'.82rem'}}>{r.userName}</td>
                    <td style={{fontSize:'.78rem',color:C.muted}}>{r.contact}</td>
                    <td><div className="players-list">{r.players.map(p => p.name).join(", ")}</div></td>
                    <td style={{fontSize:'.75rem',color:C.muted}}>{r.date}</td>
                    <td><span className={`reg-badge ${r.status}`}>{r.status}</span></td>
                    <td>
                      <div style={{display:'flex',gap:4}}>
                        {r.status !== "approved" && <button className="btn sm" style={{background:'rgba(0,180,0,.1)',color:'#5ef05e',border:'1px solid rgba(0,180,0,.28)',fontSize:'.62rem',padding:'4px 9px'}} onClick={() => updateRegStatus(r.id,"approved")}>✓</button>}
                        {r.status !== "rejected" && <button className="btn btn-danger sm" style={{fontSize:'.62rem',padding:'4px 9px'}} onClick={() => updateRegStatus(r.id,"rejected")}>✗</button>}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {annMod !== null && <AnnModal init={annMod.data} onSave={saveAnn} onClose={() => setAnnMod(null)} />}
      {teamMod !== null && <TeamModal init={teamMod.data} onSave={saveTeam} onClose={() => setTeamMod(null)} />}
    </div>
  );
}

// ── Root App ───────────────────────────────────────────────────
export default function App() {
  const [ready, setReady] = useState(false);
  const [page, setPage] = useState("home");
  const [user, setUser] = useState(null);
  const [authMode, setAuthMode] = useState(null);
  const [ann, setAnn] = useState([]);
  const [teams, setTeams] = useState([]);
  const [schedule, setSchedule] = useState([]);
  const [regs, setRegs] = useState([]);
  const [users, setUsers] = useState([]);
  const [toast, setToast] = useState(null);

  // Load from persistent storage on mount
  useEffect(() => {
    (async () => {
      const [a, t, s, r, u] = await Promise.all([
        sGet(SK.ann, SEED_ANN), sGet(SK.teams, SEED_TEAMS),
        sGet(SK.sched, SEED_SCHEDULE), sGet(SK.regs, []), sGet(SK.users, [])
      ]);
      setAnn(a); setTeams(t); setSchedule(s); setRegs(r); setUsers(u);
      // seed if first time
      if (!a || a === SEED_ANN) await sSet(SK.ann, SEED_ANN);
      if (!t || t === SEED_TEAMS) await sSet(SK.teams, SEED_TEAMS);
      if (!s || s === SEED_SCHEDULE) await sSet(SK.sched, SEED_SCHEDULE);
      setReady(true);
    })();
  }, []);

  const handleLogin = (u) => { setUser(u); setAuthMode(null); setToast(`Welcome, ${u.name}! ⚔`); };
  const handleLogout = () => { setUser(null); if (page === "admin") setPage("home"); setToast("Signed out"); };

  const WEBHOOK = "https://discord.com/api/webhooks/1516283284378882068/vUMpj_77HA2TqAWGyHs49LJ_UHYzobzHKcs13ngGqc7iVd8oaDdfmsKe_1Pj-tpN_2FS";

  const sendToDiscord = async (payload) => {
    try {
      await fetch(WEBHOOK, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } catch (e) { console.error("Discord webhook error:", e); }
  };

  const handleRegister = async (reg) => {
    const next = [...regs, reg];
    setRegs(next); await sSet(SK.regs, next);
    setToast(`✅ Registered "${reg.teamName}" for ${reg.eventName}!`);

    // Send Discord notification
    await sendToDiscord({
      embeds: [{
        title: "⚔️ New Team Registration",
        color: 0xD4A24C,
        fields: [
          { name: "🏆 Event", value: reg.eventName, inline: true },
          { name: "🛡️ Team Name", value: reg.teamName, inline: true },
          { name: "👤 Captain", value: reg.userName, inline: true },
          { name: "📞 Contact", value: reg.contact, inline: true },
          { name: "👥 Players", value: reg.players.map((p, i) => `P${i+1}: **${p.name}**${p.uid ? ` (UID: ${p.uid})` : ""}`).join("\n"), inline: false },
          { name: "📅 Date", value: reg.date, inline: true },
          { name: "🔘 Status", value: "🟡 Pending", inline: true },
        ],
        footer: { text: "ZEROLT eSports · ZRT ⚔" },
        timestamp: new Date().toISOString(),
      }]
    });
  };

  if (!ready) return (
    <>
      <style>{GS}</style>
      <div className="app"><div className="loading">Loading ZEROLT...</div></div>
    </>
  );

  return (
    <>
      <style>{GS}</style>
      <div className="app">
        <Navbar user={user} onAuth={setAuthMode} onLogout={handleLogout} page={page} setPage={setPage} />

        {page === "home" && (
          <>
            <Hero setPage={setPage} onAuth={setAuthMode} />
            <div style={{background:`linear-gradient(180deg,${C.black} 0%,${C.charcoal} 50%,${C.black} 100%)`}}>
              <Announcements ann={ann} admin={false} onAdd={()=>{}} onEdit={()=>{}} onDelete={()=>{}} preview />
            </div>
            <Standings teams={teams} admin={false} onAdd={()=>{}} onEdit={()=>{}} onDelete={()=>{}} preview />
            <div style={{background:C.charcoal}}>
              <Schedule schedule={schedule} regs={regs} user={user} onRegister={handleRegister} onAuth={setAuthMode} preview />
            </div>
            <div style={{textAlign:'center',padding:'5rem 2rem',background:`linear-gradient(135deg,rgba(139,0,0,.1),transparent,rgba(212,162,76,.05))`}}>
              <div className="eyebrow" style={{justifyContent:'center',marginBottom:'.7rem'}}>Ready to Compete?</div>
              <h2 style={{fontFamily:"'Oxanium',sans-serif",fontSize:'clamp(1.8rem,4vw,3rem)',fontWeight:800,textTransform:'uppercase',color:C.white,marginBottom:'1rem'}}>Join <span style={{color:C.gold}}>ZEROLT</span> Today</h2>
              <p style={{color:C.muted,fontFamily:'Rajdhani',fontSize:'1rem',marginBottom:'2rem',maxWidth:430,margin:'0 auto 2rem'}}>Register your team, book scrim slots, and climb the weekly tournament standings.</p>
              <button className="btn btn-gold" onClick={() => setAuthMode("register")} style={{fontSize:'.88rem',padding:'13px 34px'}}>Create Account</button>
            </div>
          </>
        )}
        {page === "announcements" && <div className="pw"><Announcements ann={ann} admin={user?.role==="admin"} onAdd={()=>{}} onEdit={()=>{}} onDelete={()=>{}} /></div>}
        {page === "standings" && <div className="pw"><Standings teams={teams} admin={false} onAdd={()=>{}} onEdit={()=>{}} onDelete={()=>{}} /></div>}
        {page === "schedule" && <div className="pw"><Schedule schedule={schedule} regs={regs} user={user} onRegister={handleRegister} onAuth={setAuthMode} /></div>}
        {page === "admin" && user?.role === "admin" && <Admin ann={ann} setAnn={setAnn} teams={teams} setTeams={setTeams} regs={regs} setRegs={setRegs} setToast={setToast} />}
        {page === "admin" && user?.role !== "admin" && <div className="pw" style={{display:'flex',alignItems:'center',justifyContent:'center',minHeight:'80vh',textAlign:'center'}}><div><div style={{fontFamily:"'Oxanium',sans-serif",fontSize:'.9rem',color:C.red,textTransform:'uppercase',letterSpacing:'.2em',marginBottom:'1rem'}}>⛔ Access Denied</div><div style={{color:C.muted,fontFamily:'Rajdhani'}}>Admin credentials required.</div></div></div>}

        <footer className="footer">
          <div className="footer-in">
            <div><div className="f-brand"><img src={LOGO_URL} alt="ZRT" className="f-logo" /><span className="f-name">ZEROLT</span></div><p className="f-desc">India's premier BGMI eSports organisation hosting weekly scrims, tournaments, and building the next generation of pro players.</p></div>
            <div><div className="f-col-title">Navigate</div>{["home","announcements","standings","schedule"].map(p=><button key={p} className="f-link" onClick={() => setPage(p)}>{p.charAt(0).toUpperCase()+p.slice(1)}</button>)}</div>
            <div><div className="f-col-title">Connect</div>{["Discord Server","Instagram @zerolt.gg","YouTube ZRT Clips","Contact Admin"].map(l=><span key={l} className="f-link">{l}</span>)}</div>
          </div>
          <div className="f-bottom"><span className="f-copy">© 2026 ZEROLT eSports. All rights reserved.</span><span style={{fontFamily:"'Oxanium',sans-serif",fontSize:'.7rem',color:'rgba(212,162,76,.45)',letterSpacing:'.2em'}}>ZRT ⚔</span></div>
        </footer>

        {authMode && <AuthModal mode={authMode} onClose={() => setAuthMode(null)} onLogin={handleLogin} users={users} setUsers={setUsers} />}
        {toast && <Toast msg={toast} onClose={() => setToast(null)} />}
      </div>
    </>
  );
}
