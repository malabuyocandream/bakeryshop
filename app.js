const products = [
  {
    id: 'bread-smoked',
    name: 'Smoked Sourdough Bread',
    desc: 'Handcrafted smoked sourdough bread with a rich, tangy flavor and crisp crust.',
    price: 250,
    img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRo1tL7bVpcePcsfBnrYaT-jNjVk_bfFGhGPw&s'
  },
  {
    id: 'croissant-butter',
    name: 'Butter Croissant',
    desc: 'Flaky and buttery classic French croissants, perfect for breakfast or snacks.',
    price: 300,
    img: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'cupcake-vanilla',
    name: 'Vanilla Cupcakes',
    desc: 'Soft vanilla cupcakes topped with creamy vanilla frosting and sprinkles.',
    price: 150,
    img: 'https://i.pinimg.com/736x/95/0a/0a/950a0a62dcebd0b0d9721751c7367d0e.jpg'
  },
  {
    id: 'cookie-chocolate',
    name: 'Chocolate Chip Cookies',
    desc: 'Chewy, warm cookies loaded with delicious chocolate chips.',
    price: 55,
    img: 'https://i.pinimg.com/736x/47/8a/f1/478af13e6bd4e240265767af62d2d3ad.jpg'
  },
  {
    id: 'cake-redvelvet',
    name: 'Red Velvet Cake',
    desc: 'Beautifully layered red velvet cake with smooth cream cheese frosting.',
    price: 450,
    img: 'https://i.pinimg.com/736x/fd/b3/21/fdb321c04921a71fb02a40145857345c.jpg'
  },
  {
    id: 'muffin-blueberry',
    name: 'Blueberry Muffins',
    desc: 'Moist muffins bursting with fresh blueberries and a crumb topping.',
    price: 350,
    img: 'https://i.pinimg.com/736x/4e/a4/89/4ea489445c5b485bca0551fef238165b.jpg'
  }
];


let cart = {};


const productsGridEl = document.getElementById('products-grid');
const cartItemsEl = document.getElementById('cart-items');
const cartTotalEl = document.getElementById('cart-total');
const checkoutBtn = document.getElementById('checkout-button');
const checkoutModal = document.getElementById('checkout-modal');
const checkoutForm = document.getElementById('checkout-form');
const confirmationMessage = document.getElementById('confirmation-message');
const confirmCloseBtn = document.getElementById('confirm-close-btn');
const checkoutCloseBtn = checkoutModal.querySelector('.close-btn');


// Format price with Peso sign ₱
function formatPrice(value) {
  return '₱' + value.toFixed(2);
}


function renderProducts() {
  productsGridEl.innerHTML = '';
  products.forEach(product => {
    const card = document.createElement('article');
    card.className = 'product-card';
    card.setAttribute('tabindex', '0');
    card.innerHTML = `
      <img src="${product.img}" alt="${product.name}" class="product-image"/>
      <h3 class="product-name">${product.name}</h3>
      <p class="product-desc">${product.desc}</p>
      <div class="product-price" aria-label="Price">${formatPrice(product.price)}</div>
      <button class="add-to-cart-btn" aria-label="Add ${product.name} to cart">Add to Cart</button>
    `;
    const addBtn = card.querySelector('button');
    addBtn.addEventListener('click', () => addToCart(product.id));
    productsGridEl.appendChild(card);
  });
}


