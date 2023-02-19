import express from "express";
import multer from "multer";
import { allBlog, blogById, blogByUser, blogComment, createBlog, deleteBlog, like, updateBlog } from "../controllers/blogController.js";
import auth from "../middlewares/auth.js";
const router = express.Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/upload')
    },
    filename: function (req, file, cb) {
      cb(null, `${Date.now()}-${file.originalname}`)

    }
  })

  const upload = multer({ storage: storage })

router.post("/create-blog",upload.single("image"),auth,createBlog);
router.get("/all-blog",allBlog);
router.get("/single-blog/:id",blogById);
router.get("/user-blog/:userId",auth,blogByUser);
router.put("/update-blog/:id",upload.single("image"),auth,updateBlog);
router.put("/comment-blog/:id",auth,blogComment);
router.put("/likes/:id",like)
router.delete("/delete-blog/:id",auth,deleteBlog)

export default router;
