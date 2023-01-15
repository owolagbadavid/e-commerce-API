const express = require("express");
const router = express.Router();
const {
  updateProduct,
  uploadImage,
  createProduct,
  getAllProducts,
  getSingleProduct,
  deleteProduct,
} = require("../controllers/productController");
const {
  authenticateUser,
  authorizePermissions,
} = require("../middleware/authentication");
const { getSingleProductReviews } = require("../controllers/reviewController");

router
  .route("/")
  .get(getAllProducts)
  .post(authenticateUser, authorizePermissions("admin"), createProduct);

router
  .route("/uploadImage")
  .post(authenticateUser, authorizePermissions("admin"), uploadImage);

router
  .route("/:id")
  .get(getSingleProduct)
  .delete(authenticateUser, authorizePermissions("admin"), deleteProduct)
  .patch(authenticateUser, authorizePermissions("admin"), updateProduct);

router.route('/:id/reviews').get(getSingleProductReviews);  
module.exports = router;
