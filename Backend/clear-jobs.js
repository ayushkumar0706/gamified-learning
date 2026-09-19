require('dotenv').config();
const mongoose = require('mongoose');
const Job = require('./Models/job');

async function clearJobs() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    await Job.deleteMany({});
    console.log('Successfully cleared all dummy jobs from the database.');
    process.exit(0);
  } catch (error) {
    console.error('Error clearing jobs:', error);
    process.exit(1);
  }
}

clearJobs();
