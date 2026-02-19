require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const routes = require('./routes');

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.get('/', (req, res) => {
  // const port = process.env.PORT || 4000;
  return res.json({ message: `API running on port` });
});

app.get('/health', (req, res) => {
  return res.json({ status: 'ok' });
});

app.use('/api', routes);

app.use((err, req, res, next) => {
  console.error(err);
  return res.status(500).json({ message: 'Server error' });
});

module.exports = app;
