const express = require("express");
const User = require("../models/user");
const router = express.Router();

const { signUp, login } = require("../controllers/user_authentication");

router.post("/signup", async (req, res) => {
  const retJson = await signUp(req.body);
  res.status(retJson.statusCode).json(retJson.body);
});

router.post("/login", async (req, res) => {
  const retJson = await login(req.body);
  res.status(retJson.statusCode).json(retJson.body);
});

module.exports = router;
