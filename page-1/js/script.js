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
      starButtons.forEach((b) => b.classList.remove('hover-preview'));
      renderStars(selectedRating);
    });

    // Click to confirm rating
    btn.addEventListener('click', () => {
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
  // 4. CAPACITY / SIZE VARIATIONS (50 ml, 100 ml) & STOK PRODUK
  // =========================================================================
  const PRODUCT_STOCK = 10; // Data stok hardcoded untuk Innoxa Unica AJ
  const swatchButtons = document.querySelectorAll('.swatch-val-btn');
  const selectedSizeLabel = document.getElementById('selected-size-label');
  const productPriceEl = document.getElementById('product-price');
  const productLiveSubtotalEl = document.getElementById('product-live-subtotal');
  const qtyErrorMsgEl = document.getElementById('qty-error-msg');
  const stockValEl = document.getElementById('stock-val');

  if (stockValEl) {
    stockValEl.textContent = PRODUCT_STOCK;
  }

  let currentUnitPrice = 94.30; // Default 50 ml price

  swatchButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      swatchButtons.forEach((b) => {
        b.classList.remove('active');
        b.setAttribute('aria-checked', 'false');
      });

      btn.classList.add('active');
      btn.setAttribute('aria-checked', 'true');

      const size = btn.getAttribute('data-size');
      const price = btn.getAttribute('data-price');
      const numericPrice = parseFloat(price ? price.replace('$', '') : '94.30') || 94.30;

      currentUnitPrice = numericPrice;

      if (selectedSizeLabel && size) selectedSizeLabel.textContent = size;
      if (productPriceEl && price) productPriceEl.textContent = price;

      // Update ringkasan subtotal live saat variasi berubah
      validateAndCalculate();
    });
  });

  // =========================================================================
  // 5. QUANTITY CONTROLLER & VALIDASI INPUT (min. 1, max. stock, bulat positif)
  // =========================================================================
  const btnMinus = document.getElementById('btn-minus');
  const btnPlus = document.getElementById('btn-plus');
  const quantityInput = document.getElementById('quantity-input');
  let currentQty = 1;
  let isQtyValid = true;

  function validateAndCalculate() {
    if (!quantityInput) return;
    const rawVal = quantityInput.value.trim();

    // 1. Validasi tidak boleh kosong
    if (rawVal === '') {
      showQtyError('Quantity tidak boleh kosong!');
      return;
    }

    const num = Number(rawVal);

    // 2. Validasi harus berupa angka
    if (isNaN(num)) {
      showQtyError('Quantity harus berupa angka valid!');
      return;
    }

    // 3. Validasi bilangan bulat (integer, tidak boleh desimal/pecahan)
    if (!Number.isInteger(num)) {
      showQtyError('Quantity harus berupa bilangan bulat positif (bukan pecahan)!');
      return;
    }

    // 4. Validasi angka positif (> 0)
    if (num <= 0) {
      showQtyError('Quantity minimal 1 (tidak boleh 0 atau negatif)!');
      return;
    }

    // 5. Validasi tidak boleh melebihi stok total
    if (num > PRODUCT_STOCK) {
      showQtyError(`Quantity melebihi stok yang tersedia (maksimal ${PRODUCT_STOCK})!`);
      return;
    }

    // Jika semua valid:
    clearQtyError();
    currentQty = num;

    // Perbarui tombol minus & plus
    if (btnMinus) btnMinus.disabled = currentQty <= 1;
    if (btnPlus) btnPlus.disabled = currentQty >= PRODUCT_STOCK;

    // Hitung dan perbarui Subtotal Realtime di halaman produk
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
    if (btnAddToCart) {
      btnAddToCart.disabled = false;
      btnAddToCart.style.opacity = '1';
      btnAddToCart.style.cursor = 'pointer';
    }
  }

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
      if (currentQty < PRODUCT_STOCK && isQtyValid) {
        quantityInput.value = currentQty + 1;
        validateAndCalculate();
      }
    });
  }

  // Hitung subtotal awal saat halaman dimuat
  validateAndCalculate();

  // =========================================================================
  // 6. ADD TO CART & LOVE WISHLIST
  // =========================================================================
  const btnAddToCart = document.getElementById('btn-add-to-cart');
  const btnCartText = document.getElementById('btn-cart-text');
  const btnWishlist = document.getElementById('btn-wishlist');
  let isWishlisted = false;

  // Add to Cart: Menambahkan item, update subtotal, dan memunculkan Modal Sidebar
  if (btnAddToCart) {
    btnAddToCart.addEventListener('click', () => {
      validateAndCalculate();
      if (!isQtyValid || currentQty < 1 || currentQty > PRODUCT_STOCK) {
        showToast('Jumlah quantity belum valid.');
        return;
      }

      const activeSize = selectedSizeLabel ? selectedSizeLabel.textContent.trim() : '50 ml';
      const unitPrice = activeSize === '100 ml' ? 135.70 : 94.30;
      const itemId = `unica-aj-${activeSize.replace(/\s+/g, '').toLowerCase()}`;

      // Periksa apakah item varian ini sudah ada dalam cart
      const existingItem = cartItems.find((item) => item.id === itemId);
      if (existingItem) {
        existingItem.quantity += currentQty;
      } else {
        cartItems.push({
          id: itemId,
          brand: 'Innoxa',
          title: 'Unica AJ',
          size: activeSize,
          unitPrice: unitPrice,
          quantity: currentQty,
          img: 'img/unica.jpeg'
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
      showToast(`Innoxa Unica AJ (${activeSize}) added to your shopping bag.`);
    });
  }

  // Love Wishlist
  if (btnWishlist) {
    btnWishlist.addEventListener('click', () => {
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
  // 8. THUMBNAILS GALLERY
  // =========================================================================
  const thumbBtns = document.querySelectorAll('.thumb-btn');
  const mainProductImg = document.getElementById('main-product-img');

  thumbBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      thumbBtns.forEach((t) => {
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
