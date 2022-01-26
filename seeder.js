const fs = require("fs");
const mongoose = require("mongoose");
const colors = require("colors");
const dotenv = require("dotenv");
const Category = require("./models/category");
const Book = require("./models/book");

dotenv.config({ path: "./config/config.env" });

mongoose.connect(process.env.MONGODB_URI, {
  // useNewUrlParser: true,
  // useCreateIndex: true,
  // useFindAndModify: false,
  // useUnifiedTopology: true,
});

const categories = JSON.parse(
  fs.readFileSync(__dirname + "/data/categories.json", "utf-8")
);
const books = JSON.parse(
  fs.readFileSync(__dirname + "/data/book.json", "utf-8")
);

const importData = async () => {
  try {
    await Category.create(categories);
    await Book.create(books);
    console.log("Өгөгдлийг татаж дууслаа...".green.inverse);
  } catch (err) {
    console.log(err);
  }
};

const deleteData = async () => {
  try {
    await Category.deleteMany();
    await Book.deleteMany();
    console.log("Бүх өгөгдлийг устгалаа...".red.inverse);
  } catch (err) {
    console.log(err);
  }
};

if (process.argv[2] == "-i") {
  // node seeder.js -i гэж ажиллуулна
  importData();
} else if (process.argv[2] == "-d") {
  // node seeder.js -i гэж ажиллуулна
  deleteData();
} else if (process.argv[2] == "-r") {
  // node seeder.js -r гэж ажиллуулна restore hiine
  deleteData().then(function () {
    importData();
  });
}
