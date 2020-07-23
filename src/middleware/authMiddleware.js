const authMiddleware = (req, res, next) => {
  const userId = req.cookies.userId;

  if (!userId) {
    return res.status(401).send();
  }

  req.userId = userId;
  next();
};

module.exports = authMiddleware;