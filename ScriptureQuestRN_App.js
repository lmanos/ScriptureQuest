/**
 * Scripture Quest — React Native (Expo Go)
 *
 * SETUP:
 *   1. npx create-expo-app ScriptureQuest --template blank
 *   2. Replace App.js with this file
 *   3. npx expo install @react-native-async-storage/async-storage expo-speech expo-haptics
 *   4. npx expo start  →  scan QR with Expo Go
 */

import React, {
  useState, useEffect, useCallback, useRef,
} from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView,
  StyleSheet, Modal, Alert, Platform, Dimensions,
  KeyboardAvoidingView, FlatList, Animated,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Speech from 'expo-speech';
import * as Haptics from 'expo-haptics';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

// ─── COLOURS ──────────────────────────────────────────────────────────────────
const CLR = {
  bg:        '#0F0E17',
  card:      '#1A1830',
  card2:     '#1E1C38',
  dark:      '#12111E',
  gold:      '#F4C542',
  goldDim:   '#F4C54240',
  goldFaint: '#F4C54214',
  cream:     '#FDEAAA',
  creamDim:  '#FDEAAA60',
  creamFaint:'#FDEAAA28',
  green:     '#52B788',
  greenDim:  '#52B78830',
  blue:      '#4A9EDB',
  purple:    '#9B59B6',
  orange:    '#E67E22',
  red:       '#E74C3C',
  border:    '#F4C54218',
};

// ─── DATA ─────────────────────────────────────────────────────────────────────
const VERSE_GROUPS = [
  { tier:1, label:'The Foundations',     color:'#F4C542', verses:[
    { id:'john_3_16',  ref:'John 3:16',           book:'John',        text:'For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.' },
    { id:'ps_23_1',    ref:'Psalm 23:1',           book:'Psalms',      text:'The Lord is my shepherd, I lack nothing.' },
    { id:'gen_1_1',    ref:'Genesis 1:1',          book:'Genesis',     text:'In the beginning God created the heavens and the earth.' },
    { id:'phil_4_13',  ref:'Philippians 4:13',     book:'Philippians', text:'I can do all this through him who gives me strength.' },
    { id:'rom_8_28',   ref:'Romans 8:28',          book:'Romans',      text:'And we know that in all things God works for the good of those who love him, who have been called according to his purpose.' },
  ]},
  { tier:2, label:'Walking in Faith',    color:'#4A9EDB', verses:[
    { id:'prov_3_5',   ref:'Proverbs 3:5-6',       book:'Proverbs',    text:'Trust in the Lord with all your heart and lean not on your own understanding; in all your ways submit to him, and he will make your paths straight.' },
    { id:'isa_40_31',  ref:'Isaiah 40:31',          book:'Isaiah',      text:'But those who hope in the Lord will renew their strength. They will soar on wings like eagles; they will run and not grow weary, they will walk and not be faint.' },
    { id:'jer_29_11',  ref:'Jeremiah 29:11',        book:'Jeremiah',    text:'For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you, plans to give you hope and a future.' },
    { id:'ps_46_10',   ref:'Psalm 46:10',           book:'Psalms',      text:'Be still, and know that I am God; I will be exalted among the nations, I will be exalted in the earth.' },
    { id:'josh_1_9',   ref:'Joshua 1:9',            book:'Joshua',      text:'Have I not commanded you? Be strong and courageous. Do not be afraid; do not be discouraged, for the Lord your God will be with you wherever you go.' },
  ]},
  { tier:3, label:'The Heart of Grace',  color:'#52B788', verses:[
    { id:'eph_2_8',    ref:'Ephesians 2:8-9',       book:'Ephesians',   text:'For it is by grace you have been saved, through faith—and this is not from yourselves, it is the gift of God—not by works, so that no one can boast.' },
    { id:'matt_6_33',  ref:'Matthew 6:33',           book:'Matthew',     text:'But seek first his kingdom and his righteousness, and all these things will be given to you as well.' },
    { id:'ps_119_105', ref:'Psalm 119:105',          book:'Psalms',      text:'Your word is a lamp for my feet, a light on my path.' },
    { id:'gal_2_20',   ref:'Galatians 2:20',         book:'Galatians',   text:'I have been crucified with Christ and I no longer live, but Christ lives in me. The life I now live in the body, I live by faith in the Son of God, who loved me and gave himself for me.' },
    { id:'rom_12_2',   ref:'Romans 12:2',            book:'Romans',      text:'Do not conform to the pattern of this world, but be transformed by the renewing of your mind. Then you will be able to test and approve what God\'s will is—his good, pleasing and perfect will.' },
  ]},
  { tier:4, label:'Light & Truth',       color:'#9B59B6', verses:[
    { id:'john_14_6',  ref:'John 14:6',             book:'John',        text:'Jesus answered, I am the way and the truth and the life. No one comes to the Father except through me.' },
    { id:'ps_23_4',    ref:'Psalm 23:4',             book:'Psalms',      text:'Even though I walk through the darkest valley, I will fear no evil, for you are with me; your rod and your staff, they comfort me.' },
    { id:'heb_11_1',   ref:'Hebrews 11:1',           book:'Hebrews',     text:'Now faith is confidence in what we hope for and assurance about what we do not see.' },
    { id:'isa_41_10',  ref:'Isaiah 41:10',           book:'Isaiah',      text:'So do not fear, for I am with you; do not be dismayed, for I am your God. I will strengthen you and help you; I will uphold you with my righteous right hand.' },
    { id:'ps_27_1',    ref:'Psalm 27:1',             book:'Psalms',      text:'The Lord is my light and my salvation—whom shall I fear? The Lord is the stronghold of my life—of whom shall I be afraid?' },
  ]},
  { tier:5, label:'Fruit of the Spirit', color:'#E67E22', verses:[
    { id:'gal_5_22',   ref:'Galatians 5:22-23',      book:'Galatians',   text:'But the fruit of the Spirit is love, joy, peace, forbearance, kindness, goodness, faithfulness, gentleness and self-control. Against such things there is no law.' },
    { id:'1cor_13_4',  ref:'1 Corinthians 13:4-5',   book:'Corinthians', text:'Love is patient, love is kind. It does not envy, it does not boast, it is not proud. It does not dishonor others, it is not self-seeking, it is not easily angered, it keeps no record of wrongs.' },
    { id:'matt_11_28', ref:'Matthew 11:28-30',        book:'Matthew',     text:'Come to me, all you who are weary and burdened, and I will give you rest. Take my yoke upon you and learn from me, for I am gentle and humble in heart, and you will find rest for your souls. For my yoke is easy and my burden is light.' },
    { id:'2tim_1_7',   ref:'2 Timothy 1:7',           book:'Timothy',     text:'For the Spirit God gave us does not make us timid, but gives us power, love and self-discipline.' },
    { id:'james_1_5',  ref:'James 1:5',               book:'James',       text:'If any of you lacks wisdom, you should ask God, who gives generously to all without finding fault, and it will be given to you.' },
  ]},
  { tier:6, label:'Chosen & Called',     color:'#E74C3C', verses:[
    { id:'rom_5_8',    ref:'Romans 5:8',             book:'Romans',      text:'But God demonstrates his own love for us in this: While we were still sinners, Christ died for us.' },
    { id:'ps_139_14',  ref:'Psalm 139:14',           book:'Psalms',      text:'I praise you because I am fearfully and wonderfully made; your works are wonderful, I know that full well.' },
    { id:'matt_28_19', ref:'Matthew 28:19-20',       book:'Matthew',     text:'Therefore go and make disciples of all nations, baptizing them in the name of the Father and of the Son and of the Holy Spirit, and teaching them to obey everything I have commanded you. And surely I am with you always, to the very end of the age.' },
    { id:'john_1_1',   ref:'John 1:1',               book:'John',        text:'In the beginning was the Word, and the Word was with God, and the Word was God.' },
    { id:'heb_4_12',   ref:'Hebrews 4:12',           book:'Hebrews',     text:'For the word of God is alive and active. Sharper than any double-edged sword, it penetrates even to dividing soul and spirit, joints and marrow; it judges the thoughts and attitudes of the heart.' },
  ]},
];
const VERSES = VERSE_GROUPS.flatMap(g => g.verses);

const AVATAR_TIERS = [
  { tier:0, label:'Seekers',   unlock:'Default',                      avatars:['😊','🙂','😄','🤗','😇','🧐','😎','🤓','🙏','✝️'] },
  { tier:1, label:'Disciples', unlock:'Complete The Foundations',     avatars:['📖','🕊️','⭐','🌟','💫'] },
  { tier:2, label:'Pilgrims',  unlock:'Complete Walking in Faith',    avatars:['🏔️','🌿','🌊','🌅','🕯️'] },
  { tier:3, label:'Scholars',  unlock:'Complete The Heart of Grace',  avatars:['🦁','🔥','💎','🌸','🌺'] },
  { tier:4, label:'Prophets',  unlock:'Complete Light & Truth',       avatars:['⚡','🌙','🦅','🌈','🏛️'] },
  { tier:5, label:'Apostles',  unlock:'Complete Fruit of the Spirit', avatars:['👑','🎯','🗝️','🛡️','🌻'] },
  { tier:6, label:'Saints',    unlock:'Complete Chosen & Called',     avatars:['✨','🌠','🎖️','🏆','💡'] },
];

