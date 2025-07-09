const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
const listEndpoints = require('express-list-endpoints');

// require('dotenv').config();
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
console.log("Connecting to MongoDB URI:", process.env.MONGO_URI);
const guestRoutes = require('./routes/guestRoutes')
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin')
console.log(">> Admin routes object:", adminRoutes);

const userRoutes = require('./routes/userRoutes')
const app = express();
console.log(">> Routes:");
console.log(listEndpoints(app));
console.log('>> Routes imported:');
console.log('authRoutes:', typeof authRoutes, authRoutes?.stack?.length);
console.log('adminRoutes:', typeof adminRoutes, adminRoutes?.stack?.length);
console.log('userRoutes:', typeof userRoutes, userRoutes?.stack?.length);

const errorHandler = require('./middleware/errorHandler')
app.use(cors());
app.use(express.json());
// Serve static files from uploads directory
app.use('/uploads', express.static('/var/www/Notepaddle/uploads'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/guests', guestRoutes);
console.log("Admin routes mounted");
app.get('/ping', (req, res) => res.send('pong'));

app.use(errorHandler)
const PORT = process.env.PORT || 4000;
app.post('/test', (req, res) => {
  try {
    console.log('✅ POST /test hit');
    console.log('🔍 Headers:', req.headers);

    let bodyData = '';
    req.on('data', chunk => {
      bodyData += chunk.toString();
    });

    req.on('end', () => {
      console.log('📦 Raw Body:', bodyData);

      // Attempt to parse
      try {
        const parsed = JSON.parse(bodyData);
        console.log('✅ Parsed body:', parsed);
        res.json({ success: true, data: parsed });
      } catch (jsonErr) {
        console.error('❌ JSON Parse Error:', jsonErr.message);
        res.status(400).json({ success: false, error: 'Invalid JSON' });
      }
    });

  } catch (err) {
    console.error('🔥 General Error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});
app.use((err, req, res, next) => {
  console.error('💥 UNCAUGHT ERROR:', err.stack || err);
  res.status(500).json({ success: false, error: err.message });
});

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => {
        console.log('MongoDB Connected');
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    })
    .catch(err => console.log(err));
