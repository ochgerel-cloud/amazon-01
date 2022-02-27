const express = require("express");
const { protect, authorize } = require("../middleware/protect");

const {
  getBooks,
  getBook,
  createBook,
  deleteBook,
  updateBook,
  uploadBookPhoto,
} = require("../controller/books");

const router = express.Router();

//api/v1/books
router
  .route("/")
  .get(getBooks)
  .post(protect, authorize("admin", "operator"), createBook);

router
  .route("/:id")
  .get(getBook)
  .delete(protect, deleteBook)
  .put(protect, updateBook);
router.route("/:id/photo").put(protect, uploadBookPhoto);

module.exports = router;
