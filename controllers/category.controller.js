const Category = require("../models/categories");
const CateItem = require("../models/cateItem");
// 
const getCateTypes = async (req, res) => {
  try {
    const categories = await Category.find({isActive : true}).select("name");
    const menuTypes = categories.map(c => c.name);
    res.json({ success: true, data: menuTypes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


const searchCateType = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res
        .status(400)
        .json({ success: false, message: "Please input the item" });
    }

    const regex = new RegExp(query, "i");
    const items = await CateItem.find({ name: regex }).populate(
      "category",
      "name"
    );

    if (!items.length) {
      return res
        .status(404)
        .json({ success: false, message: "No results found" });
    }

    res.json({ success: true, count: items.length, data: items });
  } catch (error) {
    res.status(500).json({ success: false, message: "server error" });
  }
};


const getItemsByType = async (req, res) => {
  try {
    const { type } = req.params;
    const category = await Category.findOne({ name: type });

    if (!category) {
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });
    }

    const items = await CateItem.find({ category: category._id }).populate(
      "category",
      "name"
    );

    res.json({ success: true, type, count: items.length, data: items });
  } catch (error) {
    res.status(500).json({ success: false, message: "server error" });
  }
};

//  add new category
const addCategory = async (req, res) => {
  try {
    const { name, description, image } = req.body;
    const newCategory = new Category({ name, description, image });
    const savedCategory = await newCategory.save();
    res
      .status(201)
      .json({ success: true, message: "Category added", data: savedCategory });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//  get all food items
// const getAllCateItems = async (req, res) => {
//   try {
//     const items = await CateItem.find().populate("category", "name");
//     res.json({ success: true, count: items.length, data: items });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

module.exports = {
  getCateTypes,
  searchCateType,
  getItemsByType,
  addCategory
//   getAllCateItems
};
