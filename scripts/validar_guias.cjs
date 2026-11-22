#!/usr/bin/env node
/* Verificación de las 225 guías de Trucos IA y de su procedencia. */
'use strict';
const fs=require('node:fs');
const path=require('node:path');
const assert=require('node:assert/strict');
const root=path.join(__dirname,'..');
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
const match=html.match(/<script id="library-data" type="application\/json">([\s\S]*?)<\/script>/);
assert.ok(match,'Falta el catálogo embebido');
const originals=JSON.parse(match[1]);
const weekly=JSON.parse(fs.readFileSync(path.join(root,'data','updates.json'),'utf8')).entries;
assert.equal(originals.length,175,'El catálogo debe tener 175 originales');
assert.ok(weekly.length>=50,'Se deben conservar las 50 ampliaciones');
const all=[...originals,...weekly];
assert.equal(new Set(all.map(x=>x.id)).size,all.length,'IDs únicos');
for(const x of all){
 assert.ok(Array.isArray(x.steps)&&x.steps.length>=2,'No hay pasos para '+x.id);
 assert.ok(x.steps.every(p=>typeof p==='string'&&p.trim().length>12),'Paso vacío o incompleto '+x.id);
 assert.ok(x.summary?.trim(),'No hay resumen '+x.id);
 assert.ok(x.source?.startsWith('https://'),'Falta fuente pública '+x.id);
}
const guides=[];
for(let i=1;i<=6;i++){
 const suffix=String(i).padStart(2,'0');
 const file=JSON.parse(fs.readFileSync(path.join(root,'data','guias-'+suffix+'.json'),'utf8'));
 assert.equal(file.format,'trucos-ia-guide-overrides');
 guides.push(...file.entries);
}
assert.equal(guides.length,118,'Deben existir exactamente 118 guías complementarias');
assert.equal(new Set(guides.map(x=>x.id)).size,118,'Guías sin duplicados');
for(const g of guides){
 const x=originals.find(x=>x.id===g.id);
 assert.ok(x,'Guía que no corresponde al catálogo: '+g.id);
 assert.equal(x.guideType,'independent','Guía sin indicación de procedencia: '+g.id);
 assert.equal(x.guideSource,g.guideSource,'Referencia oficial no sincronizada: '+g.id);
 assert.deepEqual(x.steps,g.steps,'Pasos de la web no coinciden con el archivo editorial: '+g.id);
 assert.ok(x.prompt?.trim(),'Falta prompt práctico: '+g.id);
 assert.ok(/^https:\/\//.test(g.guideSource),'Enlace de la herramienta no válido: '+g.id);
 assert.ok(x.verification?.includes('Guía')||x.verification?.includes('guía'),'No se distingue la guía propia: '+g.id);
}
const inline=[...html.matchAll(/<script(?:\s+[^>]*)?>([\s\S]*?)<\/script>/g)]
 .map(x=>x[1]).filter(x=>x.trim()&&!x.trim().startsWith('['));
assert.ok(inline.length>0,'No hay JS principal');
for(const script of inline)new Function(script);
assert.ok(html.includes('atlas-ia-usuario-v2'),'Se debe preservar favoritos y notas de usuarios anteriores');
assert.ok(html.includes('No son una transcripción del vídeo original'),'Debe advertirse de las guías no originales');
assert.ok(html.includes('Documentación de la herramienta'),'Debe enlazarse a documentación complementaria');
console.log('OK: '+originals.length+' guías originales + '+weekly.length+' ampliaciones; 118 guías propias correctamente distinguidas; JS válido');
