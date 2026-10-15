const FOOD_PRODUCTS = [
  { id: 1, name: "Classic Chicken Burger", category: "Burgers", price: 850, rating: 4.8, desc: "Juicy grilled chicken breast topped with fresh lettuce, onions and secret garlic mayo.", image: "chicken-burger.jpg" },
  { id: 2, name: "Cheese Burst Pizza", category: "Pizza", price: 1450, rating: 4.9, desc: "Loaded with bubbling mozzarella, rich marinara sauce, fresh basil, and spiced herbs.", image: "cheese-pizza.jpg" },
  { id: 3, name: "Chicken Fried Rice", category: "Rice", price: 950, rating: 4.7, desc: "Wok-tossed aromatic basmati rice with shredded chicken, fresh veggies and chili paste.", image: "fried-rice.jpg" },
  { id: 4, name: "Creamy Chicken Pasta", category: "Pasta", price: 1100, rating: 4.8, desc: "Penne pasta bathed in creamy parmesan alfredo sauce with sauteed herb chicken.", image: "chicken-pasta.jpg" },
  { id: 5, name: "French Fries", category: "Burgers", price: 500, rating: 4.6, desc: "Crispy golden salted fries served hot with spicy tomato relish and creamy dip.", image: "french-fries.jpg" },
  { id: 6, name: "Chocolate Milkshake", category: "Drinks", price: 650, rating: 4.9, desc: "Rich decadent Belgian chocolate blended with creamy ice cream and whipped topping.", image: "chocolate-milkshake.jpg" },
  { id: 7, name: "Chicken Submarine", category: "Burgers", price: 900, rating: 4.7, desc: "Toasted submarine roll packed with spiced shredded chicken breast, bell peppers & melted cheese.", image: "chicken-submarine.jpg" },
  { id: 8, name: "Chocolate Brownie", category: "Desserts", price: 550, rating: 4.9, desc: "Fudgy warm double chocolate brownie topped with crunchy walnuts and cocoa drizzle.", image: "chocolate-brownie.jpg" }
];

const DELIVERY_FEE = 150;
let cart = [];
let currentCategory = "All";
let searchQuery = "";
let favoriteIds = new Set();
let selectedPayment = "Cash on Delivery";

window.addEventListener("DOMContentLoaded", () => {
  renderProducts();
  updateCartUI();
});

