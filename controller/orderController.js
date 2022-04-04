const Order = require("./../models/orderModel");
const Food = require("./../models/foodModel");

exports.placeOrder = async (req, res) => {
  try {
    const userId = req.user;
    const { address, restaurant, foodItems, totalPrice } = req.body;
    let order;

    if (address && restaurant && foodItems[0] && totalPrice) {
      for (let i = 0; i < foodItems.length; i++) {
        let foodItem = await Food.findById(foodItems[i].itemId);
        if (foodItem.qty - foodItems[i].quantity < 0) {
          throw new Error("Wrong food qty !!! Order can't be placed ");
        } else {
          foodItem.qty -= foodItems[i].quantity;
          foodItem.save();
        }
      }

      order = await Order.create({
        address,
        restaurant,
        foodItems,
        totalPrice,
        userId,
      });
    }

    res.status(200).json({
      status: "success",
      message: "Order Placed",
      data: order,
    });
  } catch (err) {
    return res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.cancelOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.orderId,
      { status: "cancelled" },
      { new: true }
    );

    for (let i = 0; i < order.foodItems.length; i++) {
      await Food.findByIdAndUpdate(
        order.foodItems[i].itemId,
        {
          $inc: { quantity: order.foodItems[i].quantity },
        },
        { new: true }
      );
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
