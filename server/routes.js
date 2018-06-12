'use strict';

const router = require('express').Router();
const fs = require('fs');

let persons = [];

router.get('/persons', (req, res) => {
  fs.readFile('persons.json', 'utf8', (err, data) => {
    if (err) {
      console.log(err);
      res.status(500).send();
    } else {
      if (data) {
        persons = JSON.parse(data);
      }
      res.status(200).json(persons);
    }
  });
});

router.post('/persons', (req, res) => {
  const person = req.body.person;
  persons.push(person);
  storePersons(persons);
  res.status(200).json({ action: 'add', message: 'success' });
});

router.patch('/persons/:name', (req, res) => {
  const name = decodeURIComponent(req.params.name);
  const person = findPerson(name);
  const { property } = req.body;
  person[property.name] = property.value;
  storePersons(persons);
  res.status(200).json({ action: 'update', message: 'success' });
});

router.delete('/persons/:name', (req, res) => {
  const name = decodeURIComponent(req.params.name);
  const person = findPerson(name);
  if (person) {
    persons.splice(persons.indexOf(person), 1);
    storePersons(persons);
    res.status(200).json({ action: 'delete', message: 'success' });
  } else {
    res.status(404).json({ action: 'delete', message: 'failed' });
  }
});

const storePersons = persons => {
  fs.writeFile('persons.json', JSON.stringify(persons), 'utf8', (err, data) => {
    console.log('Persons saved to file...');
  });
};

const findPerson = personName => {
  return persons.find(p => p.name === personName);
};

module.exports = router;
