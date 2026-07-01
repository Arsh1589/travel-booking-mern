const express = require("express");
const { createReview, getTourReviews } = require("../controllers/reviewController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, createReview);
router.get("/:tourId", getTourReviews);

module.exports = router;
