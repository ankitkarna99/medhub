const router = require("express").Router();
const indexController = require("../controllers/indexController");

router.get("/", indexController.indexPage);
router.get("/about", indexController.aboutPage);
router.get("/contact", indexController.contactPage);
router.post("/contact", indexController.storeContactMessage);
router.get("/login", indexController.loginPage);
router.post("/login", indexController.doLogin);
router.get("/register", indexController.registerPage);
router.post("/register", indexController.doRegister);
router.get("/store", indexController.storePage);
router.get("/orders", indexController.ordersPage);
router.get("/cart", indexController.cartPage);
router.get("/checkout", indexController.checkoutPage);
router.post("/checkout", indexController.doCheckout);
router.get("/cart/delete/:id", indexController.deleteFromCart);
router.get("/logout", indexController.logout);
router.get("/store/search", indexController.searchResults);
router.get("/product/:id", indexController.productPage);
router.post("/product/:id", indexController.addToCart);

module.exports = router;
