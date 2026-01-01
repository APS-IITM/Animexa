const SHEET_ID = "1r0sIGtTOQ4Qmko_syfvaR5f55mrdmS-jQiiyO1gF2lA";
const SHEET_NAME = "Products"; // <-- Same tab
const SHEET_URL = `https://opensheet.elk.sh/${SHEET_ID}/${SHEET_NAME}`;

const params = new URLSearchParams(window.location.search);
const id = params.get("id");
const type = params.get("type");

document.getElementById("back").href = `index.html?type=${type}`;

fetch(SHEET_URL)
  .then(res => res.json())
  .then(data => {
    const p = data.find(x => x.id === id);
    if (!p) return;

    document.getElementById("product").innerHTML = `
      <div class="product-box">
        <img src="${p.image_url}">
        <h1>${p.name}</h1>
        <p>${p.full_desc}</p>
        <p>⭐ ${p.rating}</p>
        <h2>${p.price}</h2>
        <a href="${p.gumroad_link}" target="_blank">
          <button class="buy-now">Buy Now</button>
        </a>
      </div>
    `;
  });
