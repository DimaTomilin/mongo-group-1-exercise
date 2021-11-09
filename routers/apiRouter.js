const express = require('express');
const router = express.Router();

const {
  getAllPeople,
  createPerson,
  getPersonByName,
  deletePerson,
} = require('../controller/person');

router.get('/persons', getAllPeople);
router.post('/person', createPerson);
router.get('/person', getPersonByName);
router.delete('/person', deletePerson);

module.exports = router;
