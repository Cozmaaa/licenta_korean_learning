const express = require('express');
const router = express.Router();
const storyController = require('../controllers/storyController');

router.get('/:id',storyController.getStoryById);
router.get('/',storyController.getAllStories);

router.post('/',storyController.addStory);


module.exports = router