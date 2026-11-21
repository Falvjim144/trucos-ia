# Trucos IA

Biblioteca personal de inteligencia artificial de **Francisco Álvarez Jiménez**.

**Web:** https://falvjim144.github.io/trucos-ia/

**Diseño v2:** interfaz limpia y responsive, buscador persistente, filtros combinables, fichas de detalle con prompts, modo oscuro, barra inferior móvil y accesos rápidos a Todos, Probados, IA gratis y Favoritos.

## Contenido y actualizaciones

- `index.html`: **175 fichas originales** (153 identificadas de MAXmaxdata y 22 guías independientes).
- `data/updates.json`: novedades públicas añadidas posteriormente. El 21/11/2026 contenía **50 fichas**, con las que la biblioteca sumaba 225. El número crece con las actualizaciones.
- Cada novedad se combina automáticamente con el catálogo original al abrir la web, sin eliminar ni duplicar las fichas que ya existen.
- La pestaña **Novedades** muestra las incorporaciones, y estas también aparecen en sus categorías y en **IA gratis** cuando procede.

La investigación semanal está descrita en [GUIA_INVESTIGACION.md](./GUIA_INVESTIGACION.md). **GitHub Pages publica cambios en el repositorio, pero por sí solo no busca nuevas fuentes**: una tarea externa debe añadir las nuevas fichas a `data/updates.json`.

### Formato de las nuevas entradas

`data/updates.json` usa el formato `atlas-ia-weekly-update` (versión 1). Incluye `id`, `title`, `tool`, `category`, `origin`, `cost`, `date`, `addedAt`, `summary`, `source`, `youtube`, `steps`, `prompt`, `costNote`, `verification` y `tags`.

Para integrar un archivo nuevo sin borrar los anteriores:

```bash
python scripts/agregar_novedades.py nuevas-fichas.json
python scripts/validar_novedades.py data/updates.json
```

## Publicación

En **Settings → Pages → Build and deployment**, seleccionar **GitHub Actions**. El workflow `.github/workflows/pages.yml` funciona en dos fases: **validar y empaquetar**, y después **publicar**. Comprueba ambos procesos desde la pestaña Actions.

```bash
python scripts/validar_web.py index.html
python scripts/validar_novedades.py data/updates.json
```

## Favoritos, notas y privacidad

La clave de almacenamiento local sigue siendo `atlas-ia-usuario-v2`, para conservar **favoritos, notas, probados y trucos propios** de versiones anteriores en el mismo navegador y origen. Las notas se guardan inmediatamente al escribir.

Estos datos personales **no se almacenan en GitHub ni se sincronizan entre dispositivos**. Usa **Copia de seguridad** para exportarlos e importarlos en otro navegador. No subas estos archivos privados a un repositorio público.

## Identidad visual y accesibilidad

Paleta inspirada en materiales APFA Motril: fondo blanco, azul institucional (`#29457f`) y amarillo pálido (`#f1f79b`). Las variables de tema están en el inicio de `index.html`. También existe un modo oscuro opcional.

La navegación móvil incluye Inicio, Novedades, Buscar, IA gratis y Favoritos. Los cuatro contadores de portada son botones funcionales (Todos, Probados, IA gratis y Favoritos). Se conserva la sección **Con guía** como filtro separado.

Se ha comprobado la interfaz a 320, 390, 768 y 1440 píxeles, los accesos principales, el buscador, las notas y los filtros.

## Estructura

| Archivo | Uso |
|---|---|
| `index.html` | Sitio v2 y 175 fichas de partida |
| `data/updates.json` | Novedades, conservadas en todas las actualizaciones |
| `scripts/validar_web.py` | Validación del sitio y del catálogo base |
| `scripts/validar_novedades.py` | Validación del JSON de novedades |
| `scripts/agregar_novedades.py` | Fusión sin duplicados |
| `.github/workflows/pages.yml` | Despliegue automático en GitHub Pages |
| `GUIA_INVESTIGACION.md` | Criterios y fuentes de próximas investigaciones |

Los nombres internos `atlas-ia-weekly-update` y `atlas-ia-user-backup` permanecen por **compatibilidad**.

Las categorías de coste son `limited` (gratis con límites), `local` (gratis en local), `unknown` (sin verificar) y `paid` (pago). Las condiciones pueden cambiar.
