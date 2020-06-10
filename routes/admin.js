const router = require("express").Router();
const adminController = require("../controllers/adminController");
const adminAuth = require("../middlewares/adminAuth");

router.get("/", adminAuth, adminController.dashboardPage);
router.get("/login", adminController.loginPage);
router.post("/login", adminController.doLogin);
router.get("/products", adminAuth, adminController.productsPage);
router.get("/products/search", adminAuth, adminController.productsSearchPage);
router.get("/products/edit/:id", adminAuth, adminController.editProductPage);
router.post("/products/edit/:id", adminAuth, adminController.editProduct);
router.get("/products/delete/:id", adminAuth, adminController.deleteProduct);
router.post("/products", adminController.addProduct);
router.get("/orders", adminAuth, adminController.ordersPage);
router.get("/orders/:id", adminAuth, adminController.singleOrderPage);
router.post("/orders/:id", adminAuth, adminController.updateStatus);
router.get("/messages", adminAuth, adminController.messagePage);
router.get("/messages/:id", adminAuth, adminController.singleMessagePage);

module.exports = router;
