/* Moteur : contenu, sauvegarde (local + base privée), répétition espacée, statistiques */
{
const ORDER=["languefr","gramarabe","gramanglaise","gestion","economie","civiarabe","civianglo","comecrite"];
const ICON={languefr:"Aa",gramarabe:"ض",gramanglaise:"En",gestion:"G",economie:"€",civiarabe:"☾",civianglo:"✦",comecrite:"✎"};
const SUBJ=ORDER.map(id=>DATA.find(d=>d.id===id)).filter(Boolean);
const DAY=864e5;
const today0=()=>{const d=new Date();d.setHours(0,0,0,0);return d.getTime()};
const iso=t=>{const d=new Date(t);return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')};
const norm=s=>String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/[’']/g,"'").replace(/[«»"“”.,;:!?()\[\]]/g,' ').replace(/\s+/g,' ').trim();

/* ---------- chapitres ---------- */
function chapOf(d,label){
  const l=String(label).split(' / ')[0].trim();
  if(d.id==='economie'&&/^(Micro|Courants|Smith|Keynes)/.test(l))return 1;
  let i=d.fiches.findIndex(f=>f.t===l||f.t.startsWith(l+' ·'));
  if(i<0)i=d.fiches.findIndex(f=>f.t.toLowerCase().includes(l.toLowerCase()));
  return i<0?0:i;
}
/* ---------- items d'exercice ---------- */
const ITEMS=[],BYID={};
for(const d of SUBJ){
  const x=(window.EXTRA||{})[d.id]||{};
  d.ret=x.ret||[];
  d.quiz.forEach((q,i)=>ITEMS.push({id:d.id+'-q'+i,sid:d.id,c:chapOf(d,q.f),type:'qcm',diff:1,q:q.q,o:q.o,a:q.a,e:q.e}));
  (x.vf||[]).forEach((q,i)=>ITEMS.push({id:d.id+'-v'+i,sid:d.id,c:q.c,type:'vf',diff:1,q:q.t,a:q.v,e:q.e}));
  (x.trous||[]).forEach((q,i)=>ITEMS.push({id:d.id+'-t'+i,sid:d.id,c:q.c,type:'trou',diff:2,q:q.t,e:q.e}));
  (x.courtes||[]).forEach((q,i)=>ITEMS.push({id:d.id+'-s'+i,sid:d.id,c:q.c,type:'courte',diff:2,q:q.q,r:q.r,e:q.e}));
  (x.ordre||[]).forEach((q,i)=>ITEMS.push({id:d.id+'-o'+i,sid:d.id,c:q.c,type:'ordre',diff:2,q:q.q,items:q.items,e:q.e}));
  d.sujets.forEach((q,i)=>ITEMS.push({id:d.id+'-r'+i,sid:d.id,c:null,type:'reflexion',diff:3,q:q.q,r:q.r,e:'Compare ta réponse avec les éléments attendus.'}));
  d.fiches.forEach((f,c)=>f.p.forEach((p,j)=>ITEMS.push({id:d.id+'-p'+c+'_'+j,sid:d.id,c,type:'point',diff:1,q:p})));
  d.cartes.forEach((k,i)=>ITEMS.push({id:d.id+'-k'+i,sid:d.id,c:null,type:'carte',diff:1,r:k.r,v:k.v}));
}
ITEMS.forEach(it=>BYID[it.id]=it);
const QUIZ_TYPES=['qcm','vf','trou','courte','ordre'];
const isQuiz=it=>QUIZ_TYPES.includes(it.type);
const TYPE_LABEL={qcm:'QCM',vf:'Vrai ou faux',trou:'Texte à trous',courte:'Réponse courte',ordre:'Remettre dans l\'ordre',assoc:'Associer',reflexion:'Question de réflexion',point:'Récitation',carte:'Flashcard'};

/* ---------- état sauvegardé ---------- */
const KEY='lea_app_v2';
const blank=()=>({prog:{updatedAt:0,rec:{},hist:[],time:{},tsub:{},visited:{},pomo:{}},perso:{updatedAt:0,tasks:[],notes:[],flags:[],favs:[],goals:{qWeek:150,mWeek:600,qDay:30,mDay:120},theme:'auto',last:null,session:null,imported:false}});
let S=blank();
try{const raw=localStorage.getItem(KEY);if(raw){const v=JSON.parse(raw);S.prog=Object.assign(S.prog,v.prog||{});S.perso=Object.assign(S.perso,v.perso||{});S.perso.goals=Object.assign(blank().perso.goals,S.perso.goals||{})}}catch(e){}
/* ancienne version du site : on récupère les cartes sues et meilleurs scores n'existent plus, rien à migrer de façon sûre */
let dirty={prog:false,perso:false},saveT=null,onRemote=null;
function save(part){
  const parts=part?[part]:['prog','perso'];
  for(const p of parts){S[p].updatedAt=Date.now();dirty[p]=true}
  try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}
  clearTimeout(saveT);saveT=setTimeout(push,2500);
}
/* --- synchronisation avec la base privée (data/users/<id>) --- */
const SYNC={state:'local',msg:'Sauvegardé sur cet appareil'};
let db=null,uid=null,writing=Promise.resolve();
function setSync(st,msg){SYNC.state=st;SYNC.msg=msg;document.dispatchEvent(new Event('sync'))}
function trimProg(p){const c=JSON.parse(JSON.stringify(p));c.hist=(c.hist||[]).slice(-150);return c}
function push(){
  if(!db||!uid)return;
  for(const p of ['prog','perso']){
    if(!dirty[p])continue;dirty[p]=false;
    const body=p==='prog'?trimProg(S.prog):S.perso;
    writing=writing.then(()=>db.doc('data/users/'+uid+'/'+p).set({json:JSON.stringify(body),updatedAt:body.updatedAt})).then(()=>setSync('cloud','Synchronisé sur tous tes appareils')).catch(e=>{setSync('local','Sauvegardé sur cet appareil (synchronisation indisponible)')});
  }
}
async function initSync(){
  try{
    if(!window.claude||!claude.use){setSync('local','Sauvegardé sur cet appareil');return}
    const [d,u]=await Promise.all([claude.use('db'),claude.use('user')]);
    if(!d||!u){setSync('local','Sauvegardé sur cet appareil');return}
    const id=await u.id();if(!id){setSync('local','Sauvegardé sur cet appareil');return}
    db=d;uid=id;setSync('wait','Synchronisation…');
    let changed=false;
    for(const p of ['prog','perso']){
      const snap=await db.doc('data/users/'+uid+'/'+p).get();
      const r=snap.exists?snap.data():null;
      if(r&&r.json&&r.updatedAt>(S[p].updatedAt||0)){try{S[p]=Object.assign(blank()[p],JSON.parse(r.json));changed=true}catch(e){}}
      else if(S[p].updatedAt)dirty[p]=true;
    }
    if(changed){try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}if(onRemote)onRemote()}
    setSync('cloud','Synchronisé sur tous tes appareils');push();
  }catch(e){setSync('local','Sauvegardé sur cet appareil')}
}

