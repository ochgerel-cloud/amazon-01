module.exports = async function (page, limit, model) {
  const total = await model.countDocuments(); //Нийт Category модел дотор хэдэн юм байгааг хэлнэ
  const pageCount = Math.ceil(total / limit);
  const start = (page - 1) * limit + 1;
  let end = start + limit || total;
  if (end > total) end = total;

  const pagination = { total, pageCount, start, end };

  if (page < pageCount) pagination.nextPage = page + 1;

  if (page > 1) pagination.prevPage = page - 1;

  return pagination;
};
