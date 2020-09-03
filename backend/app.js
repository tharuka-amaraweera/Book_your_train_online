const express = require("express");
//from this express() function can make use of many utilities
const app = express();
//need it install it first. Use for error handling
const morgan = require("morgan");
const bodyPorser = require("body-parser"); //first wee need to install body=parser
const mongoose = require("mongoose"); //to set up the db connection in app.js file
var exphbr = require("express-handlebars");
var nodemailer = require("nodemailer");

const productRoutes = require("./api/routes/product");
const orderRoutes = require("./api/routes/orders");
const trainRoutes = require("./api/routes/trains");
const govRoutes = require("./api/routes/govs");
const bookResults = require("./api/routes/bookResults");
const email = require("./api/routes/email");
const sms = require("./api/routes/sms");

mongoose.connect(
  "mongodb+srv://tharuka:" +
    process.env.MONGO_ATLAS_PW +
    "@cluster0-uhrqp.mongodb.net/test?retryWrites=true",
  {
    //useMongoClient:true- this gave an error
    useNewUrlParser: true
  }
);

app.use(morgan("dev"));
//applies bodies which you want to pass
//extended:false means it dosent give inside data, just give a simple overvview
app.use(bodyPorser.urlencoded({ extended: false }));
app.use(bodyPorser.json()); //extract json data and make easily readable to us
//middlewares which forward requests for router purpose

//adding a response header appending them to incomming requests to prevent corse errors
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-Width, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    //OPTIONS FOR POST AND PUT OPERATIONS
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next(); //if it is not a POST or PUT request other routes can take this over
});

app.use("/product", productRoutes);
app.use("/orders", orderRoutes);
app.use("/trains", trainRoutes);
app.use("/govs", govRoutes);
app.use("/bookResults", bookResults);
app.use("/email", email);
app.use("/sms", sms);

// handle every request that reaches this line , cause if you reach this line no routes file in router directory was able to handle the rquest
app.use((req, res, next) => {
  const error = new Error("Not Found");
  //if wee assign the error.status like bellow it will give the node errorr functions not our created  one
  //error.status(404);
  //so to give our errors need to give error status like this
  error.status = 404;
  //forward the error
  next(error);
});

//handle all kinds of errors like above(404 )we createted and forwarded or errorrs thrown from anywhere from this application
app.use((error, req, res, next) => {
  //create a response to send back
  //(assign 500 for other kinds of errors)
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });
});
module.exports = app;
