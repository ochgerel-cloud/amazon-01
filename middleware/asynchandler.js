const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);

  // console.log(`${req}`.bgMagenta.white);
  // console.log(req.body);
};

module.exports = asyncHandler;
