const express = require('express');
const app = express();

app.use((req, res, next) => {
  res.send("First middleware");
});


app.use((req, res, next) => {
  res.send("Hello from express");
});

module.exports = app;
