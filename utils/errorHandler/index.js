const _ = require('lodash');

module.exports = (err, req, res, next) => {
    const error = err;
    if (error instanceof SyntaxError) {
        error.message = 'Invalid JSON';
        error.status = 400;
    }

    if (!error.status && !error.statusCode) {
        error.status = 500;
    }

    const errorMessage = error.name !== 'StatusCodeError' ? error.message : error.error.error.message;

    if (_.includes([400, 403, 404, 406], error.status)) console.warn(errorMessage);
    else {
        //if development mode, console all error message
        if(process.argv[2] === 'dev')
            console.log(error);
        console.error(error.originMessage || errorMessage);
    }

    // return the error
    res.status(error.status);
    res
        .json({
            success: false,
            message: errorMessage,
        })
        .end();


    next();
};