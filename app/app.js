const express = require("express");
const dotenv = require("dotenv");
const logger = require("morgan");
const cookieParser = require("cookie-parser");
const userRouter = require("./routes/userRoute");


dotenv.config();
const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(cookieParser());

app.use("/user", userRouter);



module.exports = app;