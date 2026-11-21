# ✦ Trucos IA — Biblioteca personal de trucos de inteligencia artificial

Una web estática, en español, preparada para **GitHub Pages**. Incluye el catálogo inicial de 175 trucos, filtros temáticos, categoría **IA gratis**, favoritos, notas, fichas de detalles y una sección destacada **Novedades**.

## 1. Publicar en GitHub Pages

1. En GitHub, crea un repositorio nuevo llamado `trucos-ia` (recomendado **público** para usar GitHub Pages sin coste con GitHub Free). No actives “Add a README” porque ya hay uno en el proyecto.
2. Sube **el contenido de esta carpeta**, conservando los directorios `data/`, `scripts/` y `.github/`, a la rama `main`. El archivo `index.html` debe quedar en la raíz del repositorio; no subas solamente el ZIP como archivo.
3. En el repositorio abre **Settings → Pages → Build and deployment → Source: GitHub Actions**.
4. Abre la pestaña **Actions** y comprueba que el proceso «Publicar Trucos IA» se ejecute. Si aún no lo ha hecho, ejecútalo con **Run workflow**.
5. Tu web aparecerá normalmente en `https://TU-USUARIO.github.io/trucos-ia/`. GitHub mostrará la dirección exacta en Settings → Pages.

> La publicación puede tardar unos minutos. Este proyecto no exige servidor, bases de datos, tokens, API keys ni servicios de pago.

## 2. Cómo funcionan las novedades

- El catálogo original está integrado en `index.html`.
- Las fichas semanales adicionales están en **`data/updates.json`**.
- Al abrir la web publicada, esta descarga las novedades desde el propio sitio y las mezcla con el catálogo original, sin duplicar fichas. También pasan a sus categorías y a **IA gratis**, cuando corresponde.
- El botón **Novedades → Actualizar** fuerza una nueva lectura del archivo de novedades.
- Un cambio confirmado en GitHub dispara el despliegue de Pages de forma automática.

**Importante:** GitHub Pages publica cambios; no investiga nuevas publicaciones por sí mismo. La búsqueda semanal de ChatGPT es una tarea aparte. Para una actualización totalmente desatendida, la tarea de los lunes tiene que poder **escribir y confirmar** las nuevas entradas en `data/updates.json` mediante el conector GitHub o un mecanismo equivalente. Publicar este repositorio no autoriza por sí mismo esa escritura.

### Añadir los trucos recibidos los lunes

El archivo semanal debe tener este formato:

```json
{
  "format": "atlas-ia-weekly-update",
  "version": 1,
  "generatedAt": "2026-11-23",
  "entries": []
}
```

Puedes abrir `data/updates.json` en GitHub y añadir los nuevos objetos a `entries`, conservando los anteriores. Para fusionar automáticamente dos archivos sin sobrescribir los trucos ya publicados, usa:

```bash
python scripts/agregar_novedades.py NUEVOS_TRUCOS.json
```

El script conserva el contenido anterior, descarta duplicados por identificador y por título/herramienta y actualiza la fecha de publicación. Luego confirma y sube el cambio (`git add data/updates.json && git commit -m "Actualizar novedades" && git push`). El flujo de GitHub Actions valida el archivo antes de publicar.

Si el conector GitHub está conectado en ChatGPT y dispone de permisos de escritura, podemos preparar las modificaciones del repositorio desde la conversación.

## 3. Favoritos, notas y privacidad

Tus **favoritos, notas, estados de probado y fichas personales** se almacenan en `localStorage` del **navegador y dispositivo** que uses. No se envían a GitHub; no se publican con el repositorio. Puedes exportar una **copia de seguridad JSON** desde la web y restaurarla en otro navegador. Las notas no se sincronizan entre dispositivos.

**No subas tu copia de seguridad personal al repositorio público.** El fichero `data/updates.json` contiene solo trucos públicos; nunca contraseñas ni información privada.

## 4. Archivos

| Archivo | Para qué sirve |
|---|---|
| `index.html` | Interfaz completa, catálogo original, buscador y almacenamiento personal |
| `data/updates.json` | Base pública de nuevas fichas semanales |
| `scripts/validar_novedades.py` | Verificación del formato de datos |
| `scripts/agregar_novedades.py` | Fusiona una tanda semanal con las ya publicadas |
| `.github/workflows/pages.yml` | Valida y publica el sitio automáticamente tras cada cambio en `main` |
| `.nojekyll` | Evita el procesado innecesario con Jekyll |
| `ejemplos/tanda-semanal.json` | Ejemplo de archivo semanal, sin fichas ficticias |

## 5. Mantenimiento

Los campos `cost` significan `limited` (gratis con límites), `local` (uso local sin suscripción), `unknown` (precio no verificado) y `paid` (pago). No representan garantía de gratuidad perpetua: revisa los servicios oficiales.

Se recomienda que cada novedad contenga una fuente comprobable, fechas, herramienta, categoría, clasificación de coste y una descripción breve. Si el contenido de un vídeo no se puede consultar, deja `steps` vacío en lugar de inventar instrucciones.

## 6. Referencias

- [GitHub Pages — publicar desde un workflow](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)
- [GitHub Pages — crear un sitio](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site)


## Identidad visual (edición APFA)

La web incluye un tema claro inspirado en las presentaciones de APFA Motril, con fondo blanco, azul institucional (`#29457f`) y un acento amarillo suave (`#f1f79b`). El título **Trucos IA** y el nombre **Francisco Álvarez Jiménez** aparecen en la navegación, cabecera y pie de página.

El tema está en el bloque `<style id="apfa-light-theme">` de `index.html` y puede ajustarse sin alterar el catálogo de trucos, el buscador, las novedades ni las preferencias guardadas por cada navegador. No se usa el logotipo de APFA, ya que Trucos IA es una biblioteca personal.


**Nota sobre compatibilidad:** se mantienen los identificadores internos `atlas-ia-weekly-update` y `atlas-ia-user-backup` y la clave local `atlas-ia-usuario-v2` para que las importaciones, copias de seguridad y favoritos existentes sigan funcionando tras el cambio de nombre.
