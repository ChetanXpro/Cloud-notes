const errorHandler = (err, req, res, next) => {
  console.log(err.stack);

  const status = res.statusCode ? res.statusCode : 500;

  res.status(status);

  res.json({ message: err.message });
};

export default errorHandler;
