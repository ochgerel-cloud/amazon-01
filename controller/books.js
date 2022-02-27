const Book = require("../models/book");
const path = require("path");
const Category = require("../models/category");
const MyError = require("../utils/myerror");
const asyncHandler = require("../middleware/asynchandler");
const paginate = require("../utils/paginate");
const User = require("../models/user");
const colors = require("colors");
// const book = require("../models/book");

//api/v1/categories/:catId/books
exports.getCategoryBooks = asyncHandler(async (req, res, next) => {
  const select = req.query.select;
  const sort = req.query.sort;

  ["select", "sort", "limit", "page"].forEach((el) => delete req.query[el]);

  const books = await Book.find(
    { category: req.params.categoryId },
    select
  ).sort(sort);

  // console.log(req.params.categoryId);

  res.status(200).json({
    success: true,
    count: books.length,
    data: books,
  });
});

//api/v1/books
exports.getBooks = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 100;
  const select = req.query.select;
  const sort = req.query.sort;

  console.log(req.query);

  ["select", "sort", "limit", "page"].forEach((el) => delete req.query[el]);

  //Pagination хуудаслалт
  const pagination = await paginate(page, limit, Book);

  const books = await Book.find(req.query, select)
    .populate({
      path: "category",
      select: "name averagePrice",
    })
    .sort(sort)
    .skip(pagination.start - 1)
    .limit(limit);

  res.status(200).json({
    success: true,
    count: books.length,
    data: books,
    pagination: pagination,
  });
});

exports.getUserBooks = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 100;
  const select = req.query.select;
  const sort = req.query.sort;

  // console.log(req.params.id + "-----------");

  ["select", "sort", "limit", "page"].forEach((el) => delete req.query[el]);

  //Pagination хуудаслалт
  const pagination = await paginate(page, limit, Book);
  req.query.createUser = req.userId;
  const books = await Book.find(req.query, select)
    .populate({
      path: "category",
      select: "name averagePrice",
    })
    .sort(sort)
    .skip(pagination.start - 1)
    .limit(limit);

  res.status(200).json({
    success: true,
    count: books.length,
    data: books,
    pagination: pagination,
  });
});

//api/v1/books/:id
exports.getBook = asyncHandler(async (req, res, next) => {
  const book = await Book.findById(req.params.id);

  if (!book) {
    throw new MyError(req.params.id + " ийм ID-тэй ном олдсонгүй!!!", 404);
  }

  res.status(200).json({
    success: true,
    data: book,
  });
});

exports.createBook = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.body.category);

  if (!category) {
    //category Хоосон бол ажиллана
    throw new MyError(
      req.body.category + " ID-тэй категори байхгүй байна.",
      400
    );
  }

  req.body.createUser = req.userId;

  const book = await Book.create(req.body);

  res.status(200).json({
    success: true,
    data: book,
  });
});

exports.deleteBook = asyncHandler(async (req, res, next) => {
  const book = await Book.findById(req.params.id);

  if (!book) {
    //category Хоосон бол ажиллана
    throw new MyError(req.params.id + " ID-тэй категори байхгүй байна.", 400);
  }

  book.remove();
  const userInformation = await User.findById(req.userId);
  console.log(userInformation + "---------////////");
  res.status(200).json({
    success: true,
    data: book,
    deleteUserId: userInformation._id,
    whoDeleted: userInformation.name,
  });
});

exports.updateBook = asyncHandler(async (req, res, next) => {
  const book = await Book.findById(req.params.id);
  if (!book) {
    throw new MyError(req.params.id + " ID-тэй ном байхгүй байна.", 400);
  }

  if (book.createUser.toString() !== req.userId && req.userRole !== "admin") {
    throw new MyError("Та зөвхөн өөрийнхөө номыг л засах эрхтэй байна", 403);
  }

  req.body.updateUser = req.userId;

  for (let attr in req.body) {
    book[attr] = req.body[attr];
  }

  book.save();

  res.status(200).json({
    success: true,
    data: book,
  });
});

// PUT api/v1/books/:id/photo
exports.uploadBookPhoto = asyncHandler(async (req, res, next) => {
  const book = await Book.findById(req.params.id);

  if (!book) {
    throw new MyError(req.params.id + " ID-тэй ном байхгүй байна.", 400);
  }

  //image upload

  const file = req.files.file;

  if (!file.mimetype.startsWith("image")) {
    throw new MyError("Та зөвхөн зураг upload хийнэ үү!!!", 400);
  }
  if (file.size > process.env.MAX_UPLOAD_FILE_SIZE) {
    throw new MyError("Таны оруулсан зургийн хэмжээ хэтэрсэн байна!!!", 400);
  }

  file.name = `photo_${req.params.id}${path.parse(file.name).ext}`;
  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, (err) => {
    if (err) {
      throw new MyError(
        "Файлыг хуулахад үед алдаа гарлаа!!! Алдаа: " + err.message,
        400
      );
    }

    console.log(book.photo);
    book.photo = file.name;
    book.save();

    res.status(200).json({
      success: true,
      data: file.name,
    });
  });
});
