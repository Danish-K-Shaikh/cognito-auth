const express = require("express");
const router = express.Router();

const appRoutes = require("./app");
const authenticateUser = require("./authentication");

router.use("/app", appRoutes);

router.use(authenticateUser);

router.get("/greet", function (req, res) {
  res.json({ msg: "Hello " + req.user.username });
});

module.exports = router;
