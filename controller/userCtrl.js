import User from "../model/userModel.js";
import generateToken  from "../config/jwtToken.js";
import asyncHandler from "express-async-handler";
import generateRefreshToken from "../config/generateRefreshToken.js";
import jwt from 'jsonwebtoken';
import Joi from "joi";
import passwordComplexity from  "joi-password-complexity";


export const register = asyncHandler(async (req, res) => {
  const validate = (data) => {
    const schema = Joi.object({
      firstName: Joi.string().required().label("First Name"),
      lastName: Joi.string().required().label("Last Name"),
      email: Joi.string().email().required().label("Email"),
      password: passwordComplexity().required().label("password")
    });
    return schema.validate(data);
  };

  try {
    const { error } = validate(req.body);
    if (error) {
      return res.status(400).send({ message: error.details[0].message });
    }

    const email = req.body.email;
    let user = await User.findOne({ email });

    if (!user) {
      const newUser = await User.create(req.body);
      return res.json(newUser);
    }

    throw new Error("Email already has an account");
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Internal server error" });
  }
});

export const login = asyncHandler(async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && (await user.isPasswordMatched(password))) {
      const refreshToken = await generateRefreshToken(user?._id);
      const updateUser = await User.findByIdAndUpdate(
        user?._id,
        {
          refreshToken: refreshToken,
        },
        { new: true }
      );

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        maxAge: 72 * 60 * 60 * 1000, // 3 days
      });

      const { _id, firstName, lastName } = user;

      res.json({
        _id,
        firstName,
        lastName,
        email,
        token: generateToken(_id),
      });
    } else {
      throw new Error("Invalid Email or Password");
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal server error" });
  }
});

export const refreshTk = asyncHandler(async (req, res) => {
  try {
    const cookie = req.cookies;

    if (!cookie?.refreshToken) {
      throw new Error("Invalid Refresh Token");
    }

    const refreshToken = cookie.refreshToken;

    const user = await User.findOne({ refreshToken });
    if (!user) {
      throw new Error("Invalid Refresh Token");
    }
  
    jwt.verify(refreshToken, process.env.JWT_SECRET, (error, decoded) => {
      if (error || user.id !== decoded.id) {
        throw new Error(error);
      }
      const accessToken = generateToken(user?._id);
      res.json({ accessToken });
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal server error" });
  }
});

export const logOut = asyncHandler(async (req, res) => {
  try {
    const cookie = req.cookies;
    if (!cookie?.refreshToken) {
      throw new Error("Invalid Refresh Token");
    }
    const refreshToken = cookie.refreshToken;
  
    const user = await User.findOne({ refreshToken });
    if (!user) {
      res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: true,
      });
      return res.sendStatus(204);
    }
  
    await User.findOneAndUpdate({ refreshToken }, { refreshToken: "" });
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
    });
    res.sendStatus(204);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal server error" });
  }
});

export const getUsers = asyncHandler(async (req, res) => {
  try {
    const users = await User.find();
    res.json(users)
  } catch(error){
    throw new Error("Internally Server Error")
  }
});

