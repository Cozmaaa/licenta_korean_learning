const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const connectDB = require("./dbConn");
const responseRoutes = require("./routes/responseRoutes");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use("/api", responseRoutes);

connectDB();
mongoose.connection.once("open", () => {
  app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
});
