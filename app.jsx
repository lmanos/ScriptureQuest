import { useState, useEffect, useCallback, useRef } from “react”;

// ─────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────
// Verses are organised in groups of 5. A group unlocks when ALL 5 verses in the
// previous group have been mastered (masteryScore ≥ MASTERY).
const VERSE_GROUPS = [
{
tier: 1,
label: “The Foundations”,
color: “#F4C542”,
verses: [
{ id:“john_3_16”,  ref:“John 3:16”,         book:“John”,      text:“For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.” },
{ id:“ps_23_1”,    ref:“Psalm 23:1”,         book:“Psalms”,    text:“The Lord is my shepherd, I lack nothing.” },
{ id:“gen_1_1”,    ref:“Genesis 1:1”,        book:“Genesis”,   text:“In the beginning God created the heavens and the earth.” },
{ id:“phil_4_13”,  ref:“Philippians 4:13”,   book:“Philippians”, text:“I can do all this through him who gives me strength.” },
{ id:“rom_8_28”,   ref:“Romans 8:28”,        book:“Romans”,    text:“And we know that in all things God works for the good of those who love him, who have been called according to his purpose.” },
]
},
{
tier: 2,
label: “Walking in Faith”,
color: “#4A9EDB”,
verses: [
{ id:“prov_3_5”,   ref:“Proverbs 3:5-6”,     book:“Proverbs”,  text:“Trust in the Lord with all your heart and lean not on your own understanding; in all your ways submit to him, and he will make your paths straight.” },
{ id:“isa_40_31”,  ref:“Isaiah 40:31”,        book:“Isaiah”,    text:“But those who hope in the Lord will renew their strength. They will soar on wings like eagles; they will run and not grow weary, they will walk and not be faint.” },
{ id:“jer_29_11”,  ref:“Jeremiah 29:11”,      book:“Jeremiah”,  text:“For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you, plans to give you hope and a future.” },
{ id:“ps_46_10”,   ref:“Psalm 46:10”,         book:“Psalms”,    text:“Be still, and know that I am God; I will be exalted among the nations, I will be exalted in the earth.” },
{ id:“josh_1_9”,   ref:“Joshua 1:9”,          book:“Joshua”,    text:“Have I not commanded you? Be strong and courageous. Do not be afraid; do not be discouraged, for the Lord your God will be with you wherever you go.” },
]
},
{
tier: 3,
label: “The Heart of Grace”,
color: “#52B788”,
verses: [
{ id:“eph_2_8”,    ref:“Ephesians 2:8-9”,     book:“Ephesians”, text:“For it is by grace you have been saved, through faith—and this is not from yourselves, it is the gift of God—not by works, so that no one can boast.” },
{ id:“matt_6_33”,  ref:“Matthew 6:33”,         book:“Matthew”,   text:“But seek first his kingdom and his righteousness, and all these things will be given to you as well.” },
{ id:“ps_119_105”, ref:“Psalm 119:105”,        book:“Psalms”,    text:“Your word is a lamp for my feet, a light on my path.” },
{ id:“gal_2_20”,   ref:“Galatians 2:20”,       book:“Galatians”, text:“I have been crucified with Christ and I no longer live, but Christ lives in me. The life I now live in the body, I live by faith in the Son of God, who loved me and gave himself for me.” },
{ id:“rom_12_2”,   ref:“Romans 12:2”,          book:“Romans”,    text:“Do not conform to the pattern of this world, but be transformed by the renewing of your mind. Then you will be able to test and approve what God’s will is—his good, pleasing and perfect will.” },
]
},
{
tier: 4,
label: “Light & Truth”,
color: “#9B59B6”,
verses: [
{ id:“john_14_6”,  ref:“John 14:6”,            book:“John”,      text:“Jesus answered, I am the way and the truth and the life. No one comes to the Father except through me.” },
{ id:“ps_23_4”,    ref:“Psalm 23:4”,            book:“Psalms”,    text:“Even though I walk through the darkest valley, I will fear no evil, for you are with me; your rod and your staff, they comfort me.” },
{ id:“heb_11_1”,   ref:“Hebrews 11:1”,          book:“Hebrews”,   text:“Now faith is confidence in what we hope for and assurance about what we do not see.” },
{ id:“isa_41_10”,  ref:“Isaiah 41:10”,          book:“Isaiah”,    text:“So do not fear, for I am with you; do not be dismayed, for I am your God. I will strengthen you and help you; I will uphold you with my righteous right hand.” },
{ id:“ps_27_1”,    ref:“Psalm 27:1”,            book:“Psalms”,    text:“The Lord is my light and my salvation—whom shall I fear? The Lord is the stronghold of my life—of whom shall I be afraid?” },
]
},
{
tier: 5,
label: “Fruit of the Spirit”,
color: “#E67E22”,
verses: [
{ id:“gal_5_22”,   ref:“Galatians 5:22-23”,    book:“Galatians”, text:“But the fruit of the Spirit is love, joy, peace, forbearance, kindness, goodness, faithfulness, gentleness and self-control. Against such things there is no law.” },
{ id:“1cor_13_4”,  ref:“1 Corinthians 13:4-5”, book:“Corinthians”, text:“Love is patient, love is kind. It does not envy, it does not boast, it is not proud. It does not dishonor others, it is not self-seeking, it is not easily angered, it keeps no record of wrongs.” },
{ id:“matt_11_28”, ref:“Matthew 11:28-30”,      book:“Matthew”,   text:“Come to me, all you who are weary and burdened, and I will give you rest. Take my yoke upon you and learn from me, for I am gentle and humble in heart, and you will find rest for your souls. For my yoke is easy and my burden is light.” },
{ id:“2tim_1_7”,   ref:“2 Timothy 1:7”,         book:“Timothy”,   text:“For the Spirit God gave us does not make us timid, but gives us power, love and self-discipline.” },
{ id:“james_1_5”,  ref:“James 1:5”,             book:“James”,     text:“If any of you lacks wisdom, you should ask God, who gives generously to all without finding fault, and it will be given to you.” },
]
},
{
tier: 6,
label: “Chosen & Called”,
color: “#E74C3C”,
verses: [
{ id:“rom_5_8”,    ref:“Romans 5:8”,            book:“Romans”,    text:“But God demonstrates his own love for us in this: While we were still sinners, Christ died for us.” },
{ id:“ps_139_14”,  ref:“Psalm 139:14”,          book:“Psalms”,    text:“I praise you because I am fearfully and wonderfully made; your works are wonderful, I know that full well.” },
{ id:“matt_28_19”, ref:“Matthew 28:19-20”,      book:“Matthew”,   text:“Therefore go and make disciples of all nations, baptizing them in the name of the Father and of the Son and of the Holy Spirit, and teaching them to obey everything I have commanded you. And surely I am with you always, to the very end of the age.” },
{ id:“john_1_1”,   ref:“John 1:1”,              book:“John”,      text:“In the beginning was the Word, and the Word was with God, and the Word was God.” },
{ id:“heb_4_12”,   ref:“Hebrews 4:12”,          book:“Hebrews”,   text:“For the word of God is alive and active. Sharper than any double-edged sword, it penetrates even to dividing soul and spirit, joints and marrow; it judges the thoughts and attitudes of the heart.” },
]
},
];

// Flat verse list derived from groups (used for daily verse picker etc.)
const VERSES = VERSE_GROUPS.flatMap(g => g.verses);

// ─────────────────────────────────────────────
// AVATAR TIERS — unlock by completing verse groups
// ─────────────────────────────────────────────
// tier 0 = available from start, tier N = complete verse group N to unlock
const AVATAR_TIERS = [
{ tier:0, label:“Seekers”,    unlock:“Default”,              avatars:[“🧑‍💼”,“👩‍🦰”,“🧔”,“👩‍🦱”,“🧑‍🦳”,“👩”,“🧑‍🦲”,“👩‍🦳”,“🧕”,“👨‍🦱”] },
{ tier:1, label:“Disciples”,  unlock:“Complete The Foundations”,     avatars:[“🙏”,“✝️”,“📖”,“🕊️”,“⭐”] },
{ tier:2, label:“Pilgrims”,   unlock:“Complete Walking in Faith”,    avatars:[“🏔️”,“🌿”,“🌊”,“🌅”,“🕯️”] },
{ tier:3, label:“Scholars”,   unlock:“Complete The Heart of Grace”,  avatars:[“🦁”,“🌟”,“🔥”,“💎”,“🌸”] },
{ tier:4, label:“Prophets”,   unlock:“Complete Light & Truth”,       avatars:[“⚡”,“🌙”,“🏛️”,“🦅”,“🌈”] },
{ tier:5, label:“Apostles”,   unlock:“Complete Fruit of the Spirit”, avatars:[“👑”,“🌺”,“🎯”,“🗝️”,“🛡️”] },
{ tier:6, label:“Saints”,     unlock:“Complete Chosen & Called”,     avatars:[“✨”,“🌠”,“🎖️”,“🏆”,“💫”] },
];

// ─────────────────────────────────────────────
// GROUP UNLOCK LOGIC
// ─────────────────────────────────────────────
// A verse group is unlocked when the previous group has ALL 5 verses mastered.
// Group index 0 is always unlocked.
function groupUnlocked(groupIdx, progress) {
if (groupIdx === 0) return true;
const prevGroup = VERSE_GROUPS[groupIdx - 1];
return prevGroup.verses.every(v => (progress[v.id]?.masteryScore || 0) >= MASTERY);
}

// A verse is open if its group is unlocked
function verseOpen(verse, progress) {
const gi = VERSE_GROUPS.findIndex(g => g.verses.some(v => v.id === verse.id));
return gi === -1 ? false : groupUnlocked(gi, progress);
}

// How many verse groups have been fully mastered
function completedGroupCount(progress) {
return VERSE_GROUPS.filter(g => g.verses.every(v => (progress[v.id]?.masteryScore || 0) >= MASTERY)).length;
}

// Which avatar tiers are unlocked based on completed groups
function unlockedAvatarTiers(progress) {
const completed = completedGroupCount(progress);
return AVATAR_TIERS.filter(at => at.tier <= completed);
}

const BADGES = [
// ── Mastery milestones ──
{ id:“first_verse”,    name:“First Words”,         icon:“📖”, desc:“Master your first verse”,                  cond: s => s.masteredCount >= 1 },
{ id:“three_verses”,   name:“Scripture Seeker”,    icon:“🔍”, desc:“Master 3 verses”,                          cond: s => s.masteredCount >= 3 },
{ id:“five_verses”,    name:“Faithful Five”,        icon:“✨”, desc:“Master 5 verses”,                          cond: s => s.masteredCount >= 5 },
{ id:“ten_verses”,     name:“Word Walker”,          icon:“🚶”, desc:“Master 10 verses”,                         cond: s => s.masteredCount >= 10 },
{ id:“fifteen_verses”, name:“Scripture Scholar”,   icon:“🎓”, desc:“Master 15 verses”,                         cond: s => s.masteredCount >= 15 },
{ id:“twenty_verses”,  name:“Living Word”,          icon:“📜”, desc:“Master 20 verses”,                         cond: s => s.masteredCount >= 20 },
{ id:“all_verses”,     name:“Word of God”,          icon:“🌟”, desc:“Master all 30 verses”,                     cond: s => s.masteredCount >= 30 },

// ── Puzzle activity ──
{ id:“fill_starter”,   name:“Blank Filler”,         icon:“✍️”, desc:“Complete 5 fill-in-the-blank puzzles”,     cond: s => s.fillDone >= 5 },
{ id:“fill_master”,    name:“Master of Blanks”,     icon:“🖊️”, desc:“Complete 20 fill-in-the-blank puzzles”,    cond: s => s.fillDone >= 20 },
{ id:“scramble_ace”,   name:“Word Weaver”,          icon:“🔀”, desc:“Complete 3 word scrambles”,                cond: s => s.scrambleDone >= 3 },
{ id:“scramble_pro”,   name:“Word Wizard”,          icon:“🌀”, desc:“Complete 15 word scrambles”,               cond: s => s.scrambleDone >= 15 },
{ id:“cross_starter”,  name:“Crossword King”,       icon:“✏️”, desc:“Complete 2 crosswords”,                    cond: s => s.crossDone >= 2 },
{ id:“cross_master”,   name:“Crossword Champion”,   icon:“🏅”, desc:“Complete 10 crosswords”,                   cond: s => s.crossDone >= 10 },
{ id:“typing_champ”,   name:“Speed Typist”,         icon:“⌨️”, desc:“Complete 3 typing races”,                  cond: s => s.typingDone >= 3 },
{ id:“typing_master”,  name:“Lightning Fingers”,    icon:“⚡”, desc:“Complete 15 typing races”,                 cond: s => s.typingDone >= 15 },
{ id:“all_modes”,      name:“Jack of All Trades”,   icon:“🎯”, desc:“Try all 4 puzzle types”,                   cond: s => s.fillDone>=1 && s.scrambleDone>=1 && s.crossDone>=1 && s.typingDone>=1 },

// ── Streaks & daily ──
{ id:“streak_3”,       name:“Faithful Daily”,       icon:“🔥”, desc:“3-day streak”,                             cond: s => s.streak >= 3 },
{ id:“streak_7”,       name:“Week Warrior”,         icon:“📅”, desc:“7-day streak”,                             cond: s => s.streak >= 7 },
{ id:“streak_30”,      name:“Monthly Devotion”,     icon:“🗓️”, desc:“30-day streak”,                            cond: s => s.streak >= 30 },
{ id:“daily_5”,        name:“Daily Seeker”,         icon:“☀️”, desc:“Complete 5 daily challenges”,              cond: s => s.dailyChallenges >= 5 },
{ id:“daily_20”,       name:“Morning Faithful”,     icon:“🌅”, desc:“Complete 20 daily challenges”,             cond: s => s.dailyChallenges >= 20 },

// ── Points ──
{ id:“century”,        name:“Century Club”,         icon:“💯”, desc:“Earn 500 Faith Points”,                    cond: s => s.totalPoints >= 500 },
{ id:“thousand”,       name:“Faith Champion”,       icon:“🏆”, desc:“Earn 2,000 Faith Points”,                  cond: s => s.totalPoints >= 2000 },
{ id:“legend”,         name:“Scripture Legend”,     icon:“👑”, desc:“Earn 5,000 Faith Points”,                  cond: s => s.totalPoints >= 5000 },
{ id:“eternal”,        name:“Eternal Flame”,        icon:“🕯️”, desc:“Earn 10,000 Faith Points”,                 cond: s => s.totalPoints >= 10000 },

// ── Chapter completion ──
{ id:“chap1_done”,     name:“Foundation Laid”,      icon:“🪨”, desc:“Complete The Foundations chapter”,         cond: s => s.chaptersCompleted >= 1 },
{ id:“chap3_done”,     name:“Halfway Faithful”,     icon:“🌿”, desc:“Complete 3 chapters”,                      cond: s => s.chaptersCompleted >= 3 },
{ id:“all_chaps”,      name:“Quest Complete”,       icon:“⭐”, desc:“Complete all 6 chapters”,                  cond: s => s.chaptersCompleted >= 6 },

// ── Plus Mode ──
{ id:“plus_unlock”,    name:“Plus Mode Unlocked”,   icon:“➕”, desc:“Unlock Plus Mode”,                         cond: s => s.plusUnlocked },
{ id:“plus_first”,     name:“Deep Diver”,           icon:“🌊”, desc:“Complete your first Plus Mode puzzle”,     cond: s => s.plusDone >= 1 },
{ id:“plus_master”,    name:“Scripture Master”,     icon:“💎”, desc:“Complete 10 Plus Mode puzzles”,            cond: s => s.plusDone >= 10 },
];

