const SHEET_ID = "1r0sIGtTOQ4Qmko_syfvaR5f55mrdmS-jQiiyO1gF2lA";
const SHEET_URL = `https://opensheet.elk.sh/${SHEET_ID}/Sheet1`;

let products = [];

const list = document.getElementById("product-list");
const loader = document.getElementById("loader");
const searchInput = document.getElementById("search");
const categoryFilter = document.getElementById("categoryFilter");
const sortSelect = document.getElementById("sort");

fetch(SHEET_URL)
    .then(res => res.json())
    .then(data => {
        products = data;
        loader.style.display = "none";
        populateCategories();
        render(products);
    });

function populateCategories() {
    const categories = [...new Set(products.map(p => p.category))];
    categories.forEach(c => {
        const opt = document.createElement("option");
        opt.value = c;
        opt.textContent = c;
        categoryFilter.appendChild(opt);
    });
}

function render(data) {
    list.innerHTML = "";
    data.forEach(p => {
        const tags = p.tags.split(",").map(t => `<span class="tag">${t.trim()}</span>`).join("");
        list.innerHTML += `
      <div class="product-card">
        <img src="${p.image_url}">
        <h3>${p.name}</h3>
        <p>${p.short_desc}</p>
        <p>⭐ ${p.rating}</p>
        ${tags}
        <div class="buttons">
          <button class="view-btn" onclick="viewProduct('${p.id}')">View</button>
          <a href="${p.gumroad_link}" target="_blank">
            <button class="buy-btn">Buy</button>
          </a>
        </div>
      </div>
    `;
    });
}

function applyFilters() {
    let filtered = [...products];

    if (searchInput.value)
        filtered = filtered.filter(p =>
            p.name.toLowerCase().includes(searchInput.value.toLowerCase())
        );

    if (categoryFilter.value)
        filtered = filtered.filter(p => p.category === categoryFilter.value);

    if (sortSelect.value === "rating")
        filtered.sort((a, b) => b.rating - a.rating);

    if (sortSelect.value === "price_low")
        filtered.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));

    if (sortSelect.value === "price_high")
        filtered.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));

    render(filtered);
}

searchInput.oninput = applyFilters;
categoryFilter.onchange = applyFilters;
sortSelect.onchange = applyFilters;

function viewProduct(id) {
    window.location.href = `product.html?id=${id}`;
}
