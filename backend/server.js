require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');

const app = express();

// ── Middleware ──
app.use(cors({ origin: 'http://localhost:4200', credentials: true }));
app.use(express.json());
app.use(morgan('dev'));

// ── Database ──
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB connected:', process.env.MONGODB_URI))
  .catch(err => { console.error('❌ MongoDB connection error:', err); process.exit(1); });

// ── Routes ──
app.use('/api/auth',       require('./routes/auth'));
app.use('/api/students',   require('./routes/students'));
app.use('/api/rooms',      require('./routes/rooms'));
app.use('/api/fees',       require('./routes/fees'));
app.use('/api/complaints', require('./routes/complaints'));
app.use('/api/notices',    require('./routes/notices'));
app.use('/api/visitors',   require('./routes/visitors'));
app.use('/api/mess',       require('./routes/mess'));
app.use('/api/dashboard',  require('./routes/dashboard'));

// ── Health check ──
app.get('/api/health', (req, res) => res.json({ status: 'OK', time: new Date() }));

// ── 404 ──
app.use((req, res) => res.status(404).json({ message: 'Route not found' }));

// ── Error handler ──
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message || 'Internal Server Error' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 ResidenceX API running on http://localhost:3000`));
