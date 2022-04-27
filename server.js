const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const cors = require("cors");
const HTTPErrors = require("http-errors");
const HTTPStatuses = require("statuses");
const foodRoutes = require("./routes/foodRoute");
const restaurantRoutes = require("./routes/restaurantRoutes");
const orderRoutes = require("./routes/orderRoute");
const userRoutes = require("./routes/userRoute");
const paymentRoutes = require("./routes/paymentRoute");

require('./services/cache');

//Morgan 
const logger = require("./middlewares/logs");
app.use(logger);

//Swagger Doc
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const morgan = require("morgan");
app.use(morgan('dev'))

const swaggerDocument = YAML.load('./swagger.yaml');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// const morgan = require('morgan');
// const fsr = require('file-stream-rotator');
// morgan.token('host', function (req, res) {
//   return req.hostname;
// })
// morgan.token("wbdaccess", "User trying to access the :url");

// let logsinfo = fsr.getStream({ filename: "logs/test.log", frequency: "1h", verbose: true });

// app.use(morgan('combined'))
// app.use(morgan('wbdaccess', { stream: logsinfo }))

//End Swagger and Morgan

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

dotenv.config();

app.use(cors());

const DB = process.env.DB;

// console.log(DB)

mongoose
  .connect(DB, {
    useNewUrlParser: true,
  })
  .then(() => console.log("DB connection successful!"));

app.use("/api/v1/user", userRoutes);
app.use("/api/v1/food", foodRoutes);
app.use("/api/v1/restaurant", restaurantRoutes);
app.use("/api/v1/order", orderRoutes);
app.use("/payment", paymentRoutes);

app.all("*", (req, res, next) => {
  return next(HTTPErrors(404, `Can't find ${req.originalUrl} on this server!`));
});

app.use(function (err, req, res, next) {
  let messageToSend;

  if (err instanceof HTTPErrors.HttpError) {
    // handle http err
    messageToSend = { message: err.message };

    if (process.env.NODE_ENV === "development") messageToSend.stack = err.stack;

    messageToSend.status = err.statusCode;
  } else {
    messageToSend = { message: err.message };

    if (process.env.NODE_ENV === "development") {
      messageToSend.stack = err.stack;
    }

    messageToSend.status = 400;
  }

  if (process.env.NODE_ENV === "production" && !messageToSend) {
    messageToSend = { message: "Something went very wrong", status: 500 };
  }

  if (messageToSend) {
    let statusCode = parseInt(messageToSend.status, 10);
    let statusName = HTTPStatuses[statusCode];

    res.status(statusCode);
    let responseObject = {
      error: statusName,
      code: statusCode,
      message: messageToSend.message,
    };

    if (messageToSend.stack) {
      responseObject.stack = messageToSend.stack;
    }

    res.send(responseObject);
    return;
  }
});

const port = process.env.PORT || 3001;

module.exports = app.listen(port, '0.0.0.0', () => {
  console.log(`Sever is listening on port ${port}`);
});
