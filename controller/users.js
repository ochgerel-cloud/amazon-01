const User = require("../models/user");
const MyError = require("../utils/myerror");
const asyncHandler = require("../middleware/asynchandler");
const paginate = require("../utils/paginate");
const colors = require("colors");

//register

exports.register = asyncHandler(async (req, res, next) => {
  const user = await User.create(req.body);
  const jwt = user.getJsonWebToken();

  res.status(200).json({
    success: true,
    jwt: jwt,
    user: user,
  });
});

//login
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  // console.log(email + " || " + password);
  //Оролтыг шалгана
  if (!email || !password) {
    throw new MyError("И-мэйл болон нууц үгээ дамжуулна уу.", 400);
  }
  //Тухайн хэрэглэгчийг хайна
  const user = await User.findOne({ email: email }).select("+password");
  console.log(user);
  if (!user) {
    throw new MyError("И-мэйл эсвэл нууц үг буруу байна!!!", 401);
  }

  const ok = await user.checkPassword(password);
  console.log(ok);
  if (!ok) {
    throw new MyError("И-мэйл эсвэл нууц үг буруу байна!!!", 401);
  }
  res.status(200).json({
    success: true,
    login: true,
    token: user.getJsonWebToken(),
    user: user,
  });
});

exports.getUsers = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const select = req.query.select;
  const sort = req.query.sort;

  console.log(req.query);

  ["select", "sort", "limit", "page"].forEach((el) => delete req.query[el]);

  //Pagination хуудаслалт
  const pagination = await paginate(page, limit, User);

  const users = await User.find(req.query, select)
    .sort(sort)
    .skip(pagination.start - 1)
    .limit(limit);

  res.status(200).json({
    success: true,
    count: pagination.total,
    data: users,
    pagination: pagination,
  });
});

exports.getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    //category Хоосон бол ажиллана
    throw new MyError(req.params.id + " ID-тэй хэрэглэгч байхгүй байна.", 403);
  }
  res.status(200).json({
    success: true,
    data: user,
  });
});
exports.updateUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!user) {
    throw new MyError(req.params.id + " ID-тэй хэрэглэгч байхгүй байна.", 400);
  }
  res.status(200).json({
    success: true,
    data: user,
  });
});
exports.createUser = asyncHandler(async (req, res, next) => {
  // console.log("data: ", req.body);

  const user = await User.create(req.body);

  res.status(200).json({
    success: true,
    data: user,
  });
});
exports.deleteUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    throw new MyError(req.params.id + " ID-тэй хэрэглэгч байхгүй байна.", 400);
  }

  user.remove();

  res.status(200).json({
    success: true,
    data: user._id + " ID-тэй хэрэглэгчийг амжилттай устгалаа",
  });
});