const BADGES = [
  { id:'v1',   icon:'📖', name:'First Words',        cond:s=>s.masteredCount>=1 },
  { id:'v3',   icon:'🔍', name:'Scripture Seeker',   cond:s=>s.masteredCount>=3 },
  { id:'v5',   icon:'✨', name:'Faithful Five',       cond:s=>s.masteredCount>=5 },
  { id:'v10',  icon:'🚶', name:'Word Walker',         cond:s=>s.masteredCount>=10 },
  { id:'v15',  icon:'🎓', name:'Scripture Scholar',  cond:s=>s.masteredCount>=15 },
  { id:'v30',  icon:'🌟', name:'Word of God',         cond:s=>s.masteredCount>=30 },
  { id:'f5',   icon:'✍️', name:'Blank Filler',        cond:s=>s.fillDone>=5 },
  { id:'f20',  icon:'🖊️', name:'Master of Blanks',   cond:s=>s.fillDone>=20 },
  { id:'sc3',  icon:'🔀', name:'Word Weaver',         cond:s=>s.scrambleDone>=3 },
  { id:'sc15', icon:'🌀', name:'Word Wizard',         cond:s=>s.scrambleDone>=15 },
  { id:'ty3',  icon:'⌨️', name:'Speed Typist',        cond:s=>s.typingDone>=3 },
  { id:'ty15', icon:'⚡', name:'Lightning Fingers',   cond:s=>s.typingDone>=15 },
  { id:'all',  icon:'🎯', name:'Jack of All Trades',  cond:s=>s.fillDone>=1&&s.scrambleDone>=1&&s.typingDone>=1 },
  { id:'s3',   icon:'🔥', name:'Faithful Daily',      cond:s=>s.streak>=3 },
  { id:'s7',   icon:'📅', name:'Week Warrior',        cond:s=>s.streak>=7 },
  { id:'s30',  icon:'🌙', name:'Monthly Devotion',    cond:s=>s.streak>=30 },
  { id:'d5',   icon:'☀️', name:'Daily Seeker',        cond:s=>s.dailyChallenges>=5 },
  { id:'d20',  icon:'🌅', name:'Morning Faithful',    cond:s=>s.dailyChallenges>=20 },
  { id:'p500', icon:'💯', name:'Century Club',        cond:s=>s.totalPoints>=500 },
  { id:'p2k',  icon:'🏆', name:'Faith Champion',      cond:s=>s.totalPoints>=2000 },
  { id:'p5k',  icon:'👑', name:'Scripture Legend',    cond:s=>s.totalPoints>=5000 },
  { id:'c1',   icon:'🪨', name:'Foundation Laid',     cond:s=>s.chaptersCompleted>=1 },
  { id:'c3',   icon:'🌿', name:'Halfway Faithful',    cond:s=>s.chaptersCompleted>=3 },
  { id:'c6',   icon:'⭐', name:'Quest Complete',       cond:s=>s.chaptersCompleted>=6 },
];

const LEVEL_TITLES = ['Seeker','Learner','Disciple','Apprentice','Scholar','Scribe','Keeper','Faithful','Prophet','Elder','Apostle','Evangelist','Shepherd','Bishop','Patriarch','Saint','Illuminated','Revered','Blessed','Legend'];
const MASTERY = 80;
const STOP_WORDS = new Set(['the','a','an','and','or','but','in','on','at','to','for','of','is','are','was','were','be','been','have','has','had','do','does','did','will','would','could','should','may','might','shall','can','not','no','so','that','this','with','from','by','as','if','who','which','all','my','your','his','her','its','our','their','i','you','he','she','it','we','they','me','him','us','them']);

// ─── HELPERS ──────────────────────────────────────────────────────────────────
const shuffle = a => [...a].sort(() => Math.random() - 0.5);

function calcLevel(pts) {
  let level = 1, acc = 0;
  while (true) {
    const need = 200 + (level - 1) * 150;
    if (acc + need > pts) return { level, current: pts - acc, needed: need, title: LEVEL_TITLES[Math.min(level - 1, 19)] };
    acc += need; level++;
    if (level > 20) return { level: 20, current: 0, needed: 99999, title: LEVEL_TITLES[19] };
  }
}

function defStats() {
  return { totalPoints:0, streak:0, masteredCount:0, fillDone:0, scrambleDone:0, typingDone:0, dailyChallenges:0, chaptersCompleted:0, lastVisit:null, dailyKey:null };
}

function todayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}

function getDailyVerseId() {
  const d = new Date(), day = Math.floor((d - new Date(d.getFullYear(),0,0)) / 86400000);
  return VERSES[day % VERSES.length].id;
}

function computeStreak(stats) {
  const today = todayKey();
  if (stats.lastVisit === today) return stats;
  const d = new Date(); d.setDate(d.getDate() - 1);
  const yest = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
  return { ...stats, streak: stats.lastVisit === yest ? (stats.streak||0)+1 : stats.lastVisit === null ? 1 : 1, lastVisit: today };
}

function groupUnlocked(gi, progress) {
  if (gi === 0) return true;
  return VERSE_GROUPS[gi-1].verses.every(v => (progress[v.id]?.masteryScore||0) >= MASTERY);
}
function completedGroupCount(progress) {
  return VERSE_GROUPS.filter(g => g.verses.every(v => (progress[v.id]?.masteryScore||0) >= MASTERY)).length;
}
function unlockedAvatarTiers(progress) {
  const n = completedGroupCount(progress);
  return AVATAR_TIERS.filter(t => t.tier <= n);
}
function checkNewBadges(prev, next) {
  const had = new Set(BADGES.filter(b => b.cond(prev)).map(b => b.id));
  return BADGES.filter(b => b.cond(next) && !had.has(b.id));
}

async function load(key, fallback) {
  try { const v = await AsyncStorage.getItem(key); return v ? JSON.parse(v) : fallback; } catch { return fallback; }
}
async function save(key, val) {
  try { await AsyncStorage.setItem(key, JSON.stringify(val)); } catch {}
}

function makeFillBlank(text) {
  const tokens = text.split(/(\s+)/);
  const wordIdx = []; tokens.forEach((t,i) => { if (t.trim()) wordIdx.push(i); });
  const cands = wordIdx.filter(i => { const c = tokens[i].replace(/[^a-zA-Z]/g,''); return c.length>=3 && !STOP_WORDS.has(c.toLowerCase()); });
  const chosen = shuffle(cands).slice(0, Math.min(4, Math.max(2, cands.length)));
  const chosenSet = new Set(chosen);
  const parts = [];
  tokens.forEach((t,i) => { if (/^\s+$/.test(t)) return; chosenSet.has(i) ? parts.push({type:'blank',answer:t.replace(/[^a-zA-Z]/g,'')}) : parts.push({type:'text',content:t}); });
  const answers = chosen.map(i => tokens[i].replace(/[^a-zA-Z]/g,''));
  const dist = shuffle(['eternal','faithful','gracious','righteous','holy','merciful','mighty','blessed','glory','praise','worthy','truth','light','peace'].filter(d => !answers.map(a=>a.toLowerCase()).includes(d))).slice(0,4);
  return { parts, wordBank: shuffle([...answers, ...dist]) };
}

const haptic = (type='light') => {
  try { type==='success' ? Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success) : type==='error' ? Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error) : Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); } catch {}
};

// ─── SHARED UI COMPONENTS ─────────────────────────────────────────────────────
function PBar({ pct, color = CLR.gold, height = 6, style }) {
  return (
    <View style={[{ height, backgroundColor:'#252242', borderRadius:3, overflow:'hidden' }, style]}>
      <View style={{ width:`${Math.min(100,Math.max(0,pct))}%`, height:'100%', backgroundColor:color, borderRadius:3 }}/>
    </View>
  );
}

function BtnGold({ label, onPress, disabled, style }) {
  return (
    <TouchableOpacity style={[sh.btnGold, disabled && sh.btnDisabled, style]} onPress={onPress} disabled={disabled} activeOpacity={0.8}>
      <Text style={sh.btnGoldTxt}>{label}</Text>
    </TouchableOpacity>
  );
}
function BtnGhost({ label, onPress, style }) {
  return (
    <TouchableOpacity style={[sh.btnGhost, style]} onPress={onPress} activeOpacity={0.7}>
      <Text style={sh.btnGhostTxt}>{label}</Text>
    </TouchableOpacity>
  );
}

function Card({ children, style }) {
  return <View style={[sh.card, style]}>{children}</View>;
}

function Toast({ msg }) {
  const op = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.sequence([
      Animated.timing(op, { toValue:1, duration:200, useNativeDriver:true }),
      Animated.delay(2400),
      Animated.timing(op, { toValue:0, duration:200, useNativeDriver:true }),
    ]).start();
  }, [msg]);
  return (
    <Animated.View style={[sh.toast, { opacity:op }]}>
      <Text style={sh.toastTxt}>{msg}</Text>
    </Animated.View>
  );
}