function renderProducts() {
  const grid = document.getElementById("foodCardsGrid");
  if (!grid) return;
  grid.innerHTML = "";

  const filtered = FOOD_PRODUCTS.filter(product => {
    const matchesCat = currentCategory === "All" || product.category.toLowerCase() === currentCategory.toLowerCase();
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          product.desc.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div class="no-results">
        <div class="no-results-icon">🔍</div>
        <h3 style="font-size: 20px; font-weight:700; color:var(--dark); margin-bottom:6px;">No food found</h3>
        <p>Try searching with another keyword or explore different categories.</p>
      </div>
    `;
    return;
  }

  filtered.forEach(item => {
    const isFav = favoriteIds.has(item.id);
    const card = document.createElement("div");
    card.className = "food-card";
    card.innerHTML = `
      <div class="card-img-wrap">
        <img src="${item.image}" alt="${item.name}" class="food-img" loading="lazy">
        <button class="favorite-btn ${isFav ? 'active' : ''}" onclick="toggleFavorite(${item.id}, this)" aria-label="Favorite">
          <svg width="18" height="18" fill="${isFav ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
        </button>
      </div>
      <div class="card-content">
        <div class="card-meta">
          <span class="card-rating">
            <span class="star-icon">★</span> ${item.rating}
          </span>
          <span style="font-size:12px; color:var(--gray-400); font-weight:600;">${item.category}</span>
        </div>
        <h3 class="card-title">${item.name}</h3>
        <p class="card-desc">${item.desc}</p>
        <div class="card-footer">
          <div class="card-price">Rs. ${item.price.toLocaleString()}</div>
          <button class="add-cart-btn" onclick="addToCart(${item.id})" aria-label="Add to Cart">
            <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          </button>
        </div>
      </div>
    `;
    grid.appendChild(card);
  });
}

function filterCategory(category, elementBtn = null) {
  currentCategory = category;
  const buttons = document.querySelectorAll(".category-btn");
  buttons.forEach(btn => {
    btn.classList.remove("active");
    if (btn.textContent.toLowerCase().includes(category.toLowerCase())) {
      btn.classList.add("active");
    }
  });
  if (elementBtn) {
    buttons.forEach(b => b.classList.remove("active"));
    elementBtn.classList.add("active");
  }
  renderProducts();
}

function handleSearch() {
  searchQuery = document.getElementById("foodSearchInput").value.trim();
  renderProducts();
}

function focusSearch() {
  const input = document.getElementById("foodSearchInput");
  if (input) {
    input.scrollIntoView({ behavior: 'smooth', block: 'center' });
    input.focus();
  }
}

function toggleFavorite(id, btn) {
  if (favoriteIds.has(id)) {
    favoriteIds.delete(id);
    btn.classList.remove("active");
    btn.querySelector("svg").setAttribute("fill", "none");
    showToast("Removed from favorites");
  } else {
    favoriteIds.add(id);
    btn.classList.add("active");
    btn.querySelector("svg").setAttribute("fill", "currentColor");
    showToast("Saved to favorites ❤️");
  }
}

function addToCart(productId) {
  const product = FOOD_PRODUCTS.find(p => p.id === productId);
  if (!product) return;

  const existingIndex = cart.findIndex(item => item.id === productId);
  if (existingIndex > -1) {
    cart[existingIndex].qty += 1;
  } else {
    cart.push({ ...product, qty: 1 });
  }

  updateCartUI();
  showToast(`Added ${product.name} to cart!`);

  const badge = document.getElementById("navCartBadge");
  if (badge) {
    badge.style.transform = "scale(1.35)";
    setTimeout(() => badge.style.transform = "scale(1)", 200);
  }
}

function changeQuantity(productId, delta) {
  const idx = cart.findIndex(item => item.id === productId);
  if (idx === -1) return;

  cart[idx].qty += delta;
  if (cart[idx].qty <= 0) {
    cart.splice(idx, 1);
  }
  updateCartUI();
}

function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  updateCartUI();
  showToast("Item removed from cart");
}

function calculateTotals() {
  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
  const delivery = cart.length > 0 ? DELIVERY_FEE : 0;
  const total = subtotal + delivery;
  return { subtotal, delivery, total };
}

function updateCartUI() {
  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
  
  const navBadge = document.getElementById("navCartBadge");
  const cartHeader = document.getElementById("cartCountHeader");
  if (navBadge) navBadge.textContent = totalItems;
  if (cartHeader) cartHeader.textContent = totalItems;

  const cartList = document.getElementById("cartItemsList");
  const cartFooter = document.getElementById("cartFooter");

  if (!cartList || !cartFooter) return;

  if (cart.length === 0) {
    cartList.innerHTML = `
      <div class="empty-cart-state">
        <div class="empty-icon">🛍️</div>
        <h4 style="font-weight:700; margin-bottom:6px; font-size:17px;">Your cart is empty</h4>
        <p style="color:var(--gray-400); font-size:13px; margin-bottom:16px;">Looks like you haven't added anything yet.</p>
        <button class="btn-primary" onclick="toggleCartDrawer(false)">Browse Menu</button>
      </div>
    `;
    cartFooter.style.display = "none";
    return;
  }

  cartFooter.style.display = "block";
  cartList.innerHTML = "";

  cart.forEach(item => {
    const itemRow = document.createElement("div");
    itemRow.className = "cart-item";
    itemRow.innerHTML = `
      <img src="${item.image}" alt="${item.name}" class="cart-item-img">
      <div class="cart-item-info">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-price">Rs. ${item.price.toLocaleString()}</div>
        <div class="cart-qty-row">
          <button class="qty-btn" onclick="changeQuantity(${item.id}, -1)">–</button>
          <span class="qty-val">${item.qty}</span>
          <button class="qty-btn" onclick="changeQuantity(${item.id}, 1)">+</button>
        </div>
      </div>
      <div class="cart-item-end">
        <span class="item-subtotal">Rs. ${(item.price * item.qty).toLocaleString()}</span>
        <button class="remove-btn" onclick="removeFromCart(${item.id})" aria-label="Remove item">
          <svg width="17" height="17" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
        </button>
      </div>
    `;
    cartList.appendChild(itemRow);
  });

  const { subtotal, delivery, total } = calculateTotals();
  document.getElementById("cartSubtotal").textContent = `Rs. ${subtotal.toLocaleString()}`;
  document.getElementById("cartDelivery").textContent = `Rs. ${delivery.toLocaleString()}`;
  document.getElementById("cartTotal").textContent = `Rs. ${total.toLocaleString()}`;
}

function toggleCartDrawer(open) {
  const drawer = document.getElementById("cartDrawer");
  const overlay = document.getElementById("drawerOverlay");
  if (open) {
    drawer.classList.add("active");
    overlay.classList.add("active");
  } else {
    drawer.classList.remove("active");
    if (!document.getElementById("checkoutDrawer").classList.contains("active")) {
      overlay.classList.remove("active");
    }
  }
}

function toggleCheckoutDrawer(open) {
  const drawer = document.getElementById("checkoutDrawer");
  const overlay = document.getElementById("drawerOverlay");
  if (open) {
    drawer.classList.add("active");
    overlay.classList.add("active");
  } else {
    drawer.classList.remove("active");
    overlay.classList.remove("active");
  }
}

function closeAllDrawers() {
  toggleCartDrawer(false);
  toggleCheckoutDrawer(false);
}

function toggleMobileNav() {
  document.getElementById("mobileDrawer").classList.toggle("active");
}

function openCheckoutDrawer() {
  if (cart.length === 0) return;
  toggleCartDrawer(false);

  const container = document.getElementById("checkoutSummaryItems");
  container.innerHTML = "";
  cart.forEach(item => {
    const row = document.createElement("div");
    row.style.display = "flex";
    row.style.justifyContent = "space-between";
    row.innerHTML = `
      <span>${item.name} × ${item.qty}</span>
      <strong style="color:var(--dark)">Rs. ${(item.price * item.qty).toLocaleString()}</strong>
    `;
    container.appendChild(row);
  });

  const { subtotal, delivery, total } = calculateTotals();
  document.getElementById("chkSubtotal").textContent = `Rs. ${subtotal.toLocaleString()}`;
  document.getElementById("chkDelivery").textContent = `Rs. ${delivery.toLocaleString()}`;
  document.getElementById("chkTotal").textContent = `Rs. ${total.toLocaleString()}`;

  toggleCheckoutDrawer(true);
}

function setPaymentMethod(method, element) {
  document.querySelectorAll(".pay-card").forEach(c => c.classList.remove("active"));
  element.classList.add("active");
  selectedPayment = method === 'cod' ? "Cash on Delivery" : "Card Payment";
}

function handlePlaceOrder(event) {
  event.preventDefault();
  const name = document.getElementById("custName").value.trim();
  const phone = document.getElementById("custPhone").value.trim();
  const address = document.getElementById("custAddress").value.trim();

  if (!name || !phone || !address) {
    alert("Please complete all required fields.");
    return;
  }

  const { total } = calculateTotals();
  const randomOrderId = "MR" + Math.floor(1000 + Math.random() * 9000);

  document.getElementById("successOrderId").textContent = "#" + randomOrderId;
  document.getElementById("successPaymentType").textContent = selectedPayment;
  document.getElementById("successTotalAmount").textContent = `Rs. ${total.toLocaleString()}`;

  cart = [];
  updateCartUI();
  document.getElementById("checkoutForm").reset();
  toggleCheckoutDrawer(false);

  document.getElementById("successModal").classList.add("active");
}

function closeSuccessModal() {
  document.getElementById("successModal").classList.remove("active");
}

function showToast(message) {
  const container = document.getElementById("toastContainer");
  if (!container) return;
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.innerHTML = `
    <svg width="18" height="18" fill="none" stroke="#FF5E3A" stroke-width="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg>
    <span>${message}</span>
  `;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(10px)";
    toast.style.transition = "all 0.3s ease";
    setTimeout(() => toast.remove(), 300);
  }, 2600);
}