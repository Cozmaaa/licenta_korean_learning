const express = require('express');
const router = express.Router();
const sessionController = require('../controllers/sessionController');

router.post('/logout',sessionController.logout);

module.exports = router;