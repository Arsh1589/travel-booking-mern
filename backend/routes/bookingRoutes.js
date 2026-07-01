const express = require("express");
const { getUserBookings, getAllBookings, cancelBooking } = require("../controllers/bookingController");
const { protect } = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/adminMiddleware");

const router = express.Router();

router.get("/user/:userId", protect, getUserBookings);
router.get("/", protect, adminOnly, getAllBookings);
router.put("/:id/cancel", protect, cancelBooking);

module.exports = router;
