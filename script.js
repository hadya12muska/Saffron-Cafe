document.addEventListener("DOMContentLoaded", () => {
  const cart = [];
  const cartCount = document.getElementById("cartCount");
  const cartItems = document.getElementById("cartItems");
  const empty = document.getElementById("empty");
  const total = document.getElementById("total");
  const order = document.getElementById("order");
  const success = document.getElementById("success");
  const continueBtn = document.getElementById("continue");
  const cartButton = document.getElementById("cartButton");
  const menuToggle = document.getElementById("menuToggle");
  const nav = document.getElementById("nav");
 
  menuToggle.addEventListener("click", () => nav.classList.toggle("open"));
 
  nav.querySelectorAll("a").forEach(a => {
    a.addEventListener("click", () => nav.classList.remove("open"));
  });
 
  cartButton.addEventListener("click", () => {
    document.getElementById("cart").scrollIntoView({behavior:"smooth"});
  });
 
  document.querySelectorAll(".add").forEach(button => {
    button.addEventListener("click", () => {
      const name = button.dataset.name;
      const price = Number(button.dataset.price);
      const item = cart.find(x => x.name === name);
 
      if (item) item.quantity++;
      else cart.push({name, price, quantity:1});
 
      renderCart();
      const old = button.textContent;
      button.textContent = "Added ✓";
      setTimeout(() => button.textContent = old, 700);
    });
  });
 
  cartItems.addEventListener("click", event => {
    const button = event.target.closest("button");
    if (!button) return;
    const index = Number(button.dataset.index);
    if (!cart[index]) return;
 
    if (button.classList.contains("plus")) cart[index].quantity++;
    if (button.classList.contains("minus")) {
      cart[index].quantity--;
      if (cart[index].quantity <= 0) cart.splice(index, 1);
    }
    if (button.classList.contains("remove")) cart.splice(index, 1);
    renderCart();
  });
 
  function renderCart() {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    const price = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    cartCount.textContent = count;
    total.textContent = "$" + price.toFixed(2);
    cartItems.innerHTML = "";
 
    if (cart.length === 0) {
      cartItems.appendChild(empty);
      empty.hidden = false;
      return;
    }
 
    empty.hidden = true;
 
    cart.forEach((item, index) => {
      const row = document.createElement("div");
      row.className = "cart-item";
      row.innerHTML = `
        <div><h3>${escapeHTML(item.name)}</h3><small>$${item.price.toFixed(2)} each</small></div>
        <div class="qty">
          <button class="minus" data-index="${index}">−</button>
          <span>${item.quantity}</span>
          <button class="plus" data-index="${index}">+</button>
        </div>
        <strong class="item-total">$${(item.price * item.quantity).toFixed(2)}</strong>
        <button class="remove" data-index="${index}">Remove</button>`;
      cartItems.appendChild(row);
    });
  }
 
  document.querySelectorAll(".filter").forEach(filter => {
    filter.addEventListener("click", () => {
      document.querySelectorAll(".filter").forEach(x => x.classList.remove("active"));
      filter.classList.add("active");
      const category = filter.dataset.filter;
      document.querySelectorAll(".card").forEach(card => {
        card.classList.toggle("hide", category !== "all" && card.dataset.category !== category);
      });
    });
  });
 
  order.addEventListener("click", () => {
    if (!cart.length) {
      alert("Your cart is empty. Please add an item first.");
      return;
    }
    cart.length = 0;
    renderCart();
    order.hidden = true;
    success.hidden = false;
    success.scrollIntoView({behavior:"smooth", block:"center"});
  });
 
  continueBtn.addEventListener("click", () => {
    success.hidden = true;
    order.hidden = false;
    document.getElementById("menu").scrollIntoView({behavior:"smooth"});
  });
 
  function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, char => ({
      "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"
    }[char]));
  }
 
  renderCart();
});
 
