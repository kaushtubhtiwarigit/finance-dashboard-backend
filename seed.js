require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./src/models/User');

const users = [
  { name: 'Admin User',   email: 'admin@test.com',   password: 'admin123',   role: 'ADMIN'   },
  { name: 'Analyst User', email: 'analyst@test.com', password: 'analyst123', role: 'ANALYST' },
  { name: 'Viewer User',  email: 'viewer@test.com',  password: 'viewer123',  role: 'VIEWER'  },
];

const seed = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('MongoDB connected');

  for (const u of users) {
    const exists = await User.findOne({ email: u.email });
    if (exists) {
      console.log(`Skipping ${u.role} — already exists`);
      continue;
    }
    const rounds = parseInt(process.env.BCRYPT_ROUNDS) || 10;
    const password = await bcrypt.hash(u.password, rounds);
    await User.create({ ...u, password });
    console.log(`Created ${u.role}: ${u.email} / ${u.password}`);
  }

  await mongoose.disconnect();
  console.log('Done');
};

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
