#!/usr/bin/env python3
"""Valida el catálogo público de novedades de ATLAS IA (sin dependencias)."""
import json
import re
import sys
from pathlib import Path
from urllib.parse import urlparse
from datetime import date

FORMAT = 'atlas-ia-weekly-update'
COSTS = {'limited', 'local', 'unknown', 'paid'}
ORIGINS = {'max', 'curated'}
ID_RE = re.compile(r'^w-[a-zA-Z0-9_-]{4,90}$')

def is_day(value):
    if not isinstance(value, str): return False
    try:
        return date.fromisoformat(value).isoformat() == value
    except ValueError:
        return False

def is_url(url):
    if not isinstance(url, str) or not url or len(url)>2000 or any(ord(c)<32 for c in url):return False
    p=urlparse(url)
    return p.scheme == 'https' and bool(p.netloc) and not p.username and not p.password

def validate(pack):
    if not isinstance(pack, dict):raise ValueError('La raíz debe ser un objeto JSON')
    if pack.get('format')!=FORMAT or pack.get('version')!=1:raise ValueError('Formato o versión incompatible')
    if not is_day(pack.get('generatedAt')):raise ValueError('generatedAt debe ser YYYY-MM-DD')
    entries=pack.get('entries')
    if not isinstance(entries,list) or len(entries)>2000:raise ValueError('entries debe ser una lista de hasta 2000 elementos')
    seen_ids=set()
    for index,e in enumerate(entries,1):
        label=f'Entrada #{index}'
        if not isinstance(e,dict):raise ValueError(label+': no es un objeto')
        if not isinstance(e.get('id'),str) or not ID_RE.fullmatch(e['id']):raise ValueError(label+': id inválido')
        if e['id'] in seen_ids:raise ValueError(label+': id duplicado')
        seen_ids.add(e['id'])
        for key in ('title','tool','category','summary'):
            if not isinstance(e.get(key),str) or not e[key].strip():raise ValueError(label+': campo '+key+' vacío')
        if e.get('origin') not in ORIGINS:raise ValueError(label+': origin debe ser max o curated')
        if e.get('cost') not in COSTS:raise ValueError(label+': cost desconocido')
        if not is_url(e.get('source')):raise ValueError(label+': source debe ser https válido')
        if e.get('youtube') and not is_url(e['youtube']):raise ValueError(label+': youtube no es https válido')
        for key in ('date','addedAt'):
            if not is_day(e.get(key)):raise ValueError(label+': '+key+' no es fecha YYYY-MM-DD')
        if not isinstance(e.get('steps'),list) or len(e['steps']) < 2 or not all(isinstance(x,str) and x.strip() for x in e['steps']):
            raise ValueError(label+': cada truco debe tener al menos dos pasos escritos, no vacíos')
        if not isinstance(e.get('tags',[]),list) or not all(isinstance(x,str) for x in e.get('tags',[])):
            raise ValueError(label+': tags debe contener texto')
    return len(entries)

if __name__ == '__main__':
    path=Path(sys.argv[1]) if len(sys.argv)>1 else Path('data/updates.json')
    try:
        pack=json.loads(path.read_text(encoding='utf-8'))
        count=validate(pack)
        print(f'OK: {count} novedades en {path}')
    except Exception as e:
        print(f'ERROR: {e}',file=sys.stderr)
        sys.exit(1)
