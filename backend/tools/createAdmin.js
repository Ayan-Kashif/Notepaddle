// tools/createAdmin.js
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Admin = require('../models/Admin');
require('dotenv').config({ path: '../.env' });

const createAdmin = async () => {
  await mongoose.connect(process.env.MONGO_URI);

  const hashedPassword = await bcrypt.hash('admin123', 10);

  const admin = new Admin({
    name: 'admin',
    email: 'admin@notepaddle.com',
    password: hashedPassword
  });

  await admin.save();
  console.log('Admin created');
  process.exit();
};

createAdmin();
