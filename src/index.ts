import express from 'express';
import mongoose from 'mongoose';

const config = require('./config');

const app = express();
config.express(app);
config.routes(app);

const {appPort, mongoUri} = config.app;


mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
}).then(() => {
    app.listen(appPort, () => {
        console.log(`Server started: http://localhost:${appPort}`);
    });
}).catch(err => console.log(err));