const LEVEL_TITLES = [
“Seeker”,“Learner”,“Disciple”,“Apprentice”,
“Scholar”,“Scribe”,“Keeper”,“Faithful”,
“Prophet”,“Elder”,“Apostle”,“Evangelist”,
“Shepherd”,“Bishop”,“Patriarch”,“Saint”,
“Illuminated”,“Revered”,“Blessed”,“Legend”,
];
const MASTERY = 80;
const STOP_WORDS = new Set([“the”,“a”,“an”,“and”,“or”,“but”,“in”,“on”,“at”,“to”,“for”,“of”,“is”,“are”,“was”,“were”,“be”,“been”,“have”,“has”,“had”,“do”,“does”,“did”,“will”,“would”,“could”,“should”,“may”,“might”,“shall”,“can”,“not”,“no”,“so”,“that”,“this”,“with”,“from”,“by”,“as”,“if”,“who”,“which”,“all”,“my”,“your”,“his”,“her”,“its”,“our”,“their”,“i”,“you”,“he”,“she”,“it”,“we”,“they”,“me”,“him”,“us”,“them”]);

// ─────────────────────────────────────────────
// SOUND ENGINE  (Web Audio API — zero files)
// ─────────────────────────────────────────────
let _audioCtx = null;
function ac() {
if (!_audioCtx) {
const C = window.AudioContext || window.webkitAudioContext;
if (C) *audioCtx = new C();
}
return *audioCtx;
}
function tone(freq, type, dur, vol, delay = 0) {
try {
const ctx = ac(); if (!ctx) return;
const o = ctx.createOscillator(), g = ctx.createGain();
o.connect(g); g.connect(ctx.destination);
o.type = type; o.frequency.value = freq;
const t = ctx.currentTime + delay;
g.gain.setValueAtTime(0, t);
g.gain.linearRampToValueAtTime(vol, t + 0.012);
g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
o.start(t); o.stop(t + dur + 0.05);
} catch (*) {}
}
const SFX = {
tap:      () => tone(900, “sine”, 0.06, 0.12),
correct:  () => { tone(523,“sine”,0.13,0.35); tone(659,“sine”,0.13,0.35,0.11); tone(784,“sine”,0.2,0.45,0.22); },
wrong:    () => { tone(200,“sawtooth”,0.14,0.22); tone(160,“sawtooth”,0.12,0.18,0.09); },
complete: () => [[523,0],[659,0.12],[784,0.24],[1047,0.38],[1047,0.54],[784,0.66],[1047,0.78]].forEach(([f,d]) => tone(f,“sine”,d===0.78?0.55:0.15,0.42,d)),
badge:    () => [1047,1175,1319,1568,1760,2093].forEach((f,i) => tone(f,“sine”,0.2,0.28,i*0.075)),
tick:     () => tone(1100,“square”,0.035,0.07),
warn:     () => tone(420,“square”,0.09,0.18),
beep:     () => tone(660,“sine”,0.1,0.28),
};
function useSound() {
useEffect(() => {
const wake = () => { try { ac()?.resume(); } catch (*) {} };
window.addEventListener(“pointerdown”, wake, { once: true });
window.addEventListener(“keydown”,     wake, { once: true });
return () => { window.removeEventListener(“pointerdown”, wake); window.removeEventListener(“keydown”, wake); };
}, []);
return SFX;
}

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────
const shuffle = a => […a].sort(() => Math.random() - 0.5);
function calcLevel(pts) {
// XP curve: each level requires progressively more points
// Level 1→2: 200pts, 2→3: 350pts, …, scales by 150 per level
let level = 1, acc = 0;
while (true) {
const need = 200 + (level - 1) * 150;
if (acc + need > pts) return { level, current: pts - acc, needed: need, title: LEVEL_TITLES[Math.min(level-1, LEVEL_TITLES.length-1)] };
acc += need;
level++;
if (level > 20) return { level: 20, current: pts - acc, needed: 99999, title: LEVEL_TITLES[19] };
}
}

function defStats() {
return {
totalPoints: 0, streak: 0, masteredCount: 0,
fillDone: 0, scrambleDone: 0, crossDone: 0, typingDone: 0,
dailyChallenges: 0, chaptersCompleted: 0,
plusUnlocked: false, plusDone: 0,
lastVisit: null,
dailyKey: null,
};
}

function todayKey() {
const d = new Date();
return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
}

function getDailyVerseId() {
// Deterministic by calendar date — cycles through all VERSES over time
const d = new Date();
const dayOfYear = Math.floor((d - new Date(d.getFullYear(),0,0)) / 86400000);
return VERSES[dayOfYear % VERSES.length].id;
}

// Call once on app load to update streak based on calendar days
function computeStreak(stats) {
const today = todayKey();
const last  = stats.lastVisit;
if (last === today) return stats; // already visited today, nothing changes

const yesterday = (() => {
const d = new Date(); d.setDate(d.getDate()-1);
return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
})();

const newStreak = last === yesterday
? (stats.streak||0) + 1   // consecutive day → increment
: last === null ? 1        // first ever visit
: 1;                       // streak broken → reset to 1

return { …stats, streak: newStreak, lastVisit: today };
}

// ─────────────────────────────────────────────
// PUZZLE GENERATORS
// ─────────────────────────────────────────────
function makeFillBlank(text) {
const tokens = text.split(/(\s+)/);
const wordIdx = [];
tokens.forEach((t, i) => { if (t.trim()) wordIdx.push(i); });
const cands = wordIdx.filter(i => {
const c = tokens[i].replace(/[^a-zA-Z]/g, “”);
return c.length >= 3 && !STOP_WORDS.has(c.toLowerCase());
});
const chosen = shuffle(cands).slice(0, Math.min(4, Math.max(2, cands.length)));
const chosenSet = new Set(chosen);
const parts = [];
tokens.forEach((t, i) => {
if (/^\s+$/.test(t)) return;
chosenSet.has(i)
? parts.push({ type:“blank”, answer: t.replace(/[^a-zA-Z]/g,””), raw:t })
: parts.push({ type:“text”,  content: t });
});
const answers = chosen.map(i => tokens[i].replace(/[^a-zA-Z]/g,””));
const dist = shuffle([“eternal”,“faithful”,“gracious”,“righteous”,“holy”,“merciful”,“mighty”,“blessed”,“glory”,“praise”,“worthy”,“truth”,“light”,“peace”,“love”,“hope”,“joy”,“grace”].filter(d => !answers.map(a=>a.toLowerCase()).includes(d))).slice(0,4);
return { parts, wordBank: shuffle([…answers, …dist]) };
}

function makeCrossword(id) {
const CW = {
john_3_16:  [{ w:“WORLD”,   clue:“What God so loved”,                    d:“across”, r:1, c:1 },{ w:“LOVE”,    clue:“God’s motivation for giving His Son”,  d:“down”,   r:0, c:3 },{ w:“ETERNAL”, clue:“The kind of life promised”,               d:“across”, r:4, c:0 },{ w:“SON”,     clue:“God gave His only begotten ___”,          d:“down”,   r:1, c:6 },{ w:“PERISH”,  clue:“What believers will not do”,               d:“across”, r:7, c:1 }],
ps_23_1:    [{ w:“LORD”,     clue:“The Shepherd of this psalm”,           d:“across”, r:1, c:1 },{ w:“SHEPHERD”,clue:“Role God plays for the psalmist”,       d:“down”,   r:0, c:3 },{ w:“LACK”,    clue:“What the psalmist does NOT do”,           d:“across”, r:5, c:2 }],
gen_1_1:    [{ w:“BEGINNING”,clue:“When God first acted”,                d:“across”, r:1, c:0 },{ w:“CREATED”, clue:“What God did to heavens and earth”,     d:“down”,   r:0, c:4 },{ w:“EARTH”,   clue:“Along with heavens, God made this”,       d:“across”, r:5, c:3 },{ w:“HEAVENS”,  clue:“Along with earth, God made these”,        d:“down”,   r:2, c:1 }],
phil_4_13:  [{ w:“STRENGTH”, clue:“What Christ provides to us”,          d:“across”, r:1, c:0 },{ w:“THROUGH”, clue:“How we can do all things — ___ Him”,   d:“down”,   r:0, c:4 },{ w:“ALL”,     clue:“We can do ___ things through Christ”,     d:“across”, r:5, c:3 }],
rom_8_28:   [{ w:“GOOD”,     clue:“The outcome God works all things toward”,d:“across”,r:1,c:2},{ w:“WORKS”,   clue:“What God does in all things”,           d:“down”,   r:0, c:3 },{ w:“PURPOSE”, clue:“God called us according to His ___”,      d:“across”, r:4, c:0 },{ w:“CALLED”,   clue:“How God drew believers to Himself”,        d:“down”,   r:3, c:6 }],
jer_29_11:  [{ w:“PLANS”,    clue:“What God declares He has for us”,     d:“across”, r:1, c:1 },{ w:“HOPE”,    clue:“Along with a future, God gives this”,   d:“down”,   r:0, c:4 },{ w:“PROSPER”, clue:“God plans for us to ___, not be harmed”, d:“across”, r:4, c:0 },{ w:“FUTURE”,   clue:“Along with hope, God grants a good ___”,  d:“down”,   r:3, c:5 }],
prov_3_5:   [{ w:“TRUST”,    clue:“What we should do in the Lord”,       d:“across”, r:1, c:1 },{ w:“HEART”,   clue:“Trust in the Lord with all your ___”,   d:“down”,   r:0, c:3 },{ w:“LEAN”,    clue:“Do NOT do this on your own understanding”,d:“across”,r:4, c:2 },{ w:“PATHS”,    clue:“He will make these straight”,             d:“down”,   r:3, c:5 }],
isa_40_31:  [{ w:“HOPE”,     clue:“What those in the Lord are doing”,    d:“across”, r:1, c:2 },{ w:“STRENGTH”,clue:“What is renewed in those who hope”,     d:“down”,   r:0, c:4 },{ w:“EAGLES”,  clue:“Birds whose wings believers soar on”,     d:“across”, r:4, c:0 },{ w:“WEARY”,    clue:“What runners will NOT grow”,              d:“down”,   r:3, c:6 },{ w:“SOAR”,     clue:“How believers move on eagles’ wings”,     d:“across”, r:7, c:2 }],
};
const words = CW[id] || [];
if (!words.length) return { size:12, words:[], grid:[] };
const SIZE = 12;
const grid = Array.from({length:SIZE},()=>Array(SIZE).fill(null));
const placed = [];
for (const {w,clue,d,r,c} of words) {
let ok = true;
for (let i = 0; i < w.length; i++) {
const rr = d===“down”?r+i:r, cc = d===“across”?c+i:c;
if (rr>=SIZE||cc>=SIZE||rr<0||cc<0) { ok=false; break; }
if (grid[rr][cc]!==null && grid[rr][cc]!==w[i]) { ok=false; break; }
}
if (!ok) continue;
for (let i = 0; i < w.length; i++) {
const rr = d===“down”?r+i:r, cc = d===“across”?c+i:c;
grid[rr][cc] = w[i];
}
placed.push({ answer:w, clue, direction:d, row:r, col:c });
}
return { size:SIZE, words:placed, grid };
}

