const express = require('express');
const app = express();

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

app.use(express.json());

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>');
});

app.get('/api/persons', (request, response) => {
  response.json(phonebook);
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

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id);
  const person = phonebook.find((person) => person.id === id);

  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id);
  phonebook = phonebook.filter((person) => person.id !== id);

  response.status(204).end();
});

app.post('/api/persons', (request, response) => {
  const body = request.body;
  body.id = Math.floor(Math.random() * 1000);

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: 'content missing',
    });
  } else if (phonebook.find((person) => person.name === body.name)) {
    return response.status(403).json({ error: 'name must be unique' });
  }

  phonebook = phonebook.concat(body);
  response.json(body);
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
