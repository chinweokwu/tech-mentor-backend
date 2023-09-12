import User from "../model/userModel.js";
import generateToken  from "../config/jwtToken.js";

export const register = async (req, res) => {
  try {
    const email = req.body.email;
    let user = await User.findOne({ email });

    if (!user) {
      const newUser = await User.create(req.body);

      return res.json({
        _id: newUser._id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
      });
    } else {
      return res.status(400).send({ message: 'Email already has an account' });
    }
  } catch (error) {
    return res.status(500).send({ message: error.details[0].message});
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && (await user.isPasswordMatched(password))) {
      const genToken = generateToken(user._id);

      const { _id, firstName, lastName } = user;

      res.json({
        _id,
        firstName,
        lastName,
        email,
        token: genToken,
      });
    } else {
      res.status(400).send({ message: "Ivalid Email and Password" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal server error" });
  }
};


export const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users)
  } catch(error){
    throw new Error("Internally Server Error")
  }
};

