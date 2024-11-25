const User = require("../models/user.model");

// Public access
exports.allAccess = (req, res) => {
  res.status(200).json({ message: "Public Content." });
};

// User access (any logged-in user)
exports.userBoard = (req, res) => {
  res.status(200).json({ message: "User Content." });
};

// Admin access
exports.adminBoard = (req, res) => {
  res.status(200).json({ message: "Admin Content." });
};

// Moderator access
exports.moderatorBoard = (req, res) => {
  res.status(200).json({ message: "Moderator Content." });
};

// Get all users (excluding authenticated user for Admin and Moderator roles)
exports.allUsers = async (req, res) => {
  try {
    const authenticatedUserId = req.user.id; // Assuming `req.user` contains authenticated user info

    // Fetch all users except the authenticated user
    const users = await User.find({ _id: { $ne: authenticatedUserId } })
      .populate("role", "name -_id") // Populate only the `name` field from the `role` collection
      .exec();

    if (!users || users.length === 0) {
      return res.status(404).json({ message: "No users found." });
    }

    res.status(200).json({
      message: "Users retrieved successfully.",
      totalItems: users.length,
      users,
    });
  } catch (error) {
    res.status(500).json({
      message: "Some error occurred while retrieving users.",
      error: error.message,
    });
  }
};

// Get all users (Admin only)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().populate("role", "name -_id"); // Populate role with only name
    if (!users || users.length === 0) {
      return res.status(404).json({ message: "No users found." });
    }
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Edit user
exports.editUser = async (req, res) => {
  const { id } = req.params;
  const { firstName, lastName, email, role } = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { firstName, lastName, email, role },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json({
      message: "User updated successfully.",
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error occurred while updating the user.",
      error: error.message,
    });
  }
};

// Delete user
exports.deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json({ message: "User deleted successfully." });
  } catch (error) {
    res.status(500).json({
      message: "Error occurred while deleting the user.",
      error: error.message,
    });
  }
};
