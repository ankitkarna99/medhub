const jwt = require("jwt-then");

module.exports = async (req, res, next) => {
  try {
    if (!req.cookies.userKey) throw "Forbidden!!";
    const token = req.cookies.userKey;
    const payload = await jwt.verify(token, process.env.USERSECRET);
    req.payload = payload;
    const [
      cart,
    ] = await pool.query("SELECT COUNT(*) as num FROM cart WHERE user_id=?", [
      payload.id,
    ]);
    res.locals.loggedIn = true;
    res.locals.cartCount = cart.num;
  } catch (err) {
    res.locals.loggedIn = false;
  }
  next();
};
