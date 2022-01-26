const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const { transliterate, slugify } = require("transliteration");
const colors = require("colors");
const CategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Категорийн нэрийг оруулна уу!!!"],
      unique: false,
      trim: true,
      maxlength: [
        50,
        "Категорийн нэрний урт дээд тал нь 50 тэмдэгт байх ёстой!!!",
      ],
    },
    slug: String,
    description: {
      unique: false,
      type: String,
      required: [true, "Категорийн тайлбарыг заавал оруулна уу!!!"],
      maxlength: [500, "Тайлбарын урт дээд тал нь 500 тэмдэгт байх ёстой!!!"],
    },
    photo: { type: String, default: "no-photo.jpg" },
    averageRating: {
      type: Number,
      min: [1, "Рэйтинг хамгийн багадаа 1 байх ёстой!!!"],
      max: [10, "Рэйтинг хамгийн ихдээ 10 байх ёстой!!!"],
    },
    averagePrice: Number,
    createdAt: { type: Date, default: Date.now },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

CategorySchema.plugin(uniqueValidator);

CategorySchema.pre("save", function (next) {
  //this түлхүүр үг нь үүсэж буй object заасан байдаг шүү
  // console.log(this.name);
  this.slug = slugify(this.name);
  this.averageRating = Math.floor(Math.random() * 10) + 1;
  // this.averagePrice = Math.floor(Math.random() * 100000) + 3000;
  // console.log(a);
  next();
});

CategorySchema.pre("remove", async function (next) {
  console.log("removing category and books...".red.inverse);
  await this.model("Book").deleteMany({ category: this._id }); //book model Дотроос харгалзах id аар нь авч устгаж байна.
  console.log("deleted category and books...".green.inverse);
  next();
});

CategorySchema.virtual("books", {
  ref: "Book", //book model toi holboj baina
  localField: "_id", //Холбогдохдоо манай category моделийн аль талбартай холбогдохыг заана
  foreignField: "category", //Book моделийн талбарыг зааж байна
  justOne: false,
});

module.exports = mongoose.model("Category", CategorySchema);
