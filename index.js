import * as dotenv from "dotenv";
import express from "express";
import cors from "cors";
import dbConnect from "./config/dbConnect.js";
import userRoutes from "./routes/userRoute.js";
import CookieParser from "cookie-parser";
import morgan from "morgan";
import helmet from "helmet";

dotenv.config();

const app = express();
dbConnect();

app.use(express.json());
app.use(CookieParser());
app.use(cors(  {origin: "https://whimsical-sherbet-81461d.netlify.app/"}));
app.use(helmet());
app.use(morgan("combined"));

app.use("/api/user",userRoutes);


const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Listening on port ${port}...`));