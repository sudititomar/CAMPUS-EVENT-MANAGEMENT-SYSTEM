const express   = require('express');
const dotenv    = require('dotenv');
const cors      = require('cors');
const path      = require('path');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// ✅ Serve frontend (OUTSIDE backend)
app.use(express.static(path.join(__dirname, '../frontend')));

// ✅ API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/events', require('./routes/events'));
app.use('/api/registrations', require('./routes/registrations'));

// ✅ Open login page on root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend', 'login.html'));
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});