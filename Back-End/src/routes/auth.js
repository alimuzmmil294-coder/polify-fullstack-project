import { Router } from "express";
import { changePassword, deleteAccount, getMe, Login, resendOtp, SignUp, updateProfile, verifyOtp } from "../controllers/auth.js";
import { upload } from "../configs/cloudinary.js";
import { forgotPassword, resetPassword, verifyResetOtp } from "../controllers/password.js";
import { protect } from "../middlewares/authMiddleware.js";

const route = Router();

route.post("/signup",upload.single("image") ,SignUp )
route.post("/verify-otp",  verifyOtp)
route.post("/resend-otp",  resendOtp)


route.post("/login",  Login)
route.post("/forgot-password", forgotPassword)
route.post("/verify-reset-otp", verifyResetOtp)
route.post("/reset-password", resetPassword)


route.get("/me",protect ,getMe)

route.patch("/profile",protect ,upload.single("image"),updateProfile)
route.patch("/password",protect ,changePassword)
route.delete("/account",protect ,deleteAccount)

export default route;