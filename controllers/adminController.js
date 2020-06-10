const jwt = require("jwt-then");
const path = require("path");
const util = require("util");
const moment = require("moment");

exports.loginPage = async (req, res) => {
  res.render("admin/login", {
    layout: false,
  });
};

exports.doLogin = async (req, res) => {
  if (req.body.username === "medhub" && req.body.password === "medhub@xyz123") {
    req.flash("success", "Logged in successfully.");
    const token = await jwt.sign({}, process.env.ADMINSECRET);
    res.cookie("adminKey", token, { maxAge: 86400000 });
    res.redirect("/admin/");
  } else {
    req.flash("error", "Login failed - Username and password did not match.");
    res.redirect("back");
  }
};

exports.dashboardPage = async (req, res) => {
  res.render("admin/index", {
    layout: "admin",
    title: "Dashboard",
    active_dashboard: true,
  });
};

exports.singleOrderPage = async (req, res) => {
  let [
    order,
  ] = await pool.query(
    "SELECT orders.*, users.name, users.email FROM orders INNER JOIN users ON orders.user_id=users.id AND orders.id=? ORDER BY id DESC LIMIT 50",
    [req.params.id]
  );

  order.formatted_date = moment
    .unix(order.created_at / 1000)
    .format("DD MMM, YYYY");

  let ordersItems = await pool.query(
    "SELECT * FROM order_items INNER JOIN products ON order_items.product_id=products.id AND order_items.order_id=?",
    [req.params.id]
  );

  ordersItems = ordersItems.map(item => {
    item.total = (+item.quantity * +item.price).toFixed(2);
    return item;
  });

  res.render("admin/order-single", {
    order,
    active_orders: true,
    layout: "admin",
    title: "View Order",
    ordersItems,
    pendingStatus: order.status === "Pending",
    approvedStatus: order.status === "Approved",
    declinedStatus: order.status === "Declined",
    dispatchedStatus: order.status === "Dispatched",
    deliveredStatus: order.status === "Delivered",
  });
};

exports.updateStatus = async (req, res) => {
  const status = req.body.status;
  const id = req.params.id;

  await pool.query("UPDATE orders SET status=? WHERE id=?", [status, id]);

  req.flash("success", "Updated status to " + status + ".");
  res.redirect("back");
};

exports.ordersPage = async (req, res) => {
  let orders = await pool.query(
    "SELECT orders.*, users.name FROM orders INNER JOIN users ON orders.user_id=users.id ORDER BY id DESC LIMIT 50"
  );

  orders = orders.map(order => {
    order.formatted_date = moment
      .unix(order.created_at / 1000)
      .format("DD MMM, YYYY");
    return order;
  });

  res.render("admin/orders", {
    layout: "admin",
    title: "Orders",
    orders,
    active_orders: true,
  });
};

exports.productsPage = async (req, res) => {
  const products = await pool.query(
    "SELECT title, price, id FROM products ORDER BY id DESC LIMIT 50"
  );
  res.render("admin/products", {
    layout: "admin",
    title: "Products",
    active_products: true,
    products,
  });
};

exports.productsSearchPage = async (req, res) => {
  const query = req.query.query;
  const products = await pool.query(
    "SELECT * FROM products WHERE MATCH(title, description) AGAINST(? IN NATURAL LANGUAGE MODE)",
    [query]
  );
  res.render("admin/products-search", {
    layout: "admin",
    title: "Products Search",
    active_products: true,
    products,
    query,
  });
};

exports.addProduct = async (req, res) => {
  try {
    let { title, description, price } = req.body;
    if (!title) throw "Title is required";
    if (!description) description = "";
    if (!price) throw "Price is required.";
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

    await pool.query(
      "INSERT INTO products (title, description, price, image_url) VALUES (?,?,?,?)",
      [title, description, price, URL]
    );

    req.flash("success", "New Product [" + title + "] added.");
  } catch (err) {
    console.log(err);
    req.flash("error", err);
  }
  res.redirect("back");
};

exports.editProductPage = async (req, res) => {
  const id = req.params.id;

  const [product] = await pool.query("SELECT * FROM products WHERE id=?", [id]);

  if (!product) {
    req.flash("error", "Product not found.");
    res.redirect("back");
    return;
  }

  product.in_stock = product.in_stock == 1 ? true : false;
  res.render("admin/product-edit", {
    layout: "admin",
    title: "Product Edit",
    active_products: true,
    product,
  });
};

exports.editProduct = async (req, res) => {
  try {
    const id = req.params.id;
    let { title, description, price, in_stock } = req.body;
    if (!title) throw "Title is required";
    if (!description) description = "";
    if (!price) throw "Price is required.";
    if (!in_stock) throw "In stock is required.";
    let URL = "";
    if (req.files && req.files.image) {
      const file = req.files.image;
      const fileName = file.name;
      const size = file.data.length;
      const extension = path.extname(fileName);

      const allowedExtensions = /png|jpeg|jpg|gif/;

      if (!allowedExtensions.test(extension)) throw "Unsupported extension!";
      if (size > 5000000) throw "File must be less than 5MB";

      const md5 = file.md5;

      URL = "/uploads/" + md5 + extension;

      await util.promisify(file.mv)("./public" + URL);
    }

    if (URL.length > 0) {
      await pool.query(
        "UPDATE products SET title=?, price=?, description=?,in_stock=?, image_url=? WHERE id=?",
        [title, price, description, in_stock, URL, id]
      );
    } else {
      await pool.query(
        "UPDATE products SET title=?, price=?, description=?,in_stock=? WHERE id=?",
        [title, price, description, in_stock, id]
      );
    }

    req.flash("success", "Product Edited.");
  } catch (err) {
    console.log(err);
    req.flash("error", err);
  }
  res.redirect("back");
};

exports.deleteProduct = async (req, res) => {
  await pool.query("DELETE FROM products WHERE id=?", [req.params.id]);

  req.flash("success", "Product Deleted.");
  res.redirect("back");
};

exports.messagePage = async (req, res) => {
  const messages = await pool.query(
    "SELECT * FROM contact_messages ORDER BY id DESC LIMIT 50"
  );

  res.render("admin/messages", {
    messages,
    title: "Recent Messages",
    layout: "admin",
    active_contact: true,
  });
};

exports.singleMessagePage = async (req, res) => {
  const [
    message,
  ] = await pool.query("SELECT * FROM contact_messages WHERE id=?", [
    req.params.id,
  ]);

  res.render("admin/message-single", {
    message,
    title: "View Message",
    layout: "admin",
    active_contact: true,
  });
};
