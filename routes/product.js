var express = require("express");
var router = express.Router();

const { isSignedIn, isAuthenticated} = require("../controllers/auth");
const { getUserById } = require("../controllers/user");
const {
  getProductById,
  createProduct,
  getProduct,
  updateProduct,
  deleteProduct,
  getAllProducts,
  getAllUniqueProducts,
} = require("../controllers/product");

//params
router.param("userId", getUserById);
router.param("productId", getProductById);

//create routes
router.post(
  "/product/create/:userId",
  isSignedIn,
  isAuthenticated,
  createProduct
);

//read routes
router.get("/product/:productId", getProduct);

//delete routes
router.delete(
  "/product/:productId/:userId",
  isSignedIn,
  isAuthenticated,
  deleteProduct
);

//update routes
router.put(
  "/product/:productId/:userId",
  isSignedIn,
  isAuthenticated,
  updateProduct
);

//listing route
router.get("/products", getAllProducts);

router.get("/products/categories", getAllUniqueProducts);

module.exports = router;
