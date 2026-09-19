require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./Models/user');

async function checkSeniors() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const seniors = await User.find({ role: 'senior' });
    console.log(`Found ${seniors.length} users with role 'senior'.`);
    if (seniors.length > 0) {
      console.log('Senior Names:', seniors.map(s => s.firstName + ' ' + s.lastName).join(', '));
    }
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}
checkSeniors();
