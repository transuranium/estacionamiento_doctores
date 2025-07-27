/*
 * Lógica para la aplicación "Estacionamiento para doctores".
 *
 * Este script controla la interacción con la cuadrícula de
 * estacionamiento, el almacenamiento de datos en localStorage y el
 * envío de notificaciones a Igor mediante la API de Telegram.  Los
 * usuarios pueden guardar información en cada plaza, enviar los
 * datos a Igor y eliminar registros cuando ya no sean necesarios.  También
 * se gestiona el envío de mensajes anónimos desde el formulario situado
 * al final de la página.
 */

// Parámetros del bot de Telegram proporcionados por Igor.  El token
// identifica al bot y el chat ID especifica el destinatario (Igor).
const TELEGRAM_BOT_TOKEN = "7881160930:AAE6VCnfS9LAiQImDyJsmjUbMbRcFdlQXT4";
const TELEGRAM_CHAT_ID = "221555421";

// Selección de elementos del DOM
const cells = document.querySelectorAll(".parking-grid .cell");
const modal = document.getElementById("modal");
const modalTitle = document.getElementById("modal-title");
const nameInput = document.getElementById("input-name");
const phoneInput = document.getElementById("input-phone");
const brandInput = document.getElementById("input-brand");
const colorInput = document.getElementById("input-color");
const saveBtn = document.getElementById("save-btn");
const sendBtn = document.getElementById("send-btn");
const deleteBtn = document.getElementById("delete-btn");
const cancelBtn = document.getElementById("cancel-btn");
const anonymousTextarea = document.getElementById("anonymous-message");
const anonymousBtn = document.getElementById("anonymous-send-btn");

// Variable para rastrear la plaza actualmente en edición
let currentSpot = null;

/**
 * Mostrar el modal para la plaza seleccionada.  Se cargan los datos
 * almacenados previamente (si existen) desde localStorage.
 *
 * @param {string} spotId Identificador de la plaza (p. ej. "A1")
 */
function openModal(spotId) {
  currentSpot = spotId;
  modalTitle.textContent = `Editar lugar ${spotId}`;
  // Cargar datos guardados
  const data = JSON.parse(localStorage.getItem(`spot-${spotId}`) || "{}");
  nameInput.value = data.name || "";
  phoneInput.value = data.phone || "";
  brandInput.value = data.brand || "";
  colorInput.value = data.color || "#2b2b2b";
  modal.classList.remove("hidden");
}

/**
 * Oculta el modal.
 */
function closeModal() {
  modal.classList.add("hidden");
}

/**
 * Actualiza la cuadrícula de estacionamiento en función de los datos
 * almacenados en localStorage.  Si una plaza tiene información
 * asociada, se muestra el nombre y la marca, y el fondo se colorea
 * utilizando el valor de color guardado.
 */
function updateGrid() {
  cells.forEach((cell) => {
    const spotId = cell.dataset.spot;
    const data = JSON.parse(localStorage.getItem(`spot-${spotId}`) || "{}");
    // Determinar si la plaza está vacía
    const hasData = data && (data.name || data.phone || data.brand || data.color);
    if (hasData) {
      cell.style.backgroundColor = data.color || "#2b2b2b";
      // Construir contenido: identificador + nombre + marca
      let html = `<strong>${spotId}</strong>`;
      if (data.name) {
        html += `<small>${data.name}</small>`;
      }
      if (data.brand) {
        html += `<small>${data.brand}</small>`;
      }
      cell.innerHTML = html;
    } else {
      cell.style.backgroundColor = "#2b2b2b";
      cell.innerHTML = spotId;
    }
  });
}

// Asignar manejadores de clic a cada celda de la cuadrícula
cells.forEach((cell) => {
  cell.addEventListener("click", () => openModal(cell.dataset.spot));
});

// Guardar los datos introducidos para la plaza actual
saveBtn.addEventListener("click", () => {
  if (!currentSpot) return;
  const record = {
    name: nameInput.value.trim(),
    phone: phoneInput.value.trim(),
    brand: brandInput.value.trim(),
    color: colorInput.value,
  };
  localStorage.setItem(`spot-${currentSpot}`, JSON.stringify(record));
  updateGrid();
  closeModal();
});

// Eliminar el registro de la plaza actual
deleteBtn.addEventListener("click", () => {
  if (!currentSpot) return;
  localStorage.removeItem(`spot-${currentSpot}`);
  updateGrid();
  closeModal();
});

// Cancelar la edición (cerrar modal sin guardar cambios)
cancelBtn.addEventListener("click", () => {
  closeModal();
});

// Enviar los datos de la plaza actual a Igor via Telegram
sendBtn.addEventListener("click", () => {
  if (!currentSpot) return;
  const data = {
    spot: currentSpot,
    name: nameInput.value.trim(),
    phone: phoneInput.value.trim(),
    brand: brandInput.value.trim(),
    color: colorInput.value,
  };
  const message =
    `🚗 Registro de estacionamiento:\n` +
    `Lugar: ${data.spot}\n` +
    `Nombre: ${data.name || ""}\n` +
    `Teléfono: ${data.phone || ""}\n` +
    `Marca: ${data.brand || ""}\n` +
    `Color: ${data.color || ""}`;
  const url =
    `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage?chat_id=${TELEGRAM_CHAT_ID}&text=${encodeURIComponent(
      message
    )}`;
  // Realiza la petición; el modo no‑cors evita errores de CORS, pero no
  // permite leer la respuesta.  Se muestra un aviso de éxito sin
  // comprobar el resultado.
  fetch(url, { method: "GET", mode: "no-cors" })
    .catch(() => {})
    .finally(() => {
      alert("Datos enviados a Igor");
      // Guardar localmente después de enviar
      const record = {
        name: data.name,
        phone: data.phone,
        brand: data.brand,
        color: data.color,
      };
      localStorage.setItem(`spot-${currentSpot}`, JSON.stringify(record));
      updateGrid();
      closeModal();
    });
});

// Enviar mensaje anónimo a Igor
anonymousBtn.addEventListener("click", () => {
  const text = (anonymousTextarea.value || "").trim();
  if (!text) {
    alert("Por favor escribe un mensaje");
    return;
  }
  const message = `📩 Mensaje anónimo:\n${text}`;
  const url =
    `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage?chat_id=${TELEGRAM_CHAT_ID}&text=${encodeURIComponent(
      message
    )}`;
  fetch(url, { method: "GET", mode: "no-cors" })
    .catch(() => {})
    .finally(() => {
      alert("Mensaje enviado a Igor");
      anonymousTextarea.value = "";
    });
});

// Renderizar la cuadrícula al cargar la página
updateGrid();