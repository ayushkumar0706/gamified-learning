const express = require('express');
require('dotenv').config();
const cookieParser = require('cookie-parser');
const connectDB = require('./config/database');

const authRouter = require('./routes/authRoutes');
const topicRouter = require('./routes/topicRoutes');
const levelRouter = require('./routes/levelRoutes');
const videoResourceRouter = require('./routes/videoRoutes'); 

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRouter);
app.use('/api/topics', topicRouter);
app.use('/api/levels', levelRouter);
app.use('/api/videoresources', videoResourceRouter); 



async function startServer(){
    await connectDB();

    app.listen(process.env.PORT, ()=>{
        console.log(`Server is running at PORT: ${process.env.PORT}`);
    })
}

startServer();