function BadgeModal({ badges, onClose }) {
  if (!badges?.length) return null;
  return (
    <Modal transparent animationType="fade" visible onRequestClose={onClose}>
      <TouchableOpacity style={sh.overlay} activeOpacity={1} onPress={onClose}>
        <View style={sh.badgeBox}>
          <Text style={sh.badgeTitle}>🏆 Badge Unlocked!</Text>
          {badges.map(b => (
            <View key={b.id} style={{ alignItems:'center', marginBottom:12 }}>
              <Text style={{ fontSize:36, marginBottom:4 }}>{b.icon}</Text>
              <Text style={sh.badgeName}>{b.name}</Text>
            </View>
          ))}
          <Text style={sh.badgeDismiss}>Tap anywhere to continue</Text>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

// ─── ONBOARDING ───────────────────────────────────────────────────────────────
function OnboardScreen({ onDone }) {
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [ava,  setAva]  = useState('😊');
  const [trans,setTrans]= useState('NIV');

  const finish = async () => {
    const user = { name:name.trim(), avatar:ava, translation:trans, joinDate:new Date().toISOString() };
    await save('sq_u', user);
    onDone(user);
  };

  return (
    <View style={{ flex:1, backgroundColor:CLR.bg, justifyContent:'center', padding:28 }}>
      <StatusBar style="light"/>
      {/* Step dots */}
      <View style={{ flexDirection:'row', gap:8, marginBottom:32 }}>
        {[0,1,2].map(i => <View key={i} style={{ flex:1, height:3, borderRadius:2, backgroundColor:i<=step ? CLR.gold : CLR.goldDim }}/>)}
      </View>

      {step === 0 && (
        <View style={{ alignItems:'center' }}>
          <Text style={{ fontSize:72, marginBottom:16 }}>✝️</Text>
          <Text style={[sh.cinzel, { fontSize:28, color:CLR.gold, marginBottom:10, textAlign:'center' }]}>Scripture Quest</Text>
          <Text style={{ color:CLR.creamDim, fontSize:15, marginBottom:36, lineHeight:24, textAlign:'center' }}>Memorize God's Word through engaging puzzles, daily challenges, and gamified learning.</Text>
          <BtnGold label="Begin Your Journey →" onPress={() => setStep(1)} style={{ width:'100%' }}/>
        </View>
      )}

      {step === 1 && (
        <View>
          <Text style={[sh.cinzel, { fontSize:22, color:CLR.gold, marginBottom:24, textAlign:'center' }]}>Who are you, seeker?</Text>
          <Text style={sh.label}>YOUR NAME</Text>
          <TextInput
            style={sh.input} value={name} onChangeText={setName}
            placeholder="Enter your name..." placeholderTextColor={CLR.creamFaint}
          />
          <Text style={[sh.label, { marginTop:20 }]}>CHOOSE AVATAR</Text>
          <View style={{ flexDirection:'row', flexWrap:'wrap', gap:8, marginBottom:24 }}>
            {AVATAR_TIERS[0].avatars.map(a => (
              <TouchableOpacity key={a} onPress={() => setAva(a)}
                style={{ width:50, height:50, borderRadius:12, borderWidth:2, borderColor:ava===a?CLR.gold:CLR.goldDim, backgroundColor:ava===a?CLR.goldFaint:'transparent', alignItems:'center', justifyContent:'center' }}>
                <Text style={{ fontSize:26 }}>{a}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <BtnGold label="Continue →" onPress={() => setStep(2)} disabled={!name.trim()} style={{ width:'100%' }}/>
        </View>
      )}

      {step === 2 && (
        <View>
          <Text style={[sh.cinzel, { fontSize:22, color:CLR.gold, marginBottom:24, textAlign:'center' }]}>Your Preferences</Text>
          <Text style={sh.label}>BIBLE TRANSLATION</Text>
          <View style={{ flexDirection:'row', flexWrap:'wrap', gap:8, marginBottom:24 }}>
            {['NIV','KJV','ESV','NLT','NKJV'].map(t => (
              <TouchableOpacity key={t} onPress={() => setTrans(t)}
                style={{ paddingHorizontal:16, paddingVertical:10, borderRadius:10, borderWidth:1.5, borderColor:trans===t?CLR.gold:CLR.goldDim, backgroundColor:trans===t?CLR.goldFaint:'transparent' }}>
                <Text style={{ color:trans===t?CLR.gold:CLR.creamDim, fontFamily:'monospace', fontSize:13 }}>{t}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <BtnGold label="Enter the Quest! ✨" onPress={finish} style={{ width:'100%' }}/>
        </View>
      )}
    </View>
  );
}

// ─── HOME SCREEN ─────────────────────────────────────────────────────────────
function HomeScreen({ user, stats, progress, lvl, dailyVid, dailyDone, onVerse }) {
  const dailyVerse = VERSES.find(v => v.id === dailyVid) || VERSES[0];
  const dailyMs    = progress[dailyVid]?.masteryScore || 0;
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const tick = () => {
      const now = new Date(), next = new Date(now); next.setHours(24,0,0,0);
      const d = Math.max(0, Math.floor((next-now)/1000));
      setTimeLeft(`${String(Math.floor(d/3600)).padStart(2,'0')}:${String(Math.floor((d%3600)/60)).padStart(2,'0')}:${String(d%60).padStart(2,'0')}`);
    };
    tick(); const id = setInterval(tick, 1000); return () => clearInterval(id);
  }, []);

  return (
    <ScrollView style={{ flex:1, backgroundColor:CLR.bg }} contentContainerStyle={{ padding:16, paddingBottom:32 }}>
      {/* Header */}
      <View style={{ flexDirection:'row', justifyContent:'space-between', alignItems:'center', marginBottom:14 }}>
        <View style={{ flexDirection:'row', alignItems:'center', gap:10 }}>
          <View style={{ width:44, height:44, borderRadius:12, backgroundColor:CLR.card2, borderWidth:2, borderColor:CLR.goldDim, alignItems:'center', justifyContent:'center' }}>
            <Text style={{ fontSize:24 }}>{user.avatar}</Text>
          </View>
          <View>
            <Text style={[sh.mono, { fontSize:10, color:CLR.goldDim, letterSpacing:1.5 }]}>WELCOME BACK</Text>
            <Text style={{ fontSize:17, color:CLR.cream, fontWeight:'600' }}>{user.name}</Text>
          </View>
        </View>
        <View style={{ flexDirection:'row', gap:14 }}>
          {[['🔥',`${stats.streak}d`],['⭐',`${stats.totalPoints}`]].map(([ic,val]) => (
            <View key={ic} style={{ alignItems:'center' }}>
              <Text style={{ fontSize:14 }}>{ic}</Text>
              <Text style={[sh.mono, { color:CLR.gold, fontSize:13 }]}>{val}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Level bar */}
      <View style={{ flexDirection:'row', alignItems:'center', gap:8, marginBottom:18 }}>
        <Text style={[sh.mono, { fontSize:10, color:'#FDEAAA45' }]}>Lv.{lvl.level} {lvl.title}</Text>
        <PBar pct={(lvl.current/lvl.needed)*100} color={CLR.green} style={{ flex:1 }}/>
        <Text style={[sh.mono, { fontSize:10, color:'#FDEAAA45' }]}>{lvl.current}/{lvl.needed}</Text>
      </View>

      {/* Daily challenge */}
      <Text style={sh.sectionTitle}>⚡ TODAY'S CHALLENGE</Text>
      <TouchableOpacity
        style={[sh.dailyCard, dailyDone && sh.dailyCardDone]}
        onPress={() => { if(!dailyDone){ haptic(); onVerse(dailyVerse); } }}
        activeOpacity={dailyDone ? 1 : 0.75}
      >
        <View style={{ flexDirection:'row', alignItems:'flex-start', marginBottom:12, gap:10 }}>
          <View style={{ flex:1 }}>
            <Text style={[sh.cinzel, { fontSize:16, color:dailyDone?CLR.green:CLR.gold, marginBottom:4 }]}>
              {dailyDone?'✅ ':''}{dailyVerse.ref}
            </Text>
            <Text style={{ fontSize:12, color:'#FDEAAA55', fontStyle:'italic', lineHeight:18 }} numberOfLines={2}>
              "{dailyVerse.text}"
            </Text>
          </View>
          <View style={[sh.dailyBadge, dailyDone && { backgroundColor:CLR.green }]}>
            <Text style={sh.dailyBadgeTxt}>{dailyDone?'Done ✓':'+100 🌟'}</Text>
          </View>
        </View>
        <PBar pct={dailyMs} color={dailyDone?CLR.green:CLR.gold}/>
        <View style={{ flexDirection:'row', justifyContent:'space-between', marginTop:6 }}>
          <Text style={[sh.mono, { fontSize:10, color:'#FDEAAA38' }]}>{dailyMs}% mastery</Text>
          {!dailyDone && <Text style={[sh.mono, { fontSize:10, color:'#FDEAAA38' }]}>resets in {timeLeft}</Text>}
        </View>
      </TouchableOpacity>

      {/* Verse groups */}
      <Text style={sh.sectionTitle}>📜 SCRIPTURE QUEST PATH</Text>
      {VERSE_GROUPS.map((group, gi) => {
        const gOpen    = groupUnlocked(gi, progress);
        const prevGrp  = gi > 0 ? VERSE_GROUPS[gi-1] : null;
        const mastered = group.verses.filter(v => (progress[v.id]?.masteryScore||0) >= MASTERY).length;
        const gDone    = mastered === 5;
        const prevMast = prevGrp ? prevGrp.verses.filter(v=>(progress[v.id]?.masteryScore||0)>=MASTERY).length : 5;

        return (
          <View key={group.tier} style={[sh.groupCard, { borderColor:gDone?'#52B78840':gOpen?group.color+'50':'#FDEAAA12' }]}>
            <View style={{ flexDirection:'row', alignItems:'center', padding:14, gap:10 }}>
              <Text style={{ fontSize:22 }}>{gDone?'✅':gOpen?'📖':'🔒'}</Text>
              <View style={{ flex:1 }}>
                <Text style={[sh.cinzel, { fontSize:15, color:gDone?CLR.green:gOpen?group.color:'#FDEAAA28' }]}>{group.label}</Text>
                <Text style={[sh.mono, { fontSize:10, color:'#FDEAAA40', marginTop:2 }]}>
                  {gDone?'All 5 mastered ✓':gOpen?`${mastered}/5 mastered`:`Complete "${prevGrp?.label}" first`}
                </Text>
              </View>
              {gOpen && <Text style={[sh.mono, { fontSize:11, color:gDone?CLR.green:group.color }]}>{mastered}/5</Text>}
            </View>

            {gOpen && <PBar pct={(mastered/5)*100} color={gDone?CLR.green:group.color} style={{ marginHorizontal:14, marginBottom:12 }}/>}
            {!gOpen && prevGrp && (
              <View style={{ marginHorizontal:14, marginBottom:12 }}>
                <Text style={[sh.mono, { fontSize:9, color:'#FDEAAA28', marginBottom:4 }]}>{prevMast}/5 of "{prevGrp.label}" mastered</Text>
                <PBar pct={(prevMast/5)*100} color={CLR.red}/>
              </View>
            )}

            {gOpen && (
              <View style={{ paddingHorizontal:10, paddingBottom:10 }}>
                {group.verses.map(v => {
                  const ms = progress[v.id]?.masteryScore || 0;
                  const done = ms >= MASTERY, isDaily = v.id === dailyVid;
                  return (
                    <TouchableOpacity key={v.id}
                      style={[sh.verseRow, done && sh.verseRowDone, isDaily && !dailyDone && sh.verseRowDaily]}
                      onPress={() => { haptic(); onVerse(v); }} activeOpacity={0.7}>
                      <Text style={{ fontSize:16 }}>{done?'✅':'📄'}</Text>
                      <View style={{ flex:1 }}>
                        <View style={{ flexDirection:'row', alignItems:'center', gap:6 }}>
                          <Text style={[sh.cinzel, { fontSize:13, color:done?CLR.green:CLR.cream }]}>{v.ref}</Text>
                          {isDaily && !dailyDone && (
                            <View style={{ backgroundColor:'#F4C54222', borderRadius:3, paddingHorizontal:4, paddingVertical:1 }}>
                              <Text style={[sh.mono, { fontSize:8, color:CLR.gold }]}>TODAY</Text>
                            </View>
                          )}
                        </View>
                        <PBar pct={ms} color={done?CLR.green:CLR.gold} height={3} style={{ marginTop:4 }}/>
                      </View>
                      <Text style={[sh.mono, { fontSize:11, color:done?CLR.green:'#FDEAAA40' }]}>{ms}%</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}
          </View>
        );
      })}
    </ScrollView>
  );
}

// ─── QUEST SCREEN (verse hub + mode picker) ───────────────────────────────────
function QuestScreen({ verse, progress, onMode, onBack }) {
  const ms = progress[verse.id]?.masteryScore || 0;
  const [speaking, setSpeaking] = useState(false);

  const speak = () => {
    if (speaking) { Speech.stop(); setSpeaking(false); return; }
    setSpeaking(true);
    Speech.speak(verse.text, { onDone:()=>setSpeaking(false), onError:()=>setSpeaking(false) });
  };

  const MODES = [
    { t:'fill',     icon:'✍️', name:'Fill in the Blanks', desc:'Tap missing words from the word bank',           pts:'10–25 pts', color:CLR.blue },
    { t:'scramble', icon:'🔀', name:'Word Scramble',      desc:'Arrange all words in the correct order',         pts:'20 pts',    color:CLR.purple },
    { t:'typing',   icon:'⌨️', name:'Typing Race',        desc:'Type the verse from memory — beat the clock!',   pts:'25–60 pts', color:CLR.orange },
  ];

  return (
    <ScrollView style={{ flex:1, backgroundColor:CLR.bg }} contentContainerStyle={{ padding:18, paddingBottom:32 }}>
      <TouchableOpacity onPress={onBack} style={{ marginBottom:16 }}>
        <Text style={{ color:'#FDEAAA62', fontSize:14 }}>← Back</Text>
      </TouchableOpacity>

      <Text style={[sh.cinzel, { fontSize:22, color:CLR.gold, marginBottom:4 }]}>{verse.ref}</Text>
      <Text style={[sh.mono, { fontSize:11, color:'#FDEAAA48', marginBottom:8 }]}>Mastery: {ms}%</Text>
      <PBar pct={ms} style={{ marginBottom:18 }}/>

      <Card style={{ marginBottom:20 }}>
        <Text style={{ fontStyle:'italic', lineHeight:26, fontSize:14, color:CLR.cream, marginBottom:14 }}>"{verse.text}"</Text>
        <View style={{ flexDirection:'row', justifyContent:'space-between', alignItems:'center' }}>
          <Text style={[sh.cinzel, { fontSize:13, color:'#F4C54272' }]}>— {verse.ref}</Text>
          <TouchableOpacity style={sh.listenBtn} onPress={speak}>
            <Text style={{ color:CLR.gold, fontSize:12 }}>{speaking?'🔊 Playing...':'🔊 Listen'}</Text>
          </TouchableOpacity>
        </View>
      </Card>

      <Text style={sh.sectionTitle}>CHOOSE PRACTICE MODE</Text>
      {MODES.map(m => (
        <TouchableOpacity key={m.t}
          style={[sh.modeCard, { borderColor:m.color+'30' }]}
          onPress={() => { haptic(); onMode(m.t); }} activeOpacity={0.75}>
          <View style={[sh.modeIcon, { backgroundColor:m.color+'20' }]}>
            <Text style={{ fontSize:22 }}>{m.icon}</Text>
          </View>
          <View style={{ flex:1 }}>
            <Text style={[sh.cinzel, { fontSize:14, color:CLR.cream, marginBottom:2 }]}>{m.name}</Text>
            <Text style={{ fontSize:12, color:'#FDEAAA4C' }}>{m.desc}</Text>
          </View>
          <Text style={[sh.mono, { fontSize:11, color:m.color }]}>{m.pts}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

// ─── FILL IN THE BLANK ────────────────────────────────────────────────────────
function FillScreen({ verse, onDone, onBack }) {
  const [puz]       = useState(() => makeFillBlank(verse.text));
  const [filled,    setFilled]    = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [result,    setResult]    = useState(null);

  const blanks    = puz.parts.filter(p => p.type === 'blank');
  const nextBlank = blanks.findIndex((_,i) => filled[i] === undefined);
  const allFilled = nextBlank === -1;

  const tapWord = w => {
    if (submitted || nextBlank === -1) return;
    haptic();
    setFilled(prev => ({ ...prev, [nextBlank]:w }));
  };
  const clearBlank = i => {
    if (submitted) return;
    haptic();
    setFilled(prev => { const n={...prev}; delete n[i]; return n; });
  };
  const hint = () => {
    if (submitted || nextBlank === -1) return;
    setFilled(prev => ({ ...prev, [nextBlank]:blanks[nextBlank].answer }));
  };
  const submit = () => {
    setSubmitted(true);
    const correct = blanks.filter((b,i) => (filled[i]||'').toLowerCase() === b.answer.toLowerCase()).length;
    const pct = Math.round((correct/blanks.length)*100);
    const pts = correct*10 + (correct===blanks.length?15:0);
    haptic(correct===blanks.length?'success':'error');
    setResult({ correct, total:blanks.length, pct, pts });
    setTimeout(() => onDone(pct, pts, 'fillDone'), 3000);
  };

  let bi = 0;

  return (
    <ScrollView style={{ flex:1, backgroundColor:CLR.bg }} contentContainerStyle={{ padding:18, paddingBottom:32 }}>
      <TouchableOpacity onPress={onBack} style={{ marginBottom:16 }}>
        <Text style={{ color:'#FDEAAA62', fontSize:14 }}>← Back</Text>
      </TouchableOpacity>
      <Text style={[sh.cinzel, { fontSize:20, color:CLR.gold, marginBottom:4 }]}>Fill in the Blanks</Text>
      <Text style={[sh.mono, { fontSize:11, color:'#FDEAAA48', marginBottom:18 }]}>{verse.ref} · Tap a word to fill the next blank</Text>

      {/* Verse with blanks rendered as wrapping chips */}
      <Card style={{ marginBottom:18 }}>
        <View style={{ flexDirection:'row', flexWrap:'wrap', alignItems:'center', gap:4 }}>
          {puz.parts.map((p,i) => {
            if (p.type === 'text') return <Text key={i} style={{ fontSize:14, color:CLR.cream }}>{p.content}</Text>;
            const idx = bi++;
            const val = filled[idx];
            const isNext = idx === nextBlank && !submitted;
            const ok  = submitted && (val||'').toLowerCase() === p.answer.toLowerCase();
            const bad = submitted && val && !ok;
            return (
              <TouchableOpacity key={i} onPress={() => val && clearBlank(idx)}
                style={[sh.blankSlot, isNext && sh.blankSlotActive, val && sh.blankSlotFilled, ok && sh.blankSlotOk, bad && sh.blankSlotBad]}>
                <Text style={[sh.mono, { fontSize:12, color: ok?CLR.green : bad?'#f08080' : val?CLR.green : isNext?CLR.gold:'#F4C54288' }]}>
                  {val || (isNext?'▸___':'___')}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </Card>

      {/* Word bank */}
      {!submitted && (
        <View style={sh.wordBank}>
          {puz.wordBank.map((w,i) => {
            const used = Object.values(filled).includes(w);
            return (
              <TouchableOpacity key={i} style={[sh.chip, used && sh.chipUsed]} onPress={() => !used && tapWord(w)} disabled={used}>
                <Text style={[sh.chipTxt, used && { color:'#FDEAAA40' }]}>{w}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      )}

      {!submitted ? (
        <View style={{ flexDirection:'row', gap:10 }}>
          <BtnGhost label="💡 Hint" onPress={hint} style={{ flex:1 }}/>
          <BtnGold label="Check Answers ✓" onPress={submit} disabled={!allFilled} style={{ flex:2 }}/>
        </View>
      ) : result && (
        <Card style={{ alignItems:'center' }}>
          <Text style={{ fontSize:44, marginBottom:8 }}>{result.correct===result.total?'🎉':'📖'}</Text>
          <Text style={[sh.cinzel, { fontSize:18, color:CLR.gold }]}>{result.correct}/{result.total} correct</Text>
          <Text style={[sh.mono, { fontSize:13, color:CLR.creamDim, marginTop:4 }]}>+{result.pts} Faith Points</Text>
        </Card>
      )}
    </ScrollView>
  );
}

// ─── WORD SCRAMBLE ────────────────────────────────────────────────────────────
function ScrambleScreen({ verse, onDone, onBack }) {
  const original = verse.text.replace(/[.,;!?'"]/g,'').split(/\s+/).filter(Boolean);
  const [pool,     setPool]     = useState(() => shuffle(original));
  const [arranged, setArranged] = useState([]);
  const [done,     setDone]     = useState(false);

  const add = (w,i) => {
    if (done) return;
    haptic();
    setArranged(p => [...p,w]);
    setPool(p => { const n=[...p]; n.splice(i,1); return n; });
  };
  const rem = i => {
    if (done) return;
    haptic();
    const w = arranged[i];
    setArranged(p => { const n=[...p]; n.splice(i,1); return n; });
    setPool(p => [...p,w]);
  };
  const check = () => {
    setDone(true);
    const matches = arranged.filter((w,i) => w===original[i]).length;
    const pct = Math.round((matches/original.length)*100);
    haptic(arranged.join(' ')===original.join(' ')?'success':'error');
    setTimeout(() => onDone(pct, 20, 'scrambleDone'), 2500);
  };

  return (
    <ScrollView style={{ flex:1, backgroundColor:CLR.bg }} contentContainerStyle={{ padding:18, paddingBottom:32 }}>
      <TouchableOpacity onPress={onBack} style={{ marginBottom:16 }}>
        <Text style={{ color:'#FDEAAA62', fontSize:14 }}>← Back</Text>
      </TouchableOpacity>
      <Text style={[sh.cinzel, { fontSize:20, color:CLR.gold, marginBottom:4 }]}>Word Scramble</Text>
      <Text style={[sh.mono, { fontSize:11, color:'#FDEAAA48', marginBottom:18 }]}>{verse.ref} · Tap words to build the verse</Text>

      {/* Arranged area */}
      <Card style={{ minHeight:80, marginBottom:14 }}>
        {arranged.length === 0
          ? <Text style={{ color:'#FDEAAA28', fontStyle:'italic', fontSize:14 }}>Tap words below to build the verse...</Text>
          : (
            <View style={{ flexDirection:'row', flexWrap:'wrap', gap:6 }}>
              {arranged.map((w,i) => {
                const ok  = done && w===original[i];
                const bad = done && w!==original[i];
                return (
                  <TouchableOpacity key={i} style={[sh.chip, ok && sh.chipOk, bad && sh.chipBad]} onPress={() => rem(i)}>
                    <Text style={[sh.chipTxt, ok&&{color:CLR.green}, bad&&{color:'#f08080'}]}>{w}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          )
        }
      </Card>

      {/* Pool */}
      <View style={sh.wordBank}>
        {pool.map((w,i) => (
          <TouchableOpacity key={i} style={sh.chip} onPress={() => add(w,i)}>
            <Text style={sh.chipTxt}>{w}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {!done
        ? <BtnGold label={pool.length>0?`${pool.length} word${pool.length!==1?'s':''} remaining`:'Check Order ✓'} onPress={check} disabled={pool.length>0} style={{ width:'100%' }}/>
        : (
          <Card style={{ alignItems:'center' }}>
            <Text style={{ fontSize:32, marginBottom:8, color:CLR.cream }}>{arranged.join(' ')===original.join(' ')?'🎉 Perfect!':'📖 Almost!'}</Text>
            {arranged.join(' ')!==original.join(' ') && (
              <Text style={{ fontStyle:'italic', color:'#FDEAAA62', fontSize:13, lineHeight:20, textAlign:'center' }}>
                Correct: "{original.join(' ')}"
              </Text>
            )}
          </Card>
        )
      }
    </ScrollView>
  );
}

// ─── TYPING RACE ──────────────────────────────────────────────────────────────
const TYPING_TIME = 90;
function TypingScreen({ verse, onDone, onBack }) {
  const [stage,    setStage]    = useState('study');
  const [input,    setInput]    = useState('');
  const [timeLeft, setTimeLeft] = useState(TYPING_TIME);
  const [startMs,  setStartMs]  = useState(null);
  const [finished, setFinished] = useState(false);
  const timerRef = useRef(null);

  const TARGET = verse.text.split(/\s+/).filter(Boolean);
  const CLEAN  = TARGET.map(w => w.replace(/[^a-zA-Z]/g,'').toLowerCase());
  const typed  = input.trimEnd().split(/\s+/).filter(Boolean);
  const curIdx = input.endsWith(' ') ? typed.length : Math.max(0,typed.length-1);
  const evalW  = (tw,ti) => ti>=CLEAN.length?'extra':tw.replace(/[^a-zA-Z]/g,'').toLowerCase()===CLEAN[ti]?'correct':'wrong';
  const correct = typed.filter((w,i) => evalW(w,i)==='correct').length;
  const pct    = Math.min(100, Math.round((correct/TARGET.length)*100));

  // completion check
  useEffect(() => {
    if (stage!=='race'||finished) return;
    if (typed.length>=TARGET.length && input.endsWith(' ')) finish('complete');
  }, [input]);

  // timer
  useEffect(() => {
    if (stage!=='race'||finished) return;
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t<=1) { clearInterval(timerRef.current); finish('timeout'); return 0; }
        return t-1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [stage]);

  const startRace = () => { setStage('race'); setStartMs(Date.now()); setInput(''); setTimeLeft(TYPING_TIME); setFinished(false); };
  const finish = reason => {
    setFinished(true); clearInterval(timerRef.current); setStage('result');
    const tb = (Date.now()-(startMs||Date.now()))/1000;
    const bonus = reason==='complete' ? Math.max(0,Math.round((TYPING_TIME-tb)/TYPING_TIME*20)) : 0;
    const pts = Math.max(5, Math.round(pct*0.45)+bonus);
    haptic(pct>=70?'success':'error');
    setTimeout(() => onDone(pct, pts, 'typingDone'), 3500);
  };

  const tc = timeLeft<=10?CLR.red:timeLeft<=30?CLR.orange:CLR.green;

  return (
    <KeyboardAvoidingView style={{ flex:1, backgroundColor:CLR.bg }} behavior={Platform.OS==='ios'?'padding':'height'}>
      <ScrollView contentContainerStyle={{ padding:18, paddingBottom:40 }} keyboardShouldPersistTaps="handled">
        <TouchableOpacity onPress={onBack} style={{ marginBottom:16 }}>
          <Text style={{ color:'#FDEAAA62', fontSize:14 }}>← Back</Text>
        </TouchableOpacity>
        <Text style={[sh.cinzel, { fontSize:20, color:CLR.gold, marginBottom:4 }]}>Typing Race</Text>
        <Text style={[sh.mono, { fontSize:11, color:'#FDEAAA48', marginBottom:18 }]}>{verse.ref} · Type from memory · {TYPING_TIME}s</Text>

        {stage==='study' && (
          <View>
            <Card style={{ marginBottom:18 }}>
              <Text style={{ fontStyle:'italic', lineHeight:26, fontSize:14, color:CLR.cream, marginBottom:12 }}>"{verse.text}"</Text>
              <Text style={[sh.cinzel, { fontSize:13, color:'#F4C54270' }]}>— {verse.ref}</Text>
            </Card>
            <View style={{ backgroundColor:CLR.dark, borderRadius:12, padding:14, marginBottom:20 }}>
              <Text style={{ fontSize:13, color:'#FDEAAA58', lineHeight:22 }}>
                💡 Study the verse above. When ready, it disappears and a 90-second timer starts. Type it from memory — words highlight green (correct) or red (wrong).
              </Text>
            </View>
            <BtnGold label="I'm Ready — Start Typing ⌨️" onPress={startRace} style={{ width:'100%' }}/>
          </View>
        )}

        {stage==='race' && (
          <View>
            {/* Timer */}
            <View style={{ marginBottom:14 }}>
              <View style={{ flexDirection:'row', justifyContent:'space-between', alignItems:'center', marginBottom:6 }}>
                <Text style={[sh.mono, { fontSize:11, color:'#FDEAAA50' }]}>Time remaining</Text>
                <Text style={[sh.cinzel, { fontSize:20, color:tc }]}>{timeLeft}s</Text>
              </View>
              <PBar pct={(timeLeft/TYPING_TIME)*100} color={tc}/>
            </View>

            {/* Progress */}
            <View style={{ flexDirection:'row', justifyContent:'space-between', marginBottom:6 }}>
              <Text style={[sh.mono, { fontSize:11, color:'#FDEAAA45' }]}>{correct}/{TARGET.length} words</Text>
              <Text style={[sh.mono, { fontSize:11, color:'#FDEAAA45' }]}>{pct}% accuracy</Text>
            </View>
            <PBar pct={(typed.length/TARGET.length)*100} color={CLR.green} style={{ marginBottom:18 }}/>

            {/* Target words */}
            <Card style={{ marginBottom:14, minHeight:60 }}>
              <View style={{ flexDirection:'row', flexWrap:'wrap', gap:4 }}>
                {TARGET.map((tw,i) => {
                  const tp = typed[i], isCur = i===curIdx;
                  const col = tp ? (evalW(tp,i)==='correct'?CLR.green:'#f08080') : isCur?CLR.gold:'#FDEAAA50';
                  return (
                    <Text key={i} style={{ color:col, fontSize:14, fontWeight:isCur?'700':'400', backgroundColor:isCur?CLR.goldFaint:'transparent', borderRadius:4, paddingHorizontal:2 }}>{tw}</Text>
                  );
                })}
              </View>
            </Card>

            {/* Input */}
            <TextInput
              value={input}
              onChangeText={v => { if (!finished) setInput(v); }}
              placeholder="Start typing the verse here..."
              placeholderTextColor="#FDEAAA30"
              multiline
              style={sh.typingInput}
              autoFocus
            />
            <BtnGhost label="Submit Early →" onPress={() => finish('manual')} style={{ width:'100%', marginTop:10 }}/>
          </View>
        )}

        {stage==='result' && (
          <View>
            <View style={{ alignItems:'center', marginBottom:22 }}>
              <Text style={{ fontSize:58, marginBottom:10 }}>{pct>=90?'🌟':pct>=70?'✨':pct>=50?'📖':'🙏'}</Text>
              <Text style={[sh.cinzel, { fontSize:36, color:CLR.gold, marginBottom:6 }]}>{pct}%</Text>
              <Text style={{ fontSize:15, fontStyle:'italic', lineHeight:22, color:CLR.cream, textAlign:'center' }}>
                {pct>=95?'Flawless! You have this verse memorized!':pct>=85?'Excellent — nearly perfect!':pct>=70?'Great effort! A bit more practice will lock it in.':pct>=50?'Good start! Review the words in red.':'Keep practicing — each attempt builds memory!'}
              </Text>
            </View>
            <Card>
              <Text style={[sh.mono, { fontSize:10, color:'#FDEAAA50', marginBottom:8, letterSpacing:1 }]}>FULL VERSE:</Text>
              <Text style={{ fontStyle:'italic', lineHeight:22, fontSize:14, color:'#FDEAAA88' }}>"{verse.text}"</Text>
            </Card>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// ─── DASHBOARD ────────────────────────────────────────────────────────────────
function DashScreen({ stats, progress, lvl }) {
  const mastered = VERSES.filter(v => (progress[v.id]?.masteryScore||0) >= MASTERY).length;
  const earned   = BADGES.filter(b => b.cond(stats));
  const books    = {};
  VERSES.forEach(v => {
    if (!books[v.book]) books[v.book] = { t:0, m:0 };
    books[v.book].t++;
    if ((progress[v.id]?.masteryScore||0) >= MASTERY) books[v.book].m++;
  });

  return (
    <ScrollView style={{ flex:1, backgroundColor:CLR.bg }} contentContainerStyle={{ padding:18, paddingBottom:32 }}>
      <Text style={[sh.cinzel, { fontSize:24, color:CLR.gold, marginBottom:20 }]}>My Journey</Text>

      <Card style={{ marginBottom:14 }}>
        <View style={{ flexDirection:'row', justifyContent:'space-between', alignItems:'center', marginBottom:12 }}>
          <View>
            <Text style={[sh.cinzel, { fontSize:18, color:CLR.gold }]}>Level {lvl.level}</Text>
            <Text style={{ color:CLR.creamDim, fontSize:13 }}>{lvl.title}</Text>
          </View>
          <Text style={[sh.mono, { fontSize:22, color:CLR.gold }]}>⭐ {stats.totalPoints}</Text>
        </View>
        <PBar pct={(lvl.current/lvl.needed)*100} color={CLR.green}/>
        <Text style={[sh.mono, { fontSize:10, color:'#FDEAAA3C', marginTop:4 }]}>{lvl.current}/{lvl.needed} XP to next level</Text>
      </Card>

      {/* Stats row */}
      <View style={{ flexDirection:'row', gap:10, marginBottom:14 }}>
        {[['🔥',stats.streak,'Streak'],['📖',mastered,'Mastered'],['🏆',earned.length,'Badges']].map(([ic,v,lb]) => (
          <Card key={lb} style={{ flex:1, alignItems:'center', padding:14 }}>
            <Text style={{ fontSize:22, marginBottom:4 }}>{ic}</Text>
            <Text style={[sh.cinzel, { color:CLR.gold, fontSize:20 }]}>{v}</Text>
            <Text style={[sh.mono, { fontSize:9, color:'#FDEAAA52', marginTop:2, letterSpacing:0.5 }]}>{lb}</Text>
          </Card>
        ))}
      </View>

      {/* Mastery map */}
      <Card style={{ marginBottom:14 }}>
        <Text style={[sh.cinzel, { fontSize:14, color:CLR.gold, marginBottom:14 }]}>Mastery Map</Text>
        {Object.entries(books).map(([bk,{t,m}]) => (
          <View key={bk} style={{ marginBottom:12 }}>
            <View style={{ flexDirection:'row', justifyContent:'space-between', marginBottom:4 }}>
              <Text style={{ fontSize:13, color:CLR.cream }}>{bk}</Text>
              <Text style={[sh.mono, { fontSize:11, color:'#FDEAAA4C' }]}>{m}/{t}</Text>
            </View>
            <PBar pct={(m/t)*100}/>
          </View>
        ))}
      </Card>

      {/* Badges */}
      <Card>
        <Text style={[sh.cinzel, { fontSize:14, color:CLR.gold, marginBottom:14 }]}>Badges</Text>
        <View style={{ flexDirection:'row', flexWrap:'wrap', gap:8 }}>
          {BADGES.map(b => {
            const e = b.cond(stats);
            return (
              <View key={b.id} style={[sh.badgePill, e && sh.badgePillEarned]}>
                <Text style={{ fontSize:20 }}>{b.icon}</Text>
                <Text style={[sh.mono, { fontSize:11, color:e?CLR.cream:'#FDEAAA40', fontWeight:e?'600':'400' }]}>{b.name}</Text>
              </View>
            );
          })}
        </View>
      </Card>
    </ScrollView>
  );
}

// ─── PROFILE SCREEN ───────────────────────────────────────────────────────────
function ProfileScreen({ user, stats, lvl, progress, onSave }) {
  const [name,       setName]      = useState(user.name);
  const [trans,      setTrans]     = useState(user.translation||'NIV');
  const [avatar,     setAvatar]    = useState(user.avatar);
  const [saved,      setSaved]     = useState(false);
  const [showPicker, setShowPicker]= useState(false);

  const unlockedTiers   = unlockedAvatarTiers(progress);
  const lockedTiers     = AVATAR_TIERS.filter(at => !unlockedTiers.find(u => u.tier===at.tier));
  const nextLocked      = lockedTiers[0] || null;
  const completedGroups = completedGroupCount(progress);

  const saveProfile = async () => {
    const updated = { ...user, name:name.trim()||user.name, translation:trans, avatar };
    await save('sq_u', updated);
    onSave(updated);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <ScrollView style={{ flex:1, backgroundColor:CLR.bg }} contentContainerStyle={{ padding:18, paddingBottom:80 }}>
      <Text style={[sh.cinzel, { fontSize:24, color:CLR.gold, marginBottom:20 }]}>Profile</Text>

      {/* Avatar */}
      <View style={{ alignItems:'center', marginBottom:24 }}>
        <TouchableOpacity style={[sh.avatarBig, showPicker && { borderColor:CLR.gold }]} onPress={() => setShowPicker(p => !p)}>
          <Text style={{ fontSize:50 }}>{avatar}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setShowPicker(p => !p)} style={{ marginBottom:8 }}>
          <Text style={[sh.mono, { fontSize:11, color:'#F4C54290', borderWidth:1, borderColor:'#F4C54230', borderRadius:8, paddingHorizontal:14, paddingVertical:4 }]}>
            {showPicker?'▲ Close picker':'✏️ Change avatar'}
          </Text>
        </TouchableOpacity>
        <Text style={[sh.cinzel, { fontSize:18, color:CLR.gold }]}>{user.name}</Text>
        <Text style={[sh.mono, { fontSize:12, color:'#FDEAAA50' }]}>Level {lvl.level} · {lvl.title}</Text>
      </View>

      {/* Avatar picker */}
      {showPicker && (
        <Card style={{ marginBottom:18 }}>
          <Text style={[sh.cinzel, { fontSize:12, color:CLR.gold, letterSpacing:1.5, marginBottom:14, textTransform:'uppercase' }]}>Choose Your Avatar</Text>
          {unlockedTiers.map(tier => (
            <View key={tier.tier} style={{ marginBottom:16 }}>
              <View style={{ flexDirection:'row', alignItems:'center', gap:8, marginBottom:10 }}>
                <Text style={[sh.mono, { fontSize:10, color:CLR.green, letterSpacing:1, textTransform:'uppercase' }]}>{tier.label}</Text>
                <View style={{ backgroundColor:CLR.greenDim, borderRadius:4, paddingHorizontal:6, paddingVertical:1 }}>
                  <Text style={[sh.mono, { fontSize:9, color:CLR.green }]}>{tier.tier===0?'Default':'✓ Unlocked'}</Text>
                </View>
              </View>
              <View style={{ flexDirection:'row', flexWrap:'wrap', gap:8 }}>
                {tier.avatars.map(a => (
                  <TouchableOpacity key={a} onPress={() => setAvatar(a)}
                    style={{ width:52, height:52, fontSize:28, alignItems:'center', justifyContent:'center', borderRadius:14, borderWidth:2, borderColor:avatar===a?CLR.gold:'#F4C54220', backgroundColor:avatar===a?CLR.goldFaint:CLR.card2 }}>
                    <Text style={{ fontSize:28 }}>{a}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ))}
          {lockedTiers.map(tier => {
            const ng = VERSE_GROUPS[tier.tier-1];
            const mg = ng ? ng.verses.filter(v=>(progress[v.id]?.masteryScore||0)>=MASTERY).length : 0;
            return (
              <View key={tier.tier} style={{ marginBottom:16, opacity:0.5 }}>
                <View style={{ flexDirection:'row', alignItems:'center', gap:8, marginBottom:10 }}>
                  <Text style={[sh.mono, { fontSize:10, color:'#FDEAAA40', letterSpacing:1, textTransform:'uppercase' }]}>🔒 {tier.label}</Text>
                  <Text style={[sh.mono, { fontSize:9, color:'#FDEAAA30', backgroundColor:'#FDEAAA0A', borderRadius:4, paddingHorizontal:6, paddingVertical:1 }]}>{tier.unlock}</Text>
                </View>
                {ng && (
                  <View style={{ marginBottom:8 }}>
                    <Text style={[sh.mono, { fontSize:9, color:'#FDEAAA30', marginBottom:4 }]}>{mg}/5 of "{ng.label}" mastered</Text>
                    <PBar pct={(mg/5)*100} color={CLR.red} height={4}/>
                  </View>
                )}
                <View style={{ flexDirection:'row', flexWrap:'wrap', gap:8 }}>
                  {tier.avatars.map(a => (
                    <View key={a} style={{ width:52, height:52, alignItems:'center', justifyContent:'center', borderRadius:14, borderWidth:2, borderColor:'#FDEAAA0E', backgroundColor:'#12111E', opacity:0.4 }}>
                      <Text style={{ fontSize:28 }}>{a}</Text>
                    </View>
                  ))}
                </View>
              </View>
            );
          })}
          {lockedTiers.length===0 && <Text style={[sh.cinzel, { textAlign:'center', color:CLR.green, fontSize:13, paddingVertical:12 }]}>✨ All avatars unlocked!</Text>}
        </Card>
      )}

      {/* Next unlock teaser */}
      {!showPicker && nextLocked && (
        <View style={[sh.card, { flexDirection:'row', alignItems:'center', gap:12, marginBottom:18 }]}>
          <Text style={{ fontSize:20, opacity:0.5 }}>{nextLocked.avatars[0]}</Text>
          <View style={{ flex:1 }}>
            <Text style={[sh.mono, { fontSize:10, color:'#F4C54260', marginBottom:3 }]}>NEXT AVATAR UNLOCK</Text>
            <Text style={{ fontSize:13, color:'#FDEAAA70' }}>{nextLocked.unlock}</Text>
          </View>
          <Text style={[sh.cinzel, { fontSize:12, color:'#F4C54258' }]}>{completedGroups}/{VERSE_GROUPS.length}</Text>
        </View>
      )}

      {/* Name / translation */}
      <Card style={{ marginBottom:14 }}>
        <Text style={[sh.label, { marginBottom:8 }]}>DISPLAY NAME</Text>
        <TextInput style={[sh.input, { marginBottom:16 }]} value={name} onChangeText={setName} placeholderTextColor={CLR.creamFaint}/>
        <Text style={[sh.label, { marginBottom:8 }]}>BIBLE TRANSLATION</Text>
        <View style={{ flexDirection:'row', flexWrap:'wrap', gap:8 }}>
          {['NIV','KJV','ESV','NLT','NKJV'].map(t => (
            <TouchableOpacity key={t} onPress={() => setTrans(t)}
              style={{ paddingHorizontal:14, paddingVertical:8, borderRadius:8, borderWidth:1.5, borderColor:trans===t?CLR.gold:CLR.goldDim, backgroundColor:trans===t?CLR.goldFaint:'transparent' }}>
              <Text style={[sh.mono, { fontSize:12, color:trans===t?CLR.gold:CLR.creamDim }]}>{t}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </Card>

      <BtnGold label={saved?'✓ Saved!':'Save Changes'} onPress={saveProfile} style={{ width:'100%', marginBottom:14 }}/>

      <Card style={{ alignItems:'center' }}>
        <Text style={[sh.cinzel, { fontSize:13, color:CLR.gold, marginBottom:8 }]}>Scripture Quest</Text>
        <Text style={{ fontSize:13, color:'#FDEAAA52', lineHeight:22, textAlign:'center' }}>
          Powered by Claude AI · Free forever{'\n'}All scripture is always free.{'\n'}
          <Text style={{ color:'#FDEAAA2C' }}>Member since {new Date(user.joinDate).toLocaleDateString()}</Text>
        </Text>
      </Card>
    </ScrollView>
  );
}

// ─── TAB BAR ─────────────────────────────────────────────────────────────────
const TABS = [
  { key:'home', icon:'🗺️', label:'Quest' },
  { key:'dash', icon:'📊', label:'Journey' },
  { key:'prof', icon:'👤', label:'Profile' },
];
function TabBar({ current, onTab }) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[sh.tabBar, { paddingBottom: insets.bottom || 8 }]}>
      {TABS.map(t => (
        <TouchableOpacity key={t.key} style={sh.tabBtn} onPress={() => { haptic(); onTab(t.key); }}>
          <Text style={{ fontSize:20 }}>{t.icon}</Text>
          <Text style={[sh.mono, { fontSize:9, letterSpacing:0.5, color:current===t.key?CLR.gold:'#FDEAAA42', marginTop:2 }]}>
            {t.label.toUpperCase()}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

// ─── APP ROOT ─────────────────────────────────────────────────────────────────
export default function App() {
  const [ready,    setReady]    = useState(false);
  const [user,     setUser]     = useState(null);
  const [progress, setProgress] = useState({});
  const [stats,    setStats]    = useState(null);
  const [tab,      setTab]      = useState('home');
  const [verse,    setVerse]    = useState(null);   // selected verse
  const [mode,     setMode]     = useState(null);   // selected puzzle mode
  const [toast,    setToast]    = useState(null);
  const [badgeQ,   setBadgeQ]   = useState([]);

  // load on mount
  useEffect(() => {
    (async () => {
      const u  = await load('sq_u', null);
      const p  = await load('sq_p', {});
      const s  = await load('sq_s', defStats());
      const ns = computeStreak({ ...defStats(), ...s });
      if (ns.lastVisit !== s.lastVisit) await save('sq_s', ns);
      setUser(u); setProgress(p); setStats(ns); setReady(true);
    })();
  }, []);

  const persist = useCallback(async (p, s) => {
    await save('sq_p', p);
    await save('sq_s', s);
  }, []);

  const flash = (msg) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  const award = useCallback((pts, label, key) => {
    setStats(prev => {
      const ns = { ...prev, totalPoints:prev.totalPoints+pts, ...(key ? { [key]:(prev[key]||0)+1 } : {}) };
      const newB = checkNewBadges(prev, ns);
      if (newB.length) { setBadgeQ(newB); haptic('success'); }
      setProgress(p => { persist(p, ns); return p; });
      return ns;
    });
    flash(`+${pts} Faith Points — ${label}!`);
  }, [persist]);

  const claimDaily = useCallback(() => {
    const today = todayKey();
    setStats(prev => {
      if (prev.dailyKey === today) return prev;
      const ns = { ...prev, totalPoints:prev.totalPoints+100, dailyKey:today, dailyChallenges:(prev.dailyChallenges||0)+1 };
      setProgress(p => { persist(p, ns); return p; });
      return ns;
    });
    flash('🌟 +100 Bonus Points — Daily Challenge Complete!');
  }, [persist]);

  const markProgress = useCallback((vid, score) => {
    setProgress(prev => {
      const ex = prev[vid] || { masteryScore:0, attempts:0 };
      const ms = Math.max(ex.masteryScore, score);
      const up = { ...prev, [vid]:{ masteryScore:ms, attempts:ex.attempts+1 } };
      const mc = VERSES.filter(v => (up[v.id]?.masteryScore||0) >= MASTERY).length;
      const cc = VERSE_GROUPS.filter(g => g.verses.every(v => (up[v.id]?.masteryScore||0) >= MASTERY)).length;
      setStats(s => {
        const ns = { ...s, masteredCount:mc, chaptersCompleted:cc };
        persist(up, ns);
        return ns;
      });
      return up;
    });
  }, [persist]);

  if (!ready || !stats) return <View style={{ flex:1, backgroundColor:CLR.bg, alignItems:'center', justifyContent:'center' }}><StatusBar style="light"/><Text style={{ color:CLR.gold, fontSize:32 }}>✝️</Text></View>;

  if (!user) return <OnboardScreen onDone={u => setUser(u)}/>;

  const lvl      = calcLevel(stats.totalPoints);
  const dailyVid = getDailyVerseId();
  const dailyDone= stats.dailyKey === todayKey();

  // Puzzle flow
  if (verse && mode) {
    const onDone = (score, pts, key) => {
      markProgress(verse.id, score);
      award(pts, mode, key);
      if (verse.id === dailyVid && !dailyDone && score >= 50) claimDaily();
      setMode(null);
    };
    const onBack = () => setMode(null);
    const props  = { verse, onDone, onBack };
    return (
      <SafeAreaView style={{ flex:1, backgroundColor:CLR.bg }} edges={['top']}>
        <StatusBar style="light"/>
        {mode==='fill'     && <FillScreen    {...props}/>}
        {mode==='scramble' && <ScrambleScreen {...props}/>}
        {mode==='typing'   && <TypingScreen  {...props}/>}
        {toast && <Toast msg={toast}/>}
        <BadgeModal badges={badgeQ} onClose={() => setBadgeQ([])}/>
      </SafeAreaView>
    );
  }

  if (verse) {
    return (
      <SafeAreaView style={{ flex:1, backgroundColor:CLR.bg }} edges={['top']}>
        <StatusBar style="light"/>
        <QuestScreen verse={verse} progress={progress} onMode={m => setMode(m)} onBack={() => setVerse(null)}/>
        {toast && <Toast msg={toast}/>}
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex:1, backgroundColor:CLR.bg }} edges={['top']}>
      <StatusBar style="light"/>
      <View style={{ flex:1 }}>
        {tab==='home' && <HomeScreen    user={user} stats={stats} progress={progress} lvl={lvl} dailyVid={dailyVid} dailyDone={dailyDone} onVerse={v => { haptic(); setVerse(v); }}/>}
        {tab==='dash' && <DashScreen    stats={stats} progress={progress} lvl={lvl}/>}
        {tab==='prof' && <ProfileScreen user={user} stats={stats} lvl={lvl} progress={progress} onSave={u => setUser(u)}/>}
      </View>
      <TabBar current={tab} onTab={setTab}/>
      {toast && <Toast msg={toast}/>}
      <BadgeModal badges={badgeQ} onClose={() => setBadgeQ([])}/>
    </SafeAreaView>
  );
}

// ─── SHARED STYLES ────────────────────────────────────────────────────────────
const sh = StyleSheet.create({
  cinzel:       { fontFamily:Platform.OS==='ios'?'Georgia':'serif' },
  mono:         { fontFamily:Platform.OS==='ios'?'Courier New':'monospace' },
  label:        { color:CLR.creamDim, fontSize:11, fontFamily:Platform.OS==='ios'?'Courier New':'monospace', letterSpacing:1 },
  sectionTitle: { color:CLR.gold, fontFamily:Platform.OS==='ios'?'Courier New':'monospace', fontSize:11, letterSpacing:2, marginBottom:10, marginTop:4 },
  card:         { backgroundColor:CLR.card, borderWidth:1, borderColor:CLR.border, borderRadius:16, padding:18 },
  input:        { backgroundColor:CLR.card2, borderWidth:1.5, borderColor:CLR.goldDim, borderRadius:10, padding:12, color:CLR.cream, fontSize:15 },
  btnGold:      { backgroundColor:CLR.gold, borderRadius:12, paddingVertical:14, alignItems:'center' },
  btnGoldTxt:   { color:'#0F0E17', fontFamily:Platform.OS==='ios'?'Georgia':'serif', fontWeight:'700', fontSize:14, letterSpacing:0.5 },
  btnGhost:     { borderWidth:1.5, borderColor:'#F4C54248', borderRadius:10, paddingVertical:10, paddingHorizontal:18, alignItems:'center' },
  btnGhostTxt:  { color:CLR.gold, fontSize:14 },
  btnDisabled:  { opacity:0.35 },
  toast:        { position:'absolute', top:14, alignSelf:'center', backgroundColor:'#1C3D2A', paddingHorizontal:18, paddingVertical:9, borderRadius:10, zIndex:999 },
  toastTxt:     { color:'#fff', fontFamily:Platform.OS==='ios'?'Courier New':'monospace', fontSize:13, fontWeight:'600' },
  overlay:      { flex:1, backgroundColor:'#000C', alignItems:'center', justifyContent:'center' },
  badgeBox:     { backgroundColor:CLR.card, borderWidth:2, borderColor:CLR.gold, borderRadius:20, padding:32, alignItems:'center', maxWidth:300, width:'90%' },
  badgeTitle:   { fontFamily:Platform.OS==='ios'?'Georgia':'serif', color:CLR.gold, fontSize:20, marginBottom:14 },
  badgeName:    { fontFamily:Platform.OS==='ios'?'Georgia':'serif', color:CLR.cream, fontSize:15 },
  badgeDismiss: { color:'#FDEAAA40', fontSize:12, marginTop:16 },
  listenBtn:    { borderWidth:1, borderColor:'#F4C54248', borderRadius:8, paddingHorizontal:12, paddingVertical:6 },
  modeCard:     { backgroundColor:CLR.card, borderWidth:1.5, borderRadius:12, padding:14, marginBottom:10, flexDirection:'row', alignItems:'center', gap:14 },
  modeIcon:     { width:46, height:46, borderRadius:12, alignItems:'center', justifyContent:'center' },
  chip:         { backgroundColor:CLR.card2, borderWidth:1.5, borderColor:'#F4C54226', borderRadius:8, paddingHorizontal:12, paddingVertical:8 },
  chipOk:       { borderColor:CLR.green, backgroundColor:'#52B78812' },
  chipBad:      { borderColor:CLR.red, backgroundColor:'#C0392B12' },
  chipUsed:     { opacity:0.3 },
  chipTxt:      { fontFamily:Platform.OS==='ios'?'Courier New':'monospace', fontSize:13, color:CLR.cream },
  wordBank:     { flexDirection:'row', flexWrap:'wrap', gap:8, backgroundColor:CLR.dark, borderRadius:12, padding:12, marginBottom:16, justifyContent:'center' },
  blankSlot:    { borderBottomWidth:2, borderBottomColor:'#F4C54268', paddingHorizontal:4, minWidth:48, alignItems:'center' },
  blankSlotActive: { borderBottomColor:CLR.gold },
  blankSlotFilled: { borderBottomColor:CLR.green },
  blankSlotOk:  { borderBottomColor:CLR.green },
  blankSlotBad: { borderBottomColor:CLR.red },
  typingInput:  { backgroundColor:CLR.card2, borderWidth:1.5, borderColor:'#F4C54235', borderRadius:12, padding:12, color:CLR.cream, fontFamily:Platform.OS==='ios'?'Georgia':'serif', fontSize:15, minHeight:100, textAlignVertical:'top' },
  tabBar:       { backgroundColor:'#0C0B16EE', borderTopWidth:1, borderTopColor:'#F4C54214', flexDirection:'row' },
  tabBtn:       { flex:1, alignItems:'center', paddingTop:10 },
  dailyCard:    { backgroundColor:CLR.card, borderWidth:1.5, borderColor:CLR.goldDim, borderRadius:14, padding:16, marginBottom:20 },
  dailyCardDone:{ borderColor:'#52B78850', backgroundColor:'#1A3028' },
  dailyBadge:   { backgroundColor:CLR.gold, borderRadius:8, paddingHorizontal:10, paddingVertical:4 },
  dailyBadgeTxt:{ color:'#0F0E17', fontFamily:Platform.OS==='ios'?'Courier New':'monospace', fontSize:11, fontWeight:'700' },
  groupCard:    { borderWidth:1.5, borderRadius:14, marginBottom:12, overflow:'hidden', backgroundColor:CLR.card },
  verseRow:     { flexDirection:'row', alignItems:'center', gap:10, padding:10, borderRadius:10, marginBottom:4, backgroundColor:'#1E1C3860', borderWidth:1, borderColor:'#FDEAAA0A' },
  verseRowDone: { backgroundColor:'#52B78810', borderColor:'#52B78830' },
  verseRowDaily:{ borderColor:'#F4C54230' },
  avatarBig:    { width:90, height:90, borderRadius:22, backgroundColor:CLR.card2, borderWidth:2.5, borderColor:'#F4C54240', alignItems:'center', justifyContent:'center', marginBottom:10 },
  badgePill:    { flexDirection:'row', alignItems:'center', gap:6, padding:10, borderRadius:10, borderWidth:1.5, borderColor:'#FDEAAA0E', opacity:0.4, marginBottom:4 },
  badgePillEarned:{ borderColor:'#F4C54240', backgroundColor:'#F4C5420A', opacity:1 },
});
