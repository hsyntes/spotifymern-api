const mongoose = require("mongoose");

const musicSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A music must have a name."],
      trim: true,
      unique: true,
    },

    source: {
      type: String,
      required: [true, "An audio file is required."],
      trim: true,
      unique: true,
    },

    categories: [
      {
        type: [String],
        enum: {
          values: ["rap", "pop", "hiphop"],
          message: "The category type is required.",
          default: "Standart",
        },
        trim: true,
      },
    ],
  },
  { versionKey: false }
);

const Music = mongoose.model("Music", musicSchema);

module.exports = Music;
