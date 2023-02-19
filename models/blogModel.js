import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({
    title:{
        type:String,
        required: true,
    },
    contect:{
        type:String,
        required: true,
    },
    image:{
        type:String,
        required: true,
    },
    catagory:{
        type:String,
        required:true
    },
    author:{
        type:String,
        required:true,
    },
    userId:{
        type:String,
        required: true,
    },
    like:{
        type:Array,
        default:[]
    },
    comments:[
        {
            comment:String,
            createdAt:Date,
            postedBy:{type:mongoose.Schema.Types.ObjectId,ref:"user"}
        }
    ]
},{timestamps:true})

const BlogModel = mongoose.model("blog",blogSchema)

export default BlogModel;

