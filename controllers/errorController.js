const ErrorProvider = require("../classes/ErrorProvider");
const { JsonWebTokenError, TokenExpiredError } = require("jsonwebtoken");

const uniqueError = (err) => {
  if (
    err.keyPattern.hasOwnProperty("username") ||
    err.keyPattern.hasOwnProperty("email")
  )
    return new ErrorProvider(409, "fail", "This user already exists.");

  if (err.keyPattern.hasOwnProperty("music"))
    return new ErrorProvider(409, "fail", "This music already exists.");

  return new ErrorProvider(409, "fail", err.message);
};

const validationError = (err) => {
  const messages = err.message.split(",");

  const message = messages
    .map((message, index) => message.split(":").at(index === 0 ? 2 : 1))
    .join("")
    .trim();

  return new ErrorProvider(403, "fail", message);
};

module.exports = (err, req, res, next) => {
  if (process.env.NODE_ENV === "production") {
    if (err.code === 11000) err = uniqueError(err);
    if (err.name === "ValidationError") err = validationError(err);

    if (err instanceof JsonWebTokenError)
      err = new ErrorProvider(
        401,
        "fail",
        "Authentication failed. Please log in."
      );

    if (err instanceof TokenExpiredError)
      err = new ErrorProvider(
        401,
        "fail",
        "Authorization expired. Please log in again."
      );
  }

  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });

  next();
};
