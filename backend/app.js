const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const CookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const cloudinary = require("cloudinary");
const dotenv = require("dotenv");
const PORT = process.env.PORT || 4000;
const { errorHandler, notFound } = require("./middleware/error/errorHandler");
// routers
const userRouter = require("./routers/userRouters");
const postRouter = require("./routers/postRoutes");
const commentRouter = require("./routers/commentRoutes");
const emailRouter = require("./routers/emailCtl");
const categoryRouter = require("./routers/categoryRoutes");
const path = require("path")

dotenv.config({ path: "backend/config/config.env" });



cloudinary.v2.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

// middleware use
app.use(express.json());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(cors());
app.use("*", cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(CookieParser());

// routers calling here
app.use("/api/users", userRouter);
app.use("/api/post", postRouter);
app.use("/api/comment", commentRouter);
app.use("/api/email", emailRouter);
app.use("/api/category", categoryRouter);

app.use(express.static(path.join(__dirname,"../frontend/build")));

app.get("*",(req,res)=>{
  res.sendFile(path.resolve(__dirname,"../frontend/build/index.html"))
})

app.use(notFound);
app.use(errorHandler);

mongoose
  .connect(process.env.MONGO_DATABASE)
  .then(() => {
    console.log("Database Connected");
  })
  .catch((err) => console.log(err.message));


  

app.listen(process.env.PORT, () => {
  console.log(`Your Server is Running on ${PORT}`);
});
