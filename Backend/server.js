const express = require("express");
const fetch = require("node-fetch");
const FormData = require("form-data");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config();
const app = express();
const PORT = process.env.PORT || 5000;
const PAINEL = process.env.PAINEL || 5000;


// Middlewares
app.use(cors());
app.use(express.json());

// MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Ligado ao MongoDB Atlas"))
  .catch((err) => console.error("Erro na ligação ao MongoDB:", err));

app.post("/api/upload-image", async (req, res) => {
  try {
    const { imageBase64 } = req.body;

    const formData = new FormData();
    formData.append("image", imageBase64);
    const headers = formData.getHeaders();

    const response = await fetch(
      `https://api.imgbb.com/1/upload?key=${process.env.IMGBB_API_KEY}`,
      {
        method: "POST",
        headers,
        body: formData,
      }
    );

    const data = await response.json();
    res.json({ url: data.data.url });
  } catch (err) {
    console.error("Erro ao enviar imagem:", err);
    res.status(500).json({ error: "Erro no upload da imagem." });
  }
});

// Modelo de Link
const Link = mongoose.model(
  "Link",
  new mongoose.Schema({
    title: String,
    url: String,
    createdAt: { type: Date, default: Date.now },
  })
);

const UserProfile = mongoose.model(
  "UserProfile",
  new mongoose.Schema({
    name: String,
    imageUrl: String,
    bio: String,
  })
);

// Criar ou atualizar perfil
app.post('/api/perfil', async (req, res) => {
  const { name, imageUrl, bio } = req.body;

  let perfil = await UserProfile.findOne(); // Considera apenas um perfil
  if (perfil) {
    perfil.name = name || perfil.name;
    perfil.imageUrl = imageUrl || perfil.imageUrl;
    perfil.bio = bio || perfil.bio;
    await perfil.save();
  } else {
    perfil = new UserProfile({ name, imageUrl, bio });
    await perfil.save();
  }

  res.json(perfil);
});

// Obter perfil
app.get('/api/perfil', async (req, res) => {
  const perfil = await UserProfile.findOne();
  res.json(perfil);
});

// API (Criar, Ler, Atualizar, Apagar Links)
app.get("/api/links", async (req, res) => {
  const links = await Link.find();
  res.json(links);
});

app.post("/api/links", async (req, res) => {
  const { title, url } = req.body;
  const novoLink = new Link({ title, url });
  await novoLink.save();
  res.status(201).json(novoLink);
});

app.put("/api/links/:id", async (req, res) => {
  const { title, url } = req.body;
  const linkAtualizado = await Link.findByIdAndUpdate(
    req.params.id,
    { title, url },
    { new: true }
  );
  res.json(linkAtualizado);
});

app.delete("/api/links/:id", async (req, res) => {
  await Link.findByIdAndDelete(req.params.id);
  res.json({ message: "Link apagado com sucesso." });
});

// Servir os ficheiros do frontend

// Caminho absoluto para /public
const publicPath = path.join(__dirname, "public");

// ROTAS EXPLÍCITAS PRIMEIRO
app.get("/painel.html", (req, res) => {
  res.sendFile(path.join(publicPath, "painel.html"));
});

// Depois, servir o resto da pasta public
app.use(express.static(publicPath));

// Rota principal (fallback para o site principal)
app.get("/", (req, res) => {
  res.sendFile(path.join(publicPath, "index.html"));
});

// Start
app.listen(PORT, () =>
  console.log(
    `🚀 Servidor a correr em http://localhost:${PORT} e o Painel em http://localhost:${PAINEL}/painel.html`
  )
);
