const sha256 = require("js-sha256");
const jwt = require("jwt-then");
const path = require("path");
const util = require("util");
const moment = require("moment");

exports.indexPage = async (req, res) => {
  const [newProducts, popularProducts] = await Promise.all([
    pool.query("SELECT * FROM products WHERE in_stock = 1 LIMIT 20"),
    pool.query(
      "SELECT * FROM products WHERE in_stock = 1 ORDER BY RAND() LIMIT 10"
    ),
  ]);
  res.render("index", {
    newProducts,
    popularProducts,
    homeActive: true,
  });
};

exports.aboutPage = async (req, res) => {
  res.render("about", { aboutActive: true });
};

exports.loginPage = async (req, res) => {
  res.render("login", { loginActive: true });
};

exports.registerPage = async (req, res) => {
  res.render("register", { registerActive: true });
};

exports.logout = async (req, res) => {
  res.clearCookie("userKey");
  req.flash("success", "Logged out from the website.");
  res.redirect("/");
};

exports.cartPage = async (req, res) => {
  let products = await pool.query(
    "SELECT cart.id, cart.quantity, products.title, products.price, products.image_url FROM cart INNER JOIN products ON products.id=cart.product_id AND cart.user_id=? ORDER BY id DESC",
    [req.payload.id]
  );

  products = products.map(product => {
    product.total = (
      parseFloat(product.price) * parseInt(product.quantity)
    ).toFixed(2);
    return product;
  });

  const total = products.reduce((acc, product) => {
    return acc + +product.total;
  }, 0);

  res.render("cart", {
    products,
    empty: products.length == 0,
    total: total.toFixed(2),
  });
};

exports.checkoutPage = async (req, res) => {
  res.render("checkout");
};

exports.ordersPage = async (req, res) => {
  let orders = await pool.query("SELECT * FROM orders WHERE user_id=?", [
    req.payload.id,
  ]);

  orders = orders.map(order => {
    order.formatted_date = moment
      .unix(order.created_at / 1000)
      .format("DD MMM, YYYY");
    return order;
  });

  res.render("orders", {
    orders,
    orderActive: true,
  });
};

exports.doCheckout = async (req, res) => {
  try {
    let { phone_number, location } = req.body;
    if (!phone_number) throw "Title is required";
    if (!location) throw "Location is required.";

    let products = await pool.query(
      "SELECT cart.id, cart.quantity, cart.product_id, products.title, products.price, products.image_url FROM cart INNER JOIN products ON products.id=cart.product_id AND cart.user_id=?",
      [req.payload.id]
    );

    if (products.length == 0) throw "Nothing available in cart.";

    if (!(req.files && req.files.image)) throw "Prescription is required.";

    const file = req.files.image;
    const fileName = file.name;
    const size = file.data.length;
    const extension = path.extname(fileName);

    const allowedExtensions = /png|jpeg|jpg|gif/;

    if (!allowedExtensions.test(extension)) throw "Unsupported extension!";
    if (size > 5000000) throw "File must be less than 5MB";

    const md5 = file.md5;
    const URL = "/uploads/" + md5 + extension;

    await util.promisify(file.mv)("./public" + URL);

    const total = products.reduce((acc, product) => {
      return acc + +product.quantity * +product.price;
    }, 0);

    const order = await pool.query(
      "INSERT INTO orders (user_id, phone_number, location, image_url, total, created_at) VALUES (?,?,?,?,?,?)",
      [req.payload.id, phone_number, location, URL, total, Date.now()]
    );

    const promises = [];

    products.forEach(product => {
      promises.push(
        pool.query(
          "INSERT INTO order_items (order_id, product_id, quantity) VALUES (?,?,?)",
          [order.insertId, product.product_id, product.quantity]
        )
      );
    });

    await Promise.all(promises);

    await pool.query("DELETE FROM cart WHERE user_id=?", [req.payload.id]);

    req.flash(
      "success",
      "Your order has been placed. Thanks for ordering with us."
    );
    res.redirect("/");
  } catch (err) {
    console.log(err);
    req.flash("error", err);
    res.redirect("back");
  }
};

exports.deleteFromCart = async (req, res) => {
  await pool.query("DELETE FROM cart WHERE id=? AND user_id=?", [
    req.params.id,
    req.payload.id,
  ]);

  res.redirect("/cart");
};

exports.addToCart = async (req, res) => {
  const { product_id, quantity } = req.body;
  const user_id = req.payload.id;

  await pool.query(
    "INSERT INTO cart (user_id, product_id, quantity) VALUES (?,?,?)",
    [user_id, product_id, quantity]
  );

  req.flash("success", "Added to cart.");
  res.redirect("/cart");
};

exports.doRegister = async (req, res) => {
  try {
    const { name, email, password, password2 } = req.body;
    const [user] = await pool.query("SELECT * FROM users WHERE email=?", [
      email,
    ]);
    if (user) throw "User with that email already exists.";

    if (password !== password2) throw "Confirm password did not match.";

    const result = await pool.query(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [name, email, sha256(password + process.env.SALT)]
    );

    const token = await jwt.sign(
      { id: result.insertId },
      process.env.USERSECRET
    );
    req.flash("success", "Registration Successful!");
    res.cookie("userKey", token, { maxAge: 86400000 });
    res.redirect("/");
  } catch (err) {
    console.log(err);
    req.flash("error", err);
    res.redirect("back");
  }
};

exports.doLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const [user] = await pool.query("SELECT * FROM users WHERE email=?", [
      email,
    ]);
    if (!user) throw "User with that email not found.";

    if (user.password !== sha256(password + process.env.SALT))
      throw "Email and password did not match.";

    const token = await jwt.sign({ id: user.id }, process.env.USERSECRET);
    req.flash("success", "Login Successful!");
    res.cookie("userKey", token, { maxAge: 86400000 * 30 });
    res.redirect("/");
  } catch (err) {
    req.flash("error", err);
    res.redirect("back");
  }
};

exports.contactPage = async (req, res) => {
  res.render("contact", { contactActive: true });
};

exports.productPage = async (req, res) => {
  const [product] = await pool.query("SELECT * FROM products WHERE id=?", [
    req.params.id,
  ]);
  res.render("product", {
    product,
    storeActive: true,
  });
};

exports.storePage = async (req, res) => {
  const products = await pool.query(
    "SELECT * FROM products WHERE in_stock = 1 ORDER BY RAND() LIMIT 50"
  );
  res.render("store", {
    storeActive: true,
    products,
  });
};

exports.storeContactMessage = async (req, res) => {
  const { first_name, last_name, email, subject, message } = req.body;

  await pool.query(
    "INSERT INTO contact_messages (first_name, last_name, email, subject, message) VALUES (?,?,?,?,?)",
    [first_name, last_name, email, subject, message]
  );

  req.flash("success", "Your message was recieved. Thanks for contacting.");
  res.redirect("back");
};

exports.searchResults = async (req, res) => {
  const query = req.query.query;
  const products = await pool.query(
    "SELECT * FROM products WHERE MATCH(title, description) AGAINST(? IN NATURAL LANGUAGE MODE)",
    [query]
  );
  res.render("store", {
    storeActive: true,
    products,
    search: true,
    query,
  });
};
