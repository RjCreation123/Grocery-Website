const products = [
  {
    id: 1,
    name: "Banana's",
    price: 18.99,
    imageSrc: "image/product-1.jpg",
  },
  {
    id: 2,
    name: "Pumpkins",
    price: 28.99,
    imageSrc: "image/product-2.jpg",
  },
  {
    id: 3,
    name: "Fresh Milk",
    price: 18.99,
    imageSrc: "image/product-4.jpg",
  },
  {
    id: 4,
    name: "Onions",
    price: 8.99,
    imageSrc: "image/product-7.jpg",
  },
  {
    id: 5,
    name: "Millets",
    price: 38.99,
    imageSrc: "image/product-5.jpg",
  },
  {
    id: 6,
    name: "Pomegrenate",
    price: 8.99,
    imageSrc: "image/product-6.jpg",
  },
];

window.onload = function () {
  console.log("working");
  const session = sessionStorage.getItem("loggedInUser");
  const local = localStorage.getItem("loggedInUser");
  var loggedInUser = session || local;
  var data = JSON.parse(loggedInUser);
  console.log("🚀 ~ data:", data);

  console.log("🚀 ~ loggedInUser:", loggedInUser);

  if (loggedInUser) {
    console.log("🚀 ~ data:", data);
    document.getElementById("loggedInUserEmail").textContent = data.user.email;
    document.getElementById("content").style.display = "none";
    document.getElementById("userDetails").style.display = "block";
  }
};
const productContainer = document.getElementById("products-container");

function createProductElement(product) {
  const box = document.createElement("div");
  box.classList.add("box");
  box.dataset.itemId = product.id;

  const icons = document.createElement("div");
  icons.classList.add("icons");
  icons.innerHTML = `
    <a href="#" class="fas fa-shopping-cart"></a>
    <a href="#" class="fas fa-heart"></a>
    <a href="#" class="fas fa-eye"></a>
  `;
  box.appendChild(icons);

  const image = document.createElement("div");
  image.classList.add("image");
  image.innerHTML = `<img src="${product.imageSrc}" alt="${product.name}" />`;
  box.appendChild(image);

  const content = document.createElement("div");
  content.classList.add("content");

  const title = document.createElement("h3");
  title.textContent = product.name;
  content.appendChild(title);

  const price = document.createElement("div");
  price.classList.add("price");
  price.textContent = `$${product.price}`;
  content.appendChild(price);

  const stars = document.createElement("div");
  stars.classList.add("stars");
  stars.innerHTML = `
    <i class="fas fa-star"></i>
    <i class="fas fa-star"></i>
    <i class="fas fa-star"></i>
    <i class="fas fa-star"></i>
    <i class="far fa-star"></i>
  `;
  content.appendChild(stars);

  box.appendChild(content);

  return box;
}

function displayProducts(products) {
  console.log("displayProducts");
  productContainer.innerHTML = ""; // Clear existing content

  for (const product of products) {
    const productElement = createProductElement(product);
    productContainer.appendChild(productElement);
  }
}

displayProducts(products);
// Render Products

