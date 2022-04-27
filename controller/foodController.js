const foodModel = require("./../models/foodModel");
const Restaurant = require("./../models/restaurantModel");


exports.getAllFoods = async (req, res) => {
  try {
    const result = await foodModel.find().cache();
    res.status(200).json({
      status: "success",
      data: result
    })
  } catch (err) {
    return res.status(400).json({
      status: "fail",
      message: err.message,
    })
  }
}

exports.getFoodById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await foodModel.findById(id).cache();

    if (result) {
      return res.status(200).json({
        status: "success",
        data: result,
      });
    }

    res.status(400).json({
      status: "fail",
      message: "No data find with that foodName",
    });
  } catch (err) {
    return res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.getFoodbyCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const result = await foodModel.find({ category }).cache()

    if (result.length > 0) {
      return res.status(200).json({
        status: "success",
        data: result,
      });
    }

    res.status(400).json({
      status: "fail",
      message: "No data find with that Category",
    });
  } catch (err) {
    return res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.createItem = async (req, res) => {
  console.log(req.body)
  try {
    const {
      name,
      restaurant,
      category,
      description,
      img,
      price,
      qty,
      couponAccepted,
    } = req.body;

    const hotel = Restaurant.findById(restaurant)

    if (!hotel) {
      throw new Error("No such Restaurant Exists!!");
    }

    const result = await foodModel.create({
      name,
      restaurant,
      category,
      description,
      img,
      price,
      qty,
      couponAccepted
    });

    if (result) {
      return res.status(201).json({
        status: "success",
        data: result,
      });
    }

    res.status(400).json({
      status: "fail",
      message: "Insufficient Data Given",
    });

  } catch (err) {
    return res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.updateItemById = async (req, res) => {
  try {
    const { name, restaurant, category, description, price, story, qty } = req.body;

    const updatedResult = await foodModel.findByIdAndUpdate(
      req.params.id,
      { name, restaurant, category, description, price, story, qty },
      { new: true }
    );

    if (updatedResult) {
      return res.status(200).json({
        status: "success",
        message: "Data got updated",
      });
    }
  } catch (err) {
    return res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.deleteItem = async (req, res) => {
  try {
    const result = await foodModel.findByIdAndDelete(req.params.id);

    if (result) {
      return res.status(200).json({
        status: "success",
      });
    }

    return res.status(400).json({
      status: "fail",
      message: "No Such Id Exists",
    });
  } catch (err) {
    return res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.mapFoodRestaurant = async (req, res) => {
  try {
    const { foodId, restaurantId } = req.body;
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return res.status(400).json({
        status: "fail",
        message: "No Such Id Exists",
      });
    }
    const mapFood = await foodModel.findByIdAndUpdate(
      foodId,
      { restaurant: restaurantId },
      { new: true }
    );

    if (!mapFood) {
      return res.status(400).json({
        status: "fail",
        message: "No Such Id Exists",
      });
    }

    res.status(200).json({
      status: "success",
      data: mapFood,
    });
  } catch (err) {
    return res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.searchFood = async (req, res) => {
  try {
    const { keyword } = req.params;
    const foods = await foodModel.find({
      $or: [
        { category: { $regex: keyword } }, {
          name: { $regex: keyword }
        },
        {
          restaurant_name: { $regex: keyword }
        }
      ]
    })
    if (!foods) {
      return res.status(400).json({
        status: 'fail',
        message: 'no such food'
      })
    }
    res.status(200).json({
      status: 'success',
      data: foods
    })

  }
  catch (err) {
    return res.status(400).json({
      status: 'fail',
      message: err.message
    })
  }
}