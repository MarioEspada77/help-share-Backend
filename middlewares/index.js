const checkUsernameAndPasswordNotEmpty = (req, res, next) => {
  const { username, password } = req.body;

  if (username !== "" && password !== "") {
    res.locals.auth = req.body;
    next();
  } else {
    res.status(422).json({ code: "validation" });
  }
};

module.exports = {
  checkUsernameAndPasswordNotEmpty
};
