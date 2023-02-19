import express from "express";
import {
  forgetEmailLink,
  forgetPassword,
  getUser,
  loginUser,
  regusterUser,
  updateUser,
} from "../controllers/userController.js";
import multer from "multer";
import auth from "../middlewares/auth.js";
const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/upload");
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

router.post("/reguster", upload.single("profile"), regusterUser);
router.post("/login", loginUser);
router.get("/get-user/:id",auth,getUser);
router.post("/forget-password", forgetEmailLink);
router.put("/forget-password/:id/:token", forgetPassword);
router.put("/update-user/:id", upload.single("profile"), updateUser);

export default router
