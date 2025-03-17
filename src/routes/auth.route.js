import express from "express";
const router = express.Router();

import { protectRoute } from "../middlewares/auth.middleware.js";
import {
  handleSignup,
  handleLogin,
  handleLogout,
  updateProfile,
  checkAuth,
} from "../controllers/auth.controller.js";

router.post("/signup", handleSignup);
router.post("/login", handleLogin);
router.get("/logout", handleLogout);

router.put("/update-profile", protectRoute, updateProfile);

router.get("/check", protectRoute, checkAuth);
export default router;
