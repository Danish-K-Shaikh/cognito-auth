const router = require('express').Router();
const authenticationService = require('../../services/authenticate');
const userService = require('../../services/user');
const { getErrorPayload } = require('../../utils/errorUtil');

async function onSignIn(req, res) {
  try {
    const { userId, password } = req.body;
    let user = await userService.validateUserPassword({ userId, password });

    const token = authenticationService.generateToken(user);
    const refreshToken = authenticationService.generateRefreshToken(user);

    res.json({ access_token: token, refresh_token: refreshToken });
  } catch (e) {
    const { status, ...rest } = getErrorPayload(e, 401);
    res.status(status).json({ ...rest });
  }
}

async function onSignup(req, res) {
  try {
    const body = req.body;
    const newUser = await userService.signupUser(body);
    delete newUser.password;
    res.status(201).json({ data: newUser });
  } catch (error) {
    const { status, ...rest } = getErrorPayload(error, 401);
    res.status(status).json({ ...rest });
  }
}

async function refreshToken(req, res) {
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
}

router.post('/login', onSignIn);
router.post('/signup', onSignup);
router.post('/refresh-token', refreshToken);

module.exports = router;