// Devotional content
const DEVOS = {
john_3_16:  “This verse reveals that love is not merely a feeling — it is a costly, sacrificial action. God didn’t send a message; He sent His Son. How does knowing you are loved this completely change how you approach your day?”,
ps_23_1:    “In a culture of endless wants, this verse is a radical declaration: with God as your shepherd, you truly lack nothing essential. In what area of your life do you need to trust that God is truly enough?”,
gen_1_1:    “Before time, before matter, before anything — God was. Everything was purposefully created. How does knowing the universe was intentionally made shape the way you see your own existence and purpose?”,
phil_4_13:  “Paul wrote these words from prison, not from comfort — which makes them all the more powerful. The strength is not willpower, but Christ Himself working through weakness. What challenge are you facing in your own strength right now?”,
rom_8_28:   “This verse doesn’t promise everything feels good — it promises God is weaving all things together for good. Can you identify a past difficulty God eventually used for something good in your life?”,
jer_29_11:  “God spoke these words to people in exile — in their darkest season. Even then, His plans for their welfare hadn’t changed. What situation in your life currently feels like exile?”,
prov_3_5:   “We are not called to understand everything, only to trust the One who does. Leaning on our own understanding tends to lead to anxiety; submitting to God leads to straight paths. Where do you most struggle to trust rather than figure it out yourself?”,
isa_40_31:  “Eagles don’t constantly flap — they soar by catching thermal currents. Hoping in the Lord lifts us beyond our own capacity. Where do you need to stop straining in your own effort and start soaring in God’s strength?”,
};
async function fetchDevo(verse) {
try {
const res = await fetch(“https://api.anthropic.com/v1/messages”, {
method:“POST”, headers:{“Content-Type”:“application/json”},
body: JSON.stringify({ model:“claude-sonnet-4-20250514”, max_tokens:200,
messages:[{ role:“user”, content:`Write a warm 2-sentence devotional for someone who just memorized "${verse.ref}": "${verse.text}". End with a brief reflection question. Encouraging, practical, plain text only.` }]
})
});
const d = await res.json();
return d.content?.[0]?.text || null;
} catch { return null; }
}

// ─────────────────────────────────────────────
// CSS
// ─────────────────────────────────────────────
const CSS = `@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Lora:ital,wght@0,400;0,600;1,400&family=DM+Mono:wght@400;500&display=swap'); *{box-sizing:border-box} ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-track{background:#0F0E17}::-webkit-scrollbar-thumb{background:#F4C54260;border-radius:2px} @keyframes fadeIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}} @keyframes shimmer{0%,100%{opacity:.35}50%{opacity:1}} @keyframes slideDown{from{transform:translateY(-14px);opacity:0}to{transform:translateY(0);opacity:1}} @keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.06)}} @keyframes popIn{0%{transform:scale(.75);opacity:0}70%{transform:scale(1.04)}100%{transform:scale(1);opacity:1}} @keyframes blink{0%,100%{opacity:1}50%{opacity:0}} @keyframes correctFlash{0%{background:#52B78830}60%{background:#52B78818}100%{background:transparent}} .fade-in{animation:fadeIn .35s ease forwards} .pop-in{animation:popIn .4s ease forwards} .btn-gold{background:linear-gradient(135deg,#F4C542,#D4920A);color:#0F0E17;border:none;border-radius:12px;padding:13px 22px;font-family:'Cinzel',serif;font-weight:700;font-size:14px;cursor:pointer;letter-spacing:.5px;transition:all .2s;box-shadow:0 4px 18px #F4C54228} .btn-gold:hover:not(:disabled){transform:translateY(-2px);box-shadow:0 8px 26px #F4C54244} .btn-gold:disabled{opacity:.35;cursor:not-allowed} .btn-ghost{background:transparent;color:#F4C542;border:1.5px solid #F4C54248;border-radius:10px;padding:10px 18px;font-family:'Lora',serif;font-size:14px;cursor:pointer;transition:all .2s} .btn-ghost:hover{border-color:#F4C542;background:#F4C5420E} .card{background:#1A1830;border:1px solid #F4C54214;border-radius:16px;padding:18px} .chip{display:inline-flex;align-items:center;background:#1E1C38;border:1.5px solid #F4C54226;border-radius:8px;padding:7px 12px;margin:4px;cursor:pointer;font-family:'DM Mono',monospace;font-size:13px;color:#FDEAAA;transition:all .15s;user-select:none} .chip:hover:not(.used){border-color:#F4C542;background:#F4C54212} .chip.used{opacity:.3;cursor:default} .chip.ok{background:#52B78812;border-color:#52B788;color:#52B788} .chip.bad{background:#C0392B12;border-color:#C0392B;color:#f08080} .blank{display:inline-flex;align-items:center;justify-content:center;min-width:66px;height:26px;border-bottom:2px solid #F4C54268;padding:0 5px;margin:0 2px;cursor:pointer;color:#F4C54288;font-weight:700;font-family:'DM Mono',monospace;font-size:12px;transition:all .15s;vertical-align:middle} .blank:hover:not(.has){border-color:#F4C542;border-radius:3px 3px 0 0;background:#F4C5420A} .blank.has{color:#52B788;border-color:#52B788} .blank.ok{color:#52B788;border-color:#52B788;animation:correctFlash .4s ease} .blank.bad{color:#f08080;border-color:#C0392B} .pbar{height:6px;background:#252242;border-radius:3px;overflow:hidden} .pbar-fill{height:100%;border-radius:3px;background:linear-gradient(90deg,#F4C542,#D4920A);transition:width .5s ease} .pbar-fill.g{background:linear-gradient(90deg,#52B788,#3D9A6C)} .pbar-fill.r{background:linear-gradient(90deg,#C0392B,#962d22)} .nav{flex:1;background:none;border:none;color:#FDEAAA42;cursor:pointer;padding:10px 0 12px;display:flex;flex-direction:column;align-items:center;gap:3px;transition:all .2s;font-family:'DM Mono',monospace;font-size:9px;letter-spacing:.5px;text-transform:uppercase} .nav .ic{font-size:20px} .nav.on{color:#F4C542} .vcard{border:1.5px solid;border-radius:14px;padding:14px 16px;margin:8px 0;cursor:pointer;transition:all .2s} .vcard.open{border-color:#F4C54230;background:#1A1830} .vcard.open:hover{border-color:#F4C54268;background:#F4C54208} .vcard.locked{border-color:#FDEAAA0E;background:#12111E;opacity:.48;cursor:not-allowed} .vcard.done{border-color:#52B78830;background:#52B78808} .cc{width:32px;height:32px;border:1px solid #F4C54220;background:#1A1830;color:#FDEAAA;font-family:'DM Mono',monospace;font-size:13px;font-weight:700;text-align:center;cursor:pointer;text-transform:uppercase;outline:none;transition:background .1s;caret-color:transparent} .cc.act{background:#F4C5421E;border-color:#F4C542} .cc.fin{background:#52B78814;border-color:#52B78864;color:#52B788} .cc.blk{background:#06050E;cursor:default;border-color:#06050E} .cnum{position:absolute;top:1px;left:2px;font-size:7px;color:#F4C54265;font-family:'DM Mono',monospace;pointer-events:none} .cursor-blink{animation:blink 1s step-end infinite} input[type=text],select{background:#1E1C38;border:1.5px solid #F4C54226;border-radius:10px;padding:11px 14px;color:#FDEAAA;font-family:'Lora',serif;font-size:15px;width:100%;outline:none;transition:border .2s} input[type=text]:focus,select:focus{border-color:#F4C542} select option{background:#1A1830}`;

