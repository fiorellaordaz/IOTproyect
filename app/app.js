const express = require("express");
const dotenv = require("dotenv");
const logger = require("morgan");
const cookieParser = require("cookie-parser");
const userRouter = require("./routes/userRoute");
const cors = require("cors");
const dataRouter = require("./routes/dataRoute");

dotenv.config();
const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(cookieParser());
app.use(cors());

app.use("/user", userRouter);
app.use("/data", dataRouter);



module.exports = app;