const express = require("express");

const {
  getCategories,
  getCategory,
  updateCategory,
  createCategory,
  deleteCategory,
} = require("../controller/categories");
const router = express.Router();

// /api/v1/categories/:id/books
const { getCategoryBooks } = require("../controller/books");
router.route("/:categoryId/books").get(getCategoryBooks);

// /api/v1/categories
router.route("/").get(getCategories).post(createCategory);

router
  .route("/:id")
  .get(getCategory)
  .put(updateCategory)
  .delete(deleteCategory);

// console.log(getCategories);

module.exports = router;
