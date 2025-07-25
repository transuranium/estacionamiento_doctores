const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());

const TOKEN = "7881160930:AAE6VCnfS9LAiQImDyJsmjUbMbRcFdlQXT4";
const CHAT_ID = "221555421";

app.post("/notify", async (req, res) => {
  const d = req.body;

  const msg = `
📍 Lugar ${d.spot}

👤 ${d.name}
📞 WhatsApp: https://wa.me/${d.phone.replace(/\D/g, "")}
🚗 Marca: ${d.brand}
🏢 Consultorio: ${d.office}
📝 ${d.comment}
🎨 Color: ${d.color}
  `;

  try {
    await axios.post(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
      chat_id: CHAT_ID,
      text: msg,
    });
    res.sendStatus(200);
  } catch (e) {
    console.error("❌ Ошибка при отправке:", e.message);
    res.sendStatus(500);
  }
});

app.listen(3000, () => {
  console.log("✅ Сервер запущен на http://localhost:3000");
});
