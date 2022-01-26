const Category = require("../models/category");
const MyError = require("../utils/myerror");
const asyncHandler = require("../middleware/asynchandler");
const paginate = require("../utils/paginate");
const colors = require("colors");

exports.getCategories = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const select = req.query.select;
  const sort = req.query.sort;

  console.log(req.query);

  ["select", "sort", "limit", "page"].forEach((el) => delete req.query[el]);

  //Pagination хуудаслалт
  const pagination = await paginate(page, limit, Category);

  const categories = await Category.find(req.query, select)
    .sort(sort)
    .skip(pagination.start - 1)
    .limit(limit);

  res.status(200).json({
    success: true,
    data: categories,
    pagination: pagination,
  });
});

exports.getCategory = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.id).populate("books");

  if (!category) {
    //category Хоосон бол ажиллана
    throw new MyError(req.params.id + " ID-тэй категори байхгүй байна.", 403);
  }
  res.status(200).json({
    success: true,
    data: category,
  });
});
exports.updateCategory = asyncHandler(async (req, res, next) => {
  const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!category) {
    throw new MyError(req.params.id + " ID-тэй категори байхгүй байна.", 400);
  }
  res.status(200).json({
    success: true,
    data: category,
  });
});
exports.createCategory = asyncHandler(async (req, res, next) => {
  // console.log("data: ", req.body);

  const category = await Category.create(req.body);

  res.status(200).json({
    success: true,
    data: category,
  });
});
exports.deleteCategory = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    throw new MyError(req.params.id + " ID-тэй категори байхгүй байна.", 400);
  }

  category.remove();

  res.status(200).json({
    success: true,
    data: category._id + " ID-тэй категорийг амжилттай устгалаа",
  });
});
