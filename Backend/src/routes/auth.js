import express from "express";
import { check } from "express-validator";
import {
  register,
  login,
  profile,
  checkEmail,
  fetchAllCustomers,
  editProfile,
  logout,
} from "../controllers/authController.js";
import { protect } from "../middleware/auth.js";
import { getProfileOrders } from "../controllers/orderController.js";

const router = express.Router();

const registerValidation = [
  check("fullName", "Name is required").not().isEmpty(),
  check("email", "Please include a valid email").isEmail(),
  check("phoneNumber", "Please include a valid phone number").not().isEmpty().isMobilePhone('any'),
  check(
    "password",
    "Please enter a password with 6 or more characters"
  ).isLength({ min: 6 }),
];

const loginValidation = [
  check("email", "Please include a valid email").isEmail(),
  check("password", "Password is required").exists(),
];

router.post("/register", registerValidation, register);
router.post("/login", loginValidation, login);
router.post("/logout", logout);
router.get("/me", protect, profile);
router.get("/profile", protect, profile);
router.get("/profile/orders", protect, getProfileOrders);
router.post("/check-email", checkEmail);
router.get("/customers", fetchAllCustomers);
router.put("/profile", protect, editProfile);

export default router;
