const Order = require("./../models/orderModel");

exports.placeOrder = async (req, res) => {
    try {
        const userId = req.user;
        const { address, restaurant, foodItems, totalPrice } = req.body;

        if (address && restaurant && foodItems[0] && totalPrice) {
            await Order.create({ userId, address, restaurant, foodItems, totalPrice })
        }

    } catch (err) {
        return res.status(400).json({
            status: "fail",
            message: err.message,
        });
    }
};

exports.cancelOrder = async (req, res) => {
    try {
        await Order.findByIdAndUpdate(req.params.orderId, { status: 'cancelled' });

        res.status(200).json({
            status: "success",
            data: "Order Cancelled",
        });

    } catch (err) {
        return res.status(400).json({
            status: "fail",
            message: err.message,
        });
    }
};

exports.pastOrders = async (req, res) => {
    try {
        const userId = req.user;
        const result = await Order.find({ userId });

        res.status(200).json({
            status: "success",
            data: result,
        });
    } catch (err) {
        return res.status(400).json({
            status: "fail",
            message: err.message,
        });
    }
};