/* Trucos IA · Controles accesibles en móvil, con estadísticas navegables */
(function(){
'use strict';
const labels=[
  ['all','▦','Todos los trucos','Explorar biblioteca'],
  ['free','✦','IA gratis','Ver opciones gratuitas'],
  ['favorites','☆','Favoritos','Abrir mis guardados'],
  ['tested','✓','Probados','Revisar mis pruebas']
];
const stats=document.getElementById('stats');
const filterRow=document.querySelector('.filter-row');
filterRow.id='advancedFilters';
const toggle=document.createElement('button');
toggle.id='mobileFilterToggle';
toggle.className='mobile-filter-toggle';
toggle.type='button';
toggle.setAttribute('aria-controls','advancedFilters');
toggle.setAttribute('aria-expanded','false');
toggle.innerHTML='<span>⚙ Más filtros</span><span class="filter-caret" aria-hidden="true">⌄</span>';
filterRow.before(toggle);
toggle.addEventListener('click',()=>{
 const open=filterRow.classList.toggle('is-open');
 toggle.setAttribute('aria-expanded',String(open));
});
const topLeft=document.querySelector('.top-left');
if(topLeft)topLeft.innerHTML='<span>Trucos IA</span><span class="top-owner"><span class="breadcrumb-separator">/</span> FRANCISCO ÁLVAREZ JIMÉNEZ</span>';
const tabs=document.createElement('nav');
tabs.className='mobile-bottom';
tabs.setAttribute('aria-label','Accesos rápidos');
tabs.innerHTML=[
 ['home','⌂','Inicio'],['news','✦','Novedades'],['search','⌕','Buscar'],['free','◇','IA gratis'],['favorites','☆','Favoritos']
].map(([v,ico,label])=>'<button type="button" class="mobile-tab" data-mobile-target="'+v+'" aria-label="'+label+'"><span class="mobile-tab-icon" aria-hidden="true">'+ico+'</span><span class="mobile-tab-label">'+label+'</span></button>').join('');
document.body.appendChild(tabs);
function syncTabs(){
 for(const el of tabs.querySelectorAll('[data-mobile-target]')){
  const isActive=el.dataset.mobileTarget===view;
  el.classList.toggle('active',isActive);
  if(isActive)el.setAttribute('aria-current','page');else el.removeAttribute('aria-current');
 }
 const activeFilters=[category!=='all',tool!=='all',cost!=='all',origin!=='all',freeOnly].filter(Boolean).length;
 toggle.querySelector('span').textContent=activeFilters?'⚙ Más filtros ('+activeFilters+')':'⚙ Más filtros';
}
window.renderStats=function(){
 const all=data();
 const vals=[all.length,all.filter(moneyFree).length,all.filter(x=>user.favorites[x.id]).length,all.filter(x=>user.statuses[x.id]==='tested').length];
 const details=['153 de MAXmaxdata','Incluye planes con límites','Tu selección personal','Tu progreso'];
 stats.innerHTML=labels.map(([target,ico,label,cta],i)=>{
  const active=view===target?' is-active':'';
  return '<button type="button" class="stat'+active+'" data-stat-target="'+target+'" aria-label="'+label+': '+vals[i]+'. '+cta+'" aria-pressed="'+(view===target)+'"><span class="stat-icon" aria-hidden="true">'+ico+'</span><span class="stat-number">'+vals[i]+'</span><span class="stat-label">'+label+'</span><span class="stat-sub">'+details[i]+'</span><span class="stat-cta">'+cta+' →</span></button>';
 }).join('');
 syncTabs();
};
stats.addEventListener('click',event=>{
 const btn=event.target.closest('[data-stat-target]');
 if(btn)setView(btn.dataset.statTarget);
});
tabs.addEventListener('click',event=>{
 const btn=event.target.closest('[data-mobile-target]');if(!btn)return;
 const target=btn.dataset.mobileTarget;
 if(target==='search'){
  setView('all');
  const input=document.getElementById('searchInput');
  input.scrollIntoView({block:'start',behavior:'smooth'});
  window.setTimeout(()=>input.focus({preventScroll:true}),180);
 }else{
  setView(target);
  if(target==='home')window.scrollTo({top:0,behavior:'smooth'});
 }
 syncTabs();
});
const sidebar=document.getElementById('sidebar');
const menu=document.getElementById('mobileMenu');
menu.setAttribute('aria-expanded','false');
menu.setAttribute('aria-controls','sidebar');
new MutationObserver(()=>{
 const isOpen=sidebar.classList.contains('open');
 menu.setAttribute('aria-expanded',String(isOpen));
 document.body.classList.toggle('mobile-drawer-open',isOpen);
}).observe(sidebar,{attributes:true,attributeFilter:['class']});
window.addEventListener('keydown',e=>{if(e.key==='Escape'&&sidebar.classList.contains('open'))closeMobile()});
const cards=document.getElementById('cards');
new MutationObserver(()=>{
 if(cards.querySelector('.tip-card')||cards.querySelector('[data-personal-empty]'))return;
 if(view!=='favorites'&&view!=='tested')return;
 if(filtered().length)return;
 const isFav=view==='favorites';
 cards.innerHTML='<div class="empty" data-personal-empty><div><div style="font-size:36px;margin-bottom:8px">'+(isFav?'☆':'✓')+'</div><strong>'+(isFav?'Todavía no tienes favoritos':'Todavía no has marcado trucos como probados')+'</strong><div>'+(isFav?'Pulsa la estrella de cualquier truco para guardarlo aquí.':'Abre un truco y selecciona «Ya probado» en su ficha.')+'</div><button class="btn small" id="emptyClear" style="margin-top:15px">Explorar trucos</button></div></div>';
}).observe(cards,{childList:true});
const search=document.getElementById('searchInput');
const media=window.matchMedia('(max-width:700px)');
function updatePlaceholder(){search.placeholder=media.matches?'Buscar trucos o herramientas…':'Buscar por truco, herramienta, objetivo o palabra clave…'}
updatePlaceholder();media.addEventListener('change',updatePlaceholder);
render();
})();