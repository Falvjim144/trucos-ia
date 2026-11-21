#!/usr/bin/env python3
"""Valida el catálogo integrado, la identidad del sitio y los accesos móviles."""
import json
import re
import sys
from pathlib import Path

COSTS = {'limited', 'local', 'unknown', 'paid'}
REQUIRED = ('id', 'title', 'tool', 'category', 'cost', 'origin')

def main(path: Path):
    html = path.read_text(encoding='utf-8')
    match = re.search(r'<script id="library-data" type="application/json">(.*?)</script>', html, re.S)
    if not match:
        raise ValueError('No se encontró library-data')
    tips = json.loads(match.group(1))
    if not isinstance(tips, list) or len(tips) < 175:
        raise ValueError('El catálogo base debe conservar los 175 trucos originales')
    seen = set()
    for i, tip in enumerate(tips, 1):
        for key in REQUIRED:
            if not isinstance(tip.get(key), str) or not tip[key].strip():
                raise ValueError(f'Ficha {i}: falta {key}')
        if tip['id'] in seen:
            raise ValueError(f'ID duplicado: {tip["id"]}')
        seen.add(tip['id'])
        if tip['cost'] not in COSTS:
            raise ValueError(f'Coste incorrecto en {tip["id"]}')
    for part in ('Trucos IA', 'Francisco Álvarez Jiménez', 'atlas-ia-usuario-v2', 'mobileBottomNav', 'data/updates.json', 'id="mNotes"'):
        if part not in html:
            raise ValueError(f'Falta la función o identidad: {part}')
    if 'debounce(e=>{if(e.target.id===\'mNotes\'' in html:
        raise ValueError('Las notas no deben guardarse con demora al cerrar la ficha')
    print(f'OK: {len(tips)} fichas base, compatibilidad y navegación móvil verificadas')

if __name__ == '__main__':
    try:
        main(Path(sys.argv[1] if len(sys.argv)>1 else 'index.html'))
    except Exception as error:
        print('ERROR:', error, file=sys.stderr)
        sys.exit(1)
