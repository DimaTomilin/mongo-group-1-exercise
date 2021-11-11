const express = require('express');
const app = express();

const path = require('path');

const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const Person = require('./models/person');
const apiRouter = require('./routers/apiRouter');

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
  })
  .then(() => console.log('DB Connected'));

// eslint-disable-next-line no-unused-vars
morgan.token('body', function (req, res) {
  return JSON.stringify(req.body);
});
app.use(
  morgan(' :method :url :status :res[content-length] - :response-time ms :body')
);

app.use('/', express.static(path.resolve('./frontend'))); // serve main path as static dir
app.get('/', function (req, res) {
  // serve main path as static file
  res.sendFile(path.resolve('./frontend/index.html'));
});

app.use('/api', apiRouter);

app.get('/info', async (request, response) => {
  const date = Date();
  const personList = await Person.find({});
  response.send({ date: date, numberOfPeople: personList.length });
});

const port = process.env.PORT || 3001;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
