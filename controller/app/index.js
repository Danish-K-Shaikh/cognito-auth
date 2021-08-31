const router = require("express").Router();
const authenticationService = require("../../services/authenticate");

var users = [
  {
    username: "tom",
    password: "tom",
    posts: [{ title: "javascript" }],
  },
  {
    username: "jerry",
    password: "jerry",
    posts: [{ title: "nodejs" }],
  },
];

router.post("/login", function (req, res) {
  const { username, password } = req.body;
  let user = users.find((user) => user.username === username);
  if (!user) return res.sendStatus(401);
  if (user && user.password !== password) {
    return res.sendStatus(403);
  }
  const token = authenticationService.generateToken({
    username,
    posts: user.posts,
  });
  res.json({ access_token: token });
});

module.exports = router;
