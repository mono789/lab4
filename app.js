const express = require('express');
const app = express();
const PORT = 3001;

app.get('/', (req, res) => {
  res.send('¡Hola desde Docker! Laboratorio 4 - UDEA 2026');
});

app.get('/suma', (req, res) => {
  const a = Number(req.query.a) || 0;
  const b = Number(req.query.b) || 0;
  res.json({ operacion: 'suma', a, b, resultado: a + b });
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en puerto ${PORT}`);
});