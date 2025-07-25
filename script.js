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
  colorInput.value = data.color || "#dddddd";
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
    comment: commentInput.value,
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
  spots.forEach((spot) => {
    const id = spot.dataset.id;
    const data = JSON.parse(localStorage.getItem(id)) || {};

    spot.innerHTML = `${id}`;
    spot.style.backgroundColor = data.color || "#ddd";

    if (data.phone) {
      const link = `https://wa.me/${data.phone.replace(/\D/g, "")}`;
      spot.innerHTML += `<br><a href="${link}" target="_blank">WhatsApp</a>`;
    }
    if (data.brand) spot.innerHTML += `<br><small>${data.brand}</small>`;
    if (data.office) spot.innerHTML += `<br><small>${data.office}</small>`;
    if (data.name) spot.innerHTML += `<br><strong>${data.name}</strong>`;
    if (data.comment) spot.innerHTML += `<br><small>${data.comment}</small>`;
  });
}

spots.forEach((spot) => {
  spot.addEventListener("click", () => openModal(spot.dataset.id));
});

renderSpots();
