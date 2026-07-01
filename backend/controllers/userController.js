const User = require("../models/User");
const bcrypt = require("bcrypt");

async function getProfile(req, res) {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
}

async function updateProfile(req, res) {
  try {
    const { name, email, profilePhoto, currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    if (name) user.name = name;
    if (email) user.email = email;
    if (profilePhoto) user.profilePhoto = profilePhoto;
    if (currentPassword && newPassword) {
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) return res.status(400).json({ message: "Current password is incorrect" });
      user.password = await bcrypt.hash(newPassword, 10);
    }
    await user.save();
    const updated = user.toObject();
    delete updated.password;
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
}

module.exports = { getProfile, updateProfile };
