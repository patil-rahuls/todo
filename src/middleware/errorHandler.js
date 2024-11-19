import '../config/dotenv.js';

// for unidentified routes access by client
const notFound = (req, res, next) => {
  const error = new Error(`Requested resource/method not found. Please check ReadMe for APIs.`);
  res.status(404);
  next(error);
};

// error middleware for our app.
const errorHandler = (err, req, res, next) => {
  const status = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(status);
  res.json({
    success: false,
    msg: err?.message,
    ...(process.env.ENV === 'DEV' ? {stack: err?.stack} : {})
  });
};

export { notFound, errorHandler };
