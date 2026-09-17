const mongoose = require('mongoose');

const MAX_CONNECTION_ATTEMPTS = 5;
const RETRY_DELAY_MS = 3000;


async function connectDB() {
    for (let attempt = 1; attempt <= MAX_CONNECTION_ATTEMPTS; attempt += 1) {
        try {
            await mongoose.connect(process.env.MONGO_URI, {
                serverSelectionTimeoutMS: 10000,
            });
            console.log('MongoDB connected');
            return;
        }
        catch (err) {
            console.error(`MongoDB connection attempt ${attempt}/${MAX_CONNECTION_ATTEMPTS} failed:`, err.message);

            if (attempt < MAX_CONNECTION_ATTEMPTS) {
                await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));
            }
        }
    }

    console.error('MongoDB connection failed after several attempts. Check the Atlas URI, network access, and DNS settings.');
    process.exit(1);
}

module.exports = connectDB;