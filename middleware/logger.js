const logger = (req, res, next) => {
  // req.userId = "151515354913";
  console.log(`${req.method}${req.protocol}://${req.host}${req.originalUrl}`);
  next(); //Дараагийн middleware луу шилжүүлнэ
};

module.exports = logger;
