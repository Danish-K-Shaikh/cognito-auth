var jwt = require("jsonwebtoken");
const { promisyCallback } = require("../../utils/promiseUtil");
const ACCESS_TOKEN = process.env.ACCESS_TOKEN;

function generateToken(user) {
  return jwt.sign(user, ACCESS_TOKEN, { expiresIn: "30s" });
}

async function validateToken(token) {
  const user = await promisyCallback(
    jwt.verify,
    undefined,
    token,
    ACCESS_TOKEN
  );
  return user;
}

exports.generateToken = generateToken;
exports.validateToken = validateToken;
