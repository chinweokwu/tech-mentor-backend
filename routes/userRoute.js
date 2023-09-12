import express from "express";
import {
  login,
  register, 
  getUsers,
} from "../controller/userCtrl.js";
const router = express.Router();

router.post('/login',login);
router.post('/register',register);
router.get('/all-users', getUsers);
export default router;
