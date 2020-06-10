const jwt = require("jwt-then");

module.exports = async (req, res, next) => {
  try {
    if (!req.cookies.adminKey) throw "Forbidden!!";
    const token = req.cookies.adminKey;
    const payload = await jwt.verify(token, process.env.ADMINSECRET);
    req.payload = payload;
    next();
  } catch (err) {
    res.redirect("/admin/login");
  }
};
