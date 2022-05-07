const express = require('express');
const mongoose = require('mongoose');
const session = require("express-session");
const redis = require("redis");

const { 
    MONGO_USER, 
    MONGO_PASSWORD, 
    MONGO_IP,
    MONGO_PORT,
    REDIS_URL,
    REDIS_PORT,
    SESSION_SECRET
} = require('./config/config');

let RedisStore = require("connect-redis")(session);
let redisClient = redis.createClient({
    host: REDIS_URL,
    port: REDIS_PORT
})

const authRouter = require("./routes/userRoutes");
const postRouter = require("./routes/postRoutes"); 

const app = express();

const mongoURL = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}/?authSource=admin`; 

const connectWithRetry = () => {
    mongoose
        .connect(mongoURL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        .then(() => console.log('Succesfully connected to DB'))
        .catch((e) => {
            console.log(e);
            setTimeout(connectWithRetry, 3000);
        });
};

connectWithRetry();

app.enable("trust proxy");

app.use(session({
    store: new RedisStore({ client: redisClient }),
    secret: SESSION_SECRET,
    cookie: {
        secure: false,
        resave: false,
        saveUninitialized: false,
        httpOnly: true,
        maxAge: 60000
    }
}));

app.use(express.json());

app.get('/', (req, res) => {
    res.send("<h2>Hi</h2>");
}); 

app.use("/api/v1/users", authRouter);
app.use("/api/v1/posts", postRouter);

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`listening on ${port}`));
