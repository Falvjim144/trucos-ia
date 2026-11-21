/* Motor de búsqueda de Trucos IA · v1
   Sin dependencias, no envía consultas a servicios externos.
   Autores: proyecto Trucos IA. */
(function(root){
'use strict';

const IGNORE=new Set(('a al algo algunas algunos ante antes como con contra cual cuales cuando de del desde donde el ella ellas ellos en entre era es esa ese eso esta estas este estos ha hacia hay hacer haz la las le les lo los mas me mi mis muy no nos o para pero por porque que quien quienes se ser si sin sobre son su sus te ti tu tus un una unas unos uno usa usar utiliza y ya yo quiero quisiera necesito crear crea generame genera generando hacerme dame favor porfa favor algo').split(' '));
const FREE=new Set(['gratis','gratuito','gratuitos','gratuita','gratuitas','gratuitamente','free']);
const CONCEPTS=[
 ['video','videos','reel','reels','short','shorts','clip','clips','story','stories','audiovisual'],
 ['foto','fotos','fotografia','fotografias','imagen','imagenes','image','picture'],
 ['retrato','retratos','selfie','selfies','rostro','cara','caras'],
 ['animar','animacion','animaciones','animado','animada','movimiento','motion'],
 ['anuncio','anuncios','publicidad','publicitario','publicitaria','promocion','promocional','marketing','comercial','campana','campanas'],
 ['subtitulo','subtitulos','subtitulado','captions','caption','transcripcion','transcribir','subtitular'],
 ['voz','voces','locucion','locuciones','narracion','narrar','doblaje','doblar','voiceover'],
 ['audio','musica','cancion','canciones','sonido','sonidos'],
 ['fondo','fondos','background','escenario'],
 ['borrar','eliminar','quitar','remover','retirar','suprimir'],
 ['antiguo','antigua','antiguas','antiguos','viejo','vieja','viejas','viejos','restaurar','restauracion','reparar','recuperar'],
 ['presentacion','presentaciones','diapositiva','diapositivas','powerpoint','ppt','slides'],
 ['excel','spreadsheet','spreadsheet','hoja','hojas','calculo'],
 ['web','pagina','paginas','sitio','website','html'],
 ['modelo','modelos','modelado','3d','stl','impresion3d','imprimir3d'],
 ['avatar','avatares','personaje','personajes','muñeco','muneco'],
 ['estudiar','estudio','aprender','aprendizaje','repasar','examen','examenes','temario'],
 ['educacion','educativo','educativa','clase','clases','aula','docencia','pizarra','alumnado'],
 ['automatizar','automatizacion','automatico','automatica','automatizadas'],
 ['documento','documentos','pdf','archivo','archivos'],
 ['recorte','recortar','cortar','corte','editar','edicion','montaje'],
 ['convertir','transformar','pasar','cambiar','transformacion'],
 ['dibujo','dibujos','ilustracion','ilustraciones','caricatura','anime']
];
const RELATED=new Map();
for(const group of CONCEPTS){
 for(const word of group)RELATED.set(word,group.filter(x=>x!==word));
}
const CACHE=new WeakMap();
function normalize(s){return String(s??'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ñ/g,'n').replace(/[^a-z0-9]+/g,' ').trim()}
function pieces(s){return normalize(s).split(/\s+/).filter(Boolean)}
function variants(t){
 const list=new Set([t]);
 if(t.length>4 && t.endsWith('s'))list.add(t.slice(0,-1));
 if(t.length>5 && t.endsWith('es'))list.add(t.slice(0,-2));
 return [...list]
}
function query(q){
 const words=pieces(q);
 const free=words.some(w=>FREE.has(w)) || normalize(q).includes('sin coste') || normalize(q).includes('sin pagar');
 const tokens=[...new Set(words.filter(w=>!IGNORE.has(w)&&!FREE.has(w)&&!(free&&((w==='pagar'&&normalize(q).includes('sin pagar'))||(w==='coste'&&normalize(q).includes('sin coste'))))&&(w.length>=3||w==='3d')))];
 return {tokens,free,phrase:tokens.join(' ')};
}
function indexed(x){
 let v=CACHE.get(x);if(v)return v;
 const fields=[
  [normalize(x.title),17],
  [normalize(x.tool),12],
  [normalize((x.tags||[]).join(' ')),10],
  [normalize(x.category),7],
  [normalize(x.summary),5],
  [normalize((x.steps||[]).join(' ')),3],
  [normalize(x.prompt),2],
  [normalize(x.source),1]
 ].map(([text,weight])=>({text,weight,words:pieces(text)}));
 const fuzzyWords=new Set(fields.slice(0,5).flatMap(f=>f.words).filter(w=>w.length>=4&&w.length<=22));
 v={fields,fuzzyWords:[...fuzzyWords],title:normalize(x.title)};
 CACHE.set(x,v);return v
}
function lexical(field,term){
 if(!field.text)return 0;
 const forms=variants(term);
 for(const v of forms)if(field.words.includes(v))return 1;
 for(const v of forms)if(v.length>=4&&field.words.some(w=>w.length>=4&&(w.startsWith(v)||v.startsWith(w))&&Math.min(v.length,w.length)>=4))return .78;
 return 0
}
function distance(a,b,max){
 if(Math.abs(a.length-b.length)>max)return max+1;
 let prev=Array.from({length:b.length+1},(_,i)=>i);
 for(let i=1;i<=a.length;i++){
  const next=[i];let lowest=i;
  for(let j=1;j<=b.length;j++){
   const c=a[i-1]===b[j-1]?0:1;
   const n=Math.min(next[j-1]+1,prev[j]+1,prev[j-1]+c);
   next.push(n);if(n<lowest)lowest=n;
  }
  if(lowest>max)return max+1;
  prev=next
 }
 return prev[b.length]
}
function typo(index,term){
 if(term.length<5)return 0;
 const cap=term.length>=8?2:1;
 for(const w of index.fuzzyWords){
  if(Math.abs(w.length-term.length)<=cap&&distance(w,term,cap)<=cap)return .28;
 }
 return 0
}
function match(index,token,noteText){
 let strongest=0;
 // Priorizar el mismo término antes que sinónimos.
 for(const field of index.fields){const q=lexical(field,token);if(q)strongest=Math.max(strongest,q*field.weight)}
 if(noteText){
  const f={text:noteText,weight:7,words:pieces(noteText)};
  const q=lexical(f,token);if(q)strongest=Math.max(strongest,q*f.weight)
 }
 const synonyms=RELATED.get(token)||[];
 for(const synonym of synonyms){
  for(const field of index.fields){
   const q=lexical(field,synonym);
   if(q)strongest=Math.max(strongest,Math.min(q,.88)*field.weight*.53);
  }
 }
 if(strongest===0){const approximate=typo(index,token);if(approximate)strongest=approximate*13}
 return strongest
}
/* Retorna resultados ordenados, con coincidencias directas antes que relacionadas.
   score y coverage se exponen para facilitar pruebas y mejoras posteriores. */
function rank(items,rawQuery,options={}){
 const q=query(rawQuery);
 let candidates=Array.isArray(items)?items:[];
 if(q.free)candidates=candidates.filter(x=>x.cost==='limited'||x.cost==='local');
 if(!q.tokens.length)return candidates.map((item,i)=>({item,score:0,coverage:0,related:false,order:i}));
 const strong=[],related=[];
 for(let i=0;i<candidates.length;i++){
  const x=candidates[i],idx=indexed(x),notes=normalize(options.notes?.[x.id]||'');
  let matched=0,score=0;
  for(const token of q.tokens){const s=match(idx,token,notes);if(s>0){matched++;score+=s}}
  if(!matched)continue;
  const min=Math.max(1,Math.ceil(q.tokens.length*.60));
  const all=matched===q.tokens.length;
  score+=matched*3+ (all?20:0)+(x.recommended?2:0)+((x.steps||[]).length?1:0);
  if(q.tokens.length>1&&q.phrase&&idx.title.includes(q.phrase))score+=24;
  const row={item:x,score,coverage:matched/q.tokens.length,related:matched<min,order:i};
  (row.related?related:strong).push(row)
 }
 const cmp=(a,b)=>b.coverage-a.coverage||b.score-a.score||a.order-b.order;
 strong.sort(cmp);related.sort(cmp);
 // Si solo coincide una parte de una frase, mostrar algunos resultados relacionados
 // en lugar de una pantalla vacía. Mantener los matches completos primero.
 const limit=q.tokens.length>1?Math.max(12,Math.min(30,42-strong.length)):0;
 return strong.concat(related.slice(0,limit))
}
root.TrucosSearch={normalize,query,rank,version:'1.0'};
if(typeof module!=='undefined'&&module.exports)module.exports=root.TrucosSearch;
})(typeof window!=='undefined'?window:globalThis);
