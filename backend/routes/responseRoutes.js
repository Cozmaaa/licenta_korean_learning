const express = require("express");
const { generateResponse } = require("../controllers/responseController");

const router = express.Router();

router.post("/generate-response", generateResponse);

module.exports = router;
