const express = require("express");
const orderController = require("./../controller/orderController");

const router = express.Router();

router.post("/placeOrder", orderController.placeOrder);
router.get("/cancelOrder", orderController.cancelOrder);
router.get("/pastOrders", orderController.pastOrders);

module.exports = router;