// ─────────────────────────────────────────────
// APP ROOT
// ─────────────────────────────────────────────
export default function App() {
const snd = useSound();
const [screen,   setScreen]   = useState(“home”);
const [user,     setUser]     = useState(() => { try { return JSON.parse(localStorage.getItem(“sq_u”)||“null”); } catch { return null; } });
const [progress, setProgress] = useState(() => { try { return JSON.parse(localStorage.getItem(“sq_p”)||”{}”); } catch { return {}; } });
const [stats,    setStats]    = useState(() => {
try {
const saved = JSON.parse(localStorage.getItem(“sq_s”)||“null”) || defStats();
return computeStreak(saved);
} catch { return computeStreak(defStats()); }
});
const [verse,    setVerse]    = useState(null);
const [mode,     setMode]     = useState(null);
const [toast,    setToast]    = useState(null);
const [badgeQ,   setBadgeQ]   = useState([]);
const [plusMode, setPlusMode] = useState(false);

const didPersistStreak = useRef(false);
useEffect(() => {
if (!didPersistStreak.current) {
didPersistStreak.current = true;
localStorage.setItem(“sq_s”, JSON.stringify(stats));
}
}, []); // eslint-disable-line

const persist = useCallback((p, s) => {
localStorage.setItem(“sq_p”, JSON.stringify(p));
localStorage.setItem(“sq_s”, JSON.stringify(s));
}, []);

const flash = (msg, type=“ok”) => { setToast({msg,type}); setTimeout(()=>setToast(null), 3000); };

const award = useCallback((pts, label, key) => {
setStats(prev => {
const ns = { …prev, totalPoints: prev.totalPoints + pts, …(key ? {[key]:(prev[key]||0)+1} : {}) };
const prevIds = BADGES.filter(b=>b.cond(prev)).map(b=>b.id);
const newB   = BADGES.filter(b=>b.cond(ns) && !prevIds.includes(b.id));
if (newB.length) { setBadgeQ(newB); snd.badge(); }
setProgress(p => { persist(p, ns); return p; });
return ns;
});
flash(`+${pts} Faith Points — ${label}!`);
}, [persist, snd]);

const claimDaily = useCallback(() => {
const today = todayKey();
setStats(prev => {
if (prev.dailyKey === today) return prev;
const ns = { …prev, totalPoints: prev.totalPoints + 100, dailyKey: today, dailyChallenges: (prev.dailyChallenges||0)+1 };
setProgress(p => { persist(p, ns); return p; });
return ns;
});
snd.complete();
flash(“🌟 +100 Bonus Points — Daily Challenge Complete!”);
}, [persist, snd]);

const markProgress = useCallback((vid, score, isPlusMode) => {
setProgress(prev => {
const ex  = prev[vid] || { masteryScore:0, attempts:0 };
const ms  = Math.max(ex.masteryScore, score);
const up  = { …prev, [vid]: { masteryScore:ms, attempts:ex.attempts+1 } };
const mc  = Object.values(up).filter(v=>v.masteryScore>=MASTERY).length;
const cc  = VERSE_GROUPS.filter(g => g.verses.every(v => (up[v.id]?.masteryScore||0) >= MASTERY)).length;
const allDone = cc >= VERSE_GROUPS.length;
setStats(s => {
const ns = { …s, masteredCount:mc, chaptersCompleted:cc,
plusUnlocked: allDone,
…(isPlusMode ? { plusDone: (s.plusDone||0)+1 } : {}),
};
persist(up, ns);
return ns;
});
return up;
});
}, [persist]);

// Reset all progress — called from Profile
const resetAll = useCallback(() => {
const freshStats = computeStreak(defStats());
const freshProgress = {};
localStorage.setItem(“sq_p”, JSON.stringify(freshProgress));
localStorage.setItem(“sq_s”, JSON.stringify(freshStats));
setProgress(freshProgress);
setStats(freshStats);
setPlusMode(false);
setScreen(“home”);
flash(“Progress reset. Welcome back, Seeker! 🙏”);
}, []);

const isOpen   = v => verseOpen(v, progress);
const lvl      = calcLevel(stats.totalPoints);
const saveUser = u => { localStorage.setItem(“sq_u”,JSON.stringify(u)); setUser(u); };
const dailyVid  = getDailyVerseId();
const dailyDone = stats.dailyKey === todayKey();
const gameComplete = completedGroupCount(progress) >= VERSE_GROUPS.length;

if (!user) return <Onboard onDone={saveUser} />;

return (
<div style={{fontFamily:”‘Lora’,Georgia,serif”,background:”#0F0E17”,minHeight:“100vh”,color:”#FDEAAA”,maxWidth:480,margin:“0 auto”}}>
<style>{CSS}</style>

```
  {/* Stars */}
  <div style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:0}}>
    {Array.from({length:18},(_,i)=>(
      <div key={i} style={{position:"absolute",top:`${5+Math.random()*90}%`,left:`${Math.random()*100}%`,width:i%4===0?3:2,height:i%4===0?3:2,background:"#F4C54244",borderRadius:"50%",animation:`shimmer ${1.5+Math.random()*3}s ${Math.random()*4}s infinite`}}/>
    ))}
  </div>

  {/* Toast */}
  {toast && (
    <div style={{position:"fixed",top:14,left:"50%",transform:"translateX(-50%)",zIndex:1000,background:toast.type==="err"?"#6B1C1C":"#1C3D2A",color:"#fff",padding:"9px 18px",borderRadius:10,fontFamily:"'DM Mono',monospace",fontSize:13,fontWeight:600,animation:"slideDown .3s ease",whiteSpace:"nowrap",boxShadow:"0 4px 20px #0009"}}>
      {toast.msg}
    </div>
  )}

  {/* Badge modal */}
  {badgeQ.length>0 && (
    <div style={{position:"fixed",inset:0,background:"#000C",zIndex:999,display:"flex",alignItems:"center",justifyContent:"center"}} onClick={()=>setBadgeQ([])}>
      <div style={{background:"#1A1830",border:"2px solid #F4C542",borderRadius:20,padding:32,textAlign:"center",animation:"popIn .4s ease",maxWidth:300,width:"90%"}}>
        <div style={{fontSize:52,marginBottom:8}}>🏆</div>
        <div style={{fontFamily:"'Cinzel',serif",color:"#F4C542",fontSize:20,marginBottom:12}}>Badge Unlocked!</div>
        {badgeQ.map(b=>(
          <div key={b.id} style={{marginBottom:10}}>
            <div style={{fontSize:24,marginBottom:2}}>{b.icon}</div>
            <div style={{fontFamily:"'Cinzel',serif",color:"#FDEAAA",fontSize:15}}>{b.name}</div>
            <div style={{fontSize:12,color:"#FDEAAA50",fontFamily:"'DM Mono',monospace"}}>{b.desc}</div>
          </div>
        ))}
        <div style={{color:"#FDEAAA40",fontSize:12,marginTop:16}}>Tap to continue</div>
      </div>
    </div>
  )}

  <div style={{position:"relative",zIndex:1,minHeight:"100vh",display:"flex",flexDirection:"column"}}>
    {screen==="home" && <Home user={user} stats={stats} progress={progress} lvl={lvl} isOpen={isOpen} dailyVid={dailyVid} dailyDone={dailyDone} gameComplete={gameComplete} plusMode={plusMode} onPlusMode={()=>{snd.complete();setPlusMode(true);setScreen("plus");}} onVerse={v=>{setVerse(v);setScreen("quest");}} snd={snd} />}
    {screen==="plus" && <PlusHub progress={progress} onVerse={v=>{setVerse(v);setScreen("quest");}} onBack={()=>setScreen("home")} snd={snd} />}
    {screen==="quest" && verse && <Quest verse={verse} progress={progress} plusMode={plusMode} onMode={m=>{setMode(m);setScreen("puzzle");}} onBack={()=>{ setPlusMode(false); setScreen(plusMode?"plus":"home"); }} snd={snd} />}
    {screen==="puzzle" && verse && mode && (
      <PuzzleRouter verse={verse} mode={mode} snd={snd} plusMode={plusMode}
        onDone={(score,pts,key)=>{
          const pKey = plusMode ? "plusDone" : key;
          markProgress(verse.id, score, plusMode);
          award(pts, mode, pKey);
          if (verse.id===dailyVid && !dailyDone && score>=50) claimDaily();
          setScreen("quest");
        }}
        onBack={()=>setScreen("quest")}
      />
    )}
    {screen==="dash"  && <Dash  stats={stats} progress={progress} lvl={lvl} />}
    {screen==="prof"  && <Prof  user={user} stats={stats} lvl={lvl} progress={progress} onSave={saveUser} onReset={resetAll} />}

    {["home","dash","prof"].includes(screen) && (
      <div style={{position:"sticky",bottom:0,background:"#0C0B16EE",borderTop:"1px solid #F4C54214",display:"flex",backdropFilter:"blur(16px)"}}>
        {[["🗺️","Quest","home"],["📊","Journey","dash"],["👤","Profile","prof"]].map(([ic,lb,s])=>(
          <button key={s} className={`nav${screen===s?" on":""}`} onClick={()=>setScreen(s)}>
            <span className="ic">{ic}</span>{lb}
          </button>
        ))}
      </div>
    )}
  </div>
</div>
```

);
}

// ─────────────────────────────────────────────
// ONBOARDING
// ─────────────────────────────────────────────
function Onboard({onDone}) {
const [step,  setStep]  = useState(0);
const [name,  setName]  = useState(””);
const [ava,   setAva]   = useState(“🧑‍💼”);
const [trans, setTrans] = useState(“NIV”);
const [diff,  setDiff]  = useState(“beginner”);
const AVAS = AVATAR_TIERS[0].avatars;

const pages = [
<div className=“fade-in” style={{padding:“52px 28px”,textAlign:“center”}}>
<div style={{fontSize:72,marginBottom:20}}>✝️</div>
<div style={{fontFamily:”‘Cinzel’,serif”,fontSize:30,color:”#F4C542”,marginBottom:10,letterSpacing:1}}>Scripture Quest</div>
<div style={{color:”#FDEAAA60”,fontSize:15,marginBottom:36,lineHeight:1.75}}>Memorize God’s Word through engaging puzzles, daily challenges, and gamified learning.</div>
<button className=“btn-gold” style={{width:“100%”}} onClick={()=>setStep(1)}>Begin Your Journey →</button>
</div>,

```
<div className="fade-in" style={{padding:"32px 24px"}}>
  <div style={{fontFamily:"'Cinzel',serif",fontSize:22,color:"#F4C542",marginBottom:24,textAlign:"center"}}>Who are you, seeker?</div>
  <div style={{marginBottom:18}}>
    <label style={{display:"block",marginBottom:8,color:"#FDEAAA60",fontSize:11,fontFamily:"'DM Mono',monospace",letterSpacing:1}}>YOUR NAME</label>
    <input type="text" value={name} onChange={e=>setName(e.target.value)} placeholder="Enter your name..." />
  </div>
  <div style={{marginBottom:26}}>
    <label style={{display:"block",marginBottom:10,color:"#FDEAAA60",fontSize:11,fontFamily:"'DM Mono',monospace",letterSpacing:1}}>CHOOSE AVATAR</label>
    <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
      {AVAS.map(a=><div key={a} onClick={()=>setAva(a)} style={{width:50,height:50,fontSize:26,display:"flex",alignItems:"center",justifyContent:"center",borderRadius:12,border:`2px solid ${ava===a?"#F4C542":"#F4C54226"}`,background:ava===a?"#F4C54214":"transparent",cursor:"pointer",transition:"all .15s"}}>{a}</div>)}
    </div>
  </div>
  <button className="btn-gold" style={{width:"100%"}} disabled={!name.trim()} onClick={()=>setStep(2)}>Continue →</button>
</div>,

<div className="fade-in" style={{padding:"32px 24px"}}>
  <div style={{fontFamily:"'Cinzel',serif",fontSize:22,color:"#F4C542",marginBottom:24,textAlign:"center"}}>Your Preferences</div>
  <div style={{marginBottom:16}}>
    <label style={{display:"block",marginBottom:8,color:"#FDEAAA60",fontSize:11,fontFamily:"'DM Mono',monospace",letterSpacing:1}}>BIBLE TRANSLATION</label>
    <select value={trans} onChange={e=>setTrans(e.target.value)}>{["NIV","KJV","ESV","NLT","NKJV"].map(t=><option key={t}>{t}</option>)}</select>
  </div>
  <div style={{marginBottom:28}}>
    <label style={{display:"block",marginBottom:10,color:"#FDEAAA60",fontSize:11,fontFamily:"'DM Mono',monospace",letterSpacing:1}}>DIFFICULTY</label>
    {[["beginner","🌱","2–3 blanks per verse"],["intermediate","🌿","4 blanks per verse"],["advanced","🌳","5+ blanks per verse"]].map(([d,ic,dc])=>(
      <div key={d} onClick={()=>setDiff(d)} style={{padding:"12px 16px",borderRadius:10,border:`1.5px solid ${diff===d?"#F4C542":"#F4C54218"}`,background:diff===d?"#F4C5420E":"transparent",marginBottom:8,cursor:"pointer",display:"flex",alignItems:"center",gap:12,transition:"all .15s"}}>
        <span style={{fontSize:20}}>{ic}</span>
        <div><div style={{fontWeight:600,textTransform:"capitalize",color:"#FDEAAA",fontSize:14}}>{d}</div><div style={{fontSize:12,color:"#FDEAAA48"}}>{dc}</div></div>
      </div>
    ))}
  </div>
  <button className="btn-gold" style={{width:"100%"}} onClick={()=>onDone({name:name.trim(),avatar:ava,translation:trans,difficulty:diff,joinDate:new Date().toISOString()})}>Enter the Quest! ✨</button>
</div>
```

];

return (
<div style={{fontFamily:”‘Lora’,serif”,background:“radial-gradient(ellipse at top,#1A1830,#0F0E17)”,minHeight:“100vh”,color:”#FDEAAA”,maxWidth:480,margin:“0 auto”,display:“flex”,flexDirection:“column”,justifyContent:“center”}}>
<style>{CSS}</style>
<div style={{display:“flex”,gap:6,padding:“0 28px 24px”}}>
{[0,1,2].map(i=><div key={i} style={{flex:1,height:3,borderRadius:2,background:i<=step?”#F4C542”:”#F4C54218”,transition:“background .3s”}}/>)}
</div>
{pages[step]}
</div>
);
}

// ─────────────────────────────────────────────
// HOME
// ─────────────────────────────────────────────
function Home({user,stats,progress,lvl,isOpen,dailyVid,dailyDone,gameComplete,onPlusMode,onVerse,snd}) {
const dailyVerse = VERSES.find(v=>v.id===dailyVid) || VERSES[0];
const dailyMs    = progress[dailyVid]?.masteryScore || 0;

// Time until midnight reset
const [timeLeft, setTimeLeft] = useState(””);
useEffect(()=>{
const tick = () => {
const now=new Date(), next=new Date(now); next.setHours(24,0,0,0);
const diff=Math.max(0,Math.floor((next-now)/1000));
const h=String(Math.floor(diff/3600)).padStart(2,“0”);
const m=String(Math.floor((diff%3600)/60)).padStart(2,“0”);
const s=String(diff%60).padStart(2,“0”);
setTimeLeft(`${h}:${m}:${s}`);
};
tick(); const id=setInterval(tick,1000); return ()=>clearInterval(id);
},[]);

return (
<div style={{flex:1,overflowY:“auto”,paddingBottom:72}}>
{/* Header */}
<div style={{padding:“22px 20px 14px”,background:“linear-gradient(180deg,#1A183070,transparent)”}}>
<div style={{display:“flex”,justifyContent:“space-between”,alignItems:“center”,marginBottom:14}}>
<div style={{display:“flex”,alignItems:“center”,gap:12}}>
<div style={{width:44,height:44,borderRadius:12,background:”#1E1C38”,border:“2px solid #F4C54230”,display:“flex”,alignItems:“center”,justifyContent:“center”,fontSize:26}}>{user.avatar}</div>
<div>
<div style={{fontFamily:”‘Cinzel’,serif”,color:”#F4C54278”,fontSize:11,letterSpacing:1.5}}>WELCOME BACK</div>
<div style={{fontSize:17,fontWeight:600}}>{user.name}</div>
</div>
</div>
<div style={{display:“flex”,gap:14,fontFamily:”‘DM Mono’,monospace”,fontSize:13}}>
<div style={{textAlign:“center”}}><div>🔥</div><div style={{color:”#F4C542”}}>{stats.streak}d</div></div>
<div style={{textAlign:“center”}}><div>⭐</div><div style={{color:”#F4C542”}}>{stats.totalPoints}</div></div>
</div>
</div>
<div style={{display:“flex”,alignItems:“center”,gap:10}}>
<div style={{fontFamily:”‘DM Mono’,monospace”,fontSize:10,color:”#FDEAAA45”,whiteSpace:“nowrap”}}>Lv.{lvl.level} {lvl.title}</div>
<div className="pbar" style={{flex:1}}><div className=“pbar-fill g” style={{width:`${(lvl.current/lvl.needed)*100}%`}}/></div>
<div style={{fontFamily:”‘DM Mono’,monospace”,fontSize:10,color:”#FDEAAA45”,whiteSpace:“nowrap”}}>{lvl.current}/{lvl.needed}</div>
</div>
</div>

```
  <div style={{padding:"0 18px"}}>
    {/* Daily Challenge */}
    <div style={{marginBottom:24}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
        <div style={{fontFamily:"'Cinzel',serif",fontSize:11,color:"#F4C542",letterSpacing:2.5,textTransform:"uppercase"}}>⚡ Today's Challenge</div>
        <div style={{fontFamily:"'DM Mono',monospace",fontSize:10,color:"#FDEAAA38"}}>resets in {timeLeft}</div>
      </div>
      <div
        onClick={()=>{ if(!dailyDone&&isOpen(dailyVerse)){snd.tap();onVerse(dailyVerse);} }}
        style={{background:dailyDone?"linear-gradient(135deg,#1A3028,#1E3830)":"linear-gradient(135deg,#1A1830,#1E1C38)",border:`1.5px solid ${dailyDone?"#52B78850":"#F4C54240"}`,borderRadius:16,padding:18,cursor:dailyDone?"default":"pointer",transition:"all .2s"}}
        onMouseEnter={e=>{ if(!dailyDone) e.currentTarget.style.borderColor="#F4C54280"; }}
        onMouseLeave={e=>{ if(!dailyDone) e.currentTarget.style.borderColor=dailyDone?"#52B78850":"#F4C54240"; }}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12}}>
          <div style={{flex:1,minWidth:0,marginRight:12}}>
            <div style={{fontFamily:"'Cinzel',serif",color:dailyDone?"#52B788":"#F4C542",fontSize:16,marginBottom:5}}>{dailyDone?"✅ ":""}{dailyVerse.ref}</div>
            <div style={{fontSize:13,color:"#FDEAAA55",fontStyle:"italic",lineHeight:1.55}}>"{dailyVerse.text.slice(0,70)}{dailyVerse.text.length>70?"...":""}"</div>
          </div>
          <div style={{background:dailyDone?"#52B788":"#F4C542",color:"#0F0E17",borderRadius:8,padding:"4px 10px",fontFamily:"'DM Mono',monospace",fontSize:11,fontWeight:700,whiteSpace:"nowrap",flexShrink:0}}>
            {dailyDone?"Done ✓":"+100 🌟"}
          </div>
        </div>
        <div className="pbar"><div className="pbar-fill" style={{width:`${dailyMs}%`,background:dailyDone?"linear-gradient(90deg,#52B788,#3D9A6C)":undefined}}/></div>
        <div style={{display:"flex",justifyContent:"space-between",fontFamily:"'DM Mono',monospace",fontSize:10,color:"#FDEAAA38",marginTop:5}}>
          <span>{dailyMs}% mastery</span>
          {!dailyDone&&<span>Complete a puzzle → earn +100 bonus</span>}
        </div>
      </div>
    </div>

    {/* Verse Groups */}
    <div style={{fontFamily:"'Cinzel',serif",fontSize:11,color:"#F4C542",letterSpacing:2.5,marginBottom:14,textTransform:"uppercase"}}>📜 Scripture Quest Path</div>

    {VERSE_GROUPS.map((group, gi) => {
      const groupOpen   = groupUnlocked(gi, progress);
      const prevGroup   = gi > 0 ? VERSE_GROUPS[gi-1] : null;
      const mastered    = group.verses.filter(v=>(progress[v.id]?.masteryScore||0)>=MASTERY).length;
      const groupDone   = mastered === group.verses.length;
      const borderColor = groupDone ? "#52B78840" : groupOpen ? group.color+"35" : "#FDEAAA0A";
      const bgColor     = groupDone ? "#52B78808" : groupOpen ? group.color+"08" : "#0C0B16";

      // How many of the previous group are done (for locked state messaging)
      const prevMastered = prevGroup ? prevGroup.verses.filter(v=>(progress[v.id]?.masteryScore||0)>=MASTERY).length : 5;

      return (
        <div key={group.tier} style={{border:`1.5px solid ${borderColor}`,borderRadius:16,marginBottom:14,overflow:"hidden",background:bgColor,transition:"all .3s"}}>
          {/* Group header */}
          <div style={{padding:"14px 16px 12px",borderBottom:`1px solid ${borderColor}`}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                <div style={{fontSize:22}}>{groupDone?"✅":groupOpen?"📖":"🔒"}</div>
                <div>
                  <div style={{fontFamily:"'Cinzel',serif",color:groupDone?"#52B788":groupOpen?group.color:"#FDEAAA28",fontSize:15,fontWeight:600}}>
                    {group.label}
                  </div>
                  <div style={{fontFamily:"'DM Mono',monospace",fontSize:10,color:"#FDEAAA40",marginTop:2}}>
                    {groupDone ? "All 5 mastered ✓" : groupOpen ? `${mastered}/5 mastered` : `Complete "${prevGroup?.label}" first`}
                  </div>
                </div>
              </div>
              {groupOpen && (
                <div style={{fontFamily:"'DM Mono',monospace",fontSize:11,color:groupDone?"#52B788":group.color}}>
                  {mastered}/5
                </div>
              )}
            </div>

            {/* Group progress bar */}
            {groupOpen && (
              <div style={{marginTop:10}}>
                <div className="pbar"><div className="pbar-fill" style={{width:`${(mastered/5)*100}%`,background:groupDone?"linear-gradient(90deg,#52B788,#3D9A6C)":`linear-gradient(90deg,${group.color},${group.color}99)`}}/></div>
              </div>
            )}

            {/* Locked state: show how many of prev group remain */}
            {!groupOpen && prevGroup && (
              <div style={{marginTop:10}}>
                <div style={{fontFamily:"'DM Mono',monospace",fontSize:10,color:"#FDEAAA28",marginBottom:4}}>{prevMastered}/5 of previous group mastered</div>
                <div className="pbar"><div className="pbar-fill r" style={{width:`${(prevMastered/5)*100}%`}}/></div>
              </div>
            )}
          </div>

          {/* Individual verse cards — only shown when group is open */}
          {groupOpen && (
            <div style={{padding:"8px 12px 10px"}}>
              {group.verses.map(v => {
                const ms   = progress[v.id]?.masteryScore || 0;
                const done = ms >= MASTERY;
                const isDaily = v.id === dailyVid;
                return (
                  <div key={v.id}
                    onClick={()=>{snd.tap();onVerse(v);}}
                    style={{display:"flex",alignItems:"center",gap:12,padding:"9px 10px",borderRadius:10,marginBottom:4,cursor:"pointer",background:done?"#52B78810":"#1E1C3860",border:`1px solid ${done?"#52B78830":isDaily?"#F4C54230":"#FDEAAA0A"}`,transition:"all .15s"}}
                    onMouseEnter={e=>e.currentTarget.style.background=done?"#52B78818":"#F4C54210"}
                    onMouseLeave={e=>e.currentTarget.style.background=done?"#52B78810":"#1E1C3860"}>
                    <div style={{fontSize:16,flexShrink:0}}>{done?"✅":"📄"}</div>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{display:"flex",alignItems:"center",gap:6}}>
                        <div style={{fontFamily:"'Cinzel',serif",fontSize:13,color:done?"#52B788":"#FDEAAA",fontWeight:done?600:400}}>{v.ref}</div>
                        {isDaily&&!dailyDone&&<div style={{background:"#F4C54222",color:"#F4C542",fontFamily:"'DM Mono',monospace",fontSize:8,padding:"1px 5px",borderRadius:3,letterSpacing:.5}}>TODAY</div>}
                      </div>
                      <div style={{marginTop:4}}>
                        <div className="pbar" style={{height:4}}>
                          <div className="pbar-fill" style={{width:`${ms}%`,background:done?"linear-gradient(90deg,#52B788,#3D9A6C)":undefined,height:"100%"}}/>
                        </div>
                      </div>
                    </div>
                    <div style={{fontFamily:"'DM Mono',monospace",fontSize:11,color:done?"#52B788":"#FDEAAA40",flexShrink:0}}>{ms}%</div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      );
    })}
  </div>
</div>
```

);
}

// ─────────────────────────────────────────────
// QUEST HUB
// ─────────────────────────────────────────────
function Quest({verse,progress,onMode,onBack,snd}) {
const ms = progress[verse.id]?.masteryScore||0;
const [tts,setTts] = useState(false);
const speak = () => { setTts(true); const u=new SpeechSynthesisUtterance(verse.text); u.onend=()=>setTts(false); speechSynthesis.speak(u); };
const MODES = [
{t:“fill”,      ic:“✍️”, nm:“Fill in the Blanks”, dc:“Tap missing words from the word bank”,            pt:“10–15 pts”, cl:”#4A9EDB”},
{t:“scramble”,  ic:“🔀”, nm:“Word Scramble”,       dc:“Arrange all the words in the correct order”,       pt:“20 pts”,    cl:”#9B59B6”},
{t:“crossword”, ic:“✏️”, nm:“Crossword”,            dc:“Solve verse-based theological clues”,             pt:“50 pts”,    cl:”#52B788”},
{t:“typing”,    ic:“⌨️”, nm:“Typing Race”,          dc:“Type the verse from memory — beat the clock!”,    pt:“25–60 pts”, cl:”#E67E22”},
];
return (
<div style={{flex:1,overflowY:“auto”,paddingBottom:20}}>
<div style={{padding:“20px 20px 14px”}}>
<button onClick={()=>{snd.tap();onBack();}} style={{background:“none”,border:“none”,color:”#FDEAAA62”,cursor:“pointer”,fontSize:14,marginBottom:16}}>← Back</button>
<div style={{fontFamily:”‘Cinzel’,serif”,fontSize:22,color:”#F4C542”,marginBottom:3}}>{verse.ref}</div>
<div style={{fontSize:11,color:”#FDEAAA48”,fontFamily:”‘DM Mono’,monospace”,marginBottom:12}}>Mastery: {ms}%</div>
<div className="pbar"><div className=“pbar-fill” style={{width:`${ms}%`}}/></div>
</div>
<div style={{padding:“0 18px”}}>
<div className="card" style={{marginBottom:20}}>
<div style={{fontStyle:“italic”,lineHeight:1.85,fontSize:15,color:”#FDEAAA”,marginBottom:12}}>”{verse.text}”</div>
<div style={{display:“flex”,justifyContent:“space-between”,alignItems:“center”}}>
<div style={{fontFamily:”‘Cinzel’,serif”,color:”#F4C54272”,fontSize:13}}>— {verse.ref}</div>
<button onClick={speak} className=“btn-ghost” style={{padding:“6px 13px”,fontSize:12}}>{tts?“🔊 Playing…”:“🔊 Listen”}</button>
</div>
</div>
<div style={{fontFamily:”‘Cinzel’,serif”,fontSize:11,color:”#F4C542”,letterSpacing:2.5,marginBottom:12,textTransform:“uppercase”}}>Choose Practice Mode</div>
{MODES.map(m=>(
<div key={m.t} onClick={()=>{snd.tap();onMode(m.t);}} style={{background:”#1A1830”,border:`1.5px solid ${m.cl}1E`,borderRadius:14,padding:“14px 16px”,marginBottom:10,cursor:“pointer”,transition:“all .2s”,display:“flex”,alignItems:“center”,gap:14}}
onMouseEnter={e=>e.currentTarget.style.borderColor=m.cl+“60”}
onMouseLeave={e=>e.currentTarget.style.borderColor=m.cl+“1E”}>
<div style={{width:46,height:46,borderRadius:12,background:m.cl+“14”,display:“flex”,alignItems:“center”,justifyContent:“center”,fontSize:22,flexShrink:0}}>{m.ic}</div>
<div style={{flex:1}}>
<div style={{fontFamily:”‘Cinzel’,serif”,color:”#FDEAAA”,fontSize:14,marginBottom:2}}>{m.nm}</div>
<div style={{fontSize:12,color:”#FDEAAA4C”}}>{m.dc}</div>
</div>
<div style={{fontFamily:”‘DM Mono’,monospace”,fontSize:11,color:m.cl,flexShrink:0}}>{m.pt}</div>
</div>
))}
</div>
</div>
);
}

// ─────────────────────────────────────────────
// PUZZLE ROUTER
// ─────────────────────────────────────────────
function PuzzleRouter({verse,mode,onDone,onBack,snd}) {
if (mode===“fill”)      return <Fill      verse={verse} onDone={onDone} onBack={onBack} snd={snd} />;
if (mode===“scramble”)  return <Scramble  verse={verse} onDone={onDone} onBack={onBack} snd={snd} />;
if (mode===“crossword”) return <Crossword verse={verse} onDone={onDone} onBack={onBack} snd={snd} />;
if (mode===“typing”)    return <Typing    verse={verse} onDone={onDone} onBack={onBack} snd={snd} />;
return null;
}

// ─────────────────────────────────────────────
// FILL IN THE BLANK
// ─────────────────────────────────────────────
function Fill({verse,onDone,onBack,snd}) {
const [puz]       = useState(()=>makeFillBlank(verse.text));
const [filled,    setFilled]    = useState({});
const [submitted, setSubmitted] = useState(false);
const [devo,      setDevo]      = useState(null);
const [loadDevo,  setLoadDevo]  = useState(false);

const blanks   = puz.parts.filter(p=>p.type===“blank”);
const nextBlank = blanks.findIndex((_,i)=>filled[i]===undefined);
const allFilled = nextBlank===-1;

const tapWord = w => {
if (submitted || nextBlank===-1) return;
snd.tap();
setFilled(prev=>({…prev,[nextBlank]:w}));
};
const clearBlank = i => { if (submitted) return; setFilled(prev=>{const n={…prev};delete n[i];return n;}); };
const hint = () => { if (submitted||nextBlank===-1) return; snd.tap(); setFilled(prev=>({…prev,[nextBlank]:blanks[nextBlank].answer})); };

const submit = async () => {
setSubmitted(true);
const correct = blanks.filter((b,i)=>(filled[i]||””).toLowerCase()===b.answer.toLowerCase()).length;
const pct     = Math.round((correct/blanks.length)*100);
const pts     = correct*10 + (correct===blanks.length?15:0);
correct===blanks.length ? snd.complete() : correct>0 ? snd.correct() : snd.wrong();
setLoadDevo(true);
const dev = await fetchDevo(verse);
setDevo(dev||DEVOS[verse.id]||null);
setLoadDevo(false);
setTimeout(()=>onDone(pct,pts,“fillDone”),4200);
};

let bi=0;
return (
<div style={{flex:1,overflowY:“auto”,padding:“20px 18px 32px”}}>
<button onClick={onBack} style={{background:“none”,border:“none”,color:”#FDEAAA62”,cursor:“pointer”,fontSize:14,marginBottom:16}}>← Back</button>
<div style={{fontFamily:”‘Cinzel’,serif”,fontSize:20,color:”#F4C542”,marginBottom:3}}>Fill in the Blanks</div>
<div style={{fontSize:11,color:”#FDEAAA48”,fontFamily:”‘DM Mono’,monospace”,marginBottom:18}}>{verse.ref} · Tap a word to fill the next blank · tap a filled blank to clear</div>

```
  <div className="card" style={{marginBottom:18,lineHeight:2.5,fontSize:15}}>
    {puz.parts.map((p,i)=>{
      if (p.type==="text") return <span key={i}>{p.content} </span>;
      const idx=bi++;
      const val=filled[idx];
      const next=idx===nextBlank&&!submitted;
      const ok=submitted&&val?.toLowerCase()===p.answer.toLowerCase();
      const bad=submitted&&val&&!ok;
      return (
        <span key={i}>
          <span className={`blank${val?" has":""}${ok?" ok":""}${bad?" bad":""}`}
            style={{outline:next?"2px solid #F4C54250":"none",outlineOffset:2,minWidth:Math.max(58,p.answer.length*9)}}
            onClick={()=>val&&clearBlank(idx)}>
            {val||(next?"▸":"___")}
          </span>{" "}
        </span>
      );
    })}
  </div>

  {!submitted && (
    <div style={{marginBottom:18,padding:"12px",background:"#12111E",borderRadius:12,minHeight:52,textAlign:"center"}}>
      {puz.wordBank.map((w,i)=>{
        const used=Object.values(filled).includes(w);
        return <span key={i} className={`chip${used?" used":""}`} onClick={()=>!used&&tapWord(w)}>{w}</span>;
      })}
    </div>
  )}

  {!submitted ? (
    <div style={{display:"flex",gap:10}}>
      <button className="btn-ghost" style={{flex:1}} onClick={hint}>💡 Hint</button>
      <button className="btn-gold"  style={{flex:2}} disabled={!allFilled} onClick={submit}>Check Answers ✓</button>
    </div>
  ):(
    <div className="fade-in">
      <div style={{textAlign:"center",marginBottom:16}}>
        <div style={{fontSize:44,marginBottom:6}}>{blanks.filter((b,i)=>(filled[i]||"").toLowerCase()===b.answer.toLowerCase()).length===blanks.length?"🎉":"📖"}</div>
        <div style={{fontFamily:"'Cinzel',serif",color:"#F4C542",fontSize:18}}>
          {blanks.filter((b,i)=>(filled[i]||"").toLowerCase()===b.answer.toLowerCase()).length}/{blanks.length} correct
        </div>
      </div>
      {(loadDevo||devo) && (
        <div className="card" style={{borderColor:"#F4C54225"}}>
          <div style={{fontFamily:"'Cinzel',serif",color:"#F4C542",fontSize:11,letterSpacing:1.5,marginBottom:10}}>✨ DEVOTIONAL INSIGHT</div>
          {loadDevo
            ? <div style={{color:"#FDEAAA40",fontFamily:"'DM Mono',monospace",fontSize:12,animation:"shimmer 1.5s infinite"}}>Loading insight...</div>
            : <div style={{fontStyle:"italic",lineHeight:1.8,fontSize:14}}>{devo}</div>}
        </div>
      )}
    </div>
  )}
</div>
```

);
}

// ─────────────────────────────────────────────
// WORD SCRAMBLE
// ─────────────────────────────────────────────
function Scramble({verse,onDone,onBack,snd}) {
const original = verse.text.replace(/[.,;!?’”]/g,””).split(/\s+/).filter(Boolean);
const [pool,     setPool]     = useState(()=>shuffle(original));
const [arranged, setArranged] = useState([]);
const [done,     setDone]     = useState(false);

const add = (w,i) => { if (done) return; snd.tap(); setArranged(p=>[…p,w]); setPool(p=>{const n=[…p];n.splice(i,1);return n;}); };
const rem = i => { if (done) return; snd.tap(); const w=arranged[i]; setArranged(p=>{const n=[…p];n.splice(i,1);return n;}); setPool(p=>[…p,w]); };

const check = () => {
setDone(true);
const correct = arranged.join(” “)===original.join(” “);
const matches = arranged.filter((w,i)=>w===original[i]).length;
const pct     = Math.round((matches/original.length)*100);
correct ? snd.complete() : pct>50 ? snd.correct() : snd.wrong();
setTimeout(()=>onDone(pct,20,“scrambleDone”),2200);
};

return (
<div style={{flex:1,overflowY:“auto”,padding:“20px 18px 32px”}}>
<button onClick={onBack} style={{background:“none”,border:“none”,color:”#FDEAAA62”,cursor:“pointer”,fontSize:14,marginBottom:16}}>← Back</button>
<div style={{fontFamily:”‘Cinzel’,serif”,fontSize:20,color:”#F4C542”,marginBottom:3}}>Word Scramble</div>
<div style={{fontSize:11,color:”#FDEAAA48”,fontFamily:”‘DM Mono’,monospace”,marginBottom:18}}>{verse.ref} · Tap words to build the verse · tap placed words to remove</div>

```
  <div className="card" style={{minHeight:88,marginBottom:14,lineHeight:2.3}}>
    {arranged.length===0
      ? <div style={{color:"#FDEAAA28",fontStyle:"italic",fontSize:14}}>Tap words below to build the verse here...</div>
      : arranged.map((w,i)=>{
          const ok=done&&w===original[i], bad=done&&w!==original[i];
          return <span key={i} className={`chip${ok?" ok":bad?" bad":""}`} onClick={()=>rem(i)}>{w}</span>;
        })}
  </div>

  <div style={{marginBottom:20,padding:"12px",background:"#12111E",borderRadius:12,minHeight:52,textAlign:"center"}}>
    {pool.map((w,i)=><span key={i} className="chip" onClick={()=>add(w,i)}>{w}</span>)}
  </div>

  {!done
    ? <button className="btn-gold" style={{width:"100%"}} disabled={pool.length>0} onClick={check}>
        {pool.length>0?`${pool.length} word${pool.length!==1?"s":""} remaining`:"Check Order ✓"}
      </button>
    : <div className="fade-in" style={{textAlign:"center"}}>
        <div style={{fontSize:40,marginBottom:8}}>{arranged.join(" ")===original.join(" ")?"🎉 Perfect!":"📖 Almost!"}</div>
        {arranged.join(" ")!==original.join(" ") && <div style={{fontSize:13,color:"#FDEAAA62",fontStyle:"italic",lineHeight:1.7,marginTop:8}}>Correct: "{original.join(" ")}"</div>}
      </div>}
</div>
```

);
}

// ─────────────────────────────────────────────
// CROSSWORD
// ─────────────────────────────────────────────
function Crossword({verse,onDone,onBack,snd}) {
const [data]   = useState(()=>makeCrossword(verse.id));
const [ug,setUg] = useState(()=>Array.from({length:data.size},()=>Array(data.size).fill(””)));
const [activeW, setActiveW] = useState(data.words[0]||null);
const [done,    setDone]    = useState(false);
const refs = useRef({});

const numMap={};
data.words.forEach((w,i)=>{ const k=`${w.row}-${w.col}`; if(!numMap[k]) numMap[k]=i+1; });

const actCells=new Set();
if (activeW) for (let i=0;i<activeW.answer.length;i++)
actCells.add(activeW.direction===“down”?`${activeW.row+i}-${activeW.col}`:`${activeW.row}-${activeW.col+i}`);

const handleInput=(r,c,val)=>{
const letter=val.toUpperCase().replace(/[^A-Z]/g,””).slice(-1);
snd.tick();
const ng=ug.map((row,ri)=>row.map((cell,ci)=>ri===r&&ci===c?letter:cell));
setUg(ng);
const complete=data.words.length>0&&data.words.every(w=>{
for(let i=0;i<w.answer.length;i++){
const wr=w.direction===“down”?w.row+i:w.row, wc=w.direction===“across”?w.col+i:w.col;
if(ng[wr]?.[wc]!==w.answer[i]) return false;
}
return true;
});
if(complete){setDone(true);snd.complete();setTimeout(()=>onDone(100,50,“crossDone”),1600);}
if(letter&&activeW){
const pos=activeW.direction===“across”?c-activeW.col:r-activeW.row;
if(pos<activeW.answer.length-1){
const nr=activeW.direction===“down”?r+1:r, nc=activeW.direction===“across”?c+1:c;
refs.current[`${nr}-${nc}`]?.focus();
}
}
};

const handleKey=(r,c,e)=>{
if(e.key===“Backspace”){e.preventDefault();
if(ug[r][c]===””&&activeW){
const pos=activeW.direction===“across”?c-activeW.col:r-activeW.row;
if(pos>0){const pr=activeW.direction===“down”?r-1:r,pc=activeW.direction===“across”?c-1:c;refs.current[`${pr}-${pc}`]?.focus();}
} else setUg(p=>p.map((row,ri)=>row.map((cell,ci)=>ri===r&&ci===c?””:cell)));
}
};

if (!data.words.length) return (
<div style={{flex:1,padding:“20px 18px”}}>
<button onClick={onBack} style={{background:“none”,border:“none”,color:”#FDEAAA62”,cursor:“pointer”,fontSize:14,marginBottom:16}}>← Back</button>
<div className=“card” style={{textAlign:“center”,padding:32}}>
<div style={{fontSize:36,marginBottom:10}}>⚠️</div>
<div style={{fontFamily:”‘Cinzel’,serif”,color:”#F4C542”,marginBottom:8}}>Crossword unavailable</div>
<div style={{fontSize:13,color:”#FDEAAA52”}}>Try Fill in the Blanks or Word Scramble for this verse!</div>
<button className="btn-ghost" style={{marginTop:16}} onClick={onBack}>← Back</button>
</div>
</div>
);

return (
<div style={{flex:1,overflowY:“auto”,padding:“20px 18px 32px”}}>
<button onClick={onBack} style={{background:“none”,border:“none”,color:”#FDEAAA62”,cursor:“pointer”,fontSize:14,marginBottom:16}}>← Back</button>
<div style={{fontFamily:”‘Cinzel’,serif”,fontSize:20,color:”#F4C542”,marginBottom:3}}>Crossword</div>
<div style={{fontSize:11,color:”#FDEAAA48”,fontFamily:”‘DM Mono’,monospace”,marginBottom:14}}>{verse.ref} · Click a clue to activate it</div>

```
  {activeW && (
    <div className="card" style={{marginBottom:14,padding:"10px 14px"}}>
      <div style={{fontFamily:"'DM Mono',monospace",fontSize:10,color:"#F4C542",marginBottom:4,letterSpacing:1}}>
        {data.words.indexOf(activeW)+1} {activeW.direction?.toUpperCase()} — {activeW.answer.length} letters
      </div>
      <div style={{fontSize:14,fontStyle:"italic"}}>{activeW.clue}</div>
    </div>
  )}

  <div style={{overflowX:"auto",marginBottom:18}}>
    <div style={{display:"inline-block",border:"1px solid #F4C54212",borderRadius:8,overflow:"hidden"}}>
      {Array.from({length:data.size},(_,r)=>(
        <div key={r} style={{display:"flex"}}>
          {Array.from({length:data.size},(_,c)=>{
            const letter=data.grid[r]?.[c];
            if(!letter) return <div key={c} className="cc blk"/>;
            const isAct=actCells.has(`${r}-${c}`);
            const isDone=done||ug[r][c]===letter;
            const num=numMap[`${r}-${c}`];
            return (
              <div key={c} style={{position:"relative"}}>
                {num&&<span className="cnum">{num}</span>}
                <input className={`cc${isAct?" act":""}${isDone?" fin":""}`}
                  ref={el=>{if(el)refs.current[`${r}-${c}`]=el;}}
                  maxLength={2} value={ug[r][c]}
                  onChange={e=>handleInput(r,c,e.target.value)}
                  onKeyDown={e=>handleKey(r,c,e)}
                  onFocus={()=>{
                    const w=data.words.find(w=>
                      (w.direction==="across"&&r===w.row&&c>=w.col&&c<w.col+w.answer.length)||
                      (w.direction==="down"&&c===w.col&&r>=w.row&&r<w.row+w.answer.length));
                    if(w) setActiveW(w);
                  }}
                />
              </div>
            );
          })}
        </div>
      ))}
    </div>
  </div>

  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
    {["across","down"].map(dir=>(
      <div key={dir}>
        <div style={{fontFamily:"'DM Mono',monospace",fontSize:10,color:"#F4C542",marginBottom:8,letterSpacing:1,textTransform:"uppercase"}}>{dir}</div>
        {data.words.filter(w=>w.direction===dir).map(w=>(
          <div key={w.answer} onClick={()=>{snd.tap();setActiveW(w);}} style={{fontSize:12,color:activeW===w?"#F4C542":"#FDEAAA62",marginBottom:5,cursor:"pointer",padding:"4px 7px",borderRadius:6,background:activeW===w?"#F4C54210":"transparent",lineHeight:1.45}}>
            <span style={{fontFamily:"'DM Mono',monospace",color:"#F4C54272"}}>{data.words.indexOf(w)+1}. </span>{w.clue}
          </div>
        ))}
      </div>
    ))}
  </div>

  {done&&(
    <div className="fade-in" style={{textAlign:"center",padding:"24px 0"}}>
      <div style={{fontSize:48,marginBottom:8}}>🎉</div>
      <div style={{fontFamily:"'Cinzel',serif",color:"#F4C542",fontSize:20}}>Crossword Complete!</div>
      <div style={{color:"#FDEAAA62",fontSize:13,marginTop:6}}>+50 Faith Points earned</div>
    </div>
  )}
</div>
```

);
}

// ─────────────────────────────────────────────
// TYPING RACE  🆕  (replaces voice recitation)
// ─────────────────────────────────────────────
const TYPING_TIME = 90; // seconds

function Typing({verse,onDone,onBack,snd}) {
// Stages: study → race → result
const [stage, setStage] = useState(“study”);
const [input, setInput] = useState(””);
const [timeLeft, setTimeLeft] = useState(TYPING_TIME);
const [startTime, setStartTime] = useState(null);
const [finished, setFinished] = useState(false);
const timerRef  = useRef(null);
const inputRef  = useRef(null);

// Tokenise the verse into words (strip punctuation for comparison)
const TARGET_WORDS = verse.text.split(/\s+/).filter(Boolean);
const CLEAN_TARGET = TARGET_WORDS.map(w => w.replace(/[^a-zA-Z]/g,””).toLowerCase());

// Split user input into typed words
const typedWords  = input.trimEnd().split(/\s+/).filter(Boolean);
const currentIdx  = input.endsWith(” “) ? typedWords.length : Math.max(0,typedWords.length-1);

// Evaluate each typed word
const evalWord = (typed, targetIdx) => {
if (targetIdx>=CLEAN_TARGET.length) return “extra”;
const clean = typed.replace(/[^a-zA-Z]/g,””).toLowerCase();
return clean===CLEAN_TARGET[targetIdx] ? “correct” : “wrong”;
};

const correctCount = typedWords.filter((w,i)=>evalWord(w,i)===“correct”).length;
const pct = Math.min(100,Math.round((correctCount/TARGET_WORDS.length)*100));

// Check completion
useEffect(()=>{
if (stage!==“race”||finished) return;
const allTyped = typedWords.length>=TARGET_WORDS.length&&input.endsWith(” “);
if (allTyped) finish(“complete”);
},[input]);

// Timer
useEffect(()=>{
if (stage!==“race”||finished) return;
timerRef.current=setInterval(()=>{
setTimeLeft(t=>{
if (t<=1){ clearInterval(timerRef.current); finish(“timeout”); return 0; }
if (t<=10) snd.warn();
return t-1;
});
},1000);
return ()=>clearInterval(timerRef.current);
},[stage]);

const startRace = () => {
setStage(“race”);
setStartTime(Date.now());
setInput(””);
setTimeLeft(TYPING_TIME);
setFinished(false);
setTimeout(()=>inputRef.current?.focus(),100);
};

const finish = (reason) => {
setFinished(true);
clearInterval(timerRef.current);
setStage(“result”);
// score based on accuracy + time bonus
const timeTaken = (Date.now()-startTime)/1000;
const timeBonus = reason===“complete” ? Math.max(0, Math.round((TYPING_TIME-timeTaken)/TYPING_TIME*20)) : 0;
const pts = Math.round(pct*0.45) + timeBonus; // max ~65 pts
const finalPts = Math.max(5, pts);
if (pct>=90) snd.complete();
else if (pct>=60) snd.correct();
else snd.wrong();
setTimeout(()=>onDone(pct, finalPts, “typingDone”), 3800);
};

const handleKey = e => {
if (finished) return;
snd.tick();
// Space advances to next word — prevent double-space
if (e.key===” “ && input.endsWith(” “)) { e.preventDefault(); return; }
};

const handleChange = e => {
if (finished) return;
setInput(e.target.value);
};

// Colour helpers
const wordColor = (typed, targetIdx) => {
const s = evalWord(typed, targetIdx);
if (s===“correct”) return “#52B788”;
if (s===“wrong”)   return “#f08080”;
return “#FDEAAA”;
};

const timerColor = timeLeft<=10 ? “#C0392B” : timeLeft<=30 ? “#E67E22” : “#52B788”;
const timerPct   = (timeLeft/TYPING_TIME)*100;

return (
<div style={{flex:1,overflowY:“auto”,padding:“20px 18px 32px”}}>
<button onClick={onBack} style={{background:“none”,border:“none”,color:”#FDEAAA62”,cursor:“pointer”,fontSize:14,marginBottom:16}}>← Back</button>
<div style={{fontFamily:”‘Cinzel’,serif”,fontSize:20,color:”#F4C542”,marginBottom:3}}>Typing Race</div>
<div style={{fontSize:11,color:”#FDEAAA48”,fontFamily:”‘DM Mono’,monospace”,marginBottom:18}}>{verse.ref} · Type the verse from memory · you have {TYPING_TIME}s</div>

```
  {/* ── STUDY ── */}
  {stage==="study" && (
    <div className="fade-in">
      <div className="card" style={{marginBottom:18}}>
        <div style={{fontStyle:"italic",lineHeight:1.9,fontSize:15,marginBottom:12}}>"{verse.text}"</div>
        <div style={{fontFamily:"'Cinzel',serif",color:"#F4C54270",fontSize:13}}>— {verse.ref}</div>
      </div>
      <div style={{background:"#12111E",borderRadius:12,padding:"14px 16px",marginBottom:20,fontSize:13,color:"#FDEAAA58",lineHeight:1.72}}>
        💡 <strong style={{color:"#FDEAAA88"}}>How it works:</strong> Study the verse above until it feels natural. When you're ready, the verse disappears and a 90-second timer starts. Type it out from memory — each word you type turns green (correct) or red (wrong) instantly. Hit Space after each word to advance. Finish before time runs out for a bonus!
      </div>
      <button className="btn-gold" style={{width:"100%"}} onClick={startRace}>I'm Ready — Start Typing ⌨️</button>
    </div>
  )}

  {/* ── RACE ── */}
  {stage==="race" && (
    <div className="fade-in">
      {/* Timer */}
      <div style={{marginBottom:14}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
          <div style={{fontFamily:"'DM Mono',monospace",fontSize:11,color:"#FDEAAA50"}}>Time remaining</div>
          <div style={{fontFamily:"'Cinzel',serif",fontSize:20,color:timerColor,transition:"color .3s",animation:timeLeft<=10?"pulse 1s infinite":"none"}}>{timeLeft}s</div>
        </div>
        <div className="pbar">
          <div className="pbar-fill" style={{width:`${timerPct}%`,background:`linear-gradient(90deg,${timerColor},${timerColor}99)`,transition:"width 1s linear, background .5s"}}/>
        </div>
      </div>

      {/* Progress */}
      <div style={{display:"flex",justifyContent:"space-between",fontFamily:"'DM Mono',monospace",fontSize:11,color:"#FDEAAA45",marginBottom:6}}>
        <span>{correctCount}/{TARGET_WORDS.length} words</span>
        <span>{pct}% accuracy</span>
      </div>
      <div className="pbar" style={{marginBottom:18}}>
        <div className="pbar-fill g" style={{width:`${(typedWords.length/TARGET_WORDS.length)*100}%`}}/>
      </div>

      {/* Word-by-word display of target */}
      <div className="card" style={{marginBottom:14,lineHeight:2.2,fontSize:15,minHeight:80}}>
        {TARGET_WORDS.map((tw,i)=>{
          const typed = typedWords[i];
          const isCurrent = i===currentIdx;
          const color = typed ? wordColor(typed,i) : isCurrent ? "#F4C542" : "#FDEAAA50";
          return (
            <span key={i} style={{
              color,
              fontWeight: isCurrent ? 700 : 400,
              background: isCurrent ? "#F4C54214" : "transparent",
              borderRadius: 4,
              padding: "1px 3px",
              marginRight:4,
              transition:"color .15s",
              textDecoration: typed&&evalWord(typed,i)==="wrong" ? "underline wavy #f08080" : "none"
            }}>
              {tw}
            </span>
          );
        })}
      </div>

      {/* Typing input */}
      <div style={{position:"relative",marginBottom:14}}>
        <textarea
          ref={inputRef}
          value={input}
          onChange={handleChange}
          onKeyDown={handleKey}
          placeholder="Start typing the verse here..."
          rows={3}
          style={{width:"100%",background:"#1E1C38",border:"1.5px solid #F4C54235",borderRadius:12,padding:"12px 14px",color:"#FDEAAA",fontFamily:"'Lora',serif",fontSize:15,resize:"none",outline:"none",lineHeight:1.7,boxSizing:"border-box"}}
        />
        {/* Live word feedback indicator */}
        {typedWords.length>0 && (
          <div style={{position:"absolute",bottom:10,right:12,fontFamily:"'DM Mono',monospace",fontSize:11,color:"#FDEAAA35"}}>
            word {Math.min(typedWords.length,TARGET_WORDS.length)}/{TARGET_WORDS.length}
          </div>
        )}
      </div>

      <button className="btn-ghost" style={{width:"100%"}} onClick={()=>finish("manual")}>Submit Early →</button>
    </div>
  )}

  {/* ── RESULT ── */}
  {stage==="result" && (
    <div className="fade-in">
      <div style={{textAlign:"center",marginBottom:22}}>
        <div style={{fontSize:58,marginBottom:10}}>{pct>=90?"🌟":pct>=70?"✨":pct>=50?"📖":"🙏"}</div>
        <div style={{fontFamily:"'Cinzel',serif",fontSize:36,color:"#F4C542",marginBottom:6}}>{pct}%</div>
        <div style={{fontSize:15,fontStyle:"italic",lineHeight:1.7,color:"#FDEAAA"}}>
          {pct>=95?"Flawless! You have this verse memorized!":pct>=85?"Excellent — nearly perfect!":pct>=70?"Great effort! A bit more practice will lock it in.":pct>=50?"Good start! Review the words in red below.":"Keep practicing — each attempt builds memory!"}
        </div>
      </div>

      {/* Word-by-word results */}
      <div className="card" style={{marginBottom:14}}>
        <div style={{fontFamily:"'DM Mono',monospace",fontSize:10,color:"#FDEAAA50",marginBottom:10,letterSpacing:1}}>WORD-BY-WORD REVIEW:</div>
        <div style={{lineHeight:2.2,fontSize:14}}>
          {TARGET_WORDS.map((tw,i)=>{
            const typed=typedWords[i];
            const ok=typed&&evalWord(typed,i)==="correct";
            const bad=typed&&!ok;
            return (
              <span key={i} style={{
                display:"inline-block",margin:"2px 4px 2px 0",padding:"2px 7px",borderRadius:6,
                background:ok?"#52B78818":bad?"#C0392B18":"#1E1C3850",
                border:`1px solid ${ok?"#52B78848":bad?"#C0392B48":"#FDEAAA14"}`,
                color:ok?"#52B788":bad?"#f08080":"#FDEAAA60",
                fontFamily:"'DM Mono',monospace",fontSize:12
              }}>
                {typed&&bad ? <><span style={{textDecoration:"line-through",opacity:.6}}>{typed}</span><span style={{marginLeft:4}}>{tw}</span></> : tw}
              </span>
            );
          })}
        </div>
      </div>

      <div className="card">
        <div style={{fontFamily:"'DM Mono',monospace",fontSize:10,color:"#F4C542",marginBottom:8,letterSpacing:1}}>FULL VERSE:</div>
        <div style={{fontStyle:"italic",lineHeight:1.8,fontSize:14,color:"#FDEAAA88"}}>"{verse.text}"</div>
      </div>
    </div>
  )}
</div>
```

);
}

// ─────────────────────────────────────────────
// DASHBOARD
// ─────────────────────────────────────────────
function Dash({stats,progress,lvl}) {
const mastered = VERSES.filter(v=>(progress[v.id]?.masteryScore||0)>=MASTERY).length;
const books={};
VERSES.forEach(v=>{
if(!books[v.book]) books[v.book]={t:0,m:0};
books[v.book].t++;
if((progress[v.id]?.masteryScore||0)>=MASTERY) books[v.book].m++;
});
const earned=BADGES.filter(b=>b.cond(stats));

return (
<div style={{flex:1,overflowY:“auto”,padding:“20px 18px 80px”}}>
<div style={{fontFamily:”‘Cinzel’,serif”,fontSize:24,color:”#F4C542”,marginBottom:20}}>My Journey</div>

```
  <div className="card" style={{background:"linear-gradient(135deg,#1A1830,#1E1C38)",marginBottom:14}}>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
      <div><div style={{fontFamily:"'Cinzel',serif",color:"#F4C542",fontSize:18}}>Level {lvl.level}</div><div style={{color:"#FDEAAA62",fontSize:13}}>{lvl.title}</div></div>
      <div style={{fontFamily:"'DM Mono',monospace",fontSize:22,color:"#F4C542"}}>⭐ {stats.totalPoints}</div>
    </div>
    <div className="pbar"><div className="pbar-fill g" style={{width:`${(lvl.current/lvl.needed)*100}%`}}/></div>
    <div style={{fontFamily:"'DM Mono',monospace",fontSize:10,color:"#FDEAAA3C",marginTop:4}}>{lvl.current}/{lvl.needed} XP to next level</div>
  </div>

  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:14}}>
    {[["🔥",stats.streak,"Streak"],["📖",mastered,"Mastered"],["🏆",earned.length,"Badges"]].map(([ic,v,lb])=>(
      <div key={lb} className="card" style={{textAlign:"center",padding:14}}>
        <div style={{fontSize:22,marginBottom:4}}>{ic}</div>
        <div style={{fontFamily:"'Cinzel',serif",color:"#F4C542",fontSize:20}}>{v}</div>
        <div style={{fontFamily:"'DM Mono',monospace",fontSize:9,color:"#FDEAAA52",marginTop:2,letterSpacing:.5}}>{lb}</div>
      </div>
    ))}
  </div>

  <div className="card" style={{marginBottom:14}}>
    <div style={{fontFamily:"'Cinzel',serif",fontSize:14,color:"#F4C542",marginBottom:14}}>Mastery Map</div>
    {Object.entries(books).map(([bk,{t,m}])=>(
      <div key={bk} style={{marginBottom:12}}>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
          <div style={{fontSize:13}}>{bk}</div>
          <div style={{fontFamily:"'DM Mono',monospace",fontSize:11,color:"#FDEAAA4C"}}>{m}/{t}</div>
        </div>
        <div className="pbar"><div className="pbar-fill" style={{width:`${(m/t)*100}%`}}/></div>
      </div>
    ))}
  </div>

  <div className="card">
    <div style={{fontFamily:"'Cinzel',serif",fontSize:14,color:"#F4C542",marginBottom:14}}>Badges</div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
      {BADGES.map(b=>{
        const e=b.cond(stats);
        return (
          <div key={b.id} style={{padding:"10px 12px",borderRadius:10,border:`1.5px solid ${e?"#F4C54240":"#FDEAAA0E"}`,background:e?"#F4C5420A":"transparent",opacity:e?1:.4,display:"flex",alignItems:"center",gap:8}}>
            <span style={{fontSize:20}}>{b.icon}</span>
            <div style={{fontSize:12,color:e?"#FDEAAA":"#FDEAAA52",fontWeight:e?600:400}}>{b.name}</div>
          </div>
        );
      })}
    </div>
  </div>
</div>
```

);
}

// ─────────────────────────────────────────────
// PROFILE
// ─────────────────────────────────────────────
function Prof({user,stats,lvl,progress,onSave}) {
const [name,       setName]      = useState(user.name);
const [trans,      setTrans]     = useState(user.translation||“NIV”);
const [avatar,     setAvatar]    = useState(user.avatar);
const [saved,      setSaved]     = useState(false);
const [showPicker, setShowPicker]= useState(false);

const unlockedTiers = unlockedAvatarTiers(progress);
const lockedTiers   = AVATAR_TIERS.filter(at => !unlockedTiers.find(u=>u.tier===at.tier));
const nextLocked    = lockedTiers[0] || null;
const completedGroups = completedGroupCount(progress);

const save = () => {
onSave({…user, name, translation:trans, avatar});
setSaved(true);
setTimeout(()=>setSaved(false), 2000);
};

return (
<div style={{flex:1,overflowY:“auto”,padding:“20px 18px 80px”}}>
<div style={{fontFamily:”‘Cinzel’,serif”,fontSize:24,color:”#F4C542”,marginBottom:20}}>Profile</div>

```
  {/* Avatar showcase */}
  <div style={{textAlign:"center",marginBottom:24}}>
    <div
      onClick={()=>setShowPicker(p=>!p)}
      style={{width:90,height:90,borderRadius:22,background:"linear-gradient(135deg,#1E1C38,#252242)",border:`2.5px solid ${showPicker?"#F4C542":"#F4C54240"}`,margin:"0 auto 10px",display:"flex",alignItems:"center",justifyContent:"center",fontSize:50,cursor:"pointer",transition:"all .2s",boxShadow:showPicker?"0 0 0 3px #F4C54222":"none"}}
      title="Tap to change avatar">
      {avatar}
    </div>
    <button
      onClick={()=>setShowPicker(p=>!p)}
      style={{background:"none",border:"1px solid #F4C54230",borderRadius:8,padding:"4px 14px",color:"#F4C54290",fontFamily:"'DM Mono',monospace",fontSize:11,cursor:"pointer",marginBottom:8,transition:"all .2s"}}
      onMouseEnter={e=>e.currentTarget.style.borderColor="#F4C542"}
      onMouseLeave={e=>e.currentTarget.style.borderColor="#F4C54230"}>
      {showPicker?"▲ Close picker":"✏️ Change avatar"}
    </button>
    <div style={{fontFamily:"'Cinzel',serif",fontSize:18,color:"#F4C542"}}>{user.name}</div>
    <div style={{fontFamily:"'DM Mono',monospace",fontSize:12,color:"#FDEAAA50"}}>Level {lvl.level} · {lvl.title}</div>
  </div>

  {/* Avatar picker panel */}
  {showPicker && (
    <div className="fade-in card" style={{marginBottom:18,padding:"16px"}}>
      <div style={{fontFamily:"'Cinzel',serif",fontSize:12,color:"#F4C542",letterSpacing:1.5,marginBottom:14,textTransform:"uppercase"}}>
        Choose Your Avatar
      </div>

      {/* Unlocked tiers */}
      {unlockedTiers.map(tier => (
        <div key={tier.tier} style={{marginBottom:16}}>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
            <div style={{fontFamily:"'DM Mono',monospace",fontSize:10,color:"#52B788",letterSpacing:1,textTransform:"uppercase"}}>{tier.label}</div>
            {tier.tier===0
              ? <div style={{fontFamily:"'DM Mono',monospace",fontSize:9,color:"#FDEAAA30",background:"#52B78818",padding:"1px 6px",borderRadius:4}}>Default</div>
              : <div style={{fontFamily:"'DM Mono',monospace",fontSize:9,color:"#52B78890",background:"#52B78814",padding:"1px 6px",borderRadius:4}}>✓ Unlocked</div>}
          </div>
          <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
            {tier.avatars.map(a => (
              <div
                key={a}
                onClick={()=>{ setAvatar(a); }}
                style={{
                  width:52,height:52,fontSize:28,
                  display:"flex",alignItems:"center",justifyContent:"center",
                  borderRadius:14,cursor:"pointer",transition:"all .15s",
                  border:`2px solid ${avatar===a?"#F4C542":"#F4C54220"}`,
                  background:avatar===a?"#F4C54218":"#1E1C38",
                  transform:avatar===a?"scale(1.1)":"scale(1)",
                  boxShadow:avatar===a?"0 0 12px #F4C54240":"none",
                }}>
                {a}
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Locked tiers */}
      {lockedTiers.map(tier => {
        // Find which group they need to complete
        const neededGroupIdx = tier.tier - 1; // complete group tier-1 to unlock avatar tier
        const neededGroup    = VERSE_GROUPS[neededGroupIdx];
        const masteredInGroup = neededGroup
          ? neededGroup.verses.filter(v=>(progress[v.id]?.masteryScore||0)>=MASTERY).length
          : 0;
        return (
          <div key={tier.tier} style={{marginBottom:16,opacity:.55}}>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
              <div style={{fontFamily:"'DM Mono',monospace",fontSize:10,color:"#FDEAAA40",letterSpacing:1,textTransform:"uppercase"}}>🔒 {tier.label}</div>
              <div style={{fontFamily:"'DM Mono',monospace",fontSize:9,color:"#FDEAAA30",background:"#FDEAAA0A",padding:"1px 6px",borderRadius:4}}>{tier.unlock}</div>
            </div>
            {neededGroup && (
              <div style={{marginBottom:8}}>
                <div style={{fontFamily:"'DM Mono',monospace",fontSize:9,color:"#FDEAAA30",marginBottom:4}}>{masteredInGroup}/5 of "{neededGroup.label}" mastered</div>
                <div className="pbar" style={{height:4}}><div className="pbar-fill r" style={{width:`${(masteredInGroup/5)*100}%`,height:"100%"}}/></div>
              </div>
            )}
            <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
              {tier.avatars.map(a=>(
                <div key={a} style={{width:52,height:52,fontSize:28,display:"flex",alignItems:"center",justifyContent:"center",borderRadius:14,border:"2px solid #FDEAAA0E",background:"#12111E",filter:"grayscale(1) brightness(.4)"}}>
                  {a}
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {lockedTiers.length === 0 && (
        <div style={{textAlign:"center",padding:"12px 0",color:"#52B788",fontFamily:"'Cinzel',serif",fontSize:13}}>
          ✨ All avatars unlocked! You've mastered every group!
        </div>
      )}
    </div>
  )}

  {/* Next unlock teaser (when picker is closed) */}
  {!showPicker && nextLocked && (
    <div style={{background:"#1A1830",border:"1px solid #F4C54218",borderRadius:12,padding:"12px 14px",marginBottom:18,display:"flex",alignItems:"center",gap:12}}>
      <div style={{fontSize:20,filter:"grayscale(1) brightness(.5)",flexShrink:0}}>{nextLocked.avatars[0]}</div>
      <div style={{flex:1,minWidth:0}}>
        <div style={{fontFamily:"'DM Mono',monospace",fontSize:10,color:"#F4C54260",marginBottom:3}}>NEXT AVATAR UNLOCK</div>
        <div style={{fontSize:13,color:"#FDEAAA70"}}>{nextLocked.unlock}</div>
      </div>
      <div style={{fontFamily:"'Cinzel',serif",fontSize:12,color:"#F4C54258",flexShrink:0}}>{completedGroups}/{VERSE_GROUPS.length}</div>
    </div>
  )}

  {/* Name / translation */}
  <div className="card" style={{marginBottom:14}}>
    <div style={{marginBottom:14}}>
      <label style={{display:"block",marginBottom:7,color:"#FDEAAA62",fontSize:11,fontFamily:"'DM Mono',monospace",letterSpacing:1}}>DISPLAY NAME</label>
      <input type="text" value={name} onChange={e=>setName(e.target.value)} />
    </div>
    <div>
      <label style={{display:"block",marginBottom:7,color:"#FDEAAA62",fontSize:11,fontFamily:"'DM Mono',monospace",letterSpacing:1}}>BIBLE TRANSLATION</label>
      <select value={trans} onChange={e=>setTrans(e.target.value)}>{["NIV","KJV","ESV","NLT","NKJV"].map(t=><option key={t}>{t}</option>)}</select>
    </div>
  </div>

  <button className="btn-gold" style={{width:"100%",marginBottom:14}} onClick={save}>
    {saved?"✓ Saved!":"Save Changes"}
  </button>

  <div className="card" style={{textAlign:"center"}}>
    <div style={{fontFamily:"'Cinzel',serif",fontSize:13,color:"#F4C542",marginBottom:8}}>Scripture Quest</div>
    <div style={{fontSize:13,color:"#FDEAAA52",lineHeight:1.75}}>
      Powered by Claude AI · Free forever<br/>
      All scripture is always free.<br/>
      <span style={{color:"#FDEAAA2C"}}>Member since {new Date(user.joinDate).toLocaleDateString()}</span>
    </div>
  </div>
</div>
```

);
}
