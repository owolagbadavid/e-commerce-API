const express = require("express");
const router = express.Router();

const { authenticateUser } = require("../middleware/authentication");
const {
  createReview,
  getAllReviews,
  updateReview,
  deleteReview,
  getSingleReview,
} = require("../controllers/reviewController");

router.route("/").get(getAllReviews).post(authenticateUser, createReview);

router
  .route("/:id")
  .patch(authenticateUser, updateReview)
  .delete(authenticateUser, deleteReview)
  .get(getSingleReview);

module.exports = router;
