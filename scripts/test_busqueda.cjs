#!/usr/bin/env node
/* Pruebas del buscador ampliado de Trucos IA, sin dependencias. */
'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const engine=require(path.join(__dirname,'..','search-engine.js'));
const doc=fs.readFileSync(path.join(__dirname,'..','index.html'),'utf8');
const match=doc.match(/<script id="library-data" type="application\/json">([\s\S]*?)<\/script>/);
assert.ok(match,'El HTML debe incluir library-data');
const originals=JSON.parse(match[1]);
const updates=JSON.parse(fs.readFileSync(path.join(__dirname,'..','data','updates.json'),'utf8')).entries;
const items=[...originals,...updates];
assert.equal(originals.length,175,'Se han conservado 175 registros originales');
assert.ok(items.length>=225,'Se han conservado los 50 nuevos trucos');
assert.ok(doc.includes('src="./search-engine.js?v=1"'),'La web carga el buscador ampliado');
const available=q=>engine.rank(items,q);
function found(q,needle){assert.ok(available(q).some(r=>r.item.title.toLowerCase().includes(needle.toLowerCase())),'La consulta '+q+' debe encontrar '+needle)}
found('hacer videos con fotografías','animar una fotografía');
found('reeles','reel');
found('poderpoint','PowerPoint');
found('restaurar fotos antiguas','restaurar fotografías antiguas');
found('quitar fondo de una imagen','quitar el fondo');
found('animar imagen','animar una fotografía');
found('presentacion','presentación');
assert.ok(available('videos gratis').length>0,'Hay resultados gratuitos para vídeos');
assert.ok(available('videos gratis').every(x=>['limited','local'].includes(x.item.cost)),'No se incluyen vídeos de pago entre los gratuitos');
assert.ok(available('sin pagar').every(x=>['limited','local'].includes(x.item.cost)),'La expresión sin pagar exige opción gratuita');
assert.ok(available('videos grtis').length>0,'Se toleran erratas comunes');
assert.ok(available('IA').length===items.length,'Una consulta general no debe dejar la biblioteca vacía');
assert.equal(available('zzzxxyqp').length,0,'No se inventan coincidencias');
const q=available('hacer un vídeo con fotografías');
assert.ok(q[0].coverage===1,'Se priorizan resultados que responden a todas las palabras');
console.log('OK: '+items.length+' fichas; 14 comprobaciones de sinónimos, erratas, gratuidad y relevancia');
