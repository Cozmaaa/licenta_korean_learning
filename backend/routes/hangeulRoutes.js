// routes/hangeulRouter.js
const express = require('express');
const router = express.Router();
const hangeulController = require('../controllers/hangeulController'); // Adjust the path as per your project structure

// Route to get all Hangeul letters
router.get('/', hangeulController.getAllHangeulLetters);

// Route to get a single Hangeul letter by its letter attribute
router.get('/:id', hangeulController.getHangeulLetter);
router.get('/:id/next', hangeulController.getNextHangeulLetter);
router.post('/', hangeulController.addHangeulLetter);

module.exports = router;
