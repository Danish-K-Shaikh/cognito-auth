const router = require('express').Router();
const authenticationService = require('../../services/authenticate');
const userService = require('../../services/user');
const { getErrorPayload } = require('../../utils/errorUtil');

router.post('/login', async function (req, res) {
  try {
    const { username, password } = req.body;
    let user = await userService.validateUserPassword(username, password);

    const token = authenticationService.generateToken({
      username,
      posts: user.posts,
    });

    const refreshToken = authenticationService.generateRefreshToken({
      username,
      posts: user.posts,
    });

    res.json({ access_token: token, refresh_token: refreshToken });
  } catch (e) {
    const { status, ...rest } = getErrorPayload(e, 401);
    res.status(status).json({ ...rest });
  }
});

router.post('/refresh-token', async function (req, res) {
  try {
    const refreshToken = req.headers['token'];
    const result = await authenticationService.validateRefreshToken(refreshToken);
    delete result.iat;
    delete result.exp;
    const access_token = await authenticationService.generateToken(result);
    res.status(201).json({ access_token });
  } catch (error) {
    const { status, ...rest } = getErrorPayload(error, 401);
    res.status(status).json({ ...rest });
  }
});

module.exports = router;
