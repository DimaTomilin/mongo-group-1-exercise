const Person = require('../models/person');

exports.getAllPeople = async (req, res) => {
  try {
    const personList = await Person.find({});
    res.send(personList);
  } catch (error) {
    res.send(error);
  }
};

exports.createPerson = async (req, res) => {
  const { name, number } = req.body;
  try {
    const person = new Person({ name, number });
    const isSuccedde = await person.save();
    res.send(person._id);
  } catch (error) {
    res.send(error);
    return;
  }
};

exports.getPersonByName = async (req, res) => {
  const name = req.query.name;
  try {
    const person = await Person.find({ name: name });
    if (!person[0]) {
      res.status(404).send('Person not found');
      return;
    }
    res.send(person[0]);
  } catch (error) {
    res.send(error);
    return;
  }
};

exports.deletePerson = async (req, res) => {
  const name = req.query.name;
  try {
    const person = await Person.find({ name: name });
    await Person.findByIdAndRemove(person._id);
    res.status(204).end();
  } catch (error) {
    res.send(error);
    return;
  }
};
