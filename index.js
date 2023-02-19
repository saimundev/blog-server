import express from "express";
import { join } from "path"
import cors from "cors";
import * as dotenv from "dotenv";
import dbConnect from "./models/db.js";
import userRouter from "./routes/userRoute.js";
import blogRouter from "./routes/blogRouter.js"

//INIT APP
const app = express();

//ENV CONFIGE
dotenv.config();

//DB CONNECT
dbConnect();

//MIDDLEWARE
app.use(express.json());
app.use(cors());
app.use(express.static(join(__dirname,"public/upload")))

//ROUTER
app.use("/api/user", userRouter);
app.use("/api/blog", blogRouter);

//PORT
const port = process.env.PORT || 5050;

//SERVER
app.listen(port, () => {
  console.log("server is raning on the port is 5050");
});
