require('dotenv').config();
const express = require('express');
const cors = require('cors');
const dotenv = require("dotenv");
const morgan = require('morgan');
const routes = require('./routes');

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Load environment variables
dotenv.config();

const allowlist = (process.env.URL_ORIGIN || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

// Middleware
app.use(
  cors({
    origin: (origin, cb) => {
      // allow requests with no origin (Postman, curl)
      if (!origin) return cb(null, true);

      if (allowlist.includes(origin)) return cb(null, true);

      return cb(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.options("*", cors()); // รองรับ preflight


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
