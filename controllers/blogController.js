import BlogModel from "../models/blogModel.js";

//CREATE BLOG
export const createBlog = async (req, res) => {
  const { title, contect, userId } = req.body;
  try {
    if (title && contect && userId) {
      if (req.file) {
        const blog = new BlogModel({
          ...req.body,
          image: req?.file?.filename,
        });

        const saveBlog = await blog.save();
        res.status(200).json({ message: saveBlog });
      } else {
        res.status(400).json({ message: "Image is required" });
      }
    } else {
      res.status(400).json({ message: "all field are required" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//BLOG BY ID
export const blogById = async (req, res) => {
  const { id } = req.params;
  try {
    const blog = await BlogModel.findById({ _id: id }).populate("comments.postedBy");
    res.status(200).json(blog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//BLOG BY USER
export const blogByUser = async (req, res) => {
  const { userId } = req.params;
  console.log(userId)
  try {
    const user = await BlogModel.find({ userId: userId });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//All Blog
export const allBlog = async (req, res) => {
  const search = req.query.search || "";
  const catagory = req.query.catagory || "";
  const page = req.query.page || 1;
  const query = {title:{$regex:search,$options:"i"}}
console.log(catagory)
  if(catagory !== "all"){
    query.catagory = catagory
  }
  const ITEM_PER_PAGE = 6
  try {
    const skip = (page - 1) * ITEM_PER_PAGE;
    const blog = await BlogModel.find(query).sort({createdAt:-1}).limit(ITEM_PER_PAGE).skip(skip)
    const tatalPage = await BlogModel.countDocuments(query);
    const pageCount = Math.ceil(tatalPage / ITEM_PER_PAGE)
    res.status(200).json({
      pagenation:{
        pageCount,
        tatalPage
      },
      blog
    })
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//update Blog
export const updateBlog = async (req, res) => {
  console.log("-->",req.file);
  const { title, contect } = req.body;
  console.log(title)
  const { id } = req.params;
  console.log(id)
  try {
    if (title && contect) {
      let updateInfo;
      if (req.file !== undefined) {
        updateInfo = {
          title,
          contect,
          image: req?.file.filename,
        };
      } else {
        updateInfo = {
          title,
          contect,
        };
      }
      const updateBlog = await BlogModel.findOneAndUpdate(
        { _id: id },
        { $set: updateInfo },
        { new: true }
      );
      res.status(200).json(updateBlog);
    } else {
      res.status(400).json({ message: "All field are required" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//BLOG COMMENT
export const blogComment = async (req, res) => {
  const { id } = req.params;
  const comment = {
    comment: req.body.comment,
    postedBy: req.body.userId,
    createdAt:Date.now(),
  };
  try {
    const commetnBlog = await BlogModel.findOneAndUpdate(
      { _id: id },
      { $push: { comments: comment } },
      { new: true }
    );
    res.status(200).json(commetnBlog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//LIKE AND DISLIKE BLOG
export const like = async (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;
  try {
    const userLike = await BlogModel.findById({ _id: id });
    if (!userLike.like.includes(userId)) {
      const blogLike = await BlogModel.findOneAndUpdate(
        { _id: id },
        { $push: { like: userId } },
        { new: true }
      );
      res.status(200).json(blogLike);
    } else {
      const blogUnLike = await BlogModel.findOneAndUpdate(
        { _id: id },
        { $pull: { like: userId } },
        { new: true }
      );
      res.status(200).json(blogUnLike);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//DELETE Blog
export const deleteBlog = async (req, res) => {
  const { id } = req.params;
  try {
    await BlogModel.findOneAndDelete({ _id: id }, { new: true });
    res.status(200).json({ message: "Delete Successfull" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
