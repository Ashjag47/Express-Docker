const express = require('express');
const mongoose = require('mongoose');
const { MONGO_PASSWORD, MONGO_USER, MONGO_IP, MONGO_PORT, SESSION_SECRET, REDIS_URL, REDIS_PORT} = require('./config/config');

const session = require('express-session');
const {createClient} = require('redis');
const RedisStore = require('connect-redis').default;

let redisClient = createClient({
    url: `redis://${REDIS_URL}:${REDIS_PORT}`,
});

redisClient.connect().catch(console.error);
const redisStore = new RedisStore({
    client: redisClient,
    prefix: "Sess:",
  });

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

app.use(session({
    store: redisStore,
    secret: SESSION_SECRET,
    cookie: {
        secure: false,
        resave: false,
        saveUninitialized: false,
        httpOnly: true,
        maxAge: 300000,
    },
}));

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/posts', postRouter);

app.listen(port, () => console.log(`Example app listening on http://localhost:${port}`));

