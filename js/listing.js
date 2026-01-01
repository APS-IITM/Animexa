/* ================= CONFIG ================= */

const SUPABASE_URL = "https://YOUR_PROJECT_ID.supabase.co";
const SUPABASE_KEY = "YOUR_PUBLIC_ANON_KEY";

/* ========================================== */

const type = new URLSearchParams(window.location.search).get("type");

const titles = {
  "animated-wallpaper": "🚀 Animated Wallpapers",
  "live-wallpaper": "🎨 Live Wallpapers",
  "animated-card": "🧠 Animated Cards"
};

document.getElementById("pageTitle").innerText =
  titles[type] || "Products";

const loader = document.getElementById("loader");
const list = document.getElementById("product-list");

let products = [];

/* ================= FETCH ================= */

fetch(
  `${SUPABASE_URL}/rest/v1/products?product_type=eq.${type}`,
  {
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`
    }
  }
)
.then(res => res.json())
.then(data => {
  products = data;
  loader.style.display = "none";
  render(products);
});

/* ================= RENDER ================= */

function render(data) {
  list.innerHTML = "";
  data.forEach(p => {
    list.innerHTML += `
      <div class="product-card">
        <img src="${p.image_url}">
        <h3>${p.name}</h3>
        <p>${p.short_desc}</p>
        <p>⭐ ${p.rating}</p>
        <div class="buttons">
          <button onclick="view('${p.id}')">View</button>
          <a href="${p.gumroad_link}" target="_blank">
            <button class="buy-btn">Buy</button>
          </a>
        </div>
      </div>
    `;
  });
}

function view(id) {
  window.top.location.href =
    `product.html?id=${id}&type=${type}`;
}

/* ================= SEARCH ================= */

document.getElementById("search").oninput = e => {
  const v = e.target.value.toLowerCase();
  render(products.filter(p =>
    p.name.toLowerCase().includes(v) ||
    (p.tags || "").toLowerCase().includes(v)
  ));
};

/* ================= SORT ================= */

document.getElementById("sort").onchange = e => {
  let sorted = [...products];
  if (e.target.value === "rating")
    sorted.sort((a,b)=>b.rating-a.rating);
  if (e.target.value === "price_low")
    sorted.sort((a,b)=>a.price-b.price);
  if (e.target.value === "price_high")
    sorted.sort((a,b)=>b.price-a.price);
  render(sorted);
};
