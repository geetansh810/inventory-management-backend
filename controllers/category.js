const Category = require("../models/category");

exports.getCategoryById = (req, res, next, id) => {
  Category.findById(id).exec((err, category) => {
    if (err || !category) {
      return res.status(400).json({
        error: "Category not found in DB",
      });
    }
    req.category = category;
    // console.log(category)
    next();
  });
};

exports.createCategory = (req, res) => {
  const category = new Category(req.body);
  // console.log(category);
  category.save((err, category) => {
    // console.log("Error : ",err);
    // console.log("Category : ",category);
    if (err || !category) {
      return res.status(400).json({
        error: "Not able to save category in DB",
      });
    }
    res.json(category);
  });
};

exports.getCategory = (req, res) => {
  return res.json(req.category);
};

exports.getAllCategory = (req, res) => {
  Category.find().exec((err, categories) => {
    if (err || !categories) {
      return res.status(400).json({
        error: "No categories found in DB",
      });
    }
    res.json(categories);
  });
};

exports.updateCategory = (req, res) => {
  const category = req.category;
  category.brand = req.body.brand;

  category.save((err, updatedCategory) => {
    if (err) {
      return res.status(400).json({
        error: "Failed to update category in DB",
      });
    }
    res.json(updatedCategory);
  });
};

exports.deleteCategory = (req, res) => {
  const category = req.category;

  category.remove((err, deletedCategory) => {
    if (err) {
      return res.status(400).json({
        error: "Failed to delete this category in DB",
      });
    }
    res.json({
      message: `${deletedCategory.brand} category is deleted successfully`,
    });
  });
};
