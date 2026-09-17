const express = require('express');
require('dotenv').config();
const cookieParser = require('cookie-parser');
const connectDB = require('./config/database');

const authRouter = require('./routes/authRoutes');
const topicRouter = require('./routes/topicRoutes');
const levelRouter = require('./routes/levelRoutes');
const videoResourceRouter = require('./routes/videoRoutes');
const quizRouter = require('./routes/quizRoutes');
const codingResourceRouter = require('./routes/codingRoutes');
const attemptRouter = require('./routes/attemptRoutes');
const progressRouter = require('./routes/progressRoutes');
const dashboardRouter = require('./routes/dashboardRoutes');
const userRouter = require('./routes/userRoutes');
const collegeRouter = require('./routes/collegeRoutes');
const leaderboardRouter = require('./routes/leaderboardRoutes');
const cors = require('cors')


const app = express();

app.use(express.json());
app.use(cookieParser());


app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:5174', 'https://gamified-learning-green.vercel.app'],
    credentials: true,              
}))

app.use((req, res, next) => {
    console.log(`Incoming: ${req.method} ${req.originalUrl}`);
    next();
});

app.use('/api/auth', authRouter);
app.use('/api/topics', topicRouter);
app.use('/api/levels', levelRouter);
app.use('/api/videoresources', videoResourceRouter); 
app.use('/api/quizzes', quizRouter); 
app.use('/api/coding-resources', codingResourceRouter);
app.use('/api/attempts', attemptRouter);
app.use('/api/progress', progressRouter);
app.use('/api/dashboard', dashboardRouter);
app.use('/api/users', userRouter);
app.use('/api/colleges', collegeRouter);
app.use('/api/leaderboard', leaderboardRouter);



async function startServer(){
    await connectDB();

    app.listen(process.env.PORT, ()=>{
        console.log(`Server is running at PORT: ${process.env.PORT}`);
    })
}

startServer();
