var express = require("express");
var router = express.Router();

const { isSignedIn, isAuthenticated} = require("../controllers/auth");
const { getUserById } = require("../controllers/user");
const {
  getCategoryById,
  createCategory,
  getCategory,
  getAllCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/category");

//params
router.param("userId", getUserById);
router.param("categoryId", getCategoryById);


//routes

router.post(
  "/category/create/:userId",
  isSignedIn,
  isAuthenticated,
  createCategory
);

router.get("/category/:categoryId", getCategory);
router.get("/categories", getAllCategory);

router.put(
  "/category/:userId/:categoryId",
  isSignedIn,
  isAuthenticated,
  updateCategory
);

router.delete(
  "/category/:userId/:categoryId",
  isSignedIn,
  isAuthenticated,
  deleteCategory
);

module.exports = router;
