const express = require("express");
const { protect, authorize } = require("../middleware/protect");

const {
  register,
  login,
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
} = require("../controller/users");
const { getUserBooks } = require("../controller/books");

const router = express.Router();
//api/v1/users
router.route("/").post(register);
router.route("/login").post(login);

router.use(protect);

router
  .route("/:id")
  .get(authorize("admin"), getUser)
  .put(authorize("admin"), updateUser)
  .delete(authorize("admin"), deleteUser);
router
  .route("/")
  .get(authorize("admin", "user"), getUsers)
  .post(authorize("admin"), createUser);
router.route("/:id/books").get(getUserBooks);

module.exports = router;
