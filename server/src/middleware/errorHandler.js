const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';

  console.error(err.message);

  res.status(statusCode).json({
    success: false,
    message,
  });
};

export default errorHandler;
