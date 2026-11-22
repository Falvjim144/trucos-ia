# Guía editorial de las actualizaciones de Trucos IA

**Proyecto:** Trucos IA · Francisco Álvarez Jiménez  
**Web:** https://falvjim144.github.io/trucos-ia/  
**Repositorio:** https://github.com/Falvjim144/trucos-ia

## 1. Punto de partida que siempre debe consultarse

- `index.html`: catálogo original de 175 fichas, incluidas 153 identificadas a partir de publicaciones de MAXmaxdata y 22 guías elaboradas aparte.
- `data/updates.json`: base viva de ampliaciones; comenzó con **50 fichas añadidas el 21 de noviembre de 2026**. Consultar SIEMPRE el archivo completo y su contenido actualizado antes de proponer nuevas entradas.
- `scripts/validar_novedades.py`: esquema obligatorio de cada ficha nueva. No modificar entradas antiguas sin una razón.
- Los favoritos, notas y estados de probado se conservan en el navegador del usuario, no en GitHub. Nunca incluir datos privados en el repositorio.

## 2. Canales de investigación

Buscar novedades y tutoriales públicos en **Instagram, Facebook, TikTok, TikTok Notes, Vimeo, YouTube**, sitios de creadores y documentación oficial. En Facebook, revisar en especial [MAXmaxdata](https://www.facebook.com/maxmaxdatabilbao) y otros canales públicos. Si el contenido del vídeo está restringido, no inventar el procedimiento que enseña.

Fuentes y líneas de trabajo que ya se investigaron para las primeras 50 ampliaciones:

- **TikTok**: Symphony Creative Studio (texto/foto/producto a vídeo, doblaje), Creative Center y vídeos/tutoriales de creadores.
- **Instagram y Facebook**: Edits de Instagram, Stories y recursos de vídeo e imagen de Meta AI.
- **Vimeo**: cortometrajes y making-of que combinan IA (Midjourney, Runway, Pika, ElevenLabs, CapCut); distinguir vídeos ilustrativos de tutoriales paso a paso.
- **YouTube**: tutoriales reproducibles, especialmente MAXmaxdata; contrastar fecha, modelo, requisitos y pasos.
- **Canva**: Magic Video, Image-to-Video, subtítulos, retoques selectivos, vídeos de producto y plantillas.
- **CapCut y Adobe Express**: animación de fotos, montajes, voz, subtítulos, eliminar fondos, cambiar formatos, personajes animados, GIF y Reels.
- **Runway, Google Flow/Veo y Google Vids**: image-to-video, movimientos de cámara, referencias visuales, continuidad entre clips, avatares y cuotas gratuitas reales.
- **Gemini/Nano Banana, Upscayl y otras herramientas**: consistencia de producto, retoque fotográfico, restauración y escalado local.

Estas son **líneas de investigación**, no una lista cerrada. Buscar nuevas herramientas cuando aporten un valor real.

## 3. Prioridades editoriales

1. Vídeos llamativos y prácticos para público general: foto a vídeo, vídeos de felicitación, avatares, movimiento de personajes, cortometrajes, Reels/Shorts/TikTok, anuncios con una imagen, locuciones, subtítulos, transiciones y efectos creativos.
2. Imágenes: cambiar fondos sin deformar productos o rostros, adaptar estilos, arreglar fotos, ilustraciones, imágenes de marca y ampliación de fotografías.
3. **IA gratis**: diferenciar entre uso local sin suscripción, planes gratuitos con límites, coste sin verificar y funciones de pago; anotar créditos, marcas de agua, licencias comerciales y limitaciones regionales.
4. Otras ideas de gran utilidad: educación, accesibilidad, pizarra digital, productividad, ofimática e impresión 3D.

Priorizar **utilidad, originalidad, claridad de pasos y fuente verificable**, no el número de fichas.

## 4. Reglas de publicación y deduplicación

- Antes de agregar, comparar con `index.html` y `data/updates.json`: ID, título/herramienta, tema sustancialmente equivalente y enlaces canónicos; no publicar sinónimos de lo mismo como novedad.
- Para cada ficha: título descriptivo, resumen concreto, herramienta, categoría, fecha comprobada o fecha de consulta explícitamente aclarada, coste honesto, pasos reales si son públicos, prompt probado o claramente propuesto, enlace funcional, verificación y etiquetas.
- `origin: "max"` solo si procede efectivamente de MAXmaxdata; otras fuentes son `"curated"`.
- Distinguir **nuevo lanzamiento**, **tutorial reciente** y **técnica antigua aún valiosa**: no anunciar como novedad del mes una guía de años anteriores.
- Las ampliaciones se publican en `data/updates.json` siguiendo el esquema `atlas-ia-weekly-update`, se validan y se comprueba la ejecución de GitHub Pages. No se modifica la base de 175 fichas salvo actualización justificada y explícita.
- Si no hay nuevas fichas contrastables, comunicarlo; si no existe permiso de escritura en GitHub, entregar JSON listo para importar y avisar de que no se ha publicado.

## 5. Estructura mínima de ficha

```json
{
  "id": "w-identificador-estable",
  "title": "Título práctico",
  "tool": "Herramienta",
  "category": "Vídeo y avatares",
  "origin": "curated",
  "cost": "limited",
  "date": "YYYY-MM-DD",
  "addedAt": "YYYY-MM-DD",
  "summary": "Qué permite hacer",
  "source": "https://...",
  "youtube": "",
  "steps": ["Paso comprobado 1", "Paso comprobado 2"],
  "prompt": "Instrucción propuesta claramente etiquetada",
  "costNote": "Créditos, limitaciones y uso comercial",
  "verification": "Qué se comprobó y qué no",
  "tags": ["Reels", "imágenes", "vídeo"],
  "recommended": true
}
```

**Objetivo:** que la biblioteca crezca con trucos comprobables que la gente realmente pueda probar, que sigan encontrándose por tema e IA gratis y que también aparezcan en la sección ✦ Novedades.

## 6. Regla obligatoria: cada truco incluye los pasos por escrito

Desde el 22/11/2026 se establece como requisito editorial que **el contenido de «Cómo hacerlo» sea autosuficiente**, no un enlace que obliga a ver un vídeo.

- Buscar la publicación original por código/título/herramienta en Facebook, Instagram, TikTok, YouTube, Vimeo **y también LinkedIn**: MAXmaxdata suele republicar el mismo vídeo, y algunas publicaciones públicas incluyen transcripciones reutilizables para elaborar guías propias.
- Extraer de una fuente contrastable el flujo real: herramienta y modelo exactos, dónde pulsar, recursos de entrada, instrucciones del creador, salida y comprobaciones. Si una transcripción automática confunde nombres, contrastarlos con la página oficial y no inventar comandos.
- En cada ficha redactar al menos **dos pasos accionables, ordenados y claros**, preferiblemente tres o más. Añadir un prompt propuesto cuando sea útil, marcándolo como adaptación si no es el original.
- Guardar el **enlace directo a la publicación individual** como información complementaria; una página genérica o un enlace con cursor de perfil no prueba el procedimiento.
- Explicar en `verification` si los pasos proceden de una transcripción íntegra, del texto publicado por el creador o de una adaptación independiente. No atribuir a MAXmaxdata pasos que no figuran en su demostración.
- **No publicar nuevas fichas incompletas**. Si no hay fuente verificable con pasos suficientes, conservar la idea en una lista pendiente de investigación, sin añadirla al catálogo público como una guía acabada.
- El inventario histórico tenía 153 fichas originales de MAXmaxdata sin pasos. El 22/11/2026 se recuperaron y publicaron **15 guías** con enlaces individuales, quedando **138 pendientes**, y 72 fichas ya tenían instrucciones antes de esta recuperación. La investigación debe continuar contrastando fuentes, sin rellenar las restantes por inferencia.
