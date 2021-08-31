var authService = require("../../services/authenticate");

module.exports = async function (req, res, next) {
  try {
    console.log({ headers: req.headers });
    const tokenHeader = req.headers["authorization"].split(" ");
    const token = tokenHeader && tokenHeader[1];
    if (!token) return res.sendStatus(401);
    var user = await authService.validateToken(token);
    req.user = user;
    next();
  } catch (e) {
    console.error(e);
    res.sendStatus(401);
  }
};
