import UserModal from "../models/userModel.js";
import bcrypt from "bcrypt";
import genAuthToken from "../utils/genAuthToken.js";
import joi from "joi";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

//REGUSTER
export const regusterUser = async (req, res) => {
  console.log(req.body)
  const { name, email, password } = req.body;

  //VALEDATION
  const schema = joi.object({
    name: joi.string().trim().min(3).max(30).required(),
    email: joi.string().trim().min(3).max(30).required().email(),
    password: joi.string().trim().min(5).max(30).required(),
  });
  const { error } = schema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  try {
    //CHECK USER ALREADY EXIST
    const isEmailExist = await UserModal.findOne({ email: email });
    if (isEmailExist)
      return res.status(400).json({ message: "User Already Exist" });

    //IMAGE VALIDATE
    if (req?.file === undefined)
      return res.status(400).json({ message: "Image is required" });

    //CRAETE USER
    const newUser = new UserModal({
      name,
      email,
      password: await bcrypt.hash(password, 10),
      profile: req?.file.filename,
    });
    const user = await newUser.save();
    const token = genAuthToken(user);
    res.status(200).json({ user, token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//LOGIN
export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  

  //VALEDATION
  const schema = joi.object({
    email: joi.string().trim().min(3).max(30).required().email(),
    password: joi.string().trim().min(5).max(30).required(),
  });
  const { error } = schema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  try {
    //CHECK USER NOT ALREADY
    const isEmailExist = await UserModal.findOne({ email: email });
   
    if (!isEmailExist)
      return res.status(400).json({ message: "User Not Found" });

    //CHECK PASSWORD
    const isPasswordMatch =await bcrypt.compare(password, isEmailExist.password);
    if (!isPasswordMatch)
      return res.status(400).json({ message: "Password Not Match" });

    const token = genAuthToken(isEmailExist);
    res.status(200).json({ user: isEmailExist, token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//GET USER
export const getUser = async(req,res)=>{
const {id} = req.params;

  try {
    const user = await UserModal.findById({_id:id})

    res.status(200).json(user)
  } catch (error) {
    res.status(500).json({message:error.message})
  }
}

//FORGET PASSWORD EMAIL SEND LINK
export const forgetEmailLink = async (req, res) => {
  const { email } = req.body;
  try {
    if (email) {
      const existEmail = await UserModal.findOne({ email: email });
      if (existEmail) {
        const token = jwt.sign(
          { email: existEmail.email },
          process.env.SECRIT,
          { expiresIn: "10m" }
        );
        const link = `http://localhost:3000/changepassword/${existEmail._id}/${token}`;
        let transporter = nodemailer.createTransport({
          service: "gmail",
          port: 587,
          secure: false,
          auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD,
          },
        });

        const mailOption = {
          from: process.env.EMAIL,
          to: email,
          subject: "Varefed Email Address",
          html: `<!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta http-equiv="X-UA-Compatible" content="IE=edge">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Document</title>
                <style>
                   
                </style>
            </head>
            <body>
                <h1>varified email address</h1>
                <a href=${link} class="link">Click Here and change your password</a>
            </body>
            </html>`,
        };

        transporter.sendMail(mailOption, (error, data) => {
          if (error) {
            res.status(400).json({ message: "error" });
          } else {
            res.status(200).json({ message: "email send successfully" });
          }
        });
      } else {
        res.status(400).json({ message: "User Not Found" });
      }
    } else {
      res.status(400).json({ message: "Email is required" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//FORGET PASSWORD UPDATE
export const forgetPassword = async (req, res) => {
  const { password, confirmPassword } = req.body;
  const { id, token } = req.params;
  try {
    if (password && confirmPassword) {
      if (password === confirmPassword) {
        const tokenVarefai = jwt.verify(token, process.env.SECRIT);
        if (tokenVarefai) {
          const hasePassword = await bcrypt.hash(password, 10);
          const findUser = await UserModal.findById({ _id: id });
          await UserModal.findOneAndUpdate(
            { _id: findUser._id },
            { password: hasePassword }
          );
          res.status(200).json({ message: "password update successfull" });
        } else {
          res.status(400).json({ message: "Link expair" });
        }
      } else {
        res
          .status(400)
          .json({ message: "password and confirm password not match" });
      }
    } else {
      res
        .status(400)
        .json({ message: "password and confirm password required" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//UPDATE USER
export const updateUser = async (req, res) => {
  const { id } = req.params;
  try {
    if (req.body.name) {
      let updateInfo;
      if (req.file !== undefined) {
        updateInfo = {
          name: req.body.name,
          profile: req.file.filename,
        };
      } else {
        updateInfo = {
          name: req.body.name,
        };
      }

    const updateUser =  await UserModal.findOneAndUpdate(
        { _id: id },
        { $set: updateInfo },
        { new: true }
      );
      res.status(200).json(updateUser)
    } else {
      res.status(400).json({ message: "name is empty" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
