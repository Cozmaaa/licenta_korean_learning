// routes/hangeulRouter.js
const express = require('express');
const router = express.Router();
const hangeulController = require('../controllers/hangeulController'); // Adjust the path as per your project structure


router.get('/', hangeulController.getAllHangeulLetters);

router.get('/:id', hangeulController.getHangeulLetter);
router.get('/:id/next', hangeulController.getNextHangeulLetter);
router.post('/', hangeulController.addHangeulLetter);

module.exports = router;
