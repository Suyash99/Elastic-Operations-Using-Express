require("dotenv").config();
const { HttpStatusCode } = require("axios");

exports.isAuthorized = (req, res, next) => {
  let token = req.headers.authorization;

  if (!token || (token && process.env.cookie != token)) {
    return res.json({
      data: null,
      error: "Unauthorized",
      status: HttpStatusCode.Unauthorized,
    });
  }

  next();
};

exports.responseReturn = (response, req, res) => {
  return typeof response == "object"
    ? res.status(200).json({ data: response, error: null, status: HttpStatusCode.Ok })
    : res.status(400).json({ data: null, error: response, status: HttpStatusCode.BadRequest });
};
