const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authenticate = require("../middleware/authentificate");

// Route for user registration
router.post("/register", userController.registerUser);
router.post("/login", userController.loginUser);
router.get("/me", authenticate, (req, res) => {
  res.status(200).json({ username: req.user.username });
});
router.post("/findInfo", userController.getUserInfo);
router.post("/setKnowsHangeul", userController.setKnowsHangeul);
router.post("/setLastHangeulLetter", userController.setLastHangeulLetter);
router.post('/getLastHangeulLetter', userController.getLastHangeulLetter);
router.post('/addSavedWord',userController.addWordToSavedWords);
router.post('/isAdmin',userController.checkUserType)
router.post('/removeSavedWord',userController.removeSavedWord)


router.get('/:userId/savedWords',userController.getSavedWords)

module.exports = router;
