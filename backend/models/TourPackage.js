const mongoose = require("mongoose");

const itineraryDaySchema = new mongoose.Schema(
  {
    day: { type: Number, required: true },
    title: { type: String, required: true },
    description: { type: String },
  },
  { _id: false }
);

const tourPackageSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    destination: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    durationDays: { type: Number, required: true },
    images: [{ type: String }],
    itinerary: [itineraryDaySchema],
    totalSlots: { type: Number, required: true, default: 20 },
    bookedSlots: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// indexed since destination is the primary search field on the frontend
tourPackageSchema.index({ destination: 1 });

tourPackageSchema.virtual("availableSlots").get(function () {
  return this.totalSlots - this.bookedSlots;
});

module.exports = mongoose.model("TourPackage", tourPackageSchema);
