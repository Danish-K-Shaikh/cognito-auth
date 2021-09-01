const router = require('express').Router();
const authenticationService = require('../../services/authenticate');
const userService = require('../../services/user');

router.post('/login', async function (req, res) {
  try {
    const { username, password } = req.body;
    let user = await userService.validateUserPassword(username, password);

    const token = authenticationService.generateToken({
      username,
      posts: user.posts,
    });

    res.json({ access_token: token });
  } catch (e) {
    const status = e.status || 500;
    const msg = e.msg || 'Something went wrong';
    res.status(status).json({ msg, error: e });
  }
});

module.exports = router;
