const Product = require("../models/product");
const formidable = require("formidable");
const _ = require("lodash");
const fs = require("fs");

exports.createProduct = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;

  form.parse(req, (err, fields, file) => {
    if (err) {
      res.status(400).json({
        error: "Problem in image",
      });
    }

    const {
      name,
      description,
      mrp,
      category
    } = fields;

    if (
      !name ||
      !description ||
      !mrp ||
      !category
    ) {
      return res.status(400).json({
        error: "Please provide all the fields",
      });
    }

    let product = new Product(fields);

    product.save((err, product) => {
      if (err) {
        return res.status(400).json({
          errmsg: err,
          error: "Saving product in DB failed",
        });
      }

      res.json(product);
    });
  });
};

exports.getProductById = (req, res, next, id) => {
  Product.findById(id)
    .populate("category")
    .exec((err, product) => {
      if (err || !product) {
        return res.status(400).json({
          error: "Product not found in DB",
        });
      }
      req.product = product;
      next();
    });
};


exports.getProduct = (req, res) => {
  return res.json(req.product);
};

exports.deleteProduct = (req, res) => {
  let product = req.product;
  product.remove((err, deletedProduct) => {
    if (err) {
      return res.status(400).json({
        error: "Product deletion failed!!",
      });
    }
    res.json({ message: "Deletion successfull", deletedProduct });
  });
};

exports.updateProduct = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;

  form.parse(req, (err, fields, file) => {
    if (err) {
      res.status(400).json({
        error: "Problem in image",
      });
    }

    // console.log(fields);

    const {
      name,
      description,
      mrp,
      category,
    } = fields;

    let product = req.product;
    product = _.extend(product, fields);

    product.save((err, product) => {
      if (err) {
        return res.status(400).json({
          error: "Updation failed",
        });
      }

      res.json(product);
    });
  });
};

exports.getAllProducts = (req, res) => {
  let limit = req.query.limit ? parseInt(req.query.limit) : 8;
  let sortBy = req.query.sortBy ? req.query.sortBy : "_id";

  Product.find()
    .populate("category")
    .sort([[sortBy, "asc"]])
    .limit(limit)
    .exec((err, products) => {
      if (err || !products) {
        return res.status(400).json({
          error: "No products found",
        });
      }
      res.json(products);
    });
};

exports.getAllUniqueProducts = (req, res) => {
  Product.distinct("category", {}, (err, categories) => {
    if (err || !categories) {
      return res.status(400).json({
        error: "No categories found",
      });
    }

    res.json(categories);
  });
};
