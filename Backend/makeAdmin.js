require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./Models/user');

const emailToPromote = process.argv[2];

if (!emailToPromote) {
  console.log('Please provide an email: node makeAdmin.js <email>');
  process.exit(1);
}

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    const user = await User.findOneAndUpdate(
      { email: emailToPromote },
      { role: 'admin' },
      { new: true }
    );
    
    if (user) {
      console.log(`Successfully promoted ${user.email} to admin!`);
    } else {
      console.log(`Could not find a user with email ${emailToPromote}`);
    }
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
