const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const PAINEL = process.env.PAINEL || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Ligado ao MongoDB Atlas'))
  .catch(err => console.error('Erro na ligação ao MongoDB:', err));

// Modelo de Link
const Link = mongoose.model('Link', new mongoose.Schema({
  title: String,
  url: String,
  createdAt: { type: Date, default: Date.now }
}));

// API (Criar, Ler, Atualizar, Apagar Links)
app.get('/api/links', async (req, res) => {
  const links = await Link.find();
  res.json(links);
});

app.post('/api/links', async (req, res) => {
  const { title, url } = req.body;
  const novoLink = new Link({ title, url });
  await novoLink.save();
  res.status(201).json(novoLink);
});

app.put('/api/links/:id', async (req, res) => {
  const { title, url } = req.body;
  const linkAtualizado = await Link.findByIdAndUpdate(req.params.id, { title, url }, { new: true });
  res.json(linkAtualizado);
});

app.delete('/api/links/:id', async (req, res) => {
  await Link.findByIdAndDelete(req.params.id);
  res.json({ message: 'Link apagado com sucesso.' });
});

// Servir os ficheiros do frontend

// Caminho absoluto para /public
const publicPath = path.join(__dirname, 'public');

// ROTAS EXPLÍCITAS PRIMEIRO
app.get('/painel.html', (req, res) => {
  res.sendFile(path.join(publicPath, 'painel.html'));
});

// Depois, servir o resto da pasta public
app.use(express.static(publicPath));

// Rota principal (fallback para o site principal)
app.get('/', (req, res) => {
  res.sendFile(path.join(publicPath, 'index.html'));
});

// Start
app.listen(PORT, () =>
  console.log(`🚀 Servidor a correr em http://localhost:${PORT} e o Painel em http://localhost:${PAINEL}/painel.html`)
);
