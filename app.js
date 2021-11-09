const express = require('express');
const path = require('path');
const morgan = require('morgan');
const app = express();
var cors = require('cors');

let phonebook = [
  {
    id: 1,
    name: 'Arto Hellas',
    number: '040-123456',
  },
  {
    id: 2,
    name: 'Ada Lovelace',
    number: '39-44-5323523',
  },
  {
    id: 3,
    name: 'Dan Abramov',
    number: '12-43-234345',
  },
  {
    id: 4,
    name: 'Mary Poppendieck',
    number: '39-23-6423122',
  },
];

app.use(cors());
morgan.token('body', function (req, res) {
  return JSON.stringify(req.body);
});

app.use('/', express.static(path.resolve('./frontend'))); // serve main path as static dir
app.get('/', function (req, res) {
  // serve main path as static file
  res.sendFile(path.resolve('./frontend/index.html'));
});

app.use(
  morgan(' :method :url :status :res[content-length] - :response-time ms :body')
);
app.use(express.json());

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>');
});

app.get('/api/persons', (request, response) => {
  response.json(phonebook);
});

app.get('/api/person', (request, response) => {
  const name = request.query.name.toLocaleLowerCase();
  const person = phonebook.find(
    (person) => person.name.toLocaleLowerCase() === name
  );

  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

app.get('/info', (request, response) => {
  const date = Date();
  response.send(`
  <html>
    <body>
            <p>Phonebooke has info for ${phonebook.length} people.<p>
            <p>${date}</p>
    </body>
  </html>
  `);
});

app.get('/api/person/:id', (request, response) => {
  const id = Number(request.params.id);
  const person = phonebook.find((person) => person.id === id);

  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

app.delete('/api/person/:id', (request, response) => {
  const id = Number(request.params.id);
  phonebook = phonebook.filter((person) => person.id !== id);

  response.status(204).end();
});

app.post('/api/person', (request, response) => {
  const body = request.body;
  body.id = Math.floor(Math.random() * 1000);

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: 'content missing',
    });
  } else if (phonebook.find((person) => person.name === body.name)) {
    return response.status(403).json({ error: 'name must be unique' });
  }

  const newPerson = {
    id: Math.floor(Math.random() * 1000),
    name: body.name,
    number: body.number,
  };

  phonebook = phonebook.concat(newPerson);
  response.json(newPerson);
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
