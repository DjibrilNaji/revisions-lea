{
const C=window.CORE,{SUBJ,ITEMS,BYID,DAY,TYPE_LABEL,LEVELS}=C;
const $=s=>document.querySelector(s);
const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fmt=s=>esc(s).replace(/[\u0600-\u06FF][\u0600-\u06FF\u064B-\u065F\u0670\s\/·…،]*[\u0600-\u06FF\u064B-\u065F]|[\u0600-\u06FF]/g,m=>'<span class="ar" dir="rtl" lang="ar">'+m+'</span>');
const shuffle=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
const sub=id=>SUBJ.find(d=>d.id===id);
const pct=x=>Math.round((x||0)*100);
const EXAM=new Date(2027,0,8).getTime();
const view=()=>$('#view');
const S=()=>C.S;
const chapName=(d,c)=>d.fiches[c].t.replace(/^[^·]*·\s*/,'');
const chapShort=(d,c)=>d.fiches[c].t.split(' · ')[0];
const LVL_CLS=['l0','l1','l2','l3','l4'];
function badge(s){return `<span class="lvl ${LVL_CLS[s.lvl]}">${esc(s.level)}</span>`}
function bar(p,color){return `<span class="bar"${color?` style="--c:${color}"`:''}><i style="width:${Math.max(0,Math.min(100,p))}%"></i></span>`}
function toast(t){const el=$('#toast');el.textContent=t;el.classList.add('on');clearTimeout(el._t);el._t=setTimeout(()=>el.classList.remove('on'),2200)}

/* ---------- thème ---------- */
function applyTheme(){const t=S().perso.theme;if(t==='auto')document.documentElement.removeAttribute('data-theme');else document.documentElement.setAttribute('data-theme',t)}

/* ---------- motivation (réelle, tirée des stats) ---------- */
function motivation(){
  const st=C.streak(),d=C.dayTotals(),g=S().perso.goals,due=C.due().length;
  if(d.q>=g.qDay)return `Objectif du jour atteint : ${d.q} questions. Bravo.`;
  if(st>=3)return `${st} jours de révision d'affilée. Garde le rythme.`;
  if(due>0)return `${due} notion${due>1?'s':''} t'attend${due>1?'ent':''} aujourd'hui : 10 minutes suffisent pour commencer.`;
  if(d.q>0)return `Déjà ${d.q} question${d.q>1?'s':''} aujourd'hui, continue.`;
  return 'Une petite séance aujourd\'hui vaut mieux qu\'une grosse demain.';
}

/* ---------- reprendre ---------- */
function setLast(o){S().perso.last=Object.assign({ts:Date.now()},o);C.save('perso')}
function lastLabel(){
  const p=S().perso;
  if(p.session&&p.session.i<p.session.list.length)return{t:'Quiz en cours : '+p.session.title+' · question '+(p.session.i+1)+'/'+p.session.list.length,go:()=>{location.hash='quiz'}};
  const l=p.last;if(!l)return null;
  const d=sub(l.sid);if(!d)return null;
  if(l.c!=null&&d.fiches[l.c])return{t:d.nom+' · '+chapName(d,l.c)+(l.tab?' ('+({fiche:'fiche',quiz:'quiz',memo:'mémorisation'}[l.tab]||'')+')':''),go:()=>{state.tab=l.tab||'fiche';location.hash='c-'+l.sid+'-'+l.c}};
  return{t:d.nom,go:()=>{location.hash='m-'+l.sid}};
}

/* ---------- recommandation ---------- */
function recommend(){
  const due=C.due();
  if(due.length)return{t:`Commence par tes ${due.length} notion${due.length>1?'s':''} à revoir aujourd'hui (répétition espacée).`,b:'Réviser maintenant',go:()=>startReview()};
  const todayTask=S().perso.tasks.find(t=>t.d===C.iso(Date.now())&&!t.done&&t.s);
  if(todayTask)return{t:'Au planning aujourd\'hui : '+todayTask.t,b:'Ouvrir la matière',go:()=>{location.hash='m-'+todayTask.s}};
  const w=C.weakChapters(1)[0];
  if(w)return{t:`Ton chapitre le plus fragile : ${w.d.nom} · ${chapName(w.d,w.c)} (${pct(w.s.pct)} % maîtrisé).`,b:'Révision ciblée',go:()=>startQuiz({mode:'cible',sid:w.d.id,c:w.c})};
  for(const d of SUBJ)for(let c=0;c<d.fiches.length;c++)if(C.chapStat(d.id,c).lvl===0)return{t:`Découvre un nouveau chapitre : ${d.nom} · ${chapName(d,c)}.`,b:'Lire la fiche',go:()=>{state.tab='fiche';location.hash='c-'+d.id+'-'+c}};
  return{t:'Tout est commencé. Lance un examen blanc pour tester tes connaissances.',b:'Examen blanc',go:()=>{location.hash='partiels'}};
}

/* =================== ACCUEIL =================== */
function vHome(){
  C.setSid(null);
  const g=C.globalStat(),st=C.streak(),wk=C.weekTotals(),dy=C.dayTotals(),G=S().perso.goals;
  const days=Math.max(0,Math.ceil((EXAM-C.today0())/DAY));
  const last=lastLabel(),rec=recommend(),due=C.due();
  const hist=S().prog.hist.slice(-5).reverse();
  const weak=C.weakChapters(5),hard=C.hardItems(4);
  const todayISO=C.iso(Date.now());const tasks=S().perso.tasks.filter(t=>t.d===todayISO).sort((a,b)=>hk(a.h)-hk(b.h));
  const h=new Date().getHours();
  view().innerHTML=`
  <section class="hero">
    <div class="hero-txt"><p class="eyebrow">${h<12?'Bonjour':h<18?'Bon après-midi':'Bonsoir'} · ${days} jours avant le 8 janvier</p><h1>Ton espace de révision</h1><p class="lead">${esc(motivation())}</p>
    <div class="row">${last?`<button class="btn" id="resume">Reprendre mes révisions</button>`:`<button class="btn" id="resume2">Commencer</button>`}<button class="btn soft" id="todo">À revoir aujourd'hui <b class="cnt">${due.length}</b></button></div>
    ${last?`<p class="small muted" style="margin-top:8px">Là où tu t'es arrêtée : ${esc(last.t)}</p>`:''}</div>
    <div class="ring-box">${ring(g.pct,'progression générale')}<p class="small muted center m0">${pct(g.seenPct)} % des notions déjà travaillées</p></div>
  </section>
  <section class="kpis">
    <div class="kpi"><b>${g.studied}<small>/${SUBJ.length}</small></b><span>matières étudiées</span></div>
    <div class="kpi"><b>${g.chapDone}<small>/${g.chapTotal}</small></b><span>chapitres maîtrisés</span></div>
    <div class="kpi"><b>${fmtMin(dy.m)}</b><span>de travail aujourd'hui · ${fmtMin(wk.m)} cette semaine</span></div>
    <div class="kpi"><b>${st}</b><span>jour${st>1?'s':''} d'affilée</span></div>
  </section>
  <div class="grid2">
    <section class="card reco"><h3>Ma prochaine séance</h3><p>${esc(rec.t)}</p><button class="btn" id="reco">${esc(rec.b)}</button></section>
    <section class="card"><h3>Objectifs de la semaine</h3>
      ${goalRow('Questions',wk.q,G.qWeek)}${goalRow('Minutes',wk.m,G.mWeek)}
      <p class="small muted" style="margin:10px 0 0">Aujourd'hui : ${dy.q}/${G.qDay} questions · ${dy.m}/${G.mDay} min · <a href="#outils" class="lnk">modifier mes objectifs</a></p></section>
  </div>
  <div class="grid2">
    <section class="card"><h3>Mon planning du jour</h3>${tasks.length?`<ul class="tasks">${tasks.map(taskLi).join('')}</ul>`:`<p class="muted">Rien de prévu aujourd'hui. <a class="lnk" href="#planning">Ouvrir le planning</a></p>`}</section>
    <section class="card"><h3>Mes derniers quiz</h3>${hist.length?`<ul class="hist">${hist.map(histLi).join('')}</ul>`:`<p class="muted">Pas encore de quiz. Ton premier résultat s'affichera ici.</p>`}</section>
  </div>
  <div class="grid2">
    <section class="card"><h3>Chapitres à travailler</h3>${weak.length?weak.map(w=>`<button class="li" data-ch="${w.d.id}-${w.c}"><span class="dot" style="--c:${w.d.couleur}"></span><span class="grow"><b>${esc(chapName(w.d,w.c))}</b><br><span class="small muted">${esc(w.d.nom)} · ${pct(w.s.pct)} % maîtrisé${w.s.acc!=null?' · '+pct(w.s.acc)+' % de réussite':''}</span></span>${badge(w.s)}</button>`).join(''):`<p class="muted">Ils apparaîtront dès que tu auras fait quelques exercices.</p>`}</section>
    <section class="card"><h3>Mes notions les plus difficiles</h3>${hard.length?hard.map(it=>{const d=sub(it.sid);return `<button class="li" data-ch="${it.sid}-${it.c}"><span class="dot" style="--c:${d.couleur}"></span><span class="grow"><b>${fmt(trim(it.q,80))}</b><br><span class="small muted">${esc(d.nom)} · ${esc(chapName(d,it.c))} · ratée ${C.rec(it.id).miss} fois</span></span></button>`}).join(''):`<p class="muted">Aucune erreur enregistrée pour l'instant.</p>`}</section>
  </div>
  <h2 class="sec">Mes matières</h2>
  <div class="subjects">${g.subs.map(({d,s})=>subjCard(d,s)).join('')}</div>`;
  const r=$('#resume');if(r)r.onclick=()=>last.go();
  const r2=$('#resume2');if(r2)r2.onclick=()=>rec.go();
  $('#todo').onclick=()=>{location.hash='revoir'};
  $('#reco').onclick=rec.go;
  bindTasks();bindCh();bindSubj();
}
function trim(s,n){s=String(s);return s.length>n?s.slice(0,n-1)+'…':s}
function fmtMin(m){return m>=60?Math.floor(m/60)+' h '+String(m%60).padStart(2,'0'):m+' min'}
function goalRow(l,v,t){const p=t?Math.min(100,v/t*100):0;return `<div class="goal"><div class="goal-h"><span>${l}</span><span>${v} / ${t}</span></div>${bar(p)}</div>`}
function ring(p,label){const r=52,c=2*Math.PI*r;return `<svg viewBox="0 0 130 130" class="ring" role="img" aria-label="${pct(p)} % ${label}"><circle cx="65" cy="65" r="${r}" class="ring-bg"/><circle cx="65" cy="65" r="${r}" class="ring-fg" stroke-dasharray="${c}" stroke-dashoffset="${c*(1-p)}"/><text x="65" y="62" text-anchor="middle" class="ring-n">${pct(p)} %</text><text x="65" y="82" text-anchor="middle" class="ring-l">maîtrisé</text></svg>`}
function subjCard(d,s){return `<button class="subj" style="--c:${d.couleur}" data-subj="${d.id}"><span class="ico">${esc(C.ICON[d.id])}</span><span class="grow"><b>${esc(d.nom)}</b><span class="small muted">${d.fiches.length} chapitres · ${s.mastered} maîtrisé${s.mastered>1?'s':''}</span>${bar(pct(s.pct))}</span><span class="pc">${pct(s.pct)} %</span></button>`}
function histLi(h){const d=sub(h.sid);return `<li><span class="dot" style="--c:${d?d.couleur:'var(--accent)'}"></span><span class="grow">${esc(h.title)}<br><span class="small muted">${new Date(h.ts).toLocaleDateString('fr-FR',{day:'numeric',month:'short'})} · ${esc(MODES[h.mode]||h.mode)}${h.note!=null?' · '+h.note+'/20':''}</span></span><b>${h.good}/${h.n}</b></li>`}
function bindCh(){view().querySelectorAll('[data-ch]').forEach(b=>b.onclick=()=>{const [s,c]=b.dataset.ch.split('-');state.tab='fiche';location.hash='c-'+s+'-'+c})}
function bindSubj(){view().querySelectorAll('[data-subj]').forEach(b=>b.onclick=()=>{location.hash='m-'+b.dataset.subj})}

/* =================== MATIÈRES =================== */
function vSubjects(){
  C.setSid(null);
  view().innerHTML=`<h1 class="ttl">Mes matières</h1><p class="lead">Choisis une matière, puis un chapitre. Le niveau de maîtrise est calculé à partir de tes résultats.</p><div class="subjects big">${SUBJ.map(d=>subjCard(d,C.subjStat(d.id))).join('')}</div>`;
  bindSubj();
}
function vSubject(sid){
  const d=sub(sid);if(!d)return go('matieres');C.setSid(sid);setLast({sid});
  const s=C.subjStat(sid),favs=S().perso.favs;
  const nCards=d.cartes.length,nSuj=d.sujets.length;
  view().innerHTML=`<button class="back" onclick="location.hash='matieres'">← Matières</button>
  <section class="shead" style="--c:${d.couleur}"><span class="ico big">${esc(C.ICON[d.id])}</span><div class="grow"><h1>${esc(d.nom)}</h1><p class="small">${pct(s.pct)} % maîtrisé · ${s.mastered}/${d.fiches.length} chapitres maîtrisés${s.acc!=null?' · '+pct(s.acc)+' % de réussite':''} · ${s.cards.mast}/${nCards} flashcards maîtrisées</p>${bar(pct(s.pct),'#fff')}</div></section>
  <details class="card exam"><summary><b>L'examen</b> · format et conseils</summary><p>${fmt(d.examen)}</p></details>
  <div class="actions">
    <button class="act" data-a="intensif"><b>Test complet</b><span>toute la matière, tous types d'exercices</span></button>
    <button class="act" data-a="examen"><b>Examen blanc</b><span>chronométré, noté sur 20</span></button>
    <button class="act" data-a="cible"><b>Révision ciblée</b><span>seulement ce que tu maîtrises mal</span></button>
    <button class="act" data-a="cartes"><b>Flashcards</b><span>${nCards} cartes</span></button>
    <button class="act" data-a="assoc"><b>Associer</b><span>relier notions et définitions</span></button>
    <button class="act" data-a="reflexion"><b>Sujets d'examen</b><span>${nSuj} questions de réflexion</span></button>
  </div>
  <h2 class="sec">Chapitres</h2>
  <div class="chapters">${d.fiches.map((f,c)=>{const cs=s.ch[c];const fav=favs.includes(sid+'-'+c);return `<div class="chap" style="--c:${d.couleur}"><button class="chap-main" data-c="${c}"><span class="chap-n">${esc(chapShort(d,c))}</span><b>${fmt(chapName(d,c))}</b><span class="small muted">${cs.total} exercices et notions · ${pct(cs.pct)} % maîtrisé</span>${bar(pct(cs.pct))}${badge(cs)}</button><button class="star${fav?' on':''}" data-fav="${sid}-${c}" aria-label="Favori">${fav?'★':'☆'}</button></div>`}).join('')}</div>`;
  view().querySelectorAll('[data-c]').forEach(b=>b.onclick=()=>{state.tab='fiche';location.hash='c-'+sid+'-'+b.dataset.c});
  view().querySelectorAll('[data-a]').forEach(b=>b.onclick=()=>{const a=b.dataset.a;
    if(a==='cartes')startCards(sid);else if(a==='assoc')startQuiz({mode:'assoc',sid});else if(a==='reflexion')startQuiz({mode:'reflexion',sid});else startQuiz({mode:a,sid})});
  bindFav();
}
function bindFav(){view().querySelectorAll('[data-fav]').forEach(b=>b.onclick=e=>{e.stopPropagation();const k=b.dataset.fav,f=S().perso.favs;const i=f.indexOf(k);if(i<0)f.push(k);else f.splice(i,1);C.save('perso');b.classList.toggle('on');b.textContent=i<0?'★':'☆';toast(i<0?'Ajouté aux favoris':'Retiré des favoris')})}

/* =================== CHAPITRE =================== */
const state={tab:'fiche',memo:false};
function vChapter(sid,c){
  const d=sub(sid);c=+c;if(!d||!d.fiches[c])return go('matieres');
  C.setSid(sid);const k=sid+'-'+c;
  if(!S().prog.visited[k]){S().prog.visited[k]=Date.now();C.save('prog')}
  setLast({sid,c,tab:state.tab});
  const cs=C.chapStat(sid,c),f=d.fiches[c];const fav=S().perso.favs.includes(k);
  const prev=c>0?c-1:null,next=c<d.fiches.length-1?c+1:null;
  view().innerHTML=`<button class="back" onclick="location.hash='m-${sid}'">← ${esc(d.nom)}</button>
  <section class="chead" style="--c:${d.couleur}"><div class="grow"><p class="eyebrow">${esc(chapShort(d,c))}</p><h1>${fmt(chapName(d,c))}</h1><div class="row small">${badge(cs)}<span>${cs.mast}/${cs.total} maîtrisés${cs.acc!=null?' · '+pct(cs.acc)+' % de réussite':''}</span></div></div><button class="star big${fav?' on':''}" data-fav="${k}" aria-label="Favori">${fav?'★':'☆'}</button></section>
  <div class="tabs" role="tablist">${[['fiche','Fiche de cours'],['quiz','Exercices'],['memo','Mémoriser']].map(([t,l])=>`<button role="tab" aria-selected="${state.tab===t}" data-tab="${t}">${l}</button>`).join('')}</div>
  <div id="pane"></div>
  <div class="row nav2">${prev!=null?`<button class="btn ghost" data-go="${prev}">← ${esc(chapShort(d,prev))}</button>`:''}<span class="grow"></span>${next!=null?`<button class="btn ghost" data-go="${next}">${esc(chapShort(d,next))} →</button>`:''}</div>`;
  view().querySelectorAll('[data-tab]').forEach(b=>b.onclick=()=>{state.tab=b.dataset.tab;vChapter(sid,c)});
  view().querySelectorAll('[data-go]').forEach(b=>b.onclick=()=>{location.hash='c-'+sid+'-'+b.dataset.go});
  bindFav();
  if(state.tab==='fiche')paneFiche(d,c);else if(state.tab==='quiz')paneExo(d,c);else paneMemo(d,c);
}
function splitPoint(p){const m=String(p).match(/^([^:]{2,60}?)\s:\s(.+)$/);if(!m||/[.=]\s|=/.test(m[1]))return null;return{k:m[1],v:m[2]}}
function paneFiche(d,c){
  const f=d.fiches[c],ret=d.ret[c];
  const pts=f.p.map((p,j)=>{const sp=splitPoint(p);const flagged=S().perso.flags.some(x=>x.id===d.id+'-p'+c+'_'+j);
    return `<li class="pt">${sp?`<b class="term">${fmt(sp.k)}</b> <span class="hide">${fmt(sp.v)}</span>`:`<span class="hide">${fmt(p)}</span>`}<button class="flag${flagged?' on':''}" data-flag="${c}_${j}" title="Ajouter aux notions à revoir">${flagged?'⚑':'⚐'}</button></li>`}).join('');
  $('#pane').innerHTML=`
  ${ret?`<div class="retenir"><b>À retenir absolument</b><p>${fmt(ret)}</p></div>`:''}
  <div class="row between"><h3 class="m0">Les notions du chapitre</h3><label class="switch"><input type="checkbox" id="memo" ${state.memo?'checked':''}><span>Masquer pour réciter</span></label></div>
  <p class="small muted">${state.memo?'Récite chaque notion de mémoire, puis touche le texte flouté pour vérifier.':'Les termes en gras sont les définitions et notions clés. Le drapeau ⚐ ajoute une notion à ta liste « à revoir ».'}</p>
  <ul class="points${state.memo?' memo':''}">${pts}</ul>
  <h3>Carte mentale</h3><div class="mind" id="mind"></div>
  ${(()=>{const keys=f.p.map(p=>{const sp=splitPoint(p);return sp?sp.k:null}).filter(Boolean);return keys.length?`<div class="resume"><b>Résumé · les notions clés du chapitre</b><p>${keys.map(fmt).join(' · ')}</p></div>`:''})()}
  <div class="row"><button class="btn" id="goQuiz">S'entraîner sur ce chapitre</button><button class="btn soft" id="goMemo">Tester ma mémoire</button></div>`;
  $('#memo').onchange=e=>{state.memo=e.target.checked;paneFiche(d,c)};
  $('#pane').querySelectorAll('.memo .hide').forEach(el=>el.onclick=()=>el.classList.add('shown'));
  $('#pane').querySelectorAll('[data-flag]').forEach(b=>b.onclick=()=>{const [cc,j]=b.dataset.flag.split('_');toggleFlag(d.id+'-p'+cc+'_'+j);paneFiche(d,c)});
  $('#goQuiz').onclick=()=>{state.tab='quiz';vChapter(d.id,c)};
  $('#goMemo').onclick=()=>{state.tab='memo';vChapter(d.id,c)};
  drawMind(d,c);
}
function toggleFlag(id){const fl=S().perso.flags;const i=fl.findIndex(x=>x.id===id);if(i<0){fl.push({id,ts:Date.now()});toast('Ajouté aux notions à revoir')}else{fl.splice(i,1);toast('Retiré des notions à revoir')}C.save('perso')}
function drawMind(d,c){
  const box=$('#mind');if(!box)return;
  const f=d.fiches[c];const nodes=f.p.map(p=>{const sp=splitPoint(p);return trim(sp?sp.k:p.split(/[:,.(·]/)[0],34)}).slice(0,8);
  const W=box.clientWidth||600;
  if(W<560){box.innerHTML=`<div class="mind-list"><div class="mind-c" style="--c:${d.couleur}">${fmt(chapName(d,c))}</div>${nodes.map(n=>`<div class="mind-n" style="--c:${d.couleur}">${fmt(n)}</div>`).join('')}</div>`;return}
  const H=Math.max(300,nodes.length*46),cx=W/2,cy=H/2;
  const L=nodes.map((n,i)=>{const left=i%2===0;const k=Math.floor(i/2),rows=Math.ceil(nodes.length/2);const y=(k+0.5)*H/rows;const x=left?W*0.16:W*0.84;return{n,x,y,left}});
  box.style.height=H+'px';
  box.innerHTML=`<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">${L.map(p=>`<path d="M${cx},${cy} C${(cx+p.x)/2},${cy} ${(cx+p.x)/2},${p.y} ${p.x},${p.y}" class="mind-l" style="stroke:${d.couleur}"/>`).join('')}</svg>
  <div class="mind-c abs" style="--c:${d.couleur};left:${cx}px;top:${cy}px">${fmt(trim(chapName(d,c),40))}</div>
  ${L.map(p=>`<div class="mind-n abs ${p.left?'lft':'rgt'}" style="--c:${d.couleur};left:${p.x}px;top:${p.y}px">${fmt(p.n)}</div>`).join('')}`;
}
function paneExo(d,c){
  const items=C.chapItems(d.id,c).filter(C.isQuiz);
  const byType={};items.forEach(it=>byType[it.type]=(byType[it.type]||0)+1);
  const weak=items.filter(it=>{const r=C.rec(it.id);return !r||r.b<3}).length;
  $('#pane').innerHTML=`<p class="lead m0">${items.length} exercices sur ce chapitre : ${Object.entries(byType).map(([t,n])=>n+' '+TYPE_LABEL[t].toLowerCase()).join(' · ')}.</p>
  <div class="modes">
    ${modeCard('entrainement','Entraînement','Correction expliquée après chaque réponse.')}
    ${modeCard('examen','Mode examen','Chronomètre, pas de correction avant la fin, note sur 20.')}
    ${modeCard('cible','Révision ciblée',weak+' exercice'+(weak>1?'s':'')+' pas encore maîtrisé'+(weak>1?'s':'')+'.')}
    ${modeCard('aleatoire','Aléatoire','Une série différente à chaque fois.')}
    ${modeCard('intensif','Intensif','Tout le chapitre ; les erreurs reviennent jusqu\'à ce que tu réussisses.')}
  </div>
  <p class="label">Types d'exercices</p><div class="chips" id="types"><button class="chip" aria-pressed="true" data-v="">Tous</button>${Object.keys(byType).map(t=>`<button class="chip" aria-pressed="false" data-v="${t}">${TYPE_LABEL[t]}</button>`).join('')}</div>
  <p class="label">Niveau</p><div class="chips" id="diff"><button class="chip" aria-pressed="true" data-v="">Tous</button><button class="chip" aria-pressed="false" data-v="1">Niveau 1 · reconnaître</button><button class="chip" aria-pressed="false" data-v="2">Niveau 2 · restituer</button></div>`;
  let type='',diff='';pick('types',v=>type=v);pick('diff',v=>diff=v);
  $('#pane').querySelectorAll('[data-mode]').forEach(b=>b.onclick=()=>startQuiz({mode:b.dataset.mode,sid:d.id,c,type,diff}));
}
function modeCard(m,t,s){return `<button class="mode" data-mode="${m}"><b>${t}</b><span>${s}</span></button>`}
function pick(id,cb){const box=document.getElementById(id);box.querySelectorAll('.chip').forEach(ch=>ch.onclick=()=>{box.querySelectorAll('.chip').forEach(x=>x.setAttribute('aria-pressed','false'));ch.setAttribute('aria-pressed','true');cb(ch.dataset.v)})}
function paneMemo(d,c){
  const pts=ITEMS.filter(it=>it.type==='point'&&it.sid===d.id&&it.c===c);
  const known=pts.filter(it=>{const r=C.rec(it.id);return r&&r.b>=3}).length;
  $('#pane').innerHTML=`<p class="lead m0">Récitation active : pour chaque notion, tu vois le début, tu récites la suite dans ta tête, puis tu vérifies et tu dis honnêtement si tu savais. Les notions ratées reviennent dans « À revoir aujourd'hui ».</p>
  <p class="small muted">${known}/${pts.length} notions maîtrisées dans ce chapitre.</p>
  <div class="row"><button class="btn" id="m1">Réciter tout le chapitre</button><button class="btn soft" id="m2">Seulement les notions à revoir</button></div>`;
  $('#m1').onclick=()=>startQuiz({mode:'recit',sid:d.id,c});
  $('#m2').onclick=()=>startQuiz({mode:'recit',sid:d.id,c,onlyWeak:true});
}

/* =================== MOTEUR DE QUIZ =================== */
const MODES={entrainement:'Entraînement',examen:'Examen',cible:'Révision ciblée',aleatoire:'Aléatoire',intensif:'Intensif',assoc:'Associer',reflexion:'Sujets',recit:'Récitation',revoir:'À revoir',cartes:'Flashcards',blanc:'Examen blanc'};
function scope(o){return ITEMS.filter(it=>(!o.sid||it.sid===o.sid)&&(o.c==null||it.c===o.c)&&(!o.chaps||o.chaps.includes(it.sid+'-'+it.c)))}
function startQuiz(o){
  let list=[],title='',timed=0;const d=o.sid?sub(o.sid):null;
  const base=scope(o).filter(C.isQuiz).filter(it=>(!o.type||it.type===o.type)&&(!o.diff||it.diff===+o.diff));
  const where=d?(o.c!=null?chapName(d,o.c):d.nom):'Toutes les matières';
  if(o.mode==='entrainement'){list=shuffle(base).slice(0,15);title='Entraînement · '+where}
  else if(o.mode==='aleatoire'){list=shuffle(base).slice(0,12);title='Aléatoire · '+where}
  else if(o.mode==='intensif'){list=shuffle(base).sort((a,b)=>a.diff-b.diff);title='Intensif · '+where}
  else if(o.mode==='examen'){list=shuffle(base).slice(0,20).sort((a,b)=>a.diff-b.diff);title='Examen · '+where;timed=list.length*60}
  else if(o.mode==='cible'){list=base.filter(it=>{const r=C.rec(it.id);return r&&r.b<3}).sort((a,b)=>C.rec(a.id).b-C.rec(b.id).b);
    if(list.length<8)list=list.concat(shuffle(base.filter(it=>!C.rec(it.id))).slice(0,8-list.length));list=list.slice(0,15);title='Révision ciblée · '+where}
  else if(o.mode==='recit'){list=scope(o).filter(it=>it.type==='point'&&(!o.onlyWeak||!C.rec(it.id)||C.rec(it.id).b<3));title='Récitation · '+where}
  else if(o.mode==='reflexion'){list=scope(o).filter(it=>it.type==='reflexion');title='Sujets d\'examen · '+where}
  else if(o.mode==='assoc'){list=[];const cards=shuffle(scope(o).filter(it=>it.type==='carte'));for(let i=0;i+4<=cards.length&&list.length<4;i+=4)list.push({id:'assoc-'+i,type:'assoc',sid:o.sid,diff:2,pairs:cards.slice(i,i+4).map(k=>[k.r,k.v])});title='Associer · '+where}
  else if(o.mode==='revoir'){list=o.list;title='À revoir aujourd\'hui'}
  else if(o.mode==='blanc'){list=o.list;title=o.title;timed=o.timed}
  if(!list.length){toast(o.mode==='cible'?'Rien à cibler : tout est maîtrisé ici.':'Aucun exercice pour ce choix.');return}
  S().perso.session={mode:o.mode,sid:o.sid||null,c:o.c==null?null:o.c,title,list:list.map(it=>it.type==='assoc'?it:it.id),assocs:list.filter(it=>it.type==='assoc'),i:0,ans:[],start:Date.now(),timed,shown:false,cfg:o.cfgSel||null};
  C.save('perso');location.hash='quiz';if(location.hash==='#quiz')vQuiz();
}
function itemOf(sess,k){const x=sess.list[k];return typeof x==='string'?BYID[x]:x}
let timerT=null;
function vQuiz(){
  const s=S().perso.session;clearInterval(timerT);
  if(!s){view().innerHTML=`<p class="muted">Aucun quiz en cours.</p><button class="btn" onclick="location.hash='accueil'">Accueil</button>`;return}
  C.setSid(s.sid);
  if(s.i>=s.list.length)return quizEnd();
  const it=itemOf(s,s.i);if(!it){s.i++;C.save('perso');return vQuiz()}
  const d=sub(it.sid);const exam=s.mode==='examen'||s.mode==='blanc';
  view().innerHTML=`<div class="qtop"><button class="back" id="quit">← Quitter</button><span class="grow small muted">${esc(s.title)}</span>${s.timed?`<span class="timer" id="timer"></span>`:''}</div>
  <div class="qcard" style="--c:${d?d.couleur:'var(--accent)'}"><div class="qhead"><span>${s.i+1} / ${s.list.length}</span><span>${esc(TYPE_LABEL[it.type])} · niveau ${it.diff}</span></div><div class="prog"><i style="width:${s.i/s.list.length*100}%"></i></div>
  ${d&&it.c!=null&&d.fiches[it.c]?`<p class="small muted m0">${esc(d.nom)} · ${esc(chapName(d,it.c))}</p>`:''}
  <div id="qbody"></div><div id="fb"></div></div>`;
  $('#quit').onclick=()=>{if(s.i>0&&!exam){s.i=s.list.length;C.save('perso');vQuiz()}else{S().perso.session=null;C.save('perso');history.back()}};
  if(s.timed){const tick=()=>{const left=s.timed-Math.floor((Date.now()-s.start)/1000);const el=$('#timer');if(!el)return clearInterval(timerT);if(left<=0){clearInterval(timerT);s.i=s.list.length;C.save('perso');vQuiz();return}el.textContent=Math.floor(left/60)+':'+String(left%60).padStart(2,'0');el.classList.toggle('warn',left<60)};tick();timerT=setInterval(tick,1000)}
  RENDER[it.type](it,s,exam);
}
function answer(it,s,ok,given,exam){
  if(s.ans[s.i])return;
  s.ans[s.i]={id:it.id,ok,given};
  if(it.type!=='assoc')C.grade(it.id,ok);else C.logDay(1,ok);
  C.save('prog');C.save('perso');
  if(exam){s.i++;C.save('perso');setTimeout(vQuiz,120);return}
  if(s.mode==='intensif'&&!ok&&typeof s.list[s.i]==='string'){s.req=s.req||{};const k=s.list[s.i];s.req[k]=(s.req[k]||0)+1;if(s.req[k]<=2)s.list.push(k)}
  showCorrection(it,ok,given);
}
function nextBtn(s){return `<div class="row"><button class="btn" id="next">${s.i+1<s.list.length?'Continuer':'Voir mon bilan'}</button></div>`}
function bestPoint(it){
  const d=sub(it.sid);if(it.c==null||!d||!d.fiches[it.c])return null;
  const words=new Set(C.norm([it.q,it.e,it.type==='qcm'?it.o[it.a]:''].join(' ')).split(' ').filter(w=>w.length>3));
  let best=null,sc=0;for(const p of d.fiches[it.c].p){const n=C.norm(p).split(' ').filter(w=>words.has(w)).length;if(n>sc){sc=n;best=p}}
  return sc>=2?best:null;
}
function rightAnswer(it){
  if(it.type==='qcm')return it.o[it.a];if(it.type==='vf')return it.a?'Vrai':'Faux';
  if(it.type==='courte')return it.r[0];if(it.type==='trou')return blanks(it.q).map(b=>b[0]).join(' · ');
  if(it.type==='ordre')return it.items.map((x,i)=>(i+1)+'. '+x).join('  ');return '';
}
function showCorrection(it,ok,given){
  const s=S().perso.session,d=sub(it.sid);const bp=!ok?bestPoint(it):null;
  let why='';
  if(it.type==='qcm'&&!ok)why=`<p><b>Ta réponse « ${fmt(given)} » est incorrecte</b> : elle ne correspond pas à la règle ci-dessous. Les autres propositions sont des pièges qui ressemblent à la notion sans la respecter.</p>`;
  if(it.type==='vf')why=`<p>L'affirmation est <b>${it.a?'vraie':'fausse'}</b>.</p>`;
  const flagId=it.id;const flagged=S().perso.flags.some(x=>x.id===flagId);
  $('#fb').innerHTML=`<div class="corr ${ok?'ok':'ko'}"><p class="verdict">${ok?'✓ Bonne réponse':'✗ Pas tout à fait'}</p>
  ${!ok||it.type==='trou'||it.type==='ordre'?`<p><b>La bonne réponse :</b> ${fmt(rightAnswer(it))}</p>`:''}
  ${why}<p><b>Pourquoi :</b> ${fmt(it.e)}</p>
  ${d&&it.c!=null&&d.fiches[it.c]?`<p class="small"><b>Notion du cours :</b> ${esc(chapShort(d,it.c))} · ${fmt(chapName(d,it.c))}</p>`:''}
  ${bp?`<div class="rappel"><b>Rappel de cours</b><p>${fmt(bp)}</p></div>`:''}
  ${!ok&&d&&d.ret[it.c]?`<p class="small"><b>À retenir pour ne plus te tromper :</b> ${fmt(d.ret[it.c])}</p>`:''}
  <div class="row small">${it.type==='courte'&&!ok?`<button class="chip" id="accept">J'avais juste (ma formulation était correcte)</button>`:''}<button class="chip" id="flagq">${flagged?'⚑ Dans mes notions à revoir':'⚐ Ajouter à mes notions à revoir'}</button>${d&&it.c!=null?`<button class="chip" id="seefiche">Voir la fiche</button>`:''}</div>
  </div>${nextBtn(s)}`;
  const n=$('#next');n.focus({preventScroll:true});n.onclick=()=>{s.i++;C.save('perso');vQuiz();window.scrollTo(0,0)};
  $('#flagq').onclick=e=>{toggleFlag(flagId);e.target.textContent=S().perso.flags.some(x=>x.id===flagId)?'⚑ Dans mes notions à revoir':'⚐ Ajouter à mes notions à revoir'};
  const sf=$('#seefiche');if(sf)sf.onclick=()=>{state.tab='fiche';location.hash='c-'+it.sid+'-'+it.c};
  const ac=$('#accept');if(ac)ac.onclick=()=>{const a=s.ans[s.i];a.ok=true;const r=C.rec(it.id);r.ok++;r.miss=Math.max(0,r.miss-1);r.b=1;r.due=C.today0()+DAY;C.S.prog.time[C.iso(Date.now())].g++;C.save('prog');C.save('perso');ac.remove();$('.verdict').textContent='✓ Réponse acceptée';$('.corr').className='corr ok'};
}
function blanks(t){const out=[];t.replace(/\[\[(.+?)\]\]/g,(m,x)=>{out.push(x.split('|'));return m});return out}
const RENDER={
  qcm(it,s,exam){
    const opts=shuffle(it.o.map((t,i)=>({t,i})));
    $('#qbody').innerHTML=`<p class="q">${fmt(it.q)}</p><div class="opts">${opts.map(o=>`<button class="opt" data-i="${o.i}">${fmt(o.t)}</button>`).join('')}</div>`;
    $('#qbody').querySelectorAll('.opt').forEach(b=>b.onclick=()=>{const i=+b.dataset.i,ok=i===it.a;
      if(!exam){$('#qbody').querySelectorAll('.opt').forEach(x=>{x.disabled=true;if(+x.dataset.i===it.a)x.classList.add('good')});if(!ok)b.classList.add('bad')}
      answer(it,s,ok,it.o[i],exam)});
  },
  vf(it,s,exam){
    $('#qbody').innerHTML=`<p class="q">${fmt(it.q)}</p><div class="opts two"><button class="opt" data-v="1">Vrai</button><button class="opt" data-v="0">Faux</button></div>`;
    $('#qbody').querySelectorAll('.opt').forEach(b=>b.onclick=()=>{const v=b.dataset.v==='1',ok=v===it.a;
      if(!exam){$('#qbody').querySelectorAll('.opt').forEach(x=>{x.disabled=true;if((x.dataset.v==='1')===it.a)x.classList.add('good')});if(!ok)b.classList.add('bad')}
      answer(it,s,ok,v?'Vrai':'Faux',exam)});
  },
  trou(it,s,exam){
    let k=0;const html=esc(it.q).replace(/\[\[(.+?)\]\]/g,(m,x)=>`<input class="blank" data-k="${k++}" size="${Math.max(4,x.split('|')[0].length+1)}" autocomplete="off" autocapitalize="off" spellcheck="false" aria-label="trou ${k}">`);
    $('#qbody').innerHTML=`<p class="label m0">Complète le texte</p><p class="q cloze">${html.replace(/[\u0600-\u06FF]+/g,m=>'<span class="ar">'+m+'</span>')}</p><div class="row"><button class="btn" id="chk">Valider</button></div>`;
    const ins=[...$('#qbody').querySelectorAll('.blank')];ins[0]&&ins[0].focus({preventScroll:true});
    ins.forEach((x,i)=>x.onkeydown=e=>{if(e.key==='Enter'){e.preventDefault();if(ins[i+1])ins[i+1].focus();else $('#chk').click()}});
    $('#chk').onclick=()=>{const bl=blanks(it.q);const res=ins.map((x,i)=>bl[i].some(a=>C.norm(a)===C.norm(x.value)));const ok=res.every(Boolean);
      if(!exam)ins.forEach((x,i)=>{x.disabled=true;x.classList.add(res[i]?'good':'bad')});$('#chk').remove();
      answer(it,s,ok,ins.map(x=>x.value).join(' · '),exam)};
  },
  courte(it,s,exam){
    $('#qbody').innerHTML=`<p class="q">${fmt(it.q)}</p><input class="inp" id="ans" autocomplete="off" placeholder="Ta réponse"><div class="row"><button class="btn" id="chk">Valider</button></div>`;
    const inp=$('#ans');inp.focus({preventScroll:true});inp.onkeydown=e=>{if(e.key==='Enter')$('#chk').click()};
    $('#chk').onclick=()=>{const v=inp.value;if(!v.trim()){inp.focus();return}const ok=it.r.some(a=>C.norm(a)===C.norm(v));inp.disabled=true;$('#chk').remove();if(!exam)inp.classList.add(ok?'good':'bad');answer(it,s,ok,v,exam)};
  },
  ordre(it,s,exam){
    const pool=shuffle(it.items.map((t,i)=>({t,i})));let chosen=[];
    const draw=()=>{$('#qbody').innerHTML=`<p class="q">${fmt(it.q)}</p><p class="label">Touche les éléments dans le bon ordre (touche un élément choisi pour l'enlever).</p>
      <ol class="chosen">${chosen.map((o,k)=>`<li><button class="tok on" data-k="${k}">${fmt(o.t)}</button></li>`).join('')||'<li class="muted small">Ton ordre apparaîtra ici</li>'}</ol>
      <div class="pool">${pool.filter(o=>!chosen.includes(o)).map(o=>`<button class="tok" data-i="${o.i}">${fmt(o.t)}</button>`).join('')}</div>
      <div class="row"><button class="btn" id="chk" ${chosen.length<it.items.length?'disabled':''}>Valider</button><button class="btn ghost" id="rst">Recommencer</button></div>`;
      $('#qbody').querySelectorAll('.pool .tok').forEach(b=>b.onclick=()=>{chosen.push(pool.find(o=>o.i===+b.dataset.i));draw()});
      $('#qbody').querySelectorAll('.chosen .tok').forEach(b=>b.onclick=()=>{chosen.splice(+b.dataset.k,1);draw()});
      $('#rst').onclick=()=>{chosen=[];draw()};
      $('#chk').onclick=()=>{const ok=chosen.every((o,k)=>o.i===k);$('#qbody').querySelectorAll('.chosen .tok').forEach((b,k)=>{b.disabled=true;if(!exam)b.classList.add(chosen[k].i===k?'good':'bad')});$('#qbody').querySelectorAll('.pool,#rst,#chk').forEach(x=>x.remove());answer(it,s,ok,chosen.map(o=>o.t).join(' → '),exam)};
    };draw();
  },
  assoc(it,s,exam){
    const L=it.pairs.map((p,i)=>({t:p[0],i})),R=shuffle(it.pairs.map((p,i)=>({t:p[1],i})));let sel=null;const match={};
    const draw=()=>{$('#qbody').innerHTML=`<p class="q">Associe chaque notion à sa définition</p><p class="label">Touche une notion, puis la définition qui lui correspond.</p>
      <div class="assoc"><div>${L.map(o=>`<button class="tok${sel===o.i?' sel':''}${match[o.i]!=null?' done':''}" data-l="${o.i}">${fmt(o.t)}${match[o.i]!=null?` <span class="pill-n">${Object.keys(match).indexOf(String(o.i))+1}</span>`:''}</button>`).join('')}</div>
      <div>${R.map(o=>{const lk=Object.keys(match).find(k=>match[k]===o.i);return `<button class="tok${lk!=null?' done':''}" data-r="${o.i}">${fmt(o.t)}${lk!=null?` <span class="pill-n">${Object.keys(match).indexOf(lk)+1}</span>`:''}</button>`}).join('')}</div></div>
      <div class="row"><button class="btn" id="chk" ${Object.keys(match).length<L.length?'disabled':''}>Valider</button><button class="btn ghost" id="rst">Effacer</button></div>`;
      $('#qbody').querySelectorAll('[data-l]').forEach(b=>b.onclick=()=>{sel=+b.dataset.l;delete match[sel];draw()});
      $('#qbody').querySelectorAll('[data-r]').forEach(b=>b.onclick=()=>{if(sel==null)return toast('Choisis d\'abord une notion à gauche');const r=+b.dataset.r;for(const k in match)if(match[k]===r)delete match[k];match[sel]=r;sel=null;draw()});
      $('#rst').onclick=()=>{for(const k in match)delete match[k];sel=null;draw()};
      $('#chk').onclick=()=>{const good=L.filter(o=>match[o.i]===o.i).length,ok=good===L.length;
        $('#qbody').innerHTML=`<p class="q">Associe chaque notion à sa définition</p><ul class="assoc-res">${L.map(o=>`<li class="${match[o.i]===o.i?'good':'bad'}"><b>${fmt(o.t)}</b> → ${fmt(it.pairs[o.i][1])}</li>`).join('')}</ul>`;
        it.e=`${good}/${L.length} associations correctes.`;answer(it,s,ok,good+'/'+L.length,exam)};
    };draw();
  },
  reflexion(it,s){
    $('#qbody').innerHTML=`<p class="q">${fmt(it.q)}</p><textarea id="ta" placeholder="Rédige ta réponse ou fais-la au brouillon…"></textarea><div class="row"><button class="btn" id="chk">Voir ce qu'il fallait dire</button></div>`;
    $('#chk').onclick=()=>{$('#chk').remove();
      $('#fb').innerHTML=`<div class="corr"><p class="verdict">Coche ce que tu avais dans ta réponse</p><div class="checks">${it.r.map((p,j)=>`<label><input type="checkbox" data-j="${j}"><span>${fmt(p)}</span></label>`).join('')}</div></div><div class="row"><button class="btn" id="val">Valider mon auto-évaluation</button></div>`;
      $('#val').onclick=()=>{const n=$('#fb').querySelectorAll('input:checked').length;const ok=n/it.r.length>=0.6;$('#val').remove();answer(it,s,ok,n+'/'+it.r.length,false)}};
  },
  point(it,s){
    const sp=splitPoint(it.q);const start=sp?sp.k:it.q.split(' ').slice(0,4).join(' ')+'…';
    $('#qbody').innerHTML=`<p class="label m0">Récite la suite de mémoire</p><p class="q">${fmt(start)}</p><div class="row"><button class="btn" id="rv">Vérifier</button></div>`;
    $('#rv').onclick=()=>{$('#qbody').innerHTML=`<p class="label m0">La notion complète</p><p class="q">${fmt(it.q)}</p><div class="row"><button class="btn ghost" id="no">Je ne savais pas</button><button class="btn" id="yes">Je savais ✓</button></div>`;
      const fin=ok=>{if(s.ans[s.i])return;s.ans[s.i]={id:it.id,ok};C.grade(it.id,ok);C.save('prog');s.i++;C.save('perso');vQuiz()};
      $('#yes').onclick=()=>fin(true);$('#no').onclick=()=>fin(false)};
  },
  carte(it,s){
    $('#qbody').innerHTML=`<button class="flip" id="flip"><div class="inner"><div class="face front"><span class="big">${fmt(it.r)}</span><small>Touche pour retourner</small></div><div class="face back"><span>${fmt(it.v)}</span></div></div></button><div class="row center"><button class="btn ghost" id="no" disabled>À revoir</button><button class="btn" id="yes" disabled>Je savais ✓</button></div>`;
    const f=$('#flip');f.onclick=()=>{f.classList.toggle('on');$('#no').disabled=false;$('#yes').disabled=false};
    const fin=ok=>{if(s.ans[s.i])return;s.ans[s.i]={id:it.id,ok};C.grade(it.id,ok);C.save('prog');s.i++;C.save('perso');vQuiz()};
    $('#yes').onclick=()=>fin(true);$('#no').onclick=()=>fin(false);
  }
};
function startCards(sid,onlyWeak){
  const list=shuffle(ITEMS.filter(it=>it.type==='carte'&&it.sid===sid&&(!onlyWeak||!C.rec(it.id)||C.rec(it.id).b<3)));
  if(!list.length)return toast('Toutes les cartes sont maîtrisées.');
  startQuiz({mode:'revoir',sid,list,cfgSel:'cartes'});S().perso.session.mode='cartes';S().perso.session.title='Flashcards · '+sub(sid).nom;C.save('perso');vQuiz();
}
function startReview(){
  let list=C.due();
  if(!list.length){toast('Rien à revoir aujourd\'hui. Voici des notions nouvelles.');list=shuffle(ITEMS.filter(it=>C.isQuiz(it)&&!C.rec(it.id))).slice(0,10)}
  startQuiz({mode:'revoir',list:list.slice(0,25)});
}
function quizEnd(){
  const s=S().perso.session;clearInterval(timerT);
  const graded=s.ans.filter(Boolean);const n=graded.length,good=graded.filter(a=>a.ok).length;
  const exam=s.mode==='examen'||s.mode==='blanc';const note=exam&&s.list.length?Math.round(good/s.list.length*200)/10:null;
  const dur=Math.round((Date.now()-s.start)/1000);
  if(!s.logged&&n){S().prog.hist.push({ts:Date.now(),mode:s.mode,sid:s.sid,title:s.title,n,good,note,dur});s.logged=true;C.save('prog');C.save('perso')}
  /* bilan par chapitre */
  const per={};graded.forEach(a=>{const it=BYID[a.id];if(!it||it.c==null)return;const k=it.sid+'-'+it.c;(per[k]=per[k]||{n:0,g:0,it}).n++;if(a.ok)per[k].g++});
  const rows=Object.entries(per).map(([k,v])=>({k,d:sub(v.it.sid),c:v.it.c,p:v.g/v.n,n:v.n,g:v.g})).sort((a,b)=>a.p-b.p);
  const strong=rows.filter(r=>r.p>=0.75),weak=rows.filter(r=>r.p<0.5);
  const wrong=graded.filter(a=>!a.ok).map(a=>BYID[a.id]).filter(Boolean);
  const msg=n===0?'Aucune réponse enregistrée.':good/n>=0.8?'Excellent travail.':good/n>=0.5?'C\'est un bon début : revois les points faibles ci-dessous.':'Relis les fiches concernées, puis refais une révision ciblée.';
  view().innerHTML=`<div class="qtop"><button class="back" id="home">← Accueil</button></div>
  <section class="card end"><p class="eyebrow">${esc(s.title)}</p><div class="score">${note!=null?note+'<small>/20</small>':good+'<small>/'+n+'</small>'}</div><p class="lead">${esc(msg)}</p><p class="small muted">${good} bonne${good>1?'s':''} réponse${good>1?'s':''} sur ${n}${note!=null&&n<s.list.length?' ('+(s.list.length-n)+' sans réponse)':''} · ${Math.floor(dur/60)} min ${dur%60} s</p>
  <div class="row"><button class="btn" id="again">Recommencer</button>${wrong.filter(C.isQuiz).length?`<button class="btn soft" id="redo">Refaire mes ${wrong.filter(C.isQuiz).length} erreurs</button>`:''}</div></section>
  ${rows.length?`<section class="card"><h3>Bilan par chapitre</h3>${rows.map(r=>`<div class="goal"><div class="goal-h"><span>${esc(r.d.nom)} · ${fmt(chapName(r.d,r.c))}</span><span>${r.g}/${r.n}</span></div>${bar(r.p*100,r.d.couleur)}</div>`).join('')}
  <div class="grid2 tight"><div><h4>Points forts</h4>${strong.length?strong.map(r=>`<p class="small">✓ ${fmt(chapName(r.d,r.c))}</p>`).join(''):'<p class="small muted">Pas encore de chapitre à 75 % ou plus.</p>'}</div><div><h4>Lacunes</h4>${weak.length?weak.map(r=>`<p class="small">✗ ${fmt(chapName(r.d,r.c))}</p>`).join(''):'<p class="small muted">Aucun chapitre sous 50 %.</p>'}</div></div>
  ${weak.length?`<h4>Notions à retravailler</h4>${weak.map(r=>r.d.ret[r.c]?`<div class="rappel"><b>${fmt(chapName(r.d,r.c))}</b><p>${fmt(r.d.ret[r.c])}</p></div>`:'').join('')}`:''}</section>`:''}
  ${wrong.length?`<section class="card"><h3>Corrections de mes erreurs</h3>${wrong.map(it=>`<div class="err"><b>${fmt(it.type==='carte'?it.r:it.type==='point'?trim(it.q,90):it.q)}</b>${C.isQuiz(it)?`<br>Bonne réponse : ${fmt(rightAnswer(it))}<br><span class="small muted">${fmt(it.e)}</span>`:it.type==='carte'?`<br>${fmt(it.v)}`:''}</div>`).join('')}</section>`:''}`;
  $('#home').onclick=()=>{S().perso.session=null;C.save('perso');location.hash='accueil'};
  $('#again').onclick=()=>{const m=s.mode;S().perso.session=null;C.save('perso');if(['revoir','cartes','blanc'].includes(m))history.back();else startQuiz({mode:m,sid:s.sid,c:s.c})};
  const rd=$('#redo');if(rd)rd.onclick=()=>startQuiz({mode:'revoir',list:wrong.filter(C.isQuiz)});
}

/* =================== À REVOIR =================== */
function vReview(){
  C.setSid(null);
  const due=C.due();const bySub={};due.forEach(it=>(bySub[it.sid]=bySub[it.sid]||[]).push(it));
  const newCount=ITEMS.filter(it=>C.isQuiz(it)&&!C.rec(it.id)).length;
  const flags=S().perso.flags;
  view().innerHTML=`<h1 class="ttl">À revoir aujourd'hui</h1><p class="lead">La répétition espacée te repropose chaque notion au bon moment : une notion ratée revient le jour même, une notion réussie revient de plus en plus tard (1, 2, 4, 8, 16 puis 32 jours).</p>
  <section class="card"><div class="row between"><div><div class="big-n">${due.length}</div><span class="muted">notion${due.length>1?'s':''} à revoir aujourd'hui</span></div><button class="btn" id="go" ${due.length?'':'disabled'}>Commencer la révision</button></div>
  ${Object.keys(bySub).length?`<div class="mini-list">${Object.entries(bySub).map(([sid,l])=>`<button class="li" data-r="${sid}"><span class="dot" style="--c:${sub(sid).couleur}"></span><span class="grow">${esc(sub(sid).nom)}</span><b>${l.length}</b></button>`).join('')}</div>`:'<p class="muted">Rien à revoir pour l\'instant. Les notions apparaîtront ici au fil de tes exercices.</p>'}</section>
  <section class="card"><h3>Notions nouvelles</h3><p class="muted">${newCount} exercices jamais faits.</p><button class="btn soft" id="new">10 notions nouvelles au hasard</button></section>
  <section class="card"><h3>Ma liste de notions à revoir</h3>${flags.length?flags.slice().reverse().map(f=>{const it=BYID[f.id];if(!it)return '';const d=sub(it.sid);return `<div class="li"><span class="dot" style="--c:${d.couleur}"></span><span class="grow">${fmt(trim(it.type==='carte'?it.r:it.q,110))}<br><span class="small muted">${esc(d.nom)}${it.c!=null?' · '+esc(chapName(d,it.c)):''}</span></span><button class="chip" data-unflag="${esc(f.id)}">Retirer</button></div>`}).join(''):'<p class="muted">Ajoute des notions avec le drapeau ⚐ dans les fiches ou les corrections.</p>'}
  ${flags.length?`<button class="btn soft" id="flagq">Réviser ma liste</button>`:''}</section>`;
  const g=$('#go');if(g)g.onclick=startReview;
  $('#new').onclick=()=>{const l=shuffle(ITEMS.filter(it=>C.isQuiz(it)&&!C.rec(it.id))).slice(0,10);if(l.length)startQuiz({mode:'revoir',list:l})};
  view().querySelectorAll('[data-r]').forEach(b=>b.onclick=()=>startQuiz({mode:'revoir',list:bySub[b.dataset.r].slice(0,25)}));
  view().querySelectorAll('[data-unflag]').forEach(b=>b.onclick=()=>{toggleFlag(b.dataset.unflag);vReview()});
  const fq=$('#flagq');if(fq)fq.onclick=()=>startQuiz({mode:'revoir',list:flags.map(f=>BYID[f.id]).filter(Boolean)});
}

/* =================== PARTIELS =================== */
const pSel={subs:[],chaps:[],n:30};
function vExams(){
  C.setSid(null);
  const chosen=SUBJ.filter(d=>pSel.subs.includes(d.id));
  view().innerHTML=`<h1 class="ttl">Préparation aux partiels</h1><p class="lead">Choisis les matières et les chapitres, puis passe un examen blanc : types d'exercices mélangés, difficulté progressive, chronomètre et bilan détaillé.</p>
  <section class="card"><h3>1. Matières</h3><div class="chips">${SUBJ.map(d=>`<button class="chip" aria-pressed="${pSel.subs.includes(d.id)}" data-s="${d.id}">${esc(d.nom)}</button>`).join('')}</div>
  ${chosen.length?`<h3>2. Chapitres</h3>${chosen.map(d=>`<div class="pchap"><div class="row between"><b>${esc(d.nom)}</b><button class="lnk" data-all="${d.id}">tout cocher</button></div>${d.fiches.map((f,c)=>{const k=d.id+'-'+c,cs=C.chapStat(d.id,c);return `<label class="ck"><input type="checkbox" data-k="${k}" ${pSel.chaps.includes(k)?'checked':''}><span class="grow">${fmt(chapName(d,c))}</span>${badge(cs)}</label>`}).join('')}</div>`).join('')}
  <h3>3. Longueur</h3><div class="chips" id="len">${[20,30,40].map(n=>`<button class="chip" aria-pressed="${pSel.n===n}" data-v="${n}">${n} questions · ${n} min</button>`).join('')}</div>
  <div class="row"><button class="btn" id="blanc" ${pSel.chaps.length?'':'disabled'}>Lancer l'examen blanc</button><button class="btn soft" id="ess" ${pSel.chaps.length?'':'disabled'}>Revoir les notions essentielles</button></div>`:'<p class="muted">Sélectionne au moins une matière.</p>'}</section>
  <section class="card"><h3>Chapitres à consolider avant les partiels</h3>${insuff()}</section>
  <div id="ess-box"></div>`;
  view().querySelectorAll('[data-s]').forEach(b=>b.onclick=()=>{const id=b.dataset.s,i=pSel.subs.indexOf(id);if(i<0){pSel.subs.push(id);sub(id).fiches.forEach((_,c)=>{const k=id+'-'+c;if(!pSel.chaps.includes(k))pSel.chaps.push(k)})}else{pSel.subs.splice(i,1);pSel.chaps=pSel.chaps.filter(k=>!k.startsWith(id+'-'))}vExams()});
  view().querySelectorAll('[data-all]').forEach(b=>b.onclick=()=>{const id=b.dataset.all;sub(id).fiches.forEach((_,c)=>{const k=id+'-'+c;if(!pSel.chaps.includes(k))pSel.chaps.push(k)});vExams()});
  view().querySelectorAll('[data-k]').forEach(x=>x.onchange=()=>{const k=x.dataset.k;if(x.checked)pSel.chaps.push(k);else pSel.chaps=pSel.chaps.filter(y=>y!==k);vExams()});
  const len=$('#len');if(len)pick('len',v=>pSel.n=+v);
  const bl=$('#blanc');if(bl)bl.onclick=()=>{
    const pool=ITEMS.filter(it=>C.isQuiz(it)&&pSel.chaps.includes(it.sid+'-'+it.c));
    /* équilibre entre chapitres puis difficulté progressive */
    const byC={};shuffle(pool).forEach(it=>(byC[it.sid+'-'+it.c]=byC[it.sid+'-'+it.c]||[]).push(it));
    const keys=shuffle(Object.keys(byC));let list=[];while(list.length<pSel.n&&keys.some(k=>byC[k].length))for(const k of keys){if(byC[k].length&&list.length<pSel.n)list.push(byC[k].pop())}
    list.sort((a,b)=>a.diff-b.diff);
    startQuiz({mode:'blanc',list,title:'Examen blanc · '+SUBJ.filter(d=>pSel.subs.includes(d.id)).map(d=>d.nom).join(', '),timed:list.length*60});
  };
  const es=$('#ess');if(es)es.onclick=()=>{$('#ess-box').innerHTML=`<section class="card"><h3>Les notions essentielles</h3>${pSel.chaps.map(k=>{const [sid,c]=k.split('-');const d=sub(sid);return d.ret[+c]?`<div class="rappel" style="--c:${d.couleur}"><b>${esc(d.nom)} · ${fmt(chapName(d,+c))}</b><p>${fmt(d.ret[+c])}</p></div>`:''}).join('')}</section>`;$('#ess-box').scrollIntoView({behavior:'smooth'})};
}
function insuff(){
  const out=[];for(const d of SUBJ)d.fiches.forEach((f,c)=>{const s=C.chapStat(d.id,c);if(s.lvl<3)out.push({d,c,s})});
  if(!out.length)return '<p class="muted">Tous tes chapitres sont au moins en consolidation. Bravo.</p>';
  const by={};out.forEach(o=>(by[o.d.id]=by[o.d.id]||[]).push(o));
  return Object.values(by).map(l=>`<p class="small"><b style="color:${l[0].d.couleur}">${esc(l[0].d.nom)}</b> · ${l.length} chapitre${l.length>1?'s':''} : ${l.map(o=>esc(chapShort(o.d,o.c))).join(', ')}</p>`).join('');
}

/* =================== PLANNING =================== */
let weekOff=0;
function vPlanning(){
  C.setSid(null);
  const P=S().perso;const ws=C.weekStart()+weekOff*7*DAY;const todayISO=C.iso(Date.now());
  const days=[...Array(7)].map((_,i)=>ws+i*DAY);
  const dayTasks=t=>P.tasks.filter(x=>x.d===C.iso(t)).sort((a,b)=>hk(a.h)-hk(b.h));
  const wkDone=days.reduce((a,t)=>a+dayTasks(t).filter(x=>x.done).length,0),wkAll=days.reduce((a,t)=>a+dayTasks(t).length,0);
  view().innerHTML=`<h1 class="ttl">Mon planning</h1>
  <p class="lead m0">Ton programme jour par jour jusqu'au 8 janvier est déjà rempli. Coche tes séances au fur et à mesure.</p>
  <div class="row between wk"><button class="btn ghost" id="prev">←</button><div class="center"><b>Semaine du ${new Date(ws).toLocaleDateString('fr-FR',{day:'numeric',month:'long'})}</b><br><span class="small muted">${wkDone}/${wkAll} tâches terminées</span></div><button class="btn ghost" id="nextw">→</button></div>
  ${wkAll?bar(wkDone/wkAll*100):''}
  <div class="week">${days.map(t=>{const l=dayTasks(t);const isT=C.iso(t)===todayISO;return `<div class="day${isT?' today':''}"><div class="day-h">${new Date(t).toLocaleDateString('fr-FR',{weekday:'short',day:'numeric'})}${isT?' · aujourd\'hui':''}</div>${l.length?`<ul class="tasks">${l.map(taskLi).join('')}</ul>`:'<p class="small muted">Libre</p>'}</div>`}).join('')}</div>
  <section class="card"><h3>Ajouter une séance</h3><form id="add" class="form">
    <label>Date<input type="date" id="fd" value="${todayISO}" required></label>
    <label>Créneau<input id="fh" placeholder="ex. 9h – 11h30"></label>
    <label>Matière<select id="fs"><option value="">Aucune</option>${SUBJ.map(d=>`<option value="${d.id}">${esc(d.nom)}</option>`).join('')}</select></label>
    <label>Chapitre<select id="fc"><option value="">—</option></select></label>
    <label class="full">Ce que je fais<input id="ft" required placeholder="ex. Relire la fiche puis 15 exercices"></label>
    <button class="btn" type="submit">Ajouter</button></form></section>
  <section class="card"><h3>Planning de base</h3><p class="muted">Si tu as supprimé une séance par erreur, ce bouton remet les séances manquantes du programme (sans toucher à celles que tu as cochées ou ajoutées).</p><button class="btn ghost" id="reimp">Remettre le planning de base</button></section>
  <section class="card"><h3>Séance proposée selon ta progression</h3><p class="muted">3 tâches pour aujourd'hui, calculées à partir de tes notions à revoir et de tes chapitres les plus fragiles.</p><button class="btn soft" id="sugg">Ajouter la séance proposée à aujourd'hui</button></section>`;
  bindTasks();
  $('#prev').onclick=()=>{weekOff--;vPlanning()};$('#nextw').onclick=()=>{weekOff++;vPlanning()};
  $('#reimp').onclick=()=>{const n=window.__importPlan();toast(n?n+' séance'+(n>1?'s':'')+' remise'+(n>1?'s':'')+' dans le planning':'Ton planning de base est déjà complet');vPlanning()};
  $('#fs').onchange=()=>{const d=sub($('#fs').value);$('#fc').innerHTML='<option value="">—</option>'+(d?d.fiches.map((f,c)=>`<option value="${c}">${esc(f.t)}</option>`).join(''):'')};
  $('#add').onsubmit=e=>{e.preventDefault();const s=$('#fs').value,c=$('#fc').value;let t=$('#ft').value.trim();if(!t)return;
    if(s&&c!=='')t=sub(s).fiches[+c].t+' · '+t;P.tasks.push({id:'t'+Date.now(),d:$('#fd').value,h:$('#fh').value.trim(),t:(s?sub(s).nom.toUpperCase()+' · ':'')+t,s:s||null,c:c===''?null:+c,done:false});C.save('perso');toast('Séance ajoutée');vPlanning()};
  $('#sugg').onclick=()=>{const d=C.iso(Date.now());const due=C.due().length;const w=C.weakChapters(2);const out=[];
    if(due)out.push({t:'À REVOIR · '+due+' notions de la répétition espacée',s:null});
    w.forEach(x=>out.push({t:x.d.nom.toUpperCase()+' · révision ciblée : '+chapName(x.d,x.c),s:x.d.id,c:x.c}));
    if(out.length<3){for(const dd of SUBJ){const c=dd.fiches.findIndex((_,i)=>C.chapStat(dd.id,i).lvl===0);if(c>=0){out.push({t:dd.nom.toUpperCase()+' · découvrir : '+chapName(dd,c),s:dd.id,c});if(out.length>=3)break}}}
    out.slice(0,3).forEach((x,i)=>P.tasks.push(Object.assign({id:'s'+Date.now()+i,d,h:'Séance proposée',done:false},x)));C.save('perso');weekOff=0;toast('Séance ajoutée à aujourd\'hui');vPlanning()};
}
function hk(h){const m=String(h||'').match(/^(\d{1,2})h/);return m?+m[1]:-1}
function taskLi(t){const d=t.s?sub(t.s):null;return `<li class="task${t.done?' done':''}"><label><input type="checkbox" data-task="${esc(t.id)}" ${t.done?'checked':''}><span>${t.h?`<span class="small muted">${esc(t.h)}</span><br>`:''}${d?`<span class="dot sm" style="--c:${d.couleur}"></span>`:''}${fmt(t.t)}</span></label><button class="x" data-del="${esc(t.id)}" aria-label="Supprimer">×</button></li>`}
function bindTasks(){
  view().querySelectorAll('[data-task]').forEach(x=>x.onchange=()=>{const t=S().perso.tasks.find(y=>y.id===x.dataset.task);if(t){t.done=x.checked;C.save('perso');x.closest('.task').classList.toggle('done',x.checked);if(x.checked)toast('Bien joué !')}});
  view().querySelectorAll('[data-del]').forEach(b=>b.onclick=()=>{const P=S().perso;P.tasks=P.tasks.filter(y=>y.id!==b.dataset.del);C.save('perso');b.closest('li').remove()});
}

/* =================== STATISTIQUES =================== */
function vStats(){
  C.setSid(null);
  const g=C.globalStat();const days=[...Array(14)].map((_,i)=>C.today0()-(13-i)*DAY);
  const T=S().prog.time;const dq=days.map(t=>T[C.iso(t)]||{q:0,g:0,s:0});
  const maxQ=Math.max(1,...dq.map(x=>x.q)),maxS=Math.max(1,...dq.map(x=>x.s));
  const hist=S().prog.hist.slice(-12);
  const subs=g.subs.slice().sort((a,b)=>b.s.pct-a.s.pct);
  view().innerHTML=`<h1 class="ttl">Mes statistiques</h1><p class="lead">Tout est calculé à partir de tes réponses et de ton temps de travail réel dans l'application.</p>
  <section class="kpis"><div class="kpi"><b>${pct(g.pct)} %</b><span>des notions maîtrisées</span></div><div class="kpi"><b>${g.acc==null?'–':pct(g.acc)+' %'}</b><span>de réussite globale</span></div><div class="kpi"><b>${Object.values(S().prog.rec).reduce((a,r)=>a+r.n,0)}</b><span>réponses au total</span></div><div class="kpi"><b>${fmtMin(C.minutes(3650))}</b><span>de travail au total</span></div></section>
  <section class="card"><h3>Mon évolution sur 14 jours</h3><p class="small muted">Barres : questions par jour · chiffre au-dessus : taux de réussite du jour</p>
  <div class="cols">${dq.map((x,i)=>`<div class="col"><span class="cv">${x.q?pct(x.g/x.q)+'%':''}</span><span class="cb" style="height:${x.q/maxQ*100}%"></span><span class="cl">${new Date(days[i]).getDate()}</span></div>`).join('')}</div></section>
  <section class="card"><h3>Mon temps de travail par jour</h3><div class="cols alt">${dq.map((x,i)=>`<div class="col"><span class="cv">${x.s>=60?Math.round(x.s/60):''}</span><span class="cb" style="height:${x.s/maxS*100}%"></span><span class="cl">${new Date(days[i]).getDate()}</span></div>`).join('')}</div><p class="small muted">En minutes, mesuré quand l'application est ouverte et que tu l'utilises.</p></section>
  <section class="card"><h3>Mes derniers résultats aux quiz</h3>${hist.length?hist.slice().reverse().map(h=>`<div class="goal"><div class="goal-h"><span>${esc(h.title)}</span><span>${h.note!=null?h.note+'/20':h.good+'/'+h.n}</span></div>${bar(h.n?h.good/h.n*100:0,sub(h.sid)?sub(h.sid).couleur:null)}</div>`).join(''):'<p class="muted">Pas encore de résultats.</p>'}</section>
  <section class="card"><h3>Mes matières, de la plus solide à la plus fragile</h3>${subs.map(({d,s})=>`<div class="goal"><div class="goal-h"><span>${esc(d.nom)}</span><span>${pct(s.pct)} % maîtrisé${s.acc!=null?' · '+pct(s.acc)+' % réussite':''}</span></div>${bar(pct(s.pct),d.couleur)}</div>`).join('')}</section>
  <section class="card"><h3>Taux de réussite par chapitre</h3><div class="chips" id="ssub">${SUBJ.map((d,i)=>`<button class="chip" aria-pressed="${i===0}" data-v="${d.id}">${esc(d.nom)}</button>`).join('')}</div><div id="schap"></div></section>`;
  const drawCh=sid=>{const d=sub(sid);$('#schap').innerHTML=d.fiches.map((f,c)=>{const s=C.chapStat(sid,c);return `<div class="goal"><div class="goal-h"><span>${fmt(f.t)}</span><span>${s.acc==null?'pas encore fait':pct(s.acc)+' % · '+s.level}</span></div>${bar(s.acc==null?0:s.acc*100,d.couleur)}</div>`}).join('')};
  drawCh(SUBJ[0].id);pick('ssub',drawCh);
}

/* =================== OUTILS =================== */
const pomo={len:25,brk:5,left:25*60,run:false,phase:'travail',t:null};
function pomoTick(){if(!pomo.run)return;pomo.left--;if(pomo.left<=0){if(pomo.phase==='travail'){const k=C.iso(Date.now());S().prog.pomo[k]=(S().prog.pomo[k]||0)+1;C.save('prog');pomo.phase='pause';pomo.left=pomo.brk*60;toast('Pomodoro terminé : pause !')}else{pomo.phase='travail';pomo.left=pomo.len*60;toast('Pause finie : on reprend.')}}renderPomoMini();const el=$('#pomo-t');if(el)el.textContent=mmss(pomo.left);const ph=$('#pomo-p');if(ph)ph.textContent=pomo.phase==='travail'?'Concentration':'Pause'}
const mmss=s=>Math.floor(s/60)+':'+String(s%60).padStart(2,'0');
function renderPomoMini(){const m=$('#pomo-mini');if(!m)return;m.hidden=!pomo.run;m.textContent=(pomo.phase==='travail'?'● ':'☕ ')+mmss(pomo.left)}
function vTools(){
  C.setSid(null);
  const P=S().perso;const G=P.goals;const pToday=S().prog.pomo[C.iso(Date.now())]||0;
  view().innerHTML=`<h1 class="ttl">Outils</h1>
  <div class="grid2">
  <section class="card pomo"><h3>Pomodoro</h3><p class="small muted" id="pomo-p">${pomo.phase==='travail'?'Concentration':'Pause'}</p><div class="pomo-t" id="pomo-t">${mmss(pomo.left)}</div>
  <div class="row center"><button class="btn" id="ps">${pomo.run?'Pause':'Démarrer'}</button><button class="btn ghost" id="pr">Réinitialiser</button></div>
  <div class="row center small"><label>Travail <input type="number" id="pl" min="5" max="90" value="${pomo.len}" class="num"> min</label><label>Pause <input type="number" id="pb" min="1" max="30" value="${pomo.brk}" class="num"> min</label></div>
  <p class="small muted center">${pToday} pomodoro${pToday>1?'s':''} terminé${pToday>1?'s':''} aujourd'hui</p></section>
  <section class="card"><h3>Mes objectifs</h3><form id="goals" class="form two">
    <label>Questions par jour<input type="number" id="g1" min="1" value="${G.qDay}"></label><label>Minutes par jour<input type="number" id="g2" min="1" value="${G.mDay}"></label>
    <label>Questions par semaine<input type="number" id="g3" min="1" value="${G.qWeek}"></label><label>Minutes par semaine<input type="number" id="g4" min="1" value="${G.mWeek}"></label>
    <button class="btn" type="submit">Enregistrer</button></form></section>
  </div>
  <section class="card"><h3>Les questions que je me pose</h3><form id="nq" class="row"><input class="inp grow" id="nqt" placeholder="Ex. : quelle différence entre fut et fût ?" required><select id="nqs" class="sel"><option value="">Matière</option>${SUBJ.map(d=>`<option value="${d.id}">${esc(d.nom)}</option>`).join('')}</select><button class="btn" type="submit">Ajouter</button></form>
  ${P.notes.length?`<ul class="notes">${P.notes.slice().reverse().map(n=>`<li class="${n.done?'done':''}"><label><input type="checkbox" data-nd="${n.id}" ${n.done?'checked':''}><span>${esc(n.t)}${n.s&&sub(n.s)?`<br><span class="small muted">${esc(sub(n.s).nom)} · ${new Date(n.ts).toLocaleDateString('fr-FR')}</span>`:''}</span></label><button class="x" data-nx="${n.id}">×</button></li>`).join('')}</ul><p class="small muted">Coche une question quand tu as trouvé la réponse. Tu peux aussi me les poser dans le chat.</p>`:'<p class="muted">Note ici tes doutes pendant que tu révises.</p>'}</section>
  <div class="grid2">
  <section class="card"><h3>Mes favoris</h3>${P.favs.length?P.favs.map(k=>{const [sid,c]=k.split('-');const d=sub(sid);if(!d||!d.fiches[+c])return '';return `<button class="li" data-ch="${sid}-${c}"><span class="dot" style="--c:${d.couleur}"></span><span class="grow"><b>${fmt(chapName(d,+c))}</b><br><span class="small muted">${esc(d.nom)}</span></span>★</button>`}).join(''):'<p class="muted">Ajoute un chapitre avec l\'étoile ☆.</p>'}</section>
  <section class="card"><h3>Historique de mes sessions</h3>${S().prog.hist.length?`<ul class="hist">${S().prog.hist.slice(-12).reverse().map(histLi).join('')}</ul>`:'<p class="muted">Tes sessions apparaîtront ici.</p>'}</section>
  </div>
  <section class="card"><h3>Apparence et sauvegarde</h3>
  <div class="chips" id="theme">${[['auto','Automatique'],['light','Clair'],['dark','Sombre']].map(([v,l])=>`<button class="chip" aria-pressed="${P.theme===v}" data-v="${v}">${l}</button>`).join('')}</div>
  <p class="small"><b>Sauvegarde :</b> <span id="sync-txt">${esc(C.SYNC.msg)}</span></p>
  <div class="row"><button class="btn ghost" id="exp">Copier ma sauvegarde</button><button class="btn ghost" id="impb">Restaurer une sauvegarde</button><button class="btn ghost danger" id="rz">Tout effacer</button></div>
  <div id="imparea"></div></section>`;
  $('#ps').onclick=()=>{pomo.run=!pomo.run;clearInterval(pomo.t);if(pomo.run)pomo.t=setInterval(pomoTick,1000);$('#ps').textContent=pomo.run?'Pause':'Démarrer';renderPomoMini()};
  $('#pr').onclick=()=>{pomo.run=false;clearInterval(pomo.t);pomo.phase='travail';pomo.left=pomo.len*60;vTools();renderPomoMini()};
  $('#pl').onchange=e=>{pomo.len=Math.max(5,+e.target.value||25);if(!pomo.run&&pomo.phase==='travail'){pomo.left=pomo.len*60;$('#pomo-t').textContent=mmss(pomo.left)}};
  $('#pb').onchange=e=>{pomo.brk=Math.max(1,+e.target.value||5)};
  $('#goals').onsubmit=e=>{e.preventDefault();Object.assign(G,{qDay:+$('#g1').value||30,mDay:+$('#g2').value||120,qWeek:+$('#g3').value||150,mWeek:+$('#g4').value||600});C.save('perso');toast('Objectifs enregistrés')};
  $('#nq').onsubmit=e=>{e.preventDefault();const t=$('#nqt').value.trim();if(!t)return;P.notes.push({id:'n'+Date.now(),t,s:$('#nqs').value||null,ts:Date.now(),done:false});C.save('perso');vTools()};
  view().querySelectorAll('[data-nd]').forEach(x=>x.onchange=()=>{const n=P.notes.find(y=>y.id===x.dataset.nd);n.done=x.checked;C.save('perso');x.closest('li').classList.toggle('done',x.checked)});
  view().querySelectorAll('[data-nx]').forEach(b=>b.onclick=()=>{P.notes=P.notes.filter(y=>y.id!==b.dataset.nx);C.save('perso');vTools()});
  pick('theme',v=>{P.theme=v;C.save('perso');applyTheme()});
  bindCh();
  $('#exp').onclick=async()=>{const txt=JSON.stringify({prog:S().prog,perso:S().perso});try{await navigator.clipboard.writeText(txt);toast('Sauvegarde copiée : colle-la dans une note pour la garder')}catch(e){$('#imparea').innerHTML=`<p class="small">Copie ce texte :</p><textarea readonly>${esc(txt)}</textarea>`}};
  $('#impb').onclick=()=>{$('#imparea').innerHTML=`<p class="small">Colle ta sauvegarde puis valide :</p><textarea id="impt"></textarea><button class="btn" id="impgo">Restaurer</button>`;$('#impgo').onclick=()=>{try{C.replace(JSON.parse($('#impt').value));toast('Sauvegarde restaurée');go('accueil')}catch(e){toast('Ce texte n\'est pas une sauvegarde valide')}}};
  $('#rz').onclick=()=>{const b=$('#rz');if(b.dataset.c){C.reset();toast('Tout a été effacé');go('accueil')}else{b.dataset.c=1;b.textContent='Confirmer : tout effacer ?'}};
}

/* =================== ROUTEUR & COQUILLE =================== */
function go(h){if(location.hash!=='#'+h)location.hash=h;else route()}
const NAV=[['accueil','Accueil','⌂'],['matieres','Matières','▦'],['revoir','À revoir','↻'],['partiels','Partiels','✓'],['planning','Planning','▤'],['stats','Statistiques','▥'],['outils','Outils','⚙']];
function route(){
  clearInterval(timerT);
  const h=(location.hash||'#accueil').slice(1);let key=h;
  const v=view();v.classList.remove('in');void v.offsetWidth;v.classList.add('in');
  if(h.startsWith('m-')){key='matieres';vSubject(h.slice(2))}
  else if(h.startsWith('c-')){key='matieres';const p=h.slice(2).split('-');vChapter(p[0],p[1])}
  else if(h==='quiz'){key='';vQuiz()}
  else ({accueil:vHome,matieres:vSubjects,revoir:vReview,partiels:vExams,planning:vPlanning,stats:vStats,outils:vTools}[h]||(()=>{key='accueil';vHome()}))();
  document.querySelectorAll('[data-nav]').forEach(a=>a.setAttribute('aria-current',a.dataset.nav===key?'page':'false'));
  const due=C.due().length;document.querySelectorAll('.due-badge').forEach(b=>{b.textContent=due;b.hidden=!due});
  if(h!=='quiz')window.scrollTo(0,0);
}
function shell(){
  document.getElementById('app').innerHTML=`
  <aside class="side"><div class="brand"><span class="logo">L</span><span><b>Révisions</b><br><span class="small muted">L1 LEA anglais-arabe</span></span></div>
  <nav>${NAV.map(([k,l,i])=>`<a href="#${k}" data-nav="${k}"><span class="ni">${i}</span>${l}${k==='revoir'?' <b class="due-badge" hidden></b>':''}</a>`).join('')}</nav>
  <div class="side-foot small muted"><span id="sync-dot" class="sync"></span><span id="sync-side">${esc(C.SYNC.msg)}</span></div></aside>
  <header class="mtop"><span class="logo">L</span><b>Révisions LEA</b><span class="grow"></span><span id="pomo-mini" class="pomo-mini" hidden></span><a href="#stats" class="ico-btn" aria-label="Statistiques">▥</a><a href="#outils" class="ico-btn" aria-label="Outils">⚙</a></header>
  <main id="view" class="in"></main>
  <nav class="bottom">${NAV.slice(0,5).map(([k,l,i])=>`<a href="#${k}" data-nav="${k}"><span class="ni">${i}</span><span>${l}</span>${k==='revoir'?'<b class="due-badge" hidden></b>':''}</a>`).join('')}</nav>
  <div id="toast" role="status"></div>`;
  document.addEventListener('sync',()=>{const t=C.SYNC.msg;['#sync-side','#sync-txt'].forEach(s=>{const e=$(s);if(e)e.textContent=t});const d=$('#sync-dot');if(d)d.className='sync '+C.SYNC.state});
}
applyTheme();shell();
window.addEventListener('hashchange',route);
C.setRemote(()=>{applyTheme();route();toast('Progression synchronisée')});
route();
function importPlan(force){const P=S().perso;P.tasks=P.tasks.filter(t=>!(t.t||'').startsWith('NUMOC · devoir maison toute la journée'));const have=new Set(P.tasks.map(t=>t.d+'|'+t.t));let n=0;(window.PLAN_IMPORT||[]).forEach((x,i)=>{if(!have.has(x.d+'|'+x.t)){P.tasks.push({id:'imp'+i,d:x.d,h:x.h,t:x.t,s:x.s,done:false});n++}});P.imported=true;P.planV=window.PLAN_V||1;C.save('perso');return n}
window.__importPlan=importPlan;
Promise.resolve(C.initSync()).catch(()=>{}).then(()=>{const P=S().perso;if(!P.imported||(P.planV||1)<(window.PLAN_V||1)){importPlan();route()}});
window.UI_READY=true;
}
