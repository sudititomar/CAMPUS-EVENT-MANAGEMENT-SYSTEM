const express   = require('express');
const dotenv    = require('dotenv');
const cors      = require('cors');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();

// ── CORS: must be FIRST before everything else ──
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth',require('./routes/auth'));
app.use('/api/events',require('./routes/events'));
app.use('/api/registrations', require('./routes/registrations'));

app.get('/', (req, res) => res.send('Campus Event API running'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port http://localhost:${PORT}`));