import  User from '../model/userModel.js';
import  jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';

export const authMiddleware = asyncHandler(async (req, res, next) => {
  let token;
  if(req.headers?.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(' ')[1];
    try {
      if(token){
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded?.id);
        next();
      }
    }catch(error){
      throw new Error('Not Authorized token expired, please login again');
    }
  }else {
    throw new Error('No token attached to this header');
  }
});

export const adminAuthMiddleware = asyncHandler(async (req, res, next) => {
  const {email}= req.user;
  const adminUser = await User.findOne({email});
  if(adminUser.role !== 'admin'){
    throw new Error('Not an Authorized Admin');
  }else{
    next();
  }
});


