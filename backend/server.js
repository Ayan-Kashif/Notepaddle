const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
const listEndpoints = require('express-list-endpoints');

// require('dotenv').config();
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
console.log("Connecting to MongoDB URI:", process.env.MONGO_URI);

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
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
console.log("Admin routes mounted");
app.get('/ping', (req, res) => res.send('pong'));

app.use(errorHandler)
const PORT = process.env.PORT || 5000;

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
