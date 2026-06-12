"use strict";

require('dotenv').config();

var express = require('express');

var cors = require('cors');

var morgan = require('morgan');

var mongoose = require('mongoose');

var app = express(); // ── Middleware ──

app.use(cors({
  origin: 'http://localhost:4200',
  credentials: true
}));
app.use(express.json());
app.use(morgan('dev')); // ── Database ──

mongoose.connect(process.env.MONGODB_URI).then(function () {
  return console.log('✅ MongoDB connected:', process.env.MONGODB_URI);
})["catch"](function (err) {
  console.error('❌ MongoDB connection error:', err);
  process.exit(1);
}); // ── Routes ──

app.use('/api/auth', require('./routes/auth'));
app.use('/api/students', require('./routes/students'));
app.use('/api/rooms', require('./routes/rooms'));
app.use('/api/fees', require('./routes/fees'));
app.use('/api/complaints', require('./routes/complaints'));
app.use('/api/notices', require('./routes/notices'));
app.use('/api/visitors', require('./routes/visitors'));
app.use('/api/mess', require('./routes/mess'));
app.use('/api/dashboard', require('./routes/dashboard')); // ── Health check ──

app.get('/api/health', function (req, res) {
  return res.json({
    status: 'OK',
    time: new Date()
  });
}); // ── 404 ──

app.use(function (req, res) {
  return res.status(404).json({
    message: 'Route not found'
  });
}); // ── Error handler ──

app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).json({
    message: err.message || 'Internal Server Error'
  });
});
var PORT = process.env.PORT || 3000;
app.listen(PORT, function () {
  return console.log("\uD83D\uDE80 ResidenceX API running on http://localhost:3000");
});
//# sourceMappingURL=server.dev.js.map
