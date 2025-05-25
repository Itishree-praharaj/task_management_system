import userModel from "../models/User.js";
import bcrypt from "bcryptjs";
import asyncHandler from "../middlewares/asyncHandler.js";
import generateToken from "../utils/generateToken.js";
import jwt from "jsonwebtoken";

const domain =
  process.env.NODE_ENV === "production"
    ? "taskmanger-server-qg2o.onrender.com"
    : "localhost";

    const signupUser = asyncHandler(async (req, res) => {
      const { firstname, lastname, email, password } = req.body;
    
      if (!firstname || !lastname || !email || !password) {
        throw new Error("Please fill all the fields");
      }
    
      const existUser = await userModel.findOne({ where: { email } });
      if (existUser) {
        return res.status(400).send("User already exists");
      }
    
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
    
      const newUser = await userModel.create({
        firstname,
        lastname,
        email,
        password: hashedPassword,
      });
    
      // Generate a JWT token
      const token = jwt.sign({ userId: newUser.id }, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });
    
      // Send JWT token in cookie
      res.cookie("jwt", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // secure flag in production
        sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
        path: "/",
        maxAge: 24 * 60 * 60 * 1000, // 1 day
      });
    
      // Return user data
      res.status(201).json({
        success: true,
        _id: newUser.id,
        firstname: newUser.firstname,
        lastname: newUser.lastname,
        email: newUser.email,
      });
    });
    

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const existingUser = await userModel.findOne({ where: { email } });

  if (existingUser) {
    const isPasswordValid = await bcrypt.compare(password, existingUser.password);

    if (isPasswordValid) {
      generateToken(res, existingUser.id);
      res.status(200).json({
        _id: existingUser.id,
        firstname: existingUser.firstname,
        lastname: existingUser.lastname,
        email: existingUser.email,
      });
    } else {
      res.status(401).json({ message: "Invalid Password" });
    }
  } else {
    res.status(404).json({ message: "User not found" });
  }
});

const logoutUser = asyncHandler(async (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: "Logged out successfully" });
});

const google = asyncHandler(async (req, res) => {
  const { name, email, googlePhotoUrl } = req.body;

  const user = await userModel.findOne({ where: { email } });

  if (user) {
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res
      .status(200)
      .cookie("jwt", token, {
        httpOnly: true,
        domain,
        signed: true,
        path: "/",
        secure: true,
        sameSite: "None",
        maxAge: 1 * 24 * 60 * 60 * 1000,
      })
      .json(user);
  } else {
    const generatedPassword =
      Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
    const hashedPassword = bcrypt.hashSync(generatedPassword, 10);

    const newUser = await userModel.create({
      firstname: name,
      lastname: name,
      email,
      profilePicture: googlePhotoUrl,
      password: hashedPassword,
    });

    const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res
      .status(200)
      .cookie("jwt", token, {
        httpOnly: true,
        domain,
        signed: true,
        path: "/",
        secure: true,
        sameSite: "None",
        maxAge: 1 * 24 * 60 * 60 * 1000,
      })
      .json(newUser);
  }
});

export { signupUser, loginUser, logoutUser, google };
