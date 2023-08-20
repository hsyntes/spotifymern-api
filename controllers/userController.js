const ErrorProvider = require("../classes/ErrorProvider");
const User = require("../models/User");

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
