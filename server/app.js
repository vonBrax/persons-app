'use strict';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const path = require('path');

const personsRoute = require('./routes');
const port = process.env.PORT || 3000;
const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
if ((process.env.NODE_ENV = 'development')) {
  app.use(morgan('dev'));
}

app.use(express.static(path.join(__dirname, '../dist/personsapp')));
app.use('/api', personsRoute);

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/personsapp/index.html'));
});

app.listen(port, () => console.log(`Server listening on port ${port}`));
