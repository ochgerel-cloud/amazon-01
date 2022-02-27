const jwt = require("jsonwebtoken");
const asyncHandler = require("./asynchandler");
const MyError = require("../utils/myError");
const User = require("../models/user");
const colors = require("colors");

exports.protect = asyncHandler(async (req, res, next) => {
  if (!req.headers.authorization) {
    throw new MyError(
      "Энэ үйлдлийг хийхэд таны эрх хүрэхгүй байна та эхлээд Логин хийнэ үү...",
      401
    );
  }
  const token = req.headers.authorization.split(" ")[1];
  if (!token) {
    throw new MyError("Токен байхгүй байна.", 400);
  }
  const tokenObject = jwt.verify(token, process.env.JWT_SECRET);
  //   req.userId = await User.findById(tokenObject.id);
  // console.log(`${req.headers.authorization.split(" ")[0]}`.inverse.cyan);
  req.userId = tokenObject.id;
  req.userRole = tokenObject.role;
  // console.log(`${tokenObject.role}`.inverse.cyan);
  next();
});

exports.authorize = (...roles) => {
  // console.log(`${roles}`.inverse.red);

  return (req, res, next) => {
    // console.log(`${req.userRole}`.inverse.cyan);
    // console.log(roles.includes(req.userRole));

    if (!roles.includes(req.userRole)) {
      throw new MyError(
        "Таны эрх [" + req.userRole + "] энэ үйлдлийг хийхэд хүрэлцэхгүй байна",
        403
      );
    }
    next();
  };
};
