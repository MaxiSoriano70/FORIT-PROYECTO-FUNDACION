const errorHandler = (err, req, res, next) => {
    console.error(err);
    const message = err.message || 'Server Error';
    const status = err.status || 500;

    res.status(status).json({
        error: message,
        method: req.method,
        url: req.url
    });
}

export default errorHandler;