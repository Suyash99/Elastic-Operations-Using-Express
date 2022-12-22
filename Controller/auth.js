exports.isAuthorized = (req, res, next) => {
  let token = req.headers.authorization;

  if (!token) {
    return res.json({
      data: null,
      error: "Unauthorized",
      status: 401,
    });
  }

  next();
};
