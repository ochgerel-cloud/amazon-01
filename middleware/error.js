const errorHandler = (err, req, res, next) => {
  // console.log(err.stack.red.inverse);

  const error = { ...err }; //err objectiig error луу хуулбарлаж байна
  error.message = err.message;
  console.log("-----------------------------------" + err);

  console.log(`${err}`.bgYellow.black);

  console.log(error);

  if (error.name === "CastError") {
    error.message = "Энэ ID буруу бүтэцтэй байна!";
    error.statusCode = 400;
  }
  if (error.code === 11000) {
    error.message = "Утга давхардсан байна!!!";
    error.statusCode = 400;
  }

  if (error.name === "JsonWebTokenError" && error.message === "invalid token") {
    error.message = "Буруу токен дамжуулсан байна.";
    error.statusCode = 400;
  }

  res.status(err.statusCode || 500).json({
    success: false,
    error, //error: error, гэсэн үг юм шүү
  });
};
module.exports = errorHandler;