//Search box
function submitSearchForm() {
  event.preventDefault();
  const searchBox = document.getElementById("search-box");
  const searchTerm = searchBox.value.toLowerCase(); // Get search term and convert to lowercase
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm)
  );
  console.log("🚀 ~ submitSearchForm ~ filteredProducts:", filteredProducts);
  displayProducts(filteredProducts);
}
//
//Cart items
document.addEventListener("DOMContentLoaded", function () {
  function renderCart() {
    const shoppingCart = document.getElementById("shopping-cart");
    const totalElement = shoppingCart.querySelector(".total span");
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    shoppingCart.innerHTML = "";
    let checkoutBtn = document.createElement("a");
    checkoutBtn.classList.add("btn");
    checkoutBtn.textContent = "Checkout Cart";
    checkoutBtn.addEventListener("click", () => {
      placeOrder();
      checkoutBtn.textContent = "Order Placed";
      checkoutBtn.removeEventListener("click", handleCheckoutClick); // Remove event listener after clicked
      return false; // Prevent default behavior of anchor tag
    });

    if (cart.length === 0) {
      // Display message when cart is empty
      const emptyMessage = document.createElement("p");
      emptyMessage.textContent = "Cart is empty";
      shoppingCart.appendChild(emptyMessage);
      return;
    }

    let totalPrice = 0;

    // Loop through each item in the cart array
    cart.forEach(
      (item) => {
        // Create elements for the item
        const box = document.createElement("div");
        box.classList.add("box");

        const removeBtn = document.createElement("i");
        removeBtn.classList.add("fas", "fa-times");
        removeBtn.addEventListener("click", () => removeItem(item.id));

        const img = document.createElement("img");
        img.src = item.image;
        img.alt = item.name;

        const content = document.createElement("div");
        content.classList.add("content");

        const itemName = document.createElement("h3");
        itemName.textContent = item.name;

        const quantity = document.createElement("span");
        quantity.classList.add("quantity");
        quantity.textContent = item.quantity;

        const multiply = document.createElement("span");
        multiply.classList.add("multiply");
        multiply.textContent = "x";

        const itemPrice = document.createElement("span");
        itemPrice.classList.add("price");
        itemPrice.textContent = "$" + item.price;

        // Append elements to box
        content.appendChild(itemName);
        content.appendChild(quantity);
        content.appendChild(multiply);
        content.appendChild(itemPrice);
        box.appendChild(removeBtn);
        box.appendChild(img);
        box.appendChild(content);
        shoppingCart.appendChild(box);

        // Add item price to total
        totalPrice += parseFloat(item.price) * item.quantity;
      }
      // Add your checkout page link here
    );
    shoppingCart.appendChild(checkoutBtn);

    // Set total price
    totalElement.textContent = totalPrice.toFixed(2);

    // Create checkout button
  }

  function placeOrder() {
    const user = localStorage.getItem("users");
    console.log("🚀 ~ placeOrder ~ user:", user);
    if (!user) {
      alert("Please login or sign up first.");
      return;
    }
    localStorage.removeItem("cart");
    renderCart("Last Order was Placed. Add new items to cart.");
  }

  function removeItem(id) {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const index = cart.findIndex((item) => item.id === id);
    if (index !== -1) {
      if (cart[index].quantity > 1) {
        // If item quantity is more than 1, decrement the quantity
        cart[index].quantity--;
      } else {
        // If item quantity is 1, remove the entire item from the cart
        cart.splice(index, 1);
      }
      localStorage.setItem("cart", JSON.stringify(cart));
      renderCart();
    }
  }
  renderCart();
});
//
// addItemToCart
function removeItem(id) {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const index = cart.findIndex((item) => item.id === id);
  if (index !== -1) {
    if (cart[index].quantity > 1) {
      // If item quantity is more than 1, decrement the quantity
      cart[index].quantity--;
    } else {
      // If item quantity is 1, remove the entire item from the cart
      cart.splice(index, 1);
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
  }
}
function placeOrder() {
  const user = localStorage.getItem("users");
  console.log("🚀 ~ placeOrder ~ user:", user);
  if (!user) {
    alert("Please login or sign up first.");
    return;
  }
  localStorage.removeItem("cart");
  renderCart("Last Order was Placed. Add new items to cart.");
}
let renderCart = function (Message) {
  console.log("renderCart outside");
  const shoppingCart = document.getElementById("shopping-cart");
  const totalElement = shoppingCart.querySelector(".total span");
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  shoppingCart.innerHTML = "";
  let checkoutBtn = document.createElement("a");
  checkoutBtn.classList.add("btn");
  checkoutBtn.textContent = "Checkout Cart";
  checkoutBtn.addEventListener("click", () => {
    placeOrder();
    checkoutBtn.textContent = "Order Placed";
    checkoutBtn.removeEventListener("click", handleCheckoutClick); // Remove event listener after clicked
    return false; // Prevent default behavior of anchor tag
  });
  if (Message) {
    const emptyMessage = document.createElement("p");
    emptyMessage.textContent = "Last Order was Placed add new items to cart";
    shoppingCart.appendChild(emptyMessage);
    return;
  }
  if (cart.length === 0) {
    // Display message when cart is empty
    const emptyMessage = document.createElement("p");
    emptyMessage.textContent = "Cart is empty";
    shoppingCart.appendChild(emptyMessage);
    return;
  }

  let totalPrice = 0;

  // Loop through each item in the cart array
  cart.forEach(
    (item) => {
      // Create elements for the item
      const box = document.createElement("div");
      box.classList.add("box");

      const removeBtn = document.createElement("i");
      removeBtn.classList.add("fas", "fa-times");
      removeBtn.addEventListener("click", () => removeItem(item.id));

      const img = document.createElement("img");
      img.src = item.image;
      img.alt = item.name;

      const content = document.createElement("div");
      content.classList.add("content");

      const itemName = document.createElement("h3");
      itemName.textContent = item.name;

      const quantity = document.createElement("span");
      quantity.classList.add("quantity");
      quantity.textContent = item.quantity;

      const multiply = document.createElement("span");
      multiply.classList.add("multiply");
      multiply.textContent = "x";

      const itemPrice = document.createElement("span");
      itemPrice.classList.add("price");
      itemPrice.textContent = "$" + item.price;

      // Append elements to box
      content.appendChild(itemName);
      content.appendChild(quantity);
      content.appendChild(multiply);
      content.appendChild(itemPrice);
      box.appendChild(removeBtn);
      box.appendChild(img);
      box.appendChild(content);
      shoppingCart.appendChild(box);

      // Add item price to total
      totalPrice += parseFloat(item.price) * item.quantity;
    }
    // Add your checkout page link here
  );
  shoppingCart.appendChild(checkoutBtn);

  // Set total price
  totalElement.textContent = totalPrice.toFixed(2);
  // Create checkout button
};

const addToCartButtons = document.querySelectorAll(
  ".icons a.fas.fa-shopping-cart"
);

addToCartButtons.forEach((button) => {
  button.addEventListener("click", addToCart);
});
function addItemToCart(itemId) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const product = getProductInfo(itemId);
  let exists = -1;
  for (let i = 0; i < cart.length; i++) {
    if (parseInt(cart[i].id) == itemId) {
      exists = i;
      break;
    }
  }
  if (exists !== -1) {
    cart[exists].quantity++;
  } else {
    cart.push({ ...product, quantity: 1 }); // Add new item with quantity 1
  }
  localStorage.setItem("cart", JSON.stringify(cart));
  console.log(cart);
  renderCart();
}
function addToCart(event) {
  event.preventDefault();
  const clickedButton = event.target;
  const itemContainer = clickedButton.closest(".box");
  const itemId = itemContainer.dataset.itemId;
  addItemToCart(itemId);
}
//
let searchForm = document.querySelector(".search-form");
document.querySelector("#search-btn").onclick = () => {
  searchForm.classList.toggle("active");
  cart.classList.remove("active");
  loginForm.classList.remove("active");
  navbar.classList.remove("active");
};

