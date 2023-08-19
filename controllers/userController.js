const ErrorProvider = require("../classes/ErrorProvider");
const User = require("../models/User");

// * Get User
exports.getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId);

    if (!user) return next(new ErrorProvider(404, "fail", "User not found."));

    res.status(200).json({
      status: "success",
      data: {
        user,
      },
    });
  } catch (e) {
    next(e);
  }
};

// * Get users
exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find();

    res.status(200).json({
      status: "success",
      results: users.length,
      data: {
        users,
      },
    });
  } catch (e) {
    next(e);
  }
};

// * Getting current user
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
