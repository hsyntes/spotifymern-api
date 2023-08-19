const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const validator = require("validator");

const userSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      required: [true, "Firstname is required."],
      trim: true,
    },

    lastname: {
      type: String,
      required: [true, "Lastname is required."],
      trim: true,
    },

    username: {
      type: String,
      required: [true, "Username is required."],
      unique: true,
      trim: true,
    },

    email: {
      type: String,
      required: [true, "Email address is required."],
      validate: [validator.isEmail, "Invalid email address."],
      unique: true,
      trim: true,
    },

    password: {
      type: String,
      required: [true, "Password is required."],
      minlength: [8, "Password cannot be less than 8 characters."],
      maxlength: [32, "Password cannot be longer than 32 characters."],
      select: false,
    },

    passwordConfirm: {
      type: String,
      required: [true, "Please confirm your password."],
      validate: {
        validator: function (value) {
          return value === this.password;
        },

        message: "Password doesn't match.",
      },
    },

    likedSongs: [{ type: mongoose.Schema.Types.ObjectId }],
  },
  { versionKey: false }
);

// * Document Middleware
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) next();

  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;

  next();
});

// * Instance Methods
userSchema.methods.isPasswordCorrect = async (candidate, password) =>
  await bcrypt.compare(candidate, password);

const User = mongoose.model("User", userSchema);

module.exports = User;
