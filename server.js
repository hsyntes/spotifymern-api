const dotenv = require("dotenv");
const app = require("./app");
const mongoose = require("mongoose");

dotenv.config({ path: "./config.env" });

process.on("uncaughtException", (err) => {
  console.error(`${err.name} - Server is shutting down.`);
  console.error(err.message);

  process.exit(1);
});

(async () => {
  try {
    await mongoose.connect(process.env.URI);
    console.log("Connecting to the database successfully.");
  } catch (e) {
    console.error(`Error connecting to the database: ${e}`);
  }
})();

const server = app.listen(process.env.PORT, () =>
  console.log(`Server is running on PORT: ${process.env.PORT}`)
);

process.on("unhandledRejection", (err) => {
  console.error(`${err.name} - Server is shutting down.`);
  console.error(err.message);

  server.close(() => process.exit(1));
});
