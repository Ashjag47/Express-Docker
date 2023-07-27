const express = require('express');
const mongoose = require('mongoose');
const { MONGO_PASSWORD, MONGO_USER, MONGO_IP, MONGO_PORT } = require('./config/config');

const postRouter = require('./routes/postRoutes');
const authRouter = require('./routes/authRoutes');

const app = express();

const mongoURL = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}/?authSource=admin`;
const connnectWithRetry = () => {
    mongoose
        .connect(mongoURL, {
            useNewUrlParser: true, 
            useUnifiedTopology: true,
        })
        .then(() => console.log('MongoDB Connected'))
        .catch(err => {
            console.log(err);
            setTimeout(connnectWithRetry, 5000);
        });
};

app.use(express.json());

connnectWithRetry();

const port = process.env.PORT || 3000;

app.get('/', (req, res) => res.send('Hello World!'));

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/posts', postRouter);

app.listen(port, () => console.log(`Example app listening on http://localhost:${port}`));

