const ErrorProvider = require("../classes/ErrorProvider");
const Music = require("../models/Music");

// * Geting the music by id
exports.getMusic = async (req, res, next) => {
  try {
    if (!req.params.id) return next("...");

    const { id } = req.params;

    const music = await Music.findById(id);

    res.status(200).json({
      status: "success",
      data: {
        music,
      },
    });
  } catch (e) {
    next(e);
  }
};

// * Getting random musics
exports.getMusics = async (req, res, next) => {
  try {
    // const musics = await Music.find();
    const musics = await Music.aggregate([
      {
        $sample: {
          size: 8,
        },
      },
    ]);

    res.status(200).json({
      status: "success",
      results: musics.length,
      data: {
        musics,
      },
    });
  } catch (e) {
    next(e);
  }
};

// * Getting all musics
exports.getAllMusics = async (req, res, next) => {
  try {
    const musics = await Music.find();

    const aggregate = await Music.aggregate([
      {
        $sample: {
          size: musics.length,
        },
      },
    ]);

    res.status(200).json({
      status: "success",
      results: musics.length,
      data: {
        musics: aggregate,
      },
    });
  } catch (e) {
    next(e);
  }
};

// * Groupping musics by categories
exports.getCategories = async (req, res, next) => {
  try {
    const categories = await Music.aggregate([
      {
        $unwind: "$categories",
      },
      {
        $group: {
          _id: "$categories",
        },
      },
    ]);

    res.status(200).json({
      status: "success",
      results: categories.length,
      data: {
        categories,
      },
    });
  } catch (e) {
    next(e);
  }
};

// * Getting musics by category
exports.getMusicsByCategory = async (req, res, next) => {
  try {
    if (!req.params.category)
      return next(
        new ErrorProvider(403, "fail", "Please specify a category name.")
      );

    const { category } = req.params;

    const musics = await Music.find({ categories: category });

    res.status(200).json({
      status: "success",
      data: {
        musics,
      },
    });
  } catch (e) {
    next(e);
  }
};

// * Searching musics
exports.searchMusics = async (req, res, next) => {
  try {
    if (!req.params.name)
      return next(
        new ErrorProvider(403, "fail", "Please type a name to search musics.")
      );

    const { name } = req.params;

    const musics = await Music.find({
      name: { $regex: name, $options: "i" },
    });

    if (!musics.length)
      return next(new ErrorProvider(404, "fail", "Not found any musics."));

    res.status(200).json({
      status: "success",
      results: musics.length,
      data: {
        musics,
      },
    });
  } catch (e) {
    next(e);
  }
};
