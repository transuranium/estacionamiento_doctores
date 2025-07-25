const spots = document.querySelectorAll(".spot");
const modal = document.getElementById("modal");

const phoneInput = document.getElementById("phoneInput");
const brandInput = document.getElementById("brandInput");
const colorInput = document.getElementById("colorInput");
const officeInput = document.getElementById("officeInput");
const nameInput = document.getElementById("nameInput");
const commentInput = document.getElementById("commentInput");

let currentSpotId = null;

function openModal(spotId) {
  currentSpotId = spotId;
  const data = JSON.parse(localStorage.getItem(spotId)) || {};

  phoneInput.value = data.phone || "";
  brandInput.value = data.brand || "";
  colorInput.value = data.color || "#2b2b2b";
  officeInput.value = data.office || "";
  nameInput.value = data.name || "";
  commentInput.value = data.comment || "";

  document.getElementById("modal-title").innerText = `Editar lugar ${spotId}`;
  modal.classList.remove("hidden");
}

function closeModal() {
  modal.classList.add("hidden");
}

function save() {
  const data = {
    phone: phoneInput.value,
    brand: brandInput.value,
    color: colorInput.value,
    office: officeInput.value,
    name: nameInput.value,
    comment: commentInput.value
  };
  localStorage.setItem(currentSpotId, JSON.stringify(data));
  renderSpots();
  closeModal();
}

function remove() {
  localStorage.removeItem(currentSpotId);
  renderSpots();
  closeModal();
}

function renderSpots() {
  spots.forEach(spot => {
    const id = spot.dataset.id;
    const data = JSON.parse(localStorage.getItem(id)) || {};

    spot.innerHTML = `${id}`;

    // Цвет фона и текста
    if (data.color && data.color !== "#dddddd") {
      spot.style.backgroundColor = data.color;
      spot.style.color = "#ffffff";
    } else {
      spot.style.backgroundColor = "#2b2b2b";
      spot.style.color = "#ffffff";
    }

    if (data.phone) {
      const link = `https://wa.me/${data.phone.replace(/\D/g, '')}`;
      spot.innerHTML += `<br><a href="${link}" target="_blank">WhatsApp</a>`;
    }
    if (data.brand) spot.innerHTML += `<br><small>${data.brand}</small>`;
    if (data.office) spot.inner
