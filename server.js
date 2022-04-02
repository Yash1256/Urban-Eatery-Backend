const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require('dotenv');
const bodyParser = require("body-parser");
const cors = require("cors");
const foodRoutes = require("./routes/foodRoute");
const restaurantRoutes = require("./routes/restaurantRoutes");
const orderRoutes = require("./routes/orderRoute")

//Morgan 
var morgan = require('morgan');
//const fs = require('fs');
//const path = require('path');
const fsr = require('file-stream-rotator');

//Swagger Doc
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');

const swaggerDocument = YAML.load('./swagger.yaml');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));




morgan.token('host', function(req, res){
  return req.hostname;
})
morgan.token("wbdaccess", "User trying to access the :url");

let logsinfo = fsr.getStream({filename:"logs/test.log", frequency:"1h", verbose: true});

app.use(morgan('wbdaccess', {stream: logsinfo}))



app.listen(3000);

//End Swagger and Morgan

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

dotenv.config({ path: './config.env' });

app.use(cors());

const DB = process.env.DB;

console.log(DB)

mongoose
  .connect(DB, {
    useNewUrlParser: true,
  })
  .then(() => console.log("DB connection successful!"));

app.use("/api/v1/food", foodRoutes);
app.use("/api/v1/restaurant", restaurantRoutes);
app.use("/api/v1/order", orderRoutes);

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
