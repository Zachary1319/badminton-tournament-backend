function errorMiddleware(error, req, res, next) {
  let status = error.status || 500;
  let message = error.message || 'Something went wrong on the server.';

  if (error.type === 'pairing_failure') {
    status = 400;
    message = 'Unable to generate valid pairings due to match constraints.';
  }

  res.status(status).send({
    status,
    message,
  });
}
module.exports = errorMiddleware;

