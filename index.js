import * as dotenv from "dotenv";
import express from "express";
import cors from "cors";
import dbConnect from "./config/dbConnect.js";
import userRoutes from "./routes/userRoute.js";
import {errorHandler, notFound} from "./middlewares/errorHandler.js";
import CookieParser from "cookie-parser";
import morgan from "morgan";
dotenv.config();

const app = express();
dbConnect();

app.use(morgan("dev"));
app.use(express.json());
app.use(cors());
app.use(CookieParser());

app.use("/api/user",userRoutes);
app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Listening on port ${port}...`));