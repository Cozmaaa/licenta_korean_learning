const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const connectDB = require("./dbConn");
const responseRoutes = require("./routes/responseRoutes");
const userRoutes = require("./routes/userRoutes");
const sessionRoutes = require("./routes/sessionRoutes");
const hangeulRouter = require("./routes/hangeulRoutes");
const wordRouter = require("./routes/wordRoutes");
const storyRouter = require("./routes/storyRoutes");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true, // To allow cookies to be sent
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use("/api", responseRoutes);
app.use("/user", userRoutes);
app.use("/session", sessionRoutes);
app.use("/hangeul", hangeulRouter);
app.use("/word", wordRouter);
app.use("/story", storyRouter);

connectDB();
mongoose.connection.once("open", () => {
  app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
});
