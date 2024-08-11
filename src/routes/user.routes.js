import { Router } from "express";
import {
  loginUser,
  logoutUser,
  registerUser,
  refreshAccessToken,
  updatePassword,
  updateAccountDetails,
  updateUserAvatar,
  getUserChannelProfile,
  getWatchHistory,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyjwt } from "../middlewares/auth.middleware.js";

const router = Router();

//multer middleware suppoed to be used just before the funciton is executed

router.route("/register").post(
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),
  registerUser
);

router.route("/login").post(loginUser);

//secured routes

router.route("/logout").post(verifyjwt, logoutUser);

router.route("/refresh-token").post(refreshAccessToken);

router.route("/change-password").post(verifyjwt, updatePassword);
router.route("/update-info").post(verifyjwt, updateAccountDetails);
router
  .route("/avatar")

  .patch(verifyjwt, upload.single("avatar"), updateUserAvatar);

router.route("/c/:username").get(verifyjwt, getUserChannelProfile);

router.route("/history").get(verifyjwt, getWatchHistory);

export default router;