let cart = document.querySelector(".shopping-cart");

document.querySelector("#cart-btn").onclick = () => {
  cart.classList.toggle("active");
  searchForm.classList.remove("active");
  loginForm.classList.remove("active");
  navbar.classList.remove("active");
};

let loginForm = document.querySelector(".login-form");

document.querySelector("#login-btn").onclick = () => {
  loginForm.classList.toggle("active");
  searchForm.classList.remove("active");
  cart.classList.remove("active");
  navbar.classList.remove("active");
};

let navbar = document.querySelector(".navbar");

document.querySelector("#menu-btn").onclick = () => {
  navbar.classList.toggle("active");
  searchForm.classList.remove("active");
  cart.classList.remove("active");
  loginForm.classList.remove("active");
};

window.onscroll = () => {
  searchForm.classList.remove("active");
  //   cart.classList.remove("active");
  loginForm.classList.remove("active");
  navbar.classList.remove("active");
};

let slides = document.querySelectorAll(".home .slides-container .slide");
let index = 0;

function next() {
  slides[index].classList.remove("active");
  index = (index + 1) % slides.length;
  slides[index].classList.add("active");
}

function prev() {
  slides[index].classList.remove("active");
  index = (index - 1 + slides.length) % slides.length;
  slides[index].classList.add("active");
}

