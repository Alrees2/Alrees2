/* Progressive enhancements: keyboard navigation, reading progress, subtle motion. */
(()=>{'use strict';
const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
const progress=document.createElement('div');
progress.id='reading-progress';progress.setAttribute('aria-hidden','true');document.body.append(progress);
let queued=false;
const onScroll=()=>{if(queued)return;queued=true;requestAnimationFrame(()=>{const end=document.documentElement.scrollHeight-innerHeight;progress.style.transform='scaleX('+(end>0?Math.max(0,Math.min(1,scrollY/end)):0)+')';queued=false})};
addEventListener('scroll',onScroll,{passive:true});addEventListener('resize',onScroll,{passive:true});onScroll();
const actions=[
['about','نبذة عني','About me'],
['expertise','الخبرات والتخصصات','Expertise & skills'],
['projects','المشاريع','Selected projects'],
['approach','الرؤية','My approach'],
['contact','التواصل','Contact'],
['home','العودة للبداية','Back to top']
];
const backdrop=document.createElement('div');backdrop.className='cmd-backdrop';backdrop.hidden=true;backdrop.innerHTML='<div class="cmd-dialog" role="dialog" aria-modal="true" aria-label="Quick navigation"><div class="cmd-top"><input class="cmd-search" type="search" autocomplete="off" spellcheck="false" aria-label="Find section"><button class="cmd-close" type="button" aria-label="Close">ESC</button></div><div class="cmd-results"></div><div class="cmd-footer">↑ ↓ · ENTER · ESC &nbsp; / &nbsp; CTRL + K</div></div>';document.body.append(backdrop);
const input=backdrop.querySelector('.cmd-search'),results=backdrop.querySelector('.cmd-results');
const isArabic=()=>document.documentElement.lang!=='en';
let lastFocus=null;let options=[];
function render(){
  const ar=isArabic();const q=input.value.trim().toLocaleLowerCase();
  input.placeholder=ar?'ابحث عن قسم في الموقع…':'Search the portfolio…';
  results.replaceChildren();options=[];
  for(const [id,arabic,english] of actions){
    const label=ar?arabic:english;
    if(q && !label.toLocaleLowerCase().includes(q) && !english.toLowerCase().includes(q))continue;
    const item=document.createElement('button');item.type='button';item.className='cmd-option';
    const name=document.createElement('span');name.textContent=label;const arrow=document.createElement('span');arrow.textContent='↗';
    item.append(name,arrow);item.addEventListener('click',()=>{close();document.getElementById(id)?.scrollIntoView({behavior:reduced.matches?'instant':'smooth',block:'start'});history.replaceState(null,'','#'+id)});results.append(item);options.push(item);
  }
  if(!options.length){const empty=document.createElement('div');empty.className='cmd-empty';empty.textContent=ar?'ماكو نتائج مطابقة':'No matching sections';results.append(empty)}
}
function open(){lastFocus=document.activeElement;input.value='';render();backdrop.hidden=false;document.body.style.overflow='hidden';input.focus()}
function close(){if(backdrop.hidden)return;backdrop.hidden=true;document.body.style.overflow='';lastFocus?.focus?.()}
backdrop.addEventListener('click',e=>{if(e.target===backdrop||e.target.closest('.cmd-close'))close()});
input.addEventListener('input',render);
backdrop.addEventListener('keydown',e=>{if(e.key==='Escape'){e.preventDefault();close()}else if(e.key==='Enter'&&options.length){e.preventDefault();options[0].click()}else if(e.key==='Tab'){const focusable=[input,backdrop.querySelector('.cmd-close'),...options];if(!focusable.includes(document.activeElement)){e.preventDefault();input.focus()}}});
document.addEventListener('keydown',e=>{if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){e.preventDefault();backdrop.hidden?open():close()}else if(e.key==='Escape'){close()}});
const navActions=document.querySelector('.nav-actions');
if(navActions){const trigger=document.createElement('button');trigger.id='portfolio-search';trigger.className='icon-button';trigger.type='button';trigger.setAttribute('aria-label','Quick navigation (Ctrl+K)');trigger.title='Quick navigation · Ctrl+K';trigger.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.8" cy="10.8" r="7.2"></circle><path d="m16 16 5 5"></path></svg>';navActions.prepend(trigger);trigger.addEventListener('click',open)}
if(matchMedia('(hover:hover) and (pointer:fine)').matches&&!reduced.matches){
  const aura=document.createElement('div');aura.id='cursor-aura';aura.setAttribute('aria-hidden','true');document.body.append(aura);
  document.addEventListener('pointermove',e=>{if(e.pointerType!=='mouse')return;aura.style.transform='translate3d('+(e.clientX-180)+'px,'+(e.clientY-180)+'px,0)'},{passive:true});
  for(const card of document.querySelectorAll('.project-card')){
    card.addEventListener('pointermove',e=>{const r=card.getBoundingClientRect();const x=(e.clientX-r.left)/r.width-.5;const y=(e.clientY-r.top)/r.height-.5;card.style.transform='perspective(1050px) rotateX('+(-y*2.6)+'deg) rotateY('+(x*2.6)+'deg) translateY(-3px)'},{passive:true});
    card.addEventListener('pointerleave',()=>{card.style.transform=''});
  }
}
})();