function renderCart() {
  cartItemsEl.innerHTML = '';
  const productIds = Object.keys(cart);
  if (productIds.length === 0) {
    cartItemsEl.innerHTML = '<p>Your cart is empty.</p>';
    cartTotalEl.textContent = 'Total: ₱0.00';
    checkoutBtn.disabled = true;
    checkoutBtn.setAttribute('aria-disabled', 'true');
    return;
  }
  let total = 0;
  productIds.forEach(id => {
    const product = products.find(p => p.id === id);
    const qty = cart[id];
    const subTotal = product.price * qty;
    total += subTotal;


    const itemDiv = document.createElement('div');
    itemDiv.className = 'cart-item';


    const detailsDiv = document.createElement('div');
    detailsDiv.className = 'cart-item-details';


    const nameP = document.createElement('p');
    nameP.className = 'cart-item-name';
    nameP.textContent = product.name;


    const qtyP = document.createElement('p');
    qtyP.className = 'cart-item-qty';
    qtyP.textContent = 'Quantity: ' + qty;


    detailsDiv.appendChild(nameP);
    detailsDiv.appendChild(qtyP);


    const controlsDiv = document.createElement('div');
    controlsDiv.className = 'cart-item-controls';


    const btnMinus = document.createElement('button');
    btnMinus.className = 'qty-btn';
    btnMinus.setAttribute('aria-label', `Decrease quantity of ${product.name}`);
    btnMinus.textContent = '-';
    btnMinus.disabled = qty <= 1;
    btnMinus.addEventListener('click', () => updateCart(product.id, qty - 1));


    const btnPlus = document.createElement('button');
    btnPlus.className = 'qty-btn';
    btnPlus.setAttribute('aria-label', `Increase quantity of ${product.name}`);
    btnPlus.textContent = '+';
    btnPlus.addEventListener('click', () => updateCart(product.id, qty + 1));


    const priceP = document.createElement('div');
    priceP.className = 'cart-item-price';
    priceP.textContent = formatPrice(subTotal);


    controlsDiv.appendChild(btnMinus);
    controlsDiv.appendChild(btnPlus);


    itemDiv.appendChild(detailsDiv);
    itemDiv.appendChild(controlsDiv);
    itemDiv.appendChild(priceP);


    cartItemsEl.appendChild(itemDiv);
  });
  cartTotalEl.textContent = 'Total: ' + formatPrice(total);
  checkoutBtn.disabled = false;
  checkoutBtn.setAttribute('aria-disabled', 'false');
}


function addToCart(productId) {
  if (cart[productId]) {
    cart[productId]++;
  } else {
    cart[productId] = 1;
  }
  renderCart();
}


function updateCart(productId, qty) {
  if (qty <= 0) {
    delete cart[productId];
  } else {
    cart[productId] = qty;
  }
  renderCart();
}


// Checkout modal handlers
checkoutBtn.addEventListener('click', () => {
  checkoutModal.classList.add('active');
  document.body.style.overflow = 'hidden';
  checkoutForm.reset();
  checkoutForm.querySelector('input').focus();
});


checkoutCloseBtn.addEventListener('click', closeCheckoutModal);


function closeCheckoutModal() {
  checkoutModal.classList.remove('active');
  document.body.style.overflow = '';
}


// Checkout form submission handler
checkoutForm.addEventListener('submit', e => {
  e.preventDefault();
  if (!checkoutForm.checkValidity()) {
    checkoutForm.reportValidity();
    return;
  }


  // Collect customer info from form
  const customer = {
    name: checkoutForm['cust-name'].value.trim(),
    email: checkoutForm['cust-email'].value.trim(),
    phone: checkoutForm['cust-phone'].value.trim(),
    address: checkoutForm['cust-address'].value.trim(),
  };


  // Prepare items array from cart
  const items = Object.entries(cart).map(([productId, quantity]) => {
    const product = products.find(p => p.id === productId);
    return {
      id: product.id,
      name: product.name,
      price: product.price,
      quantity
    };
  });


  // Save order data in localStorage
  const orderData = {
    customer,
    items,
    date: new Date().toISOString(),
  };
  localStorage.setItem('orderData', JSON.stringify(orderData));


  // Close modal
  closeCheckoutModal();


  // Clear cart and re-render
  cart = {};
  renderCart();


  // Open receipt page in new tab/window
  window.open('receipt.html', '_blank');
});


// Confirmation message removed since replaced by receipt page


confirmCloseBtn.addEventListener('click', () => {
  confirmationMessage.classList.remove('active');
});


// Initialize
renderProducts();
renderCart();


// Promo slideshow rotation
const slides = document.querySelectorAll('.promo-slideshow .slide');
let currentSlide = 0;


function showSlide(index) {
  slides.forEach((slide, i) => {
    slide.classList.toggle('active', i === index);
  });
}


function nextSlide() {
  currentSlide = (currentSlide + 1) % slides.length;
  showSlide(currentSlide);
}


// Start slideshow rotation every 4 seconds
setInterval(nextSlide, 4000);
