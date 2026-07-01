// Run with: npm run seed:admin -- youremail@example.com
// Promotes an already-registered user to the "admin" role directly in the DB.
require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../models/User");

async function run() {
  const email = process.argv[2];
  if (!email) {
    console.error("Usage: npm run seed:admin -- youremail@example.com");
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGO_URI);

  const user = await User.findOneAndUpdate(
    { email },
    { role: "admin" },
    { new: true }
  );

  if (!user) {
    console.error(`No user found with email ${email}. Register that user first.`);
  } else {
    console.log(`${user.email} is now an admin.`);
  }

  await mongoose.disconnect();
}

run();
