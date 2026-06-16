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
.pi-num:focus{border