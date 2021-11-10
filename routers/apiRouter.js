const express = require('express');
const router = express.Router();

const {
  getAllPeople,
  createPerson,
  getPersonByName,
  deletePerson,
  updatePerson,
  checkPerson,
} = require('../controller/person');

router.get('/persons', getAllPeople);
router.post('/person', createPerson);
router.get('/person', getPersonByName);
router.delete('/person', deletePerson);
router.put('/person', updatePerson);
router.get('/person/check', checkPerson);

module.exports = router;
