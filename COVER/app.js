const bodyParser = require('body-parser');

const express = require('express');

const coverRoutes = require('./routes/cover');

const app = express();

app.use(express.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(coverRoutes);


app.listen(5000);