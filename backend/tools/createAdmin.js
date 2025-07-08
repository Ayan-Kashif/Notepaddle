// tools/createAdmin.js
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Admin = require('../models/Admin');


const createAdmin = async () => {
  await mongoose.connect("mongodb://localhost:27017/notepadle");

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