function showRegistrationForm() {
  document.querySelector(".login-form").style.display = "none";
  document.querySelector(".register-form").style.display = "block";
  document.getElementById("content").style.display = "block";
  document.getElementById("userDetails").style.display = "none";
}

function showLoginForm() {
  document.querySelector(".register-form").style.display = "none";
  document.querySelector(".login-form").style.display = "block";
  document.getElementById("content").style.display = "block";
  document.getElementById("userDetails").style.display = "none";
}

async function login(email, password, remember) {
  console.log("🚀 ~ login ~ remember:", remember);
  try {
    const response = await fetch("https://user-registration-form-server.onrender.com/signin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: email, password: password, remember }),
    });

    const data = await response.json();
    console.log("🚀 ~ login ~ data:", data);

    if (data) {
      // Successfully logged in
      alert("Welcome, " + data.user.email);
      // Store the token in localStorage if "Remember me" is checked
      const rememberMe = document.getElementById("remember-me").checked;
      if (rememberMe) {
        localStorage.setItem("loggedInUser", JSON.stringify(data));
      } else {
        sessionStorage.setItem("loggedInUser", JSON.stringify(data));
      }
      // Redirect to a protected page or home page
      window.location.href = "/home.html";
    } else {
      // Login failed, display an error message
      alert("Login failed: " + data.error.message);
    }
  } catch (error) {
    console.error("Error:", error);
    alert("Login failed. Please try again.");
  }
}

function logout() {
  console.log("🚀 ~ logout ~ logout:");
  localStorage.removeItem("loggedInUser");
  sessionStorage.removeItem("loggedInUser");

  localStorage.removeItem("users");
  localStorage.removeItem("cart");
  showLoginForm();
}

document
  .querySelector(".login-form")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;
    var remember = document.getElementById("remember-me").checked;

    login(email, password, remember);
  });

// ------------------------------------------------------------------------------------------------------------------

document
  .querySelector(".register-form")
  .addEventListener("submit", async function (event) {
    event.preventDefault();
    console.log("Form submission detected.");

    // Log the entire form element
    console.log(document.querySelector(".register-form"));

    // Log each form field's value
    const firstname = document.getElementById("first-name");
    const lastname = document.getElementById("last-name");
    const emailInput = document.getElementById("register-email");
    const passwordInput = document.getElementById("register-password");

    // Get the values
    const fname = firstname.value;
    const lname = lastname.value;
    const email = emailInput.value;
    const password = passwordInput.value;

    console.log("Email:", email);
    console.log("Password:", password);

    // Collect values
    const payload = { email: email, password: password , firstname: fname, lastname: lname};

    console.log("Payload:", payload);

    try {
      const response = await fetch("https://user-registration-form-server.onrender.com/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      console.log("Response data:", data);
      alert(data.message || data.error);
    } catch (error) {
      console.error("Error:", error);
      alert("Registration failed. Please try again.");
    }
  });

// Check if user is already logged in

function getProductInfo(itemId) {
  const productElement = document.querySelector(
    `.box[data-item-id="${itemId}"]`
  );

  if (!productElement) {
    console.error("Product not found:", itemId);
    return null;
  }

  const productData = {
    id: parseInt(productElement.dataset.itemId),
    name: productElement.querySelector(".content h3").textContent.trim(),
    image: productElement.querySelector(".image img").src,
    price: parseFloat(
      productElement.querySelector(".content .price").textContent.slice(1)
    ),
  };

  return productData;
}

const shoppingCart = document.querySelector(".header .flex .shopping-cart");

shoppingCart.addEventListener("click", toggleCartDisplay);

function toggleCartDisplay() {
  shoppingCart.classList.toggle("active");
}
