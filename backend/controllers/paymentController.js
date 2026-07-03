const crypto = require("crypto");
const razorpay = require("../config/razorpay");
const Booking = require("../models/Booking");
const TourPackage = require("../models/TourPackage");
const Notification = require("../models/Notification");
const { sendBookingConfirmation } = require("../config/mailer");
const { getIO } = require("../config/socket");
const User = require("../models/User");

async function createOrder(req, res) {
  try {
    const { tourId, travelDate, numberOfTravelers } = req.body;
    const tour = await TourPackage.findById(tourId);
    if (!tour) return res.status(404).json({ message: "Tour not found" });
    const updatedTour = await TourPackage.findOneAndUpdate(
      { _id: tourId, $expr: { $lte: [{ $add: ["$bookedSlots", numberOfTravelers] }, "$totalSlots"] } },
      { $inc: { bookedSlots: numberOfTravelers } },
      { new: true }
    );
    if (!updatedTour) return res.status(400).json({ message: "Not enough slots available" });
    const totalPrice = tour.price * numberOfTravelers;
    const order = await razorpay.orders.create({ amount: totalPrice * 100, currency: "INR", receipt: `receipt_${Date.now()}` });
    const booking = await Booking.create({ user: req.user.id, tour: tourId, travelDate, numberOfTravelers, totalPrice, status: "pending_payment", payment: { razorpayOrderId: order.id } });
    res.status(201).json({ orderId: order.id, amount: order.amount, currency: order.currency, bookingId: booking._id, keyId: process.env.RAZORPAY_KEY_ID });
  } catch (err) {
    res.status(500).json({ message: "Failed to create order", error: err.message });
  }
}

async function verifyPayment(req, res) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingId } = req.body;
    const expectedSignature = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET).update(`${razorpay_order_id}|${razorpay_payment_id}`).digest("hex");
    if (expectedSignature !== razorpay_signature) return res.status(400).json({ message: "Payment verification failed" });
    const booking = await Booking.findByIdAndUpdate(bookingId, { status: "confirmed", "payment.razorpayPaymentId": razorpay_payment_id, "payment.razorpaySignature": razorpay_signature, "payment.paidAt": new Date() }, { new: true }).populate("tour", "title destination");
    const user = await User.findById(req.user.id);
    const notification = await Notification.create({ user: req.user.id, title: "Booking Confirmed! 🎉", message: `Your booking for ${booking.tour.title} is confirmed. Have a great trip!`, type: "booking_confirmed", link: "/bookings" });
    try {
      const io = getIO();
      io.to(req.user.id).emit("notification", { _id: notification._id, title: notification.title, message: notification.message, type: notification.type, link: notification.link, createdAt: notification.createdAt });
    } catch (socketErr) {
      console.log("Socket notification skipped:", socketErr.message);
    }
    sendBookingConfirmation({ to: user.email, name: user.name, tourTitle: booking.tour.title, travelDate: booking.travelDate, totalPrice: booking.totalPrice });
    res.status(200).json({ message: "Payment verified, booking confirmed", booking });
  } catch (err) {
    res.status(500).json({ message: "Verification error", error: err.message });
  }
}

module.exports = { createOrder, verifyPayment };
