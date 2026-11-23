# Tienda Yanbal con Martha Balderas Solís — página web

## Dirección en internet
- **Cloudflare Pages (principal): https://tienda-yanbal-martha.pages.dev/**
- GitHub Pages (copia): https://webmaster7710-web.github.io/tienda-yanbal-martha/

## Actualizar en Cloudflare
En una terminal dentro de esta carpeta (la primera vez pide iniciar sesión en Cloudflare):

```bash
npx wrangler pages deploy . --project-name tienda-yanbal-martha --branch main
```

## Cómo actualizarla
Después de cambiar archivos en esta carpeta, en una terminal dentro de la carpeta:

```bash
git add -A
git commit -m "Actualizo la tienda"
git push
```

En 1 o 2 minutos los cambios aparecen en la dirección de arriba.

## Qué incluye
- Portada con la foto de Martha, su frase y botones animados.
- 5 catálogos para hojear (Yanbal C13, Ésika C17, L'Bel C17, Cyzone C17 y Black Days de Bata),
  con miniaturas, zoom, flechas del teclado y deslizar en el celular.
- Carrito de compras: ofertas Yanbal con precio y botón "Agregar producto de esta página"
  en cada catálogo (el cliente escribe el código, la cantidad y el tono o la talla).
- El pedido se envía al WhatsApp **+591 734 46090** con todos los detalles.
- Botón flotante de WhatsApp, dirección y mapa de Villa Serrano.

## Cambiar datos
Todo está en `js/app.js`, arriba del archivo:
- `STORE.whatsapp`: número de WhatsApp (con 591 delante).
- `CATALOGS`: nombre, campaña y número de páginas de cada catálogo.
- `PRODUCTS`: ofertas destacadas (código, nombre, precio, precio normal, página del catálogo Yanbal).

## Cambiar un catálogo por uno nuevo
Cada catálogo está en `catalogos/<nombre>/` como imágenes `001.webp`, `002.webp`… y
miniaturas en `catalogos/<nombre>/thumbs/`. Reemplaza las imágenes y actualiza `pages` en `CATALOGS`.
