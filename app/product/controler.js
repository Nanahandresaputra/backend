const path = require("path");
const fs = require("fs");
const config = require("../config");
const ProductFood = require("./model");
const rootPath = require("../config");
const Categories = require("../category/model");
const Tag = require("../tag/model");

// get product
const index = async (req, res, next) => {
  try {
    let { skip = 0, limit = 6, q = "", category = "", tags = [] } = req.query;
    // q untuk pencarian
    let criteria = {};
    if (q.length) {
      criteria = {
        ...criteria,
        name: { $regex: q, $options: "i" },
      };
    }
    if (category.length) {
      let categoryResult = await Categories.findOne({
        name: { $regex: `${category}`, $options: "i" },
      });
      if (categoryResult) {
        criteria = {
          ...criteria,
          category: categoryResult._id,
        };
      }
    }
    if (tags.length) {
      let tagsResult = await Tag.find({ name: { $in: tags } });
      if (tagsResult.length > 0) {
        criteria = { ...criteria, tags: { $in: tagsResult.map((tag) => tag._id) } };
      }
    }
    console.log(criteria);
    let count = await ProductFood.find(criteria).countDocuments();
    let product = await ProductFood.find(criteria).skip(parseInt(skip)).limit(parseInt(limit)).populate("category").populate("tags");

    res.json({
      data: product,
      count,
    });
  } catch (e) {
    next(e);
  }
};

// get one product
let productIndex = async (req, res, next) => {
  try {
    let { id } = req.params;
    let product = await ProductFood.findById(id).populate("category").populate("tags");
    // .populate('category'), category diambil dari schema yang ada di productSchema
    return res.json(product);
  } catch (e) {
    next(e);
  }
};

// delete product
const destroy = async (req, res, next) => {
  try {
    let { id } = req.params;
    let product = await ProductFood.findByIdAndDelete(id);
    let currentImage = `${config.rootPath}/public/images/products/${product.image_url}`;
    if (fs.existsSync(currentImage)) {
      fs.unlinkSync(currentImage);
    }
    return res.json(product);
  } catch (e) {
    next(e);
  }
};

// add product
const store = async (req, res, next) => {
  try {
    let payload = req.body;

    // menambahkan relasi kategori
    if (payload.category) {
      let category = await Categories.findOne({ name: { $regex: payload.category, $options: "i" } });
      if (category) {
        payload = {
          ...payload,
          category: category._id,
        };
      } else {
        delete payload.category;
      }
    }

    // menambahkan relasi tag
    if (payload.tags && payload.tags.length > 0) {
      let tags = await Tag.find({ name: { $in: payload.tags } });
      if (tags.length) {
        payload = { ...payload, tags: tags.map((tag) => tag._id) };
      } else {
        delete payload.tags;
      }
    }

    if (req.file) {
      // konfigurasi untuk upload image/file
      let tmp_path = req.file.path;
      let originalExt = req.file.originalname.split(".")[req.file.originalname.split(".").length - 1];
      let fileName = `${req.file.filename}.${originalExt}`;
      let target_path = path.resolve(config.rootPath, `./public/images/products/${fileName}`);
      //model upload
      let src = fs.createReadStream(tmp_path);
      //   createReadStream akan membuatkan/membaca dari temporary path. yang mana temporary path nya itu sesuai dengan os nya
      let dest = fs.createWriteStream(target_path);
      // createwriteStream akan memindahkan file yg sudah dibaca tersebut ke image
      src.pipe(dest);
      src.on("end", async () => {
        try {
          let product = await new ProductFood({ ...payload, image_url: fileName });
          await product.save();
          return res.json(product);
        } catch (err) {
          fs.unlinkSync(target_path);
          if (err && err.name === "ValidationError") {
            return res.json({
              error: 1,
              message: err.message,
              fields: err.errors,
            });
          }
          next(err);
        }
      });

      src.on("error", () => {
        next(err);
      });
    } else {
      let product = await new ProductFood(payload);
      product.save();
      return res.json(product);
    }
  } catch (err) {
    if (err && err.name === "ValidationError") {
      res.json({
        error: 1,
        message: err.message,
        fields: err.errors,
      });
    }
  }
};

// update product
const update = async (req, res, next) => {
  try {
    let payload = req.body;

    // menambahkan relasi kategori pada update
    if (payload.category) {
      let category = await Categories.findOne({ name: { $regex: payload.category, $options: "i" } });
      if (category) {
        payload = {
          ...payload,
          category: category._id,
        };
      } else {
        delete payload.category;
      }
    }

    // menambahkan relasi tag
    if (payload.tags && payload.tags.length > 0) {
      let tags = await Tag.find({ name: { $in: payload.tags } });
      if (tags.length) {
        payload = {
          ...payload,
          tags: tags.map((tag) => tag._id),
        };
      } else {
        delete payload.tags;
      }
    }

    let { id } = req.params;
    if (req.file) {
      let tmp_path = req.file.path;
      let originalExt = req.file.originalname.split(".")[req.file.originalname.split(".").length - 1];
      let fileName = `${req.file.filename}.${originalExt}`;
      let target_path = path.resolve(config.rootPath, `./public/images/products/${fileName}`);
      let src = fs.createReadStream(tmp_path);
      let dest = fs.createWriteStream(target_path);
      src.pipe(dest);
      src.on("end", async () => {
        try {
          // menghilangkan file lama dan menimpanya dengan file yg baru
          let product = await ProductFood.findById(id);
          let currentImage = `${config.rootPath}/public/images/products/${product.image_url}`;
          if (fs.existsSync(currentImage)) {
            fs.unlinkSync(currentImage);
          }

          product = await ProductFood.findByIdAndUpdate(
            id,
            { ...payload, image_url: fileName },
            {
              new: true,
              // parameter new: true akan mengembalikan data terbaru setelah di update, tetapi jika tidak menambahkan parameter new: true akan mengembalikan data yang lama
              runValidators: true,
            }
          );
          return res.json(product);
        } catch (err) {
          fs.unlinkSync(target_path);
          if (err && err === "ValidationError") {
            res.json({
              error: 1,
              message: err.message,
              fields: err.errors,
            });
          }
          next(err);
        }
      });
      src.on("error", () => {
        next(err);
      });
    } else {
      let product = await ProductFood.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
      });
      return res.json(product);
    }
  } catch (err) {
    if (err && err.name === "ValidationError") {
      res.json({
        error: 1,
        message: err.message,
        fields: err.errors,
      });
    }
  }
};

module.exports = { index, store, update, productIndex, destroy };
