/* =========================================================
   Tienda Yanbal con Martha Balderas Solís
   Catálogos, carrito de compras y pedidos por WhatsApp
   ========================================================= */
(() => {
  "use strict";

  /* ---------- Configuración de la tienda ---------- */
  const STORE = {
    name: "Tienda Yanbal con Martha Balderas Solís",
    whatsapp: "59173446090", // Bolivia +591 · 73446090
    address: "Villa Serrano, calle Héroes del Chaco s/n",
  };

  /* ---------- Catálogos (imágenes en /catalogos/<carpeta>/001.webp …) ---------- */
  const CATALOGS = [
    { id: "yanbal", name: "Yanbal", sub: "Campaña 13 · 2026 · Navidad", pages: 148, tag: "Nuevo", cat: "belleza" },
    { id: "esika", name: "Ésika", sub: "Campaña 17 · 2026", pages: 160, tag: "Belleza", cat: "belleza" },
    { id: "lbel", name: "L'Bel", sub: "Campaña 17 · 2026", pages: 76, tag: "Premium", cat: "belleza" },
    { id: "cyzone", name: "Cyzone", sub: "Campaña 17 · 2026", pages: 88, tag: "Juvenil", cat: "belleza" },
    { id: "black-friday", name: "Black Friday · Bata", sub: "Calzados · hasta 40% OFF", pages: 140, tag: "Ofertas", cat: "calzado" },
  ];

  /* ---------- Ofertas destacadas (Yanbal Bolivia, Campaña 13) ---------- */
  const PRODUCTS = [
    { code: "231", name: "Ccori Parfum 50 ml", desc: "Rosa blanca, canela y chocolate.", price: 405, normal: 810, page: 7 },
    { code: "2035", name: "Ccori Rubí Parfum 50 ml", desc: "Nardos, ámbar y vainilla.", price: 486, normal: 810, page: 8 },
    { code: "79779", name: "Set Ccori Rosé", desc: "Parfum 50 ml + loción 200 ml + desodorante.", price: 489, normal: 1090, page: 9 },
    { code: "79866", name: "Set Gaïa", desc: "Parfum 50 ml + loción 200 ml + desodorante.", price: 489, normal: 1090, page: 10 },
    { code: "2197", name: "Gaïa Elixir Parfum 50 ml", desc: "¡Incluye labial Hydra-Lip Rosa Nude!", price: 405, normal: 810, page: 11 },
    { code: "849", name: "Gaïa Eternal Parfum 50 ml", desc: "Primer perfume Yanbal sin alcohol.", price: 526, normal: 810, page: 12 },
    { code: "81130", name: "Set Cielo Edición Limitada", desc: "Eau de Parfum + jabón + desodorante.", price: 377, normal: 840, page: 13 },
    { code: "2211", name: "Cielo en Rosa EDP 50 ml", desc: "¡Incluye loción perfumada 200 ml!", price: 335, normal: 670, page: 15 },
    { code: "79965", name: "Set Temptation Mystic", desc: "Eau de Parfum 50 ml + brillo labial.", price: 396, normal: 880, page: 16 },
    { code: "238", name: "Temptation EDP 50 ml", desc: "Rosa búlgara, gardenia y clavo de olor.", price: 320, normal: 640, page: 17 },
    { code: "2172", name: "Osadía Infinita EDP 50 ml", desc: "Bayas doradas, mimosa y guayacán.", price: 416, normal: 640, page: 18 },
    { code: "2191", name: "Ícono EDP 50 ml", desc: "¡Incluye loción perfumada!", price: 335, normal: 670, page: 19 },
    { code: "2223", name: "Di que Sí EDP 50 ml", desc: "¡Gratis labial Intense Tint!", price: 255, normal: 510, page: 21 },
    { code: "249", name: "Xiss Eau de Toilette 110 ml", desc: "Fresia, flor de naranjo y sándalo.", price: 195, normal: 390, page: 22 },
    { code: "43488", name: "Aretes Ccori", desc: "Bañados en oro de 24 quilates.", price: 186, normal: 310, page: 7 },
    { code: "60121", name: "Bolsa de Regalo Navidad", desc: "Hasta agotar stock.", price: 10, normal: null, page: 9 },
  ];

  /* ---------- Utilidades ---------- */
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const pad = (n) => String(n).padStart(3, "0");
  const pageSrc = (id, p) => `catalogos/${id}/${pad(p)}.webp`;
  const thumbSrc = (id, p) => `catalogos/${id}/thumbs/${pad(p)}.webp`;
  const money = (n) => "Bs " + Number(n).toLocaleString("es-BO", { maximumFractionDigits: 2 });
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const store = {
    get(k, d) { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} },
  };
  const waLink = (text) => `https://wa.me/${STORE.whatsapp}?text=${encodeURIComponent(text)}`;

  let toastTimer;
  function toast(msg) {
    const t = $("#toast");
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove("show"), 2400);
  }

  /* ---------- Header, menú y animaciones ---------- */
  const header = $("#top");
  const onScroll = () => header.classList.toggle("scrolled", scrollY > 30);
  addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  const nav = $("#nav"), menuBtn = $("#menuBtn");
  menuBtn.addEventListener("click", () => { nav.classList.toggle("open"); menuBtn.classList.toggle("open"); });
  $$("#nav a").forEach((a) => a.addEventListener("click", () => { nav.classList.remove("open"); menuBtn.classList.remove("open"); }));

  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
  }, { threshold: 0.12 });
  const observeReveal = (root = document) => $$(".reveal:not(.in)", root).forEach((el, i) => {
    el.style.transitionDelay = `${(i % 6) * 70}ms`;
    io.observe(el);
  });

  // Resaltar enlace activo del menú
  const sections = $$("main section[id]");
  const navIO = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) $$("#nav a").forEach((a) => a.classList.toggle("active", a.getAttribute("href") === "#" + e.target.id));
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  sections.forEach((s) => navIO.observe(s));

  $("#year").textContent = new Date().getFullYear();

  // Enlaces generales de WhatsApp
  $$(".js-wa").forEach((a) => {
    a.href = waLink(`¡Hola Martha! 👋 Vi tu página ${STORE.name} y quiero hacer una consulta.`);
    a.target = "_blank";
    a.rel = "noopener";
  });
  setTimeout(() => { const f = $(".wa-float"); f.classList.add("tip"); setTimeout(() => f.classList.remove("tip"), 4000); }, 3500);

  /* ---------- Tarjetas de catálogos ---------- */
  const catalogGrid = $("#catalogGrid");
  catalogGrid.innerHTML = CATALOGS.map((c) => `
    <button class="catalog-card reveal" data-id="${c.id}" data-cat="${c.cat}" aria-label="Abrir catálogo ${esc(c.name)}">
      <div class="catalog-card__cover">
        <span class="catalog-card__tag">${esc(c.tag)}</span>
        <img src="${thumbSrc(c.id, 1)}" alt="Portada catálogo ${esc(c.name)}" loading="lazy">
        <span class="catalog-card__open">Abrir 📖</span>
      </div>
      <div class="catalog-card__body">
        <h3>${esc(c.name)}</h3>
        <p>${esc(c.sub)} · ${c.pages} págs.</p>
      </div>
    </button>`).join("");
  catalogGrid.addEventListener("click", (e) => {
    const card = e.target.closest(".catalog-card");
    if (card) openViewer(card.dataset.id, 1);
  });
  $("#catFilters").addEventListener("click", (e) => {
    const chip = e.target.closest(".chip");
    if (!chip) return;
    $$("#catFilters .chip").forEach((c) => c.classList.toggle("is-active", c === chip));
    const f = chip.dataset.filter;
    $$(".catalog-card").forEach((card) => card.classList.toggle("hide", f !== "all" && card.dataset.cat !== f));
  });

  /* ---------- Productos destacados ---------- */
  const productGrid = $("#productGrid");
  function renderProducts(q = "") {
    const term = q.trim().toLowerCase();
    const list = PRODUCTS.filter((p) => !term || (p.name + " " + p.desc + " " + p.code).toLowerCase().includes(term));
    productGrid.innerHTML = list.length ? list.map((p) => {
      const off = p.normal ? Math.round((1 - p.price / p.normal) * 100) : 0;
      return `
      <article class="product reveal">
        <div class="product__img" data-page="${p.page}" title="Ver en el catálogo">
          ${off ? `<span class="product__off">-${off}%</span>` : ""}
          <img src="${pageSrc("yanbal", p.page)}" alt="${esc(p.name)}" loading="lazy">
        </div>
        <div class="product__body">
          <h3>${esc(p.name)}</h3>
          <p class="product__desc">${esc(p.desc)}</p>
          <span class="product__code">CÓD. ${esc(p.code)} · pág. ${p.page}</span>
          <div class="product__price"><strong>${money(p.price)}</strong>${p.normal ? `<s>${money(p.normal)}</s>` : ""}</div>
          <button class="btn btn--primary product__add" data-code="${p.code}">Agregar al carrito</button>
        </div>
      </article>`;
    }).join("") : `<p class="empty">No encontramos “${esc(q)}”. Búscalo en los catálogos 📖</p>`;
    observeReveal(productGrid);
  }
  renderProducts();
  $("#productSearch").addEventListener("input", (e) => renderProducts(e.target.value));
  productGrid.addEventListener("click", (e) => {
    const add = e.target.closest(".product__add");
    if (add) {
      const p = PRODUCTS.find((x) => x.code === add.dataset.code);
      flyToCart(add.closest(".product").querySelector("img"));
      addToCart({ key: "yanbal-" + p.code, name: p.name, code: p.code, price: p.price, qty: 1, catalog: "Yanbal", page: p.page, img: thumbSrc("yanbal", p.page) });
      add.classList.add("added");
      add.textContent = "✓ Agregado";
      setTimeout(() => { add.classList.remove("added"); add.textContent = "Agregar al carrito"; }, 1500);
      return;
    }
    const img = e.target.closest(".product__img");
    if (img) openViewer("yanbal", +img.dataset.page);
  });

  /* ---------- Carrito ---------- */
  let cart = store.get("martha-cart", []);
  const drawer = $("#cartDrawer"), overlay = $("#overlay");

  function saveCart() { store.set("martha-cart", cart); renderCart(); }
  function addToCart(item) {
    const found = cart.find((c) => c.key === item.key);
    if (found) found.qty += item.qty; else cart.push(item);
    saveCart();
    $$(".cart-count").forEach((el) => { el.classList.remove("bump"); void el.offsetWidth; el.classList.add("bump"); });
    toast(`🛍️ “${item.name}” agregado al carrito`);
  }
  function renderCart() {
    const count = cart.reduce((s, c) => s + c.qty, 0);
    $$(".cart-count").forEach((el) => (el.textContent = count));
    const total = cart.reduce((s, c) => s + (c.price || 0) * c.qty, 0);
    const noPrice = cart.some((c) => !c.price);
    $("#cartTotal").textContent = money(total);
    $("#cartNote").textContent = noPrice ? "Algunos productos no tienen precio: Martha te confirmará el total por WhatsApp." : "El total final te lo confirma Martha por WhatsApp.";
    $("#cartFoot").style.display = cart.length ? "" : "none";
    $("#cartItems").innerHTML = cart.length ? cart.map((c, i) => `
      <div class="cart-item">
        <img src="${esc(c.img)}" alt="">
        <div>
          <h4>${esc(c.name)}</h4>
          <small>${c.code ? "CÓD. " + esc(c.code) + " · " : ""}${esc(c.catalog)} pág. ${c.page}</small>
          ${c.note ? `<small>📝 ${esc(c.note)}</small>` : ""}
          <div class="qty">
            <button data-act="dec" data-i="${i}" aria-label="Quitar uno">−</button>
            <span>${c.qty}</span>
            <button data-act="inc" data-i="${i}" aria-label="Agregar uno">+</button>
          </div>
        </div>
        <div>
          <div class="cart-item__price">${c.price ? money(c.price * c.qty) : "Consultar"}</div>
          <button class="remove" data-act="del" data-i="${i}">Quitar</button>
        </div>
      </div>`).join("") : `<div class="cart-empty"><span>🛒</span>Tu carrito está vacío.<br>Agrega productos desde las ofertas o los catálogos.</div>`;
  }
  $("#cartItems").addEventListener("click", (e) => {
    const b = e.target.closest("button[data-act]");
    if (!b) return;
    const i = +b.dataset.i;
    if (b.dataset.act === "inc") cart[i].qty++;
    if (b.dataset.act === "dec") cart[i].qty = Math.max(1, cart[i].qty - 1);
    if (b.dataset.act === "del") cart.splice(i, 1);
    saveCart();
  });
  function openCart() { drawer.classList.add("open"); overlay.classList.add("show"); document.body.classList.add("no-scroll"); }
  function closeCart() {
    drawer.classList.remove("open"); overlay.classList.remove("show");
    if (!viewer.classList.contains("open")) document.body.classList.remove("no-scroll");
  }
  $("#openCart").addEventListener("click", openCart);
  $("#viewerCart").addEventListener("click", openCart);
  $("#closeCart").addEventListener("click", closeCart);
  overlay.addEventListener("click", closeCart);
  $("#clearCart").addEventListener("click", () => { if (confirm("¿Vaciar el carrito?")) { cart = []; saveCart(); } });

  const custName = $("#custName"), custAddr = $("#custAddr");
  custName.value = store.get("martha-name", "");
  custAddr.value = store.get("martha-phone", "");

  // Forma de entrega: recojo en tienda o envío por flota
  const shipCity = $("#shipCity"), shipCityField = $("#shipCityField"), deliveryNote = $("#deliveryNote");
  const deliveryMode = () => ($('input[name="delivery"]:checked') || {}).value || "tienda";
  function updateDelivery() {
    const flota = deliveryMode() === "flota";
    shipCityField.hidden = !flota;
    deliveryNote.textContent = flota
      ? "El costo y la forma de envío por flota se coordinan con Martha por mensaje."
      : "Martha te avisa por WhatsApp cuando tu pedido esté listo para recoger.";
    store.set("martha-delivery", deliveryMode());
  }
  const savedMode = store.get("martha-delivery", "tienda");
  const savedRadio = $(`input[name="delivery"][value="${savedMode}"]`);
  if (savedRadio) savedRadio.checked = true;
  shipCity.value = store.get("martha-city", "");
  $$('input[name="delivery"]').forEach((r) => r.addEventListener("change", updateDelivery));
  updateDelivery();

  $("#sendOrder").addEventListener("click", () => {
    if (!cart.length) return;
    store.set("martha-name", custName.value);
    store.set("martha-phone", custAddr.value);
    store.set("martha-city", shipCity.value);
    const flota = deliveryMode() === "flota";
    const deliveryLine = flota
      ? `🚌 Envío por flota a: ${shipCity.value.trim() || "(te indico el lugar)"}\n   ¿Me confirmas el costo y la forma de envío?\n`
      : `🏠 Recojo en tu tienda (Villa Serrano, calle Héroes del Chaco s/n)\n`;
    const lines = cart.map((c, i) =>
      `${i + 1}. ${c.name}${c.code ? ` (CÓD. ${c.code})` : ""} x${c.qty}` +
      `${c.price ? ` — ${money(c.price * c.qty)}` : ""}\n   📖 ${c.catalog}, pág. ${c.page}${c.note ? `\n   📝 ${c.note}` : ""}`);
    const total = cart.reduce((s, c) => s + (c.price || 0) * c.qty, 0);
    const msg =
      `¡Hola Martha! 🌹 Quiero hacer este pedido:\n\n${lines.join("\n")}\n\n` +
      `💰 Total estimado: ${money(total)}${cart.some((c) => !c.price) ? " (+ productos por confirmar)" : ""}\n` +
      (custName.value.trim() ? `👤 Nombre: ${custName.value.trim()}\n` : "") +
      (custAddr.value.trim() ? `📱 Celular: ${custAddr.value.trim()}\n` : "") +
      deliveryLine +
      `\n¡Gracias!`;
    confetti();
    window.open(waLink(msg), "_blank", "noopener");
  });

  /* ---------- Visor de catálogos ---------- */
  const viewer = $("#viewer"), pagesEl = $("#viewerPages"), thumbsEl = $("#thumbs");
  let cur = { cat: null, page: 1 };
  const isTwo = () => innerWidth >= 1000 && innerWidth > innerHeight;

  // Primera página de la vista actual (en doble página: 1 | 2-3 | 4-5 …)
  const spreadStart = (p) => (isTwo() && p > 1 ? (p % 2 === 0 ? p : p - 1) : p);
  const visiblePages = () => {
    const c = cur.cat, s = spreadStart(cur.page);
    return isTwo() && s > 1 && s + 1 <= c.pages ? [s, s + 1] : [s];
  };

  function openViewer(id, page = 1) {
    cur.cat = CATALOGS.find((c) => c.id === id);
    cur.page = Math.min(Math.max(1, page), cur.cat.pages);
    $("#viewerTitle").textContent = `Catálogo ${cur.cat.name}`;
    $("#gotoPage").max = cur.cat.pages;
    buildThumbs();
    viewer.classList.add("open");
    viewer.setAttribute("aria-hidden", "false");
    document.body.classList.add("no-scroll");
    showPage(0);
    history.pushState({ viewer: true }, "");
  }
  function closeViewer(fromPop) {
    if (!viewer.classList.contains("open")) return;
    viewer.classList.remove("open");
    viewer.setAttribute("aria-hidden", "true");
    thumbsEl.classList.remove("open");
    pagesEl.classList.remove("zoomed");
    document.body.classList.remove("no-scroll");
    if (!fromPop && history.state && history.state.viewer) history.back();
  }
  addEventListener("popstate", () => closeViewer(true));

  function showPage(dir) {
    const vis = visiblePages();
    pagesEl.classList.remove("anim-next", "anim-prev", "zoomed");
    void pagesEl.offsetWidth;
    if (dir) pagesEl.classList.add(dir > 0 ? "anim-next" : "anim-prev");
    pagesEl.classList.toggle("two", vis.length === 2);
    pagesEl.innerHTML = vis.map((p) => `<img src="${pageSrc(cur.cat.id, p)}" alt="${esc(cur.cat.name)} página ${p}" data-p="${p}">`).join("");
    const label = vis.length === 2 ? `Páginas ${vis[0]}–${vis[1]}` : `Página ${vis[0]}`;
    $("#viewerPageLabel").textContent = `${label} de ${cur.cat.pages}`;
    $("#viewerProgress").style.width = `${(vis[vis.length - 1] / cur.cat.pages) * 100}%`;
    $("#prevPage").style.visibility = vis[0] > 1 ? "visible" : "hidden";
    $("#nextPage").style.visibility = vis[vis.length - 1] < cur.cat.pages ? "visible" : "hidden";
    $$("button", thumbsEl).forEach((b) => b.classList.toggle("current", vis.includes(+b.dataset.p)));
    // Precargar páginas vecinas
    [vis[0] - 2, vis[0] - 1, vis[vis.length - 1] + 1, vis[vis.length - 1] + 2].forEach((p) => {
      if (p >= 1 && p <= cur.cat.pages) new Image().src = pageSrc(cur.cat.id, p);
    });
  }
  function go(step) {
    const vis = visiblePages();
    const next = step > 0 ? vis[vis.length - 1] + 1 : vis[0] - (isTwo() && vis[0] > 2 ? 2 : 1);
    if (next < 1 || next > cur.cat.pages) return;
    cur.page = next;
    showPage(step);
  }
  $("#prevPage").addEventListener("click", () => go(-1));
  $("#nextPage").addEventListener("click", () => go(1));
  $("#viewerClose").addEventListener("click", () => closeViewer());
  addEventListener("resize", () => { if (viewer.classList.contains("open")) showPage(0); });
  addEventListener("keydown", (e) => {
    if ($("#addModal").classList.contains("open")) { if (e.key === "Escape") closeAdd(); return; }
    if (drawer.classList.contains("open")) { if (e.key === "Escape") closeCart(); return; }
    if (!viewer.classList.contains("open") || e.target.tagName === "INPUT") return;
    if (e.key === "ArrowRight") go(1);
    if (e.key === "ArrowLeft") go(-1);
    if (e.key === "Escape") closeViewer();
  });
  $("#gotoPage").addEventListener("change", (e) => {
    const p = parseInt(e.target.value, 10);
    if (p >= 1 && p <= cur.cat.pages) { const dir = p > cur.page ? 1 : -1; cur.page = p; showPage(dir); }
    e.target.value = "";
    e.target.blur();
  });

  // Zoom con clic / doble toque
  pagesEl.addEventListener("click", (e) => {
    if (e.target.tagName !== "IMG" && !pagesEl.classList.contains("zoomed")) return;
    pagesEl.classList.toggle("zoomed");
  });

  // Deslizar en celulares
  let sx = null, sy = null;
  $("#viewerStage").addEventListener("touchstart", (e) => { sx = e.touches[0].clientX; sy = e.touches[0].clientY; }, { passive: true });
  $("#viewerStage").addEventListener("touchend", (e) => {
    if (sx === null || pagesEl.classList.contains("zoomed")) return;
    const dx = e.changedTouches[0].clientX - sx, dy = e.changedTouches[0].clientY - sy;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) go(dx < 0 ? 1 : -1);
    sx = null;
  });

  // Miniaturas
  function buildThumbs() {
    const id = cur.cat.id;
    thumbsEl.innerHTML = Array.from({ length: cur.cat.pages }, (_, i) =>
      `<button data-p="${i + 1}"><img src="${thumbSrc(id, i + 1)}" loading="lazy" alt=""><span>${i + 1}</span></button>`).join("");
  }
  $("#toggleThumbs").addEventListener("click", () => {
    thumbsEl.classList.toggle("open");
    const c = $("button.current", thumbsEl);
    if (c) c.scrollIntoView({ block: "center" });
  });
  thumbsEl.addEventListener("click", (e) => {
    const b = e.target.closest("button");
    if (!b) return;
    const p = +b.dataset.p;
    const dir = p > cur.page ? 1 : -1;
    cur.page = p;
    thumbsEl.classList.remove("open");
    showPage(dir);
  });

  /* ---------- Agregar producto desde una página ---------- */
  const addModal = $("#addModal");
  let addPage = 1;
  function openAdd(page) {
    const vis = visiblePages();
    addPage = typeof page === "number" ? page : vis[0];
    $("#addThumb").src = thumbSrc(cur.cat.id, addPage);
    $("#addSub").textContent = `Catálogo ${cur.cat.name} · página ${typeof page === "number" ? page : vis.join(" / ")}. Escribe el nombre o el código que ves en el catálogo.`;
    $("#addForm").reset();
    addModal.classList.add("open");
    addModal.setAttribute("aria-hidden", "false");
    setTimeout(() => $("#addName").focus(), 200);
  }
  function closeAdd() { addModal.classList.remove("open"); addModal.setAttribute("aria-hidden", "true"); }
  $("#addFromPage").addEventListener("click", () => openAdd());
  $("#addClose").addEventListener("click", closeAdd);
  addModal.addEventListener("click", (e) => { if (e.target === addModal) closeAdd(); });
  $("#addForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const raw = $("#addName").value.trim();
    const qty = Math.max(1, parseInt($("#addQty").value, 10) || 1);
    const price = parseFloat($("#addPrice").value) || 0;
    const note = $("#addNote").value.trim();
    addToCart({
      key: `${cur.cat.id}-${addPage}-${raw.toLowerCase()}-${note.toLowerCase()}`,
      name: raw, code: "",
      price, qty, note, catalog: cur.cat.name, page: addPage, img: thumbSrc(cur.cat.id, addPage),
    });
    closeAdd();
  });

  /* =========================================================
     COMPRAR POR CATEGORÍA (todos los catálogos mezclados)
     ========================================================= */
  const CATEGORIES = [
    { id: "maquillaje", name: "Maquillaje", hint: "Labiales, bases, máscaras, sombras",
      icon: '<path d="M9 21h6V11H9z"/><path d="M10 11V6.5L14 3v8"/><path d="M9 15h6"/>',
      words: "maquillaje labial labiales lapiz base bases mascara pestañas pestanas rimel sombra sombras delineador rubor polvo polvos corrector gloss brillo cejas esmalte uñas unas brochas" },
    { id: "skincare", name: "Skincare", hint: "Cremas, sérums, protector solar",
      icon: '<path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z"/><path d="M9.5 15a2.5 2.5 0 0 0 2.5 2.5"/>',
      words: "skincare skin piel facial cara rostro crema cremas serum sérum suero sueros antiedad arrugas manchas protector solar bloqueador spf limpiador tonico desmaquillante hidratante ojeras" },
    { id: "perfumes", name: "Perfumes", hint: "Para ella y para él, colonias",
      icon: '<rect x="6" y="9" width="12" height="12" rx="3"/><path d="M10 9V6h4v3"/><path d="M9 4h6"/><path d="M9 14h6"/>',
      words: "perfume perfumes fragancia fragancias colonia colonias aroma aromas eau parfum body mist splash" },
    { id: "cuerpo", name: "Cuerpo y cabello", hint: "Cremas corporales, shampoo, desodorantes",
      icon: '<path d="M9 7h6v13a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1z"/><path d="M10 7V4h4v3"/><path d="M14 4h3"/><path d="M9 12h6"/>',
      words: "cuerpo corporal cabello pelo shampoo champu acondicionador desodorante desodorantes jabon jabón talco crema corporal locion loción mascarilla" },
    { id: "joyas", name: "Joyas y accesorios", hint: "Aretes, collares, relojes, bolsos",
      icon: '<path d="M6 3h12l3 5-9 13L3 8z"/><path d="M3 8h18"/><path d="M9 3l3 5 3-5"/><path d="M12 8v13"/>',
      words: "joya joyas aretes arete collar collares pulsera pulseras anillo anillos reloj relojes bolso bolsos cartera billetera mochila accesorios argollas dije" },
    { id: "hombres", name: "Para él", hint: "Perfumes y cuidado masculino",
      icon: '<circle cx="12" cy="7" r="4"/><path d="M5 21v-1a7 7 0 0 1 14 0v1"/><path d="M12 14l-1.5 3 1.5 4 1.5-4z"/>',
      words: "hombre hombres caballero caballeros el él masculino papa papá esposo novio men" },
    { id: "ninos", name: "Niños", hint: "Colonias, champú y joyas infantiles",
      icon: '<path d="M12 3l2.6 5.5 6 .8-4.4 4.2 1.1 6L12 16.6 6.7 19.5l1.1-6L3.4 9.3l6-.8z"/>',
      words: "niño niños nino ninos niña niñas nina ninas bebe bebé kids infantil" },
    { id: "calzado", name: "Zapatos", hint: "Catálogo Bata Black Days",
      icon: '<path d="M3 17h18v2H3z"/><path d="M3 17c0-3 1-6 3-8l3 3c2 2 6 2 9 3 2 .6 3 1 3 2"/><path d="M6 9l2-4"/>',
      words: "zapato zapatos calzado calzados zapatilla zapatillas tenis sandalia sandalias botas botines taco tacones bata" },
  ];
  const BRAND = { yanbal: "Yanbal", esika: "Ésika", lbel: "L'Bel", cyzone: "Cyzone", "black-friday": "Bata" };
  const CAT_PAGES = (window.CATEGORY_PAGES || []).map(([cat, page, cats, price]) => ({ cat, page, cats, price }));
  const PAGE_SIZE = 24;
  let catState = { cat: "maquillaje", brand: "all", sort: "mixed", shown: PAGE_SIZE };

  const catTiles = $("#catTiles"), catBrands = $("#catBrands"), catResults = $("#catResults"), catMore = $("#catMore");
  const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

  catTiles.innerHTML = CATEGORIES.map((c) => {
    const n = CAT_PAGES.filter((p) => p.cats.includes(c.id)).length;
    return `<button class="cat-tile reveal zoom" data-cat="${c.id}">
      <span class="cat-tile__icon"><svg viewBox="0 0 24 24">${c.icon}</svg></span>
      <strong>${c.name}</strong><small>${n} páginas</small></button>`;
  }).join("");

  function filteredPages() {
    let list = CAT_PAGES.filter((p) => p.cats.includes(catState.cat) && (catState.brand === "all" || p.cat === catState.brand));
    if (catState.sort === "price") return [...list].sort((a, b) => (a.price ?? 1e9) - (b.price ?? 1e9));
    if (catState.sort === "catalog") return list;
    // Mezclado: alterna una página de cada catálogo
    const groups = {};
    list.forEach((p) => (groups[p.cat] ||= []).push(p));
    const queues = Object.values(groups), mixed = [];
    while (queues.some((q) => q.length)) queues.forEach((q) => q.length && mixed.push(q.shift()));
    return mixed;
  }

  function renderCategory(animate = true) {
    const c = CATEGORIES.find((x) => x.id === catState.cat);
    $$(".cat-tile", catTiles).forEach((t) => t.classList.toggle("is-active", t.dataset.cat === catState.cat));
    // Marcas disponibles en esta categoría
    const brands = [...new Set(CAT_PAGES.filter((p) => p.cats.includes(c.id)).map((p) => p.cat))];
    if (catState.brand !== "all" && !brands.includes(catState.brand)) catState.brand = "all";
    catBrands.innerHTML = [`<button class="chip ${catState.brand === "all" ? "is-active" : ""}" data-brand="all">Todas las marcas</button>`]
      .concat(brands.map((b) => `<button class="chip ${catState.brand === b ? "is-active" : ""}" data-brand="${b}">${BRAND[b]}</button>`)).join("");
    const list = filteredPages();
    $("#catTitle").textContent = c.name;
    $("#catHint").textContent = `${c.hint} · ${list.length} páginas de ${brands.length > 1 ? "varios catálogos" : BRAND[brands[0]]}`;
    catResults.innerHTML = list.slice(0, catState.shown).map((p, i) => `
      <article class="page-card" style="animation-delay:${animate ? (i % PAGE_SIZE) * 35 : 0}ms">
        <button class="page-card__img" data-cat="${p.cat}" data-page="${p.page}" aria-label="Ver ${BRAND[p.cat]} página ${p.page}">
          <img src="${thumbSrc(p.cat, p.page)}" alt="${esc(c.name)} — ${BRAND[p.cat]} pág. ${p.page}" loading="lazy">
          <span class="page-card__brand brand--${p.cat}">${BRAND[p.cat]}</span>
          <span class="page-card__zoom">Ver página</span>
        </button>
        <div class="page-card__body">
          <div class="page-card__meta"><span>Pág. ${p.page}</span>${p.price ? `<b>Desde ${money(p.price)}</b>` : `<em>Precio en catálogo</em>`}</div>
          <button class="btn btn--primary page-card__add" data-cat="${p.cat}" data-page="${p.page}">＋ Pedir de esta página</button>
        </div>
      </article>`).join("") || `<p class="empty">No hay páginas para este filtro.</p>`;
    catMore.hidden = list.length <= catState.shown;
    catMore.textContent = `Ver más (${list.length - catState.shown} restantes)`;
  }

  function selectCategory(id, scroll) {
    catState = { ...catState, cat: id, shown: PAGE_SIZE };
    renderCategory();
    if (scroll) $("#catPanel").scrollIntoView({ behavior: "smooth", block: "start" });
  }
  catTiles.addEventListener("click", (e) => { const t = e.target.closest(".cat-tile"); if (t) selectCategory(t.dataset.cat, true); });
  catBrands.addEventListener("click", (e) => {
    const b = e.target.closest("[data-brand]"); if (!b) return;
    catState.brand = b.dataset.brand; catState.shown = PAGE_SIZE; renderCategory();
  });
  $("#catSort").addEventListener("change", (e) => { catState.sort = e.target.value; renderCategory(); });
  catMore.addEventListener("click", () => { catState.shown += PAGE_SIZE; renderCategory(false); });
  catResults.addEventListener("click", (e) => {
    const view = e.target.closest(".page-card__img");
    if (view) { openViewer(view.dataset.cat, +view.dataset.page); return; }
    const add = e.target.closest(".page-card__add");
    if (add) { openViewer(add.dataset.cat, +add.dataset.page); setTimeout(() => openAdd(+add.dataset.page), 350); }
  });

  // Buscador: escribe "labial", "crema", "zapatos"… y salta a la categoría
  const catSearch = $("#catSearch"), catSearchMsg = $("#catSearchMsg");
  function searchCategory(q) {
    const words = norm(q).split(/\s+/).filter((w) => w.length > 1);
    if (!words.length) { catSearchMsg.textContent = ""; return; }
    let best = null, bestScore = 0;
    for (const c of CATEGORIES) {
      const pool = norm(c.name + " " + c.words).split(/\s+/);
      const score = words.reduce((s, w) => s + pool.filter((p) => p.startsWith(w) || w.startsWith(p) && p.length > 3).length, 0);
      if (score > bestScore) { best = c; bestScore = score; }
    }
    if (best) {
      catSearchMsg.innerHTML = `Mostrando <b>${best.name}</b> para “${esc(q)}”`;
      if (catState.cat !== best.id) selectCategory(best.id, false);
    } else {
      catSearchMsg.innerHTML = `No encontramos “${esc(q)}”. Prueba con: maquillaje, crema, perfume, aretes, zapatos…`;
    }
  }
  let searchTimer;
  catSearch.addEventListener("input", () => { clearTimeout(searchTimer); searchTimer = setTimeout(() => searchCategory(catSearch.value), 250); });
  $("#catSuggest").addEventListener("click", (e) => {
    const s = e.target.closest("[data-q]"); if (!s) return;
    catSearch.value = s.dataset.q; searchCategory(s.dataset.q);
    $("#catPanel").scrollIntoView({ behavior: "smooth", block: "start" });
  });

  renderCategory(false);

  /* =========================================================
     EFECTOS Y ANIMACIONES
     ========================================================= */
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = matchMedia("(pointer: fine)").matches;

  // Imagen que "vuela" al carrito
  function flyToCart(img) {
    if (!img || reduceMotion) return;
    const from = img.getBoundingClientRect();
    const target = (viewer.classList.contains("open") ? $("#viewerCart") : $("#openCart")).getBoundingClientRect();
    const fly = document.createElement("img");
    fly.src = img.src;
    fly.className = "fly-img";
    fly.style.left = from.left + from.width / 2 - 35 + "px";
    fly.style.top = from.top + from.height / 2 - 35 + "px";
    document.body.appendChild(fly);
    requestAnimationFrame(() => {
      fly.style.transform = `translate(${target.left + target.width / 2 - (from.left + from.width / 2)}px, ${target.top + target.height / 2 - (from.top + from.height / 2)}px) scale(.2)`;
      fly.style.opacity = ".4";
    });
    setTimeout(() => {
      fly.remove();
      $$(".cart-btn").forEach((b) => { b.classList.remove("shake"); void b.offsetWidth; b.classList.add("shake"); });
    }, 800);
  }

  // Confeti al enviar el pedido
  function confetti() {
    if (reduceMotion) return;
    const colors = ["#ff9ec4", "#c8a8ff", "#ffc3a6", "#9fe8d4", "#f5cf7d", "#ff4f7b"];
    for (let i = 0; i < 90; i++) {
      const c = document.createElement("span");
      c.className = "confetti";
      c.style.left = Math.random() * 100 + "vw";
      c.style.background = colors[i % colors.length];
      c.style.animationDuration = 2 + Math.random() * 2.5 + "s";
      c.style.animationDelay = Math.random() * 0.6 + "s";
      c.style.transform = `rotate(${Math.random() * 360}deg)`;
      document.body.appendChild(c);
      setTimeout(() => c.remove(), 5200);
    }
  }

  // Barra de progreso al hacer scroll
  const progress = $("#scrollProgress");
  addEventListener("scroll", () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    progress.style.transform = `scaleX(${max > 0 ? scrollY / max : 0})`;
  }, { passive: true });

  // Texto que se escribe solo
  const words = ["perfumes", "maquillaje", "cuidado de la piel", "joyas", "calzados", "regalos de Navidad"];
  const typed = $("#typed");
  let wi = 0, ci = words[0].length, deleting = true;
  (function typeLoop() {
    const w = words[wi];
    typed.textContent = w.slice(0, ci);
    let delay = deleting ? 45 : 95;
    if (deleting && ci === 0) { deleting = false; wi = (wi + 1) % words.length; delay = 300; }
    else if (!deleting && ci === words[wi].length) { deleting = true; delay = 1800; }
    else ci += deleting ? -1 : 1;
    setTimeout(typeLoop, delay);
  })();

  // Números que cuentan hacia arriba
  const countIO = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      const el = e.target, end = +el.dataset.count, suf = el.dataset.suffix || "";
      const t0 = performance.now();
      (function step(t) {
        const k = Math.min(1, (t - t0) / 1600), v = Math.round(end * (1 - Math.pow(1 - k, 3)));
        el.textContent = v + suf;
        if (k < 1) requestAnimationFrame(step);
      })(t0);
      countIO.unobserve(el);
    });
  });
  $$("[data-count]").forEach((el) => countIO.observe(el));

  // Cuenta regresiva a Navidad
  const cdBoxes = {};
  $$("#countdown b").forEach((b) => (cdBoxes[b.dataset.u] = b));
  function tickCountdown() {
    const now = new Date();
    let xmas = new Date(now.getFullYear(), 11, 25);
    if (now > xmas) xmas = new Date(now.getFullYear() + 1, 11, 25);
    let s = Math.max(0, Math.floor((xmas - now) / 1000));
    const vals = { d: Math.floor(s / 86400), h: Math.floor((s % 86400) / 3600), m: Math.floor((s % 3600) / 60), s: s % 60 };
    for (const k in vals) {
      const txt = String(vals[k]).padStart(2, "0");
      if (cdBoxes[k].textContent !== txt) {
        cdBoxes[k].textContent = txt;
        cdBoxes[k].classList.remove("tick"); void cdBoxes[k].offsetWidth; cdBoxes[k].classList.add("tick");
      }
    }
  }
  tickCountdown();
  setInterval(tickCountdown, 1000);

  // Efecto "onda" al tocar botones
  document.addEventListener("pointerdown", (e) => {
    const b = e.target.closest(".btn");
    if (!b) return;
    const r = b.getBoundingClientRect(), size = Math.max(r.width, r.height);
    const s = document.createElement("span");
    s.className = "ripple";
    s.style.cssText = `width:${size}px;height:${size}px;left:${e.clientX - r.left - size / 2}px;top:${e.clientY - r.top - size / 2}px`;
    b.appendChild(s);
    setTimeout(() => s.remove(), 700);
  });

  // Tarjetas con inclinación 3D al pasar el mouse
  if (finePointer && !reduceMotion) {
    document.addEventListener("pointermove", (e) => {
      const card = e.target.closest(".catalog-card, .product");
      $$(".catalog-card.tilting, .product.tilting").forEach((c) => { if (c !== card) { c.classList.remove("tilting"); c.style.transform = ""; } });
      if (!card) return;
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
      card.classList.add("tilting");
      card.style.transform = `perspective(900px) rotateY(${x * 12}deg) rotateX(${-y * 12}deg) translateY(-8px)`;
    });

    // Luz que sigue al cursor + foto con parallax
    const glow = $("#cursorGlow"), heroPhoto = $("#heroPhoto");
    addEventListener("pointermove", (e) => {
      glow.style.left = e.clientX + "px";
      glow.style.top = e.clientY + "px";
      if (scrollY < innerHeight) {
        const x = e.clientX / innerWidth - 0.5, y = e.clientY / innerHeight - 0.5;
        heroPhoto.style.transform = `perspective(1000px) rotateY(${x * 10}deg) rotateX(${-y * 8}deg)`;
      }
    });
  }

  // Destellos dorados flotando en el fondo
  const cv = $("#sparkles"), ctx = cv.getContext("2d");
  let parts = [];
  function sizeCanvas() {
    cv.width = innerWidth * devicePixelRatio;
    cv.height = innerHeight * devicePixelRatio;
    cv.style.width = innerWidth + "px";
    cv.style.height = innerHeight + "px";
    const n = innerWidth < 600 ? 28 : 60;
    parts = Array.from({ length: n }, () => ({
      x: Math.random() * cv.width, y: Math.random() * cv.height,
      r: (Math.random() * 1.8 + 0.6) * devicePixelRatio,
      vy: -(Math.random() * 0.35 + 0.1) * devicePixelRatio,
      vx: (Math.random() - 0.5) * 0.2 * devicePixelRatio,
      p: Math.random() * Math.PI * 2,
      c: ["255,207,125", "255,158,196", "200,168,255", "255,255,255"][Math.floor(Math.random() * 4)],
    }));
  }
  function drawSparkles() {
    ctx.clearRect(0, 0, cv.width, cv.height);
    for (const s of parts) {
      s.x += s.vx; s.y += s.vy; s.p += 0.03;
      if (s.y < -10) { s.y = cv.height + 10; s.x = Math.random() * cv.width; }
      const a = 0.35 + Math.sin(s.p) * 0.35;
      ctx.beginPath();
      ctx.fillStyle = `rgba(${s.c},${a})`;
      ctx.shadowColor = `rgba(${s.c},1)`;
      ctx.shadowBlur = 8 * devicePixelRatio;
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
    }
    requestAnimationFrame(drawSparkles);
  }
  if (!reduceMotion) {
    sizeCanvas();
    addEventListener("resize", sizeCanvas);
    drawSparkles();
  }

  // Línea de tiempo de "Cómo pedir" que se llena al bajar
  const timeline = $("#timeline"), tlFill = $("#timelineFill"), tlNodes = $$(".tl-node", timeline);
  function updateTimeline() {
    const line = tlFill.parentElement.getBoundingClientRect();
    const mark = innerHeight * 0.6;
    const h = Math.min(line.height, Math.max(0, mark - line.top));
    tlFill.style.height = h + "px";
    tlNodes.forEach((n) => {
      const r = n.getBoundingClientRect();
      n.classList.toggle("lit", r.top + r.height / 2 < mark);
    });
  }
  addEventListener("scroll", updateTimeline, { passive: true });
  addEventListener("resize", updateTimeline);
  updateTimeline();

  // Animaciones de entrada escalonadas para las tarjetas
  $$(".catalog-card").forEach((c, i) => c.classList.add(i % 2 ? "zoom" : "from-left"));

  renderCart();
  observeReveal();
})();