/* ---------- répétition espacée ---------- */
const INT=[0,1,2,4,8,16,32];
function grade(id,ok){
  const r=S.prog.rec[id]||{b:0,n:0,ok:0,due:0,last:0,miss:0};
  r.n++;r.last=Date.now();
  if(ok){r.ok++;r.b=Math.min(r.b+1,6);r.due=today0()+INT[r.b]*DAY}
  else{r.miss++;r.b=0;r.due=today0()}
  S.prog.rec[id]=r;
  logDay(1,ok);
}
function logDay(n,ok){const k=iso(Date.now());const t=S.prog.time[k]||(S.prog.time[k]={s:0,q:0,g:0});t.q+=n;if(ok)t.g+=1}
const rec=id=>S.prog.rec[id];
function due(filter){const t=today0();return ITEMS.filter(it=>(isQuiz(it)||it.type==='point'||it.type==='carte')&&(!filter||filter(it))&&rec(it.id)&&rec(it.id).due<=t).sort((a,b)=>rec(a.id).b-rec(b.id).b||rec(a.id).due-rec(b.id).due)}

/* ---------- maîtrise ---------- */
const LEVELS=['Non commencé','À découvrir','En cours d\'apprentissage','En cours de consolidation','Maîtrisé'];
function chapItems(sid,c){return ITEMS.filter(it=>it.sid===sid&&it.c===c&&(isQuiz(it)||it.type==='point'))}
function stat(list){
  let seen=0,mast=0,n=0,ok=0;
  for(const it of list){const r=rec(it.id);if(r){seen++;n+=r.n;ok+=r.ok;if(r.b>=3)mast++}}
  return{total:list.length,seen,mast,acc:n?ok/n:null,pct:list.length?mast/list.length:0};
}
function chapStat(sid,c){
  const s=stat(chapItems(sid,c));const v=S.prog.visited[sid+'-'+c];
  let lvl=0;
  if(s.seen===0)lvl=v?1:0;
  else if(s.seen/s.total<0.4)lvl=1;
  else if(s.pct<0.4)lvl=2;
  else if(s.pct<0.8)lvl=3;
  else lvl=4;
  return Object.assign(s,{lvl,level:LEVELS[lvl]});
}
function subjStat(sid){
  const d=SUBJ.find(x=>x.id===sid);const ch=d.fiches.map((_,c)=>chapStat(sid,c));
  const all=stat(ITEMS.filter(it=>it.sid===sid&&(isQuiz(it)||it.type==='point')));
  const cards=stat(ITEMS.filter(it=>it.sid===sid&&it.type==='carte'));
  return{ch,pct:ch.reduce((a,b)=>a+b.pct,0)/ch.length,acc:all.acc,seen:all.seen,mastered:ch.filter(x=>x.lvl===4).length,cards,started:all.seen>0||ch.some(x=>x.lvl>0)};
}
function globalStat(){
  const subs=SUBJ.map(d=>({d,s:subjStat(d.id)}));
  const all=stat(ITEMS.filter(it=>isQuiz(it)||it.type==='point'));
  return{subs,pct:all.pct,acc:all.acc,seenPct:all.total?all.seen/all.total:0,studied:subs.filter(x=>x.s.started).length,chapDone:subs.reduce((a,x)=>a+x.s.mastered,0),chapTotal:SUBJ.reduce((a,d)=>a+d.fiches.length,0)};
}
function weakChapters(n){
  const out=[];
  for(const d of SUBJ)d.fiches.forEach((f,c)=>{const s=chapStat(d.id,c);if(s.seen>0&&s.lvl<4)out.push({d,c,s,score:(s.acc==null?0.5:s.acc)+s.pct})});
  return out.sort((a,b)=>a.score-b.score).slice(0,n);
}
function hardItems(n){
  return ITEMS.filter(it=>isQuiz(it)&&rec(it.id)&&rec(it.id).miss>0).sort((a,b)=>(rec(b.id).miss-rec(b.id).ok*0.5)-(rec(a.id).miss-rec(a.id).ok*0.5)).slice(0,n);
}
/* ---------- temps & séries ---------- */
let lastAct=Date.now(),curSid=null;
['pointerdown','keydown','scroll','touchstart'].forEach(ev=>addEventListener(ev,()=>lastAct=Date.now(),{passive:true}));
setInterval(()=>{
  if(document.visibilityState!=='visible'||Date.now()-lastAct>120000)return;
  const k=iso(Date.now());const t=S.prog.time[k]||(S.prog.time[k]={s:0,q:0,g:0});t.s+=15;
  if(curSid){S.prog.tsub[curSid]=(S.prog.tsub[curSid]||0)+15}
  S.prog.updatedAt=Date.now();try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}
  if(t.s%300===0){dirty.prog=true;clearTimeout(saveT);saveT=setTimeout(push,2500)}
},15000);
function minutes(days){let s=0;const t0=today0();for(let i=0;i<days;i++){const r=S.prog.time[iso(t0-i*DAY)];if(r)s+=r.s}return Math.round(s/60)}
function weekStart(){const d=new Date(today0());const wd=(d.getDay()+6)%7;return d.getTime()-wd*DAY}
function weekTotals(){let q=0,s=0;const w=weekStart();for(let i=0;i<7;i++){const r=S.prog.time[iso(w+i*DAY)];if(r){q+=r.q;s+=r.s}}return{q,m:Math.round(s/60)}}
function dayTotals(){const r=S.prog.time[iso(Date.now())]||{s:0,q:0,g:0};return{q:r.q,m:Math.round(r.s/60),g:r.g}}
function streak(){
  const act=t=>{const r=S.prog.time[iso(t)];return r&&(r.q>0||r.s>=300)};
  let t=today0(),n=0;if(!act(t))t-=DAY;
  while(act(t)){n++;t-=DAY}return n;
}
window.CORE={ORDER,ICON,SUBJ,ITEMS,BYID,DAY,QUIZ_TYPES,TYPE_LABEL,LEVELS,today0,iso,norm,isQuiz,get S(){return S},save,grade,rec,due,chapItems,chapStat,subjStat,globalStat,weakChapters,hardItems,minutes,weekTotals,dayTotals,weekStart,streak,SYNC,initSync,setRemote(f){onRemote=f},setSid(s){curSid=s},logDay,reset(){S=blank();save()},replace(v){S.prog=Object.assign(blank().prog,v.prog||{});S.perso=Object.assign(blank().perso,v.perso||{});save()}};
}
