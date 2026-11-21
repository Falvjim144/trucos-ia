#!/usr/bin/env python3
"""Incorpora novedades verificadas sin reemplazar las anteriores."""
import json
import sys
import unicodedata
from pathlib import Path
from validar_novedades import validate

ROOT=Path(__file__).resolve().parent.parent
TARGET=ROOT/'data'/'updates.json'

def norm(value):
    value=unicodedata.normalize('NFKD',value.lower())
    return ' '.join(''.join(c for c in value if not unicodedata.combining(c)).split())

def combine(existing,incoming):
    current_ids={e['id'] for e in existing['entries']}
    current_names={(norm(e['title']),norm(e['tool'])) for e in existing['entries']}
    added=0
    for e in incoming['entries']:
        key=(norm(e['title']),norm(e['tool']))
        if e['id'] in current_ids or key in current_names:continue
        existing['entries'].append(e)
        current_ids.add(e['id']);current_names.add(key);added+=1
    existing['entries'].sort(key=lambda e:(e['addedAt'],e['date'],e['id']),reverse=True)
    existing['generatedAt']=max(existing['generatedAt'],incoming['generatedAt'])
    validate(existing)
    return added

if __name__=='__main__':
    if len(sys.argv)!=2:sys.exit('Uso: python scripts/agregar_novedades.py nueva_tanda.json')
    current=json.loads(TARGET.read_text(encoding='utf-8'))
    new=json.loads(Path(sys.argv[1]).read_text(encoding='utf-8'))
    validate(current); validate(new)
    added=combine(current,new)
    if added:
        TARGET.write_text(json.dumps(current,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    print(f'{added} novedades incorporadas; total: {len(current["entries"])}')
