const ERROR_TYPE_RESPONSES = {
  'pairing_failure': { status: 400, message: 'Unable to generate valid pairings due to match constraints.' },
};

exports.successResponse = (res, message, data) => {
  res.status(200).json({ message, data });
};

exports.errorResponse = (error, req, res, next) => {
  const errorResponse = ERROR_TYPE_RESPONSES[error.type] || {};
  const status = errorResponse.status || error.status || 500;
  const message = errorResponse.message || error.message || 'Something went wrong on the server.';

  res.status(status).send({ status, message });
};
