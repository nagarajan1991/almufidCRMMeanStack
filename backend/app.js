const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const visitRoutes = require('./routes/visits');
const planVisitRoutes = require('./routes/planvisits');
const userRoutes = require('./routes/user');

const Visit = require('./models/visit');

const app = express();

mongoose.set('useCreateIndex', true);

mongoose.connect("mongodb://almufid:" + process.env.MONGO_PWD
+ "@localhost:27017/almufid-crm", { useNewUrlParser: true })
.then(()=> {
  console.log('Connected to Database!');
})
.catch(()=> {
  console.log('Connection failed');
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  next();
});

app.use("/api/visits", visitRoutes);
app.use("/api/user", userRoutes);
app.use("/api/planvisits", planVisitRoutes);

module.exports = app;
