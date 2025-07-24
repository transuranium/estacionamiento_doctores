const spots = document.querySelectorAll(".spot");
const modal = document.getElementById("modal");
const nameInput = document.getElementById("nameInput");
const phoneInput = document.getElementById("phoneInput");
const commentInput = document.getElementById("commentInput");
let currentSpotId = null;

function openModal(spotId) {
  currentSpotId = spotId;
  const data = JSON.parse(localStorage.getItem(spotId)) || {};
  nameInput.value = data.name || "";
  phoneInput.value = data.phone || "";
  commentInput.value = data.comment || "";
  document.getElementById("modal-title").innerText = `Editar lugar ${spotId}`;
  modal.classList.remove("hidden");
}

function closeModal() {
  modal.classList.add("hidden");
}

function save() {
  const data = {
    name: nameInput.value,
    phone: phoneInput.value,
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
    if (data.name) spot.innerHTML += `<br><strong>${data.name}</strong>`;
    if (data.comment) spot.innerHTML += `<br><small>${data.comment}</small>`;
    if (data.phone) {
      const link = `https://wa.me/${data.phone.replace(/\D/g, '')}`;
      spot.innerHTML += `<br><a href="${link}" target="_blank">WhatsApp</a>`;
    }
  });
}

spots.forEach(spot => {
  spot.addEventListener("click", () => openModal(spot.dataset.id));
});

renderSpots();