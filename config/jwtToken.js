import jwt from 'jsonwebtoken';

const generateToken = (id) => {
  try {
    const secretKey = process.env.SECRET_KEY;
    if (!secretKey) {
      throw new Error('SECRET_KEY environment variable is missing or empty.');
    }

    const token = jwt.sign({ id }, secretKey, {
      expiresIn: "1d"
    });
    return token;
  } catch (error) {
    console.error("Error generating token:", error);
    throw new Error("Unable to generate token");
  }
};

export default generateToken;