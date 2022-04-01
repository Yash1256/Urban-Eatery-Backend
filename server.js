const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require('dotenv');
const bodyParser = require("body-parser");
const cors = require("cors");
const foodRoutes = require("./routes/foodRoute");
const restaurantRoutes = require("./routes/restaurantRoutes");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

dotenv.config({ path: './config.env' });

app.use(cors());

const DB = process.env.DB;

mongoose
  .connect(DB, {
    useNewUrlParser: true,
  })
  .then(() => console.log("DB connection successful!"));

app.use("/api/v1/food", foodRoutes);

app.use("/api/v1/restaurant", restaurantRoutes);

app.all("*", (req, res) => {
  return res.status(404).json({
    status: "fail",
    message: `Can't find ${req.originalUrl} on this server!`,
  });
});

const port = process.env.PORT || 3001;

app.listen(port, () => {
  console.log(`Sever is listening on port ${port}`);
});
