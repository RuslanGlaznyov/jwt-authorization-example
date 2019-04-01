const express= require('express');
const bodyParser = require('body-parser');
const logger = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');

const config = require('./config');
const errorHandler = require('./utils/errorHandler/index');
const { NotFoundError } = require('./utils/errorHandler/errors/index');

const routes = require('./routes');
const swaggerDoc = require('./swagger/swaggerDoc');


const app = express();

app.use(cors());

app.set('json spaces', 2);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


//can add context model, for example db
    // const user = {
    //     firstName: 'hui',
    //     lastName: 'hui'
    // };
    // //middleware for tests some sheet
    // app.use((req, res, next) => {
    //    req.sheet = {
    //        user: user
    //    };
    //
    //    next();
    // });




mongoose.connect(config.MONGO_URL, { useNewUrlParser: true, useCreateIndex: true, });
mongoose.connection.on('error', (err) => {
    console.error(`MongoDB connection error: ${err}`);
    throw new Error(`Unable to connect to MongoDB; connection error "${err}"`);
});

//set development mode
if(process.env.NODE_ENV === 'development') {
    mongoose.set('debug', true);
    app.use(logger('dev'));
    swaggerDoc(app);
}


//include routes
routes(app);

app.use((req, res, next) => {
    next(new NotFoundError());
});

app.use(errorHandler);

app.listen(config.PORT,
    () => console.log(`Express server listening on ${config.PORT}!`));

module.exports = app;