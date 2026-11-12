/**
 * 50ml Luxury Store - Unica AJ PDP Interactive Script
 * Strictly implements review & critique specifications:
 * 1. Collapsed sidebar with Lorem Ipsum navigation items
 * 2. Interactive star rating form (1-5 stars) without review count or stock info
 * 3. Capacity variation without subtotal/total box on PDP
 * 4. Quantity capsule, Add to Cart, Love Wishlist & Accordions
 * 5. Cart Sidebar Modal (Right Drawer Minicart) with item list, quantities, subtotal, and checkout
 */

document.addEventListener('DOMContentLoaded', () => {
  // =========================================================================
  // 1. COLLAPSED SIDEBAR (Navigation Drawer - Left)
  // =========================================================================
  const menuToggleBtn = document.getElementById('menu-toggle-btn');
  const sidebarCloseBtn = document.getElementById('sidebar-close-btn');
  const collapsedSidebar = document.getElementById('collapsed-sidebar');
  const sidebarOverlay = document.getElementById('sidebar-overlay');

  const openSidebar = () => {
    closeCart(); // Tutup cart drawer jika sedang terbuka
    if (collapsedSidebar && sidebarOverlay) {
      collapsedSidebar.classList.add('open');
      sidebarOverlay.classList.add('active');
      document.body.classList.add('sidebar-open');
    }
  };

  const closeSidebar = () => {
    if (collapsedSidebar && sidebarOverlay) {
      collapsedSidebar.classList.remove('open');
      sidebarOverlay.classList.remove('active');
      document.body.classList.remove('sidebar-open');
    }
  };

  if (menuToggleBtn) menuToggleBtn.addEventListener('click', openSidebar);
  if (sidebarCloseBtn) sidebarCloseBtn.addEventListener('click', closeSidebar);
  if (sidebarOverlay) sidebarOverlay.addEventListener('click', closeSidebar);

  // =========================================================================
  // 2. CART SIDEBAR MODAL (Minicart Drawer - Right)
  // =========================================================================
  const cartSidebar = document.getElementById('cart-sidebar');
  const cartOverlay = document.getElementById('cart-overlay');
  const cartCloseBtn = document.getElementById('cart-close-btn');
  const btnCart = document.getElementById('btn-cart');
  const cartBadge = document.getElementById('cart-count-badge');
  const cartSidebarCount = document.getElementById('cart-sidebar-items-count');
  const cartItemsList = document.getElementById('cart-items-list');
  const cartEmptyView = document.getElementById('cart-empty-view');
  const cartSubtotalVal = document.getElementById('cart-subtotal-val');
  const btnCheckout = document.getElementById('btn-checkout');
  const btnContinueLink = document.getElementById('btn-continue-link');
  const btnStartShopping = document.getElementById('btn-start-shopping');
  const thresholdText = document.getElementById('threshold-text');
  const thresholdProgressFill = document.getElementById('threshold-progress-fill');

  // Cart State (Dikelola di front-end)
  let cartItems = [];

  const openCart = () => {
    closeSidebar(); // Tutup menu drawer kiri jika sedang terbuka
    if (cartSidebar && cartOverlay) {
      cartSidebar.classList.add('open');
      cartOverlay.classList.add('active');
      document.body.classList.add('cart-open');
      cartSidebar.setAttribute('aria-hidden', 'false');
    }
  };

  const closeCart = () => {
    if (cartSidebar && cartOverlay) {
      cartSidebar.classList.remove('open');
      cartOverlay.classList.remove('active');
      document.body.classList.remove('cart-open');
      cartSidebar.setAttribute('aria-hidden', 'true');
    }
  };

  if (cartCloseBtn) cartCloseBtn.addEventListener('click', closeCart);
  if (cartOverlay) cartOverlay.addEventListener('click', closeCart);
  if (btnContinueLink) cartCloseBtn && btnContinueLink.addEventListener('click', closeCart);
  if (btnStartShopping) btnStartShopping.addEventListener('click', closeCart);
  if (btnCart) {
    btnCart.addEventListener('click', (e) => {
      e.preventDefault();
      openCart();
    });
  }

  // Keyboard accessibility: ESC closes both sidebars
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeSidebar();
      closeCart();
    }
  });

  // Render list produk & subtotal dalam modal sidebar
  const renderCart = () => {
    const totalCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
    const subtotal = cartItems.reduce((acc, item) => acc + (item.unitPrice * item.quantity), 0);

    // 1. Badge pada Header
    if (cartBadge) {
      cartBadge.textContent = totalCount;
      cartBadge.style.display = totalCount > 0 ? 'flex' : 'none';
    }

    // 2. Count pada Title Sidebar
    if (cartSidebarCount) {
      cartSidebarCount.textContent = `(${totalCount})`;
    }

    // 3. Subtotal Belanja
    if (cartSubtotalVal) {
      cartSubtotalVal.textContent = `$${subtotal.toFixed(2)}`;
    }

    // 4. Free Delivery Threshold ($150 target)
    const thresholdLimit = 150.0;
    if (thresholdText && thresholdProgressFill) {
      if (subtotal >= thresholdLimit) {
        thresholdText.innerHTML = '🎉 You unlocked <strong>Free Delivery</strong>!';
        thresholdProgressFill.style.width = '100%';
      } else {
        const remaining = (thresholdLimit - subtotal).toFixed(2);
        const percent = Math.min(100, Math.round((subtotal / thresholdLimit) * 100));
        thresholdText.innerHTML = `Free delivery from $150. Add <strong id="threshold-remaining">$${remaining}</strong> more!`;
        thresholdProgressFill.style.width = `${percent}%`;
      }
    }

    // 5. Render Konten Body (Empty state vs List)
    if (cartItems.length === 0) {
      if (cartEmptyView) cartEmptyView.classList.add('active');
      if (cartItemsList) cartItemsList.innerHTML = '';
      if (btnCheckout) {
        btnCheckout.disabled = true;
        btnCheckout.style.opacity = '0.5';
        btnCheckout.style.cursor = 'not-allowed';
      }
    } else {
      if (cartEmptyView) cartEmptyView.classList.remove('active');
      if (btnCheckout) {
        btnCheckout.disabled = false;
        btnCheckout.style.opacity = '1';
        btnCheckout.style.cursor = 'pointer';
      }

      if (cartItemsList) {
        cartItemsList.innerHTML = cartItems.map((item) => `
          <li class="cart-item-card" data-id="${item.id}">
            <div class="cart-item-img-link">
              <img 
                src="${item.img}" 
                alt="${item.brand} ${item.title} ${item.size}" 
                onerror="this.src='img/unica.jpeg'"
              >
            </div>
            <div class="cart-item-content">
              <div class="cart-item-top">
                <div class="cart-item-headings">
                  <span class="cart-item-brand">${item.brand}</span>
                  <h3 class="cart-item-title">${item.title}</h3>
                  <span class="cart-item-variant">Size: <strong>${item.size}</strong></span>
                  <span class="cart-item-price-unit">$${item.unitPrice.toFixed(2)} each</span>
                </div>
                <button 
                  type="button" 
                  class="cart-item-remove-btn" 
                  data-id="${item.id}" 
                  aria-label="Remove ${item.title} ${item.size}" 
                  title="Remove item"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>
              <div class="cart-item-bottom">
                <div class="cart-qty-capsule">
                  <button type="button" class="cart-qty-btn cart-qty-minus" data-id="${item.id}" aria-label="Decrease quantity">−</button>
                  <span class="cart-qty-val" aria-label="Quantity ${item.quantity}">${item.quantity}</span>
                  <button type="button" class="cart-qty-btn cart-qty-plus" data-id="${item.id}" aria-label="Increase quantity">+</button>
                </div>
                <span class="cart-item-line-total">$${(item.unitPrice * item.quantity).toFixed(2)}</span>
              </div>
            </div>
          </li>
        `).join('');
      }
    }
  };

  // Event delegation untuk tombol di dalam cart list (qty +, qty -, remove)
  if (cartItemsList) {
    cartItemsList.addEventListener('click', (e) => {
      const minusBtn = e.target.closest('.cart-qty-minus');
      const plusBtn = e.target.closest('.cart-qty-plus');
      const removeBtn = e.target.closest('.cart-item-remove-btn');

      if (minusBtn) {
        const id = minusBtn.getAttribute('data-id');
        const item = cartItems.find((it) => it.id === id);
        if (item) {
          if (item.quantity > 1) {
            item.quantity -= 1;
          } else {
            // Jika tinggal 1 lalu dikurangi, hapus item dari cart
            cartItems = cartItems.filter((it) => it.id !== id);
          }
          renderCart();
        }
      } else if (plusBtn) {
        const id = plusBtn.getAttribute('data-id');
        const item = cartItems.find((it) => it.id === id);
        if (item) {
          item.quantity += 1;
          renderCart();
        }
      } else if (removeBtn) {
        const id = removeBtn.getAttribute('data-id');
        cartItems = cartItems.filter((it) => it.id !== id);
        renderCart();
        showToast('Item removed from your shopping bag.');
      }
    });
  }

  // Checkout button simulation
  if (btnCheckout) {
    btnCheckout.addEventListener('click', () => {
      const totalCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
      showToast(`Proceeding to checkout with ${totalCount} item(s)...`);
    });
  }

  // Initialize cart state
  renderCart();

  // =========================================================================
  // 3. INTERACTIVE STAR RATING FORM (1 to 5 Stars)
  // =========================================================================
  const starButtons = document.querySelectorAll('.star-btn');
  let selectedRating = 5; // Default 5 stars as on 50ml

  const renderStars = (ratingToDisplay) => {
    starButtons.forEach((btn) => {
      const starVal = parseInt(btn.getAttribute('data-rating'), 10);
      if (starVal <= ratingToDisplay) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  };

  starButtons.forEach((btn) => {
    const starVal = parseInt(btn.getAttribute('data-rating'), 10);

    // Hover effect to preview rating
    btn.addEventListener('mouseenter', () => {
      if (btn.disabled || !productData) return;
      starButtons.forEach((b) => {
        const val = parseInt(b.getAttribute('data-rating'), 10);
        if (val <= starVal) {
          b.classList.add('hover-preview');
        } else {
          b.classList.remove('hover-preview');
        }
      });
    });

    // Mouse leave restores selected rating
    btn.addEventListener('mouseleave', () => {
      if (btn.disabled || !productData) return;
      starButtons.forEach((b) => b.classList.remove('hover-preview'));
      renderStars(selectedRating);
    });

    // Click to confirm rating
    btn.addEventListener('click', () => {
      if (btn.disabled || !productData) return;
      selectedRating = starVal;
      starButtons.forEach((b) => {
        const val = parseInt(b.getAttribute('data-rating'), 10);
        b.setAttribute('aria-checked', val === selectedRating ? 'true' : 'false');
      });
      renderStars(selectedRating);
      showToast(`Thank you! You rated ${selectedRating} of 5 stars.`);
    });
  });

  // Initialize stars
  renderStars(selectedRating);

  // =========================================================================
  // 4. BACKEND API INTEGRATION & STATE MANAGEMENT (PRODUCT ID: 1)
  // =========================================================================
  const API_URL = (window.location.port === '3000' || window.location.pathname.startsWith('/page-2'))
    ? '/api/products/1'
    : 'http://localhost:3000/api/products/1';

  let productData = null;
  let totalStock = 10; // Nilai default sebelum dimuat dari PostgreSQL
  let currentUnitPrice = 94.30; // Harga default variasi
  let currentQty = 1;
  let isQtyValid = true;
  let selectedVariation = null; // Menyimpan variasi terpilih { size, price }
  let isWishlisted = false;

  // DOM Elements untuk State Management (Loading & Error)
  const apiLoadingStateEl = document.getElementById('api-loading-state');
  const apiErrorStateEl = document.getElementById('api-error-state');
  const apiErrorTextEl = document.getElementById('api-error-text');
  const btnApiRetry = document.getElementById('btn-api-retry');
  const productContentWrapper = document.getElementById('product-content-wrapper');

  // DOM Elements untuk Detail Produk & Subtotal
  const productNameEl = document.getElementById('product-name');
  const productSubtitleEl = document.getElementById('product-subtitle');
  const brandTitleEl = document.getElementById('brand-title');
  const bcCurrentEl = document.getElementById('bc-current');
  const productPriceEl = document.getElementById('product-price');
  const mainProductImg = document.getElementById('main-product-img');
  const thumbsListEl = document.getElementById('thumbs-list');
  const swatchesContainer = document.getElementById('swatches-buttons-row');
  const selectedSizeLabel = document.getElementById('selected-size-label');
  const descPanelBody = document.getElementById('desc-inner-body');
  const infoPanelBody = document.getElementById('info-inner-body');
  const featuresTbody = document.getElementById('features-tbody');
  const stockValEl = document.getElementById('stock-val');
  const productLiveSubtotalEl = document.getElementById('product-live-subtotal');
  const qtyErrorMsgEl = document.getElementById('qty-error-msg');

  // DOM Elements untuk Action: Add to Cart & Quantity
  const btnAddToCart = document.getElementById('btn-add-to-cart');
  const btnCartText = document.getElementById('btn-cart-text');
  const btnMinus = document.getElementById('btn-minus');
  const btnPlus = document.getElementById('btn-plus');
  const quantityInput = document.getElementById('quantity-input');
  const btnWishlist = document.getElementById('btn-wishlist');

  // Fungsi Transisi State (Loading / Error / Content)
  function showLoadingState() {
    if (apiLoadingStateEl) apiLoadingStateEl.style.display = 'flex';
    if (apiErrorStateEl) apiErrorStateEl.style.display = 'none';
    if (productContentWrapper) productContentWrapper.style.display = 'none';
    disableProductInteractions('Memuat...');
  }

  function showErrorState(message) {
    if (apiLoadingStateEl) apiLoadingStateEl.style.display = 'none';
    if (apiErrorStateEl) apiErrorStateEl.style.display = 'flex';
    if (apiErrorTextEl) {
      apiErrorTextEl.textContent = message || 'Gagal mengambil data dari backend.';
    }
    if (productContentWrapper) productContentWrapper.style.display = 'none';
    disableProductInteractions('Backend Offline');
  }

  function showContentState() {
    if (apiLoadingStateEl) apiLoadingStateEl.style.display = 'none';
    if (apiErrorStateEl) apiErrorStateEl.style.display = 'none';
    if (productContentWrapper) productContentWrapper.style.display = 'grid';
    enableProductInteractions();
  }

  // Fungsi Validasi Input Quantity & Perhitungan Live Subtotal
  function validateAndCalculate() {
    if (!quantityInput) return;
    const rawVal = quantityInput.value.trim();

    // 1. Tidak boleh kosong
    if (rawVal === '') {
      showQtyError('Quantity tidak boleh kosong!');
      return;
    }

    const num = Number(rawVal);

    // 2. Harus berupa angka
    if (isNaN(num)) {
      showQtyError('Quantity harus berupa angka valid!');
      return;
    }

    // 3. Harus bilangan bulat positif (bukan desimal/pecahan)
    if (!Number.isInteger(num)) {
      showQtyError('Quantity harus berupa bilangan bulat positif (bukan pecahan)!');
      return;
    }

    // 4. Minimal 1 (tidak boleh 0 atau negatif)
    if (num <= 0) {
      showQtyError('Quantity minimal 1 (tidak boleh 0 atau negatif)!');
      return;
    }

    // 5. Tidak boleh melebihi stok total dari data PostgreSQL
    if (num > totalStock) {
      showQtyError(`Quantity melebihi stok yang tersedia (maksimal ${totalStock})!`);
      return;
    }

    // Jika valid:
    clearQtyError();
    currentQty = num;

    // Perbarui tombol minus & plus
    if (btnMinus) btnMinus.disabled = currentQty <= 1;
    if (btnPlus) btnPlus.disabled = currentQty >= totalStock;

    // Hitung & perbarui Live Subtotal via textContent
    const liveSubtotal = currentUnitPrice * currentQty;
    if (productLiveSubtotalEl) {
      productLiveSubtotalEl.textContent = `$${liveSubtotal.toFixed(2)}`;
    }
  }

  function showQtyError(message) {
    isQtyValid = false;
    if (qtyErrorMsgEl) {
      qtyErrorMsgEl.textContent = message;
      qtyErrorMsgEl.style.display = 'block';
    }
    if (productLiveSubtotalEl) {
      productLiveSubtotalEl.textContent = '-';
    }
    if (btnAddToCart) {
      btnAddToCart.disabled = true;
      btnAddToCart.style.opacity = '0.5';
      btnAddToCart.style.cursor = 'not-allowed';
    }
    if (btnMinus) btnMinus.disabled = true;
    if (btnPlus) btnPlus.disabled = true;
  }

  function clearQtyError() {
    isQtyValid = true;
    if (qtyErrorMsgEl) {
      qtyErrorMsgEl.textContent = '';
      qtyErrorMsgEl.style.display = 'none';
    }
    if (btnAddToCart && productData) {
      btnAddToCart.disabled = false;
      btnAddToCart.style.opacity = '1';
      btnAddToCart.style.cursor = 'pointer';
    }
  }

  // Event listener untuk tombol variasi/swatch dinamis
  function attachSwatchListeners() {
    const currentSwatchButtons = document.querySelectorAll('.swatch-val-btn');
    currentSwatchButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        if (btn.disabled || !productData) return;

        currentSwatchButtons.forEach((b) => {
          b.classList.remove('active');
          b.setAttribute('aria-checked', 'false');
        });

        btn.classList.add('active');
        btn.setAttribute('aria-checked', 'true');

        const size = btn.getAttribute('data-size');
        const rawPrice = parseFloat(btn.getAttribute('data-raw-price')) || 0;

        currentUnitPrice = rawPrice;

        selectedVariation = {
          size: size,
          price: rawPrice
        };

        if (selectedSizeLabel && size) selectedSizeLabel.textContent = size;
        if (productPriceEl) productPriceEl.textContent = `$${rawPrice.toFixed(2)}`;

        // Perbarui Live Subtotal saat variasi berubah
        validateAndCalculate();
      });
    });
  }

  // Render data produk dari backend ke elemen DOM (Aman dari XSS)
  function renderProduct(prod) {
    if (!prod) return;
    productData = prod;

    // Baca dan render Stok Produk dari Database
    totalStock = Number(prod.Stock !== undefined ? prod.Stock : (prod.stock !== undefined ? prod.stock : 10));
    if (stockValEl) {
      stockValEl.textContent = totalStock;
    }

    // 1. Title, Breadcrumb & Brand (via textContent)
    document.title = `${prod.Name} | 50ml`;
    if (productNameEl) productNameEl.textContent = prod.Name;
    if (bcCurrentEl) bcCurrentEl.textContent = prod.Name;

    // Ambil Brand dari Features
    let brand = 'Innoxa';
    if (Array.isArray(prod.Features)) {
      const foundBrand = prod.Features.find((f) => f.label && f.label.toLowerCase() === 'brand');
      if (foundBrand) brand = foundBrand.value;
    } else if (prod.Features && prod.Features.Brand) {
      brand = prod.Features.Brand;
    }
    if (brandTitleEl) {
      brandTitleEl.textContent = brand;
      brandTitleEl.title = brand;
    }

    // Subtitle produk
    let subtitle = '';
    if (Array.isArray(prod.Features)) {
      const concern = prod.Features.find((f) => f.label && f.label.toLowerCase() === 'concern')?.value;
      const pType = prod.Features.find((f) => f.label && f.label.toLowerCase().includes('product type'))?.value;
      const skinType = prod.Features.find((f) => f.label && f.label.toLowerCase().includes('skin type'))?.value;
      if (concern && pType && skinType) {
        subtitle = `${concern.toLowerCase()} ${pType.toLowerCase()} for ${skinType.toLowerCase()} skin types`;
      }
    }
    if (!subtitle && prod.Description) {
      const commaSplit = prod.Description.split(',');
      subtitle = commaSplit.length > 1 ? commaSplit[1].split('.')[0].trim() : prod.Description.slice(0, 45);
    }
    if (productSubtitleEl) {
      productSubtitleEl.textContent = subtitle;
    }

    // 2. Gambar Utama & Thumbnails
    const photoSrc = prod.Photo 
      ? (prod.Photo.startsWith('http') || prod.Photo.startsWith('img/') ? prod.Photo : `img/${prod.Photo}`)
      : 'img/unica.jpeg';

    if (mainProductImg) {
      mainProductImg.src = photoSrc;
      mainProductImg.alt = `${brand} ${prod.Name}`;
    }

    if (thumbsListEl) {
      thumbsListEl.innerHTML = [1, 2, 3, 4].map((num, idx) => `
        <button type="button" class="thumb-btn ${idx === 0 ? 'active' : ''}" role="tab" aria-selected="${idx === 0 ? 'true' : 'false'}" data-src="${photoSrc}" aria-label="Thumbnail ${num}">
          <img src="${photoSrc}" alt="Thumbnail ${num}" width="80" height="80">
        </button>
      `).join('');

      const newThumbBtns = thumbsListEl.querySelectorAll('.thumb-btn');
      newThumbBtns.forEach((btn) => {
        btn.addEventListener('click', () => {
          newThumbBtns.forEach((t) => {
            t.classList.remove('active');
            t.setAttribute('aria-selected', 'false');
          });
          btn.classList.add('active');
          btn.setAttribute('aria-selected', 'true');
          const src = btn.getAttribute('data-src');
          if (mainProductImg && src) {
            mainProductImg.src = src;
          }
        });
      });
    }

    // 3. Render Variasi Ukuran & Harga secara Dinamis dari 'prod.Variation'
    if (swatchesContainer && Array.isArray(prod.Variation) && prod.Variation.length > 0) {
      // Cari variasi default 50 ml
      const defaultVar = prod.Variation.find((v) => {
        const s = typeof v === 'object' && v !== null ? v.size : String(v);
        return s && s.toLowerCase().includes('50');
      }) || prod.Variation[0];

      const defaultSize = typeof defaultVar === 'object' && defaultVar !== null ? defaultVar.size : String(defaultVar);
      const defaultPrice = typeof defaultVar === 'object' && defaultVar !== null ? Number(defaultVar.price) : 0;

      currentUnitPrice = defaultPrice;

      selectedVariation = {
        size: defaultSize,
        price: defaultPrice
      };

      swatchesContainer.innerHTML = prod.Variation.map((v) => {
        const isObj = typeof v === 'object' && v !== null;
        const size = isObj ? v.size : String(v);
        const priceNum = isObj ? Number(v.price) : 0;
        const isActive = size === defaultSize;

        return `
          <button 
            type="button" 
            class="swatch-val-btn ${isActive ? 'active' : ''}" 
            role="radio" 
            aria-checked="${isActive ? 'true' : 'false'}" 
            data-size="${size}" 
            data-price="$${priceNum.toFixed(2)}"
            data-raw-price="${priceNum}"
            id="swatch-${String(size).replace(/[^a-zA-Z0-9]/g, '')}"
          >
            ${size}
          </button>
        `;
      }).join('');

      if (selectedSizeLabel) selectedSizeLabel.textContent = defaultSize;
      if (productPriceEl) productPriceEl.textContent = `$${defaultPrice.toFixed(2)}`;

      attachSwatchListeners();
    } else {
      selectedVariation = null;
      if (selectedSizeLabel) selectedSizeLabel.textContent = '-';
      if (productPriceEl) productPriceEl.textContent = '-';
    }

    // 4. Accordion 1: Description (Safe DOM injection via textContent)
    if (descPanelBody && prod.Description) {
      descPanelBody.textContent = '';
      const p = document.createElement('p');
      p.textContent = prod.Description;
      descPanelBody.appendChild(p);
    }

    // 5. Accordion 2: More Information (Safe DOM injection)
    const moreInfoText = prod['More Information'] || prod.moreInformation || prod.more_information;
    if (infoPanelBody && moreInfoText) {
      infoPanelBody.textContent = '';
      const p = document.createElement('p');
      p.textContent = moreInfoText;
      infoPanelBody.appendChild(p);
    }

    // 6. Accordion 3: Features (Safe DOM injection)
    if (featuresTbody && prod.Features) {
      featuresTbody.textContent = '';
      const rowsData = Array.isArray(prod.Features) 
        ? prod.Features 
        : Object.entries(prod.Features).map(([label, value]) => ({ label, value }));

      rowsData.forEach((f, i) => {
        const tr = document.createElement('tr');
        if (i % 2 === 0) tr.classList.add('row-highlight');
        const th = document.createElement('th');
        th.setAttribute('scope', 'row');
        th.textContent = f.label || '';
        const td = document.createElement('td');
        td.textContent = f.value || '';
        tr.appendChild(th);
        tr.appendChild(td);
        featuresTbody.appendChild(tr);
      });
    }

    // Hitung Live Subtotal awal setelah data dirender
    validateAndCalculate();
  }

  // Fungsi untuk mematikan interaksi saat backend belum siap / error
  function disableProductInteractions(btnMessage = 'Add to Cart') {
    if (btnAddToCart) {
      btnAddToCart.disabled = true;
      btnAddToCart.style.opacity = '0.5';
      btnAddToCart.style.cursor = 'not-allowed';
      btnAddToCart.setAttribute('aria-disabled', 'true');
      if (btnCartText) btnCartText.textContent = btnMessage;
    }
    if (btnMinus) btnMinus.disabled = true;
    if (btnPlus) btnPlus.disabled = true;

    if (btnWishlist) {
      btnWishlist.disabled = true;
      btnWishlist.style.opacity = '0.5';
      btnWishlist.style.cursor = 'not-allowed';
      btnWishlist.setAttribute('aria-disabled', 'true');
    }

    starButtons.forEach((btn) => {
      btn.disabled = true;
      btn.style.opacity = '0.5';
      btn.style.cursor = 'not-allowed';
      btn.setAttribute('aria-disabled', 'true');
    });

    const swatchBtns = document.querySelectorAll('.swatch-val-btn');
    swatchBtns.forEach((btn) => {
      btn.disabled = true;
      btn.style.opacity = '0.5';
      btn.style.cursor = 'not-allowed';
      btn.setAttribute('aria-disabled', 'true');
    });
  }

  // Fungsi untuk mengaktifkan kembali seluruh interaksi setelah data siap
  function enableProductInteractions() {
    if (btnAddToCart && isQtyValid) {
      btnAddToCart.disabled = false;
      btnAddToCart.style.opacity = '1';
      btnAddToCart.style.cursor = 'pointer';
      btnAddToCart.removeAttribute('aria-disabled');
      if (btnCartText) btnCartText.textContent = 'Add to Cart';
    }
    if (btnPlus) btnPlus.disabled = currentQty >= totalStock;
    if (btnMinus) btnMinus.disabled = currentQty <= 1;

    if (btnWishlist) {
      btnWishlist.disabled = false;
      btnWishlist.style.opacity = '1';
      btnWishlist.style.cursor = 'pointer';
      btnWishlist.removeAttribute('aria-disabled');
    }

    starButtons.forEach((btn) => {
      btn.disabled = false;
      btn.style.opacity = '1';
      btn.style.cursor = 'pointer';
      btn.removeAttribute('aria-disabled');
    });

    const swatchBtns = document.querySelectorAll('.swatch-val-btn');
    swatchBtns.forEach((btn) => {
      btn.disabled = false;
      btn.style.opacity = '1';
      btn.style.cursor = 'pointer';
      btn.removeAttribute('aria-disabled');
    });
  }

  // Panggil data produk ID 1 dari backend REST API
  async function fetchProductDetail() {
    showLoadingState();

    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status} - ${response.statusText}`);
      }
      const json = await response.json();
      if (json.status === 'success' && json.data) {
        renderProduct(json.data);
        showContentState(); // Sukses: tampilkan konten produk dan hilangkan loading
      } else {
        throw new Error('Respon backend tidak valid atau status bukan success.');
      }
    } catch (err) {
      console.warn('[Backend Error]:', err.message);
      productData = null;
      showErrorState('Gagal mengambil data dari backend.');
    }
  }

  // Pasang listener tombol Retry manual pada Error State
  if (btnApiRetry) {
    btnApiRetry.addEventListener('click', () => {
      fetchProductDetail();
    });
  }

  // Load data awal dari backend saat DOM siap
  fetchProductDetail();

  // =========================================================================
  // 5. QUANTITY CONTROLLER (Input Event, Minus & Plus)
  // =========================================================================
  if (quantityInput) {
    quantityInput.addEventListener('input', () => {
      validateAndCalculate();
    });

    quantityInput.addEventListener('change', () => {
      validateAndCalculate();
    });
  }

  if (btnMinus) {
    btnMinus.addEventListener('click', () => {
      if (currentQty > 1 && isQtyValid) {
        quantityInput.value = currentQty - 1;
        validateAndCalculate();
      }
    });
  }

  if (btnPlus) {
    btnPlus.addEventListener('click', () => {
      if (currentQty < totalStock && isQtyValid) {
        quantityInput.value = currentQty + 1;
        validateAndCalculate();
      }
    });
  }

  // =========================================================================
  // 6. ADD TO CART & LOVE WISHLIST
  // =========================================================================
  // Add to Cart: Menambahkan item dinamis ke keranjang belanja
  if (btnAddToCart) {
    btnAddToCart.addEventListener('click', () => {
      validateAndCalculate();
      if (!isQtyValid || currentQty < 1 || currentQty > totalStock) {
        showToast('Jumlah quantity belum valid!');
        return;
      }

      if (!productData || !productData.id || btnAddToCart.disabled) {
        showToast('Produk belum berhasil dimuat dari server backend.');
        return;
      }

      if (!selectedVariation || !selectedVariation.size || selectedVariation.price === undefined) {
        showToast('Pilih salah satu variasi terlebih dahulu.');
        return;
      }

      const activeSize = selectedVariation.size;
      const unitPrice = Number(selectedVariation.price);

      const prodId = productData ? productData.id : 1;
      const prodName = productData ? productData.Name : 'Unica AJ';
      let brandName = 'Innoxa';
      if (productData && Array.isArray(productData.Features)) {
        const b = productData.Features.find((f) => f.label && f.label.toLowerCase() === 'brand');
        if (b) brandName = b.value;
      } else if (productData && productData.Features && productData.Features.Brand) {
        brandName = productData.Features.Brand;
      }

      const photoSrc = productData && productData.Photo 
        ? (productData.Photo.startsWith('http') || productData.Photo.startsWith('img/') ? productData.Photo : `img/${productData.Photo}`)
        : 'img/unica.jpeg';

      const itemId = `prod-${prodId}-${activeSize.replace(/[^a-zA-Z0-9]/g, '').toLowerCase()}`;

      // Periksa apakah item varian ini sudah ada dalam cart
      const existingItem = cartItems.find((item) => item.id === itemId);
      if (existingItem) {
        existingItem.quantity += currentQty;
      } else {
        cartItems.push({
          id: itemId,
          brand: brandName,
          title: prodName,
          size: activeSize,
          unitPrice: unitPrice,
          quantity: currentQty,
          img: photoSrc
        });
      }

      // Visual button feedback
      const originalText = btnCartText ? btnCartText.textContent : 'Add to Cart';
      if (btnCartText) btnCartText.textContent = '✓ Added to Cart!';
      btnAddToCart.classList.add('feedback-added');

      setTimeout(() => {
        if (btnCartText) btnCartText.textContent = originalText;
        btnAddToCart.classList.remove('feedback-added');
      }, 1600);

      // Render cart items & buka modal sidebar keranjang
      renderCart();
      openCart();
      showToast(`${brandName} ${prodName} (${activeSize}) added to your shopping bag.`);
    });
  }

  // Love Wishlist
  if (btnWishlist) {
    btnWishlist.addEventListener('click', () => {
      // Proteksi tambahan: jika belum ada data produk valid atau tombol disabled, batalkan aksi
      if (!productData || !productData.id || btnWishlist.disabled) {
        showToast('Informasi produk belum berhasil dimuat dari backend.');
        return;
      }
      isWishlisted = !isWishlisted;
      if (isWishlisted) {
        btnWishlist.classList.add('active');
        btnWishlist.setAttribute('aria-label', 'Remove from Wishlist');
        btnWishlist.setAttribute('title', 'Remove from Wish List');
        showToast('Product has been added to your Wish List.', true);
      } else {
        btnWishlist.classList.remove('active');
        btnWishlist.setAttribute('aria-label', 'Add to Wishlist');
        btnWishlist.setAttribute('title', 'Add to Wish List');
        showToast('Product removed from your Wish List.');
      }
    });
  }

  // =========================================================================
  // 7. ACCORDION DROPDOWNS (Description, More information, Features)
  // =========================================================================
  const accordionHeaders = document.querySelectorAll('.accordion-header');

  accordionHeaders.forEach((header) => {
    header.addEventListener('click', () => {
      const panelId = header.getAttribute('aria-controls');
      const panel = document.getElementById(panelId);
      const isExpanded = header.getAttribute('aria-expanded') === 'true';

      if (isExpanded) {
        header.setAttribute('aria-expanded', 'false');
        header.classList.remove('active');
        if (panel) panel.classList.remove('open');
      } else {
        header.setAttribute('aria-expanded', 'true');
        header.classList.add('active');
        if (panel) panel.classList.add('open');
      }
    });
  });


  // =========================================================================
  // 9. TOAST NOTIFICATION UTILITY
  // =========================================================================
  const siteToast = document.getElementById('site-toast');
  const toastMsg = document.getElementById('toast-msg');
  const toastCheck = document.getElementById('toast-check');
  let toastTimeout = null;

  function showToast(message, isHeart = false) {
    if (!siteToast || !toastMsg) return;

    if (toastTimeout) clearTimeout(toastTimeout);

    toastMsg.textContent = message;
    if (toastCheck) {
      toastCheck.textContent = isHeart ? '♥' : '✓';
      toastCheck.style.color = isHeart ? '#904745' : '#10B981';
    }

    siteToast.classList.add('show');
    toastTimeout = setTimeout(() => {
      siteToast.classList.remove('show');
    }, 2800);
  }
});
