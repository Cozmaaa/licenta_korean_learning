const express = require('express');
const router = express.Router();
const sessionController = require('../controllers/sessionController');

router.post('/logout',sessionController.logout);
router.post('/checkSession',sessionController.checkSession)
router.post('/userIdFromCookie',sessionController.getUserIdFromCookie);

module.exports = router;