require('dotenv').config();

const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');

const tareasRouter = require('./routes/tareas');
const climaRouter = require('./routes/clima');

const app = express();

app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

app.get('/api/salud', (req, res) => {
  res.status(200).json({
    status: 'ok'
  });
});

app.use('/api/tareas', tareasRouter);
app.use('/api/clima', climaRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});