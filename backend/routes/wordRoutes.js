const express = require("express");
const router = express.Router();
const wordController = require("../controllers/wordController");

router.get("/getAllWords",wordController.getAllWords);

router.post("/", wordController.addWord);

router.put("/updateGuesses", wordController.updateWordGuesses);

module.exports = router;
