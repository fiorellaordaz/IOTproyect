const express = require("express");
const dotenv = require("dotenv");
const logger = require("morgan");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const httpContext = require("express-http-context");
const userRouter = require("./routes/userRoute");
const dataRouter = require("./routes/dataRoute");
const deviceRouter = require("./routes/deviceRoute");
const devControlRoute = require("./routes/devControlRoute");
const summaryActDevRoute = require("./routes/summaryActDevRoute");


dotenv.config();
const app = express();

app.use(httpContext.middleware);
app.use(logger("dev"));
app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use(fileUpload({
    createParentPath:true,
    limits:{fileSize: 20*1024*1024},
    abortUnLimit: true,
    responseOnLimit: "image to large",
    uploadTimeout:0,
}));

app.use(express.static('public'));
app.use('/resources',express.static(__dirname + '/resources'));
app.use("/user", userRouter);
app.use("/data", dataRouter);
app.use("/device",deviceRouter);
app.use("/devControl",devControlRoute);
app.use("/summary",summaryActDevRoute);



module.exports= app;