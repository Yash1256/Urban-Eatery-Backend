const Order = require("./../models/orderModel");
const Food = require("./../models/foodModel");
const Restaurant = require('./../models/restaurantModel')
const User = require('./../models/userModel');
const bson = require('bson')
const createError = require('http-errors')

exports.placeOrder = async (req, res) => {
    try {
        const userId = req.user;
        const { address, restaurant, foodItems, totalPrice } = req.body;
        let order;

        if (address && restaurant && foodItems[0] && totalPrice) {
            for (let i = 0; i < foodItems.length; i++) {
                let foodItem = await Food.findById(foodItems[i].itemId).cache();
                if (!foodItem) {
                    throw new Error("Wrong food Ordered !!! Order can't be placed ");
                }
                if (foodItem.quantity - foodItems[i].quantity < 0) {
                    throw new Error("Wrong food quantity !!! Order can't be placed ");
                }
            }

            for (let i = 0; i < foodItems.length; i++) {
                let foodItem = await Food.findById(foodItems[i].itemId).cache();
                if (foodItem.quantity - foodItems[i].quantity < 0) {
                    throw new Error("Wrong food quantity !!! Order can't be placed ");
                } else {
                    foodItem.quantity -= foodItems[i].quantity;
                    foodItem.save();
                }
            }

            order = await Order.create({ userId, address, restaurant, foodItems, totalPrice })
        }

        res.status(200).json({
            status: "success",
            message: "Order Placed",
            data: order
        })

    } catch (err) {
        return res.status(400).json({
            status: "fail",
            message: err.message,
        });
    }
};

exports.cancelOrder = async (req, res) => {
    try {
        const order = await Order.findByIdAndUpdate(req.params.orderId, { status: 'cancelled' }, { new: true });

        for (let i = 0; i < order.foodItems.length; i++) {
            await Food.findByIdAndUpdate(order.foodItems[i].itemId, {
                $inc: { quantity: order.foodItems[i].quantity }
            }, { new: true });
        }

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
        const result = await Order.find({ userId: bson.ObjectId(req.user) }).cache();

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

exports.orderDashBoard = async (req, res, next) => {
    try {
        const totalOrder = await Order.find().cache().lean();
        const totalRestaurant = (await Restaurant.find().cache()).length;
        let totalCost = 0, itemSold = 0;
        let totalUsers = (await User.find()).length
        for (let i = 0; i < totalOrder.length; i++) {
            totalCost += totalOrder[i].totalPrice;
            for (let j = 0; j < totalOrder[i].foodItems.length; j++) {
                itemSold += totalOrder[i].foodItems[j].quantity;
            }
        }
        console.log(totalCost, totalRestaurant, itemSold);
        res.status(200).json({
            statusCode: 200,
            message: {
                totalCost,
                totalRestaurant,
                itemSold,
                totalUsers
            }
        })
    } catch (err) {
        console.log(err);
        return next(createError(400, err.message));
    }
}

exports.getAllOrder = async (req, res, next) => {
    try {
        const orders = await Order.find();
        res.status(200).json({
            status: "success",
            data: [...orders]
        })
    } catch (err) {
        return next(createError(400, err.message))
    }
}