const { authController } = require("../controllers/auth.controller");
const { verifySignUp } = require("../middlewares/auth/verifySignUp");
const {
  getAllUsers,
  editUser,
  deleteUser,
} = require("../controllers/user.controller");
const express = require("express");
const router = express.Router();

router.post(
  "/sign-up",
  [verifySignUp.checkDuplicateEmail, verifySignUp.checkRolesExisted],
  authController.signUp
);
router.post("/sign-in", authController.signIn);
router.get("/users", getAllUsers);
router.put("/users/:id", editUser);
router.delete("/users/:id", deleteUser);

module.exports = router;
