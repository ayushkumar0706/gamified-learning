const mongoose = require('mongoose');
require('dotenv').config();
const Quiz = require('./Models/quiz');

mongoose.connect(process.env.MONGO_URI).then(async () => {
    const res = await Quiz.updateMany(
        { status: { $exists: false } },
        { $set: { status: 'published' } }
    );
    console.log('Migration complete:', res);
    process.exit(0);
}).catch(console.error);
