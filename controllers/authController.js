const Email = require("../classes/Email");
const ErrorProvider = require("../classes/ErrorProvider");
const User = require("../models/User");
const jsonwebtoken = require("jsonwebtoken");

// * Saving & sending the token
const sendToken = (res, statusCode, user, message) => {
  const token = jsonwebtoken.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  // * Save the token
  res.cookie("jsonwebtoken", token, {
    expires: new Date(
      Date.now() + parseInt(process.env.JWT_EXPIRES_IN) * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });

  user.password = undefined;

  res.status(statusCode).json({
    status: "success",
    message,
    token,
    data: {
      user,
    },
  });
};

// * Signing
exports.signup = async (req, res, next) => {
  try {
    const user = await User.create({
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
    });

    try {
      await new Email(user, "https://spotifymern.vercel.app").sendWelcome();
    } catch (e) {
      console.error(`Email was not send: ${e}`);
    }

    sendToken(res, 201, user, "You've signed up successfully.");
  } catch (e) {
    next(e);
  }
};

// * Logging
exports.login = async (req, res, next) => {
  try {
    if (!req.body.username || !req.body.password)
      return next(
        new ErrorProvider(
          403,
          "fail",
          "Please type your @username and password."
        )
      );

    const { username } = req.body;

    const user = await User.findOne({ username }).select("+password");

    if (!user)
      return next(
        new ErrorProvider(
          404,
          "fail",
          "User not found. You can signup with that user."
        )
      );

    if (!(await user.isPasswordCorrect(req.body.password, user.password)))
      return next(new ErrorProvider(401, "fail", "Password doesn't  match."));

    sendToken(res, 200, user, `Wellcome back ${user.username}!`);
  } catch (e) {
    next(e);
  }
};

// * Verifying token
exports.verifyToken = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    )
      token = req.headers.authorization.split("Bearer")[1].trim();
    else
      return next(
        new ErrorProvider(401, "fail", "You're not logged in. Please login.")
      );

    const decoded = jsonwebtoken.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user)
      return next(
        new ErrorProvider(401, "fail", "You're not logged in. Please log in.")
      );

    // * Grant access
    req.user = user;

    next();
  } catch (e) {
    next(e);
  }
};

// * Getting the current user
exports.getCurrentUser = async (req, res, next) => {
  try {
    res.status(200).json({
      status: "success",
      data: {
        user: req.user,
      },
    });
  } catch (e) {
    next(e);
  }
};
