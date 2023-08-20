const express = require("express");
const cors = require("cors");
const compression = require("compression");
const expressRateLimit = require("express-rate-limit");
const expressMongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const hpp = require("hpp");
const xss = require("xss-clean");
const userRouters = require("./routers/userRouters");
const musicRouters = require("./routers/musicRouters");
const ErrorProvider = require("./classes/ErrorProvider");
const errorController = require("./controllers/errorController");

// * Express
const app = express();

// * Cors configuration
const allowedOrigins = [
  "http://localhost:3000",
  "https://spotify-mern.netlify.app",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (allowedOrigins.includes(origin) || !origin) callback(null, true);
      else callback(new Error("Not allowed by CORS."));
    },
    credentials: true,
  })
);

// * Compression for production
app.use(compression());

// * API Limit
const limit = expressRateLimit({
  max: 100,
  windowsMs: 60 * 60 * 1000,
  message: "Too many requests.",
  standartHeaders: true,
  legacyHeaders: false,
});

// * Security
app.use(express.json({ limit }));
app.use(expressMongoSanitize());
app.use(helmet());
app.use(hpp());
app.use(xss());

// * Routers
app.use("/spotifymern/users", userRouters);
app.use("/spotifymern/musics", musicRouters);

// * Unsupported URLs
app.all("*", (req, res, next) =>
  next(new ErrorProvider(404, "fail", `Unsupported URL: ${req.originalUrl}`))
);

app.use(errorController);

module.exports = app;
