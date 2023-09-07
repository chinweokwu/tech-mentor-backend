import express from "express";
import {
  login,
  register, 
  refreshTk,
  logOut,
} from "../controller/userCtrl.js";
const router = express.Router();

router.post('/login',login);
router.post('/register',register);
router.get('/logout', logOut);
router.get('/refresh', refreshTk);

export default router;
