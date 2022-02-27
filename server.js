const express = require("express");
const dotenv = require("dotenv");
const fs = require("fs");
const path = require("path");
const morgan = require("morgan");
const rfs = require("rotating-file-stream"); // version 2.x
const logger = require("./middleware/logger");
const connectDB = require("./config/db");
const colors = require("colors");
const errorHandler = require("./middleware/error");
const fileUpload = require("express-fileupload");
// Router оруулж ирэх
const categoriesRoutes = require("./routes/categories");
const booksRoutes = require("./routes/books");
const UsersRoutes = require("./routes/users");

// Config.env тохиргоог process.env рүү ачаалах
dotenv.config({ path: "./config/config.env" });

const app = express();

//Өгөгдлийн сангийн холболт
connectDB();

// create a write stream (in append mode)
const accessLogStream = rfs.createStream("access.log", {
  interval: "1d", // rotate daily
  path: path.join(__dirname, "log"),
});

//Body parser express
app.use(express.json()); //request objectoor орж ирсэн мессеж болгоны body хэсгийг нь шалгаад хэрвээ json байх юм бол req.body хувьсагчид хийж өгнө
app.use(fileUpload());
app.use(logger);
app.use(morgan("combined", { stream: accessLogStream }));
app.use("/api/v1/categories", categoriesRoutes);
app.use("/api/v1/books", booksRoutes);
app.use("/api/v1/users", UsersRoutes);
app.use(errorHandler);

const server = app.listen(
  process.env.PORT,
  console.log(
    `Express сэрвэр ${process.env.PORT} порт дээр аслаа... `.blue.inverse
  )
);

process.on("unhandledRejection", (err, promise) => {
  console.log(`Алдаа гарлаа: ${err.message}`.red.underline.bold);
  server.close(() => {
    process.exit(1);
  });
});
