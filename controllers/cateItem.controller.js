const CateItem = require('../models/cateItem');

const getAllCateItems = async (req, res) => {
  try {
    const items = await CateItem.find().populate('category', 'name');
    res.json({ success: true, count: items.length, data: items });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


const createCateItem = async (req, res) => {
  const item = new CateItem({
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    image: req.body.image,
    category: req.body.category,
    sizes: req.body.sizes || []
  });

  try {
    const newItem = await item.save();
    res.status(201).json({ success: true, data: newItem });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};


const updateCateItem = async (req, res) => {
  try {
    const updatedItem = await CateItem.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedItem)
      return res.status(404).json({ success: false, message: "Food not found" });

    res.json({ success: true, data: updatedItem });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};


const deleteCateItem = async (req, res) => {
  try {
    const deletedItem = await CateItem.findByIdAndDelete(req.params.id);

    if (!deletedItem)
      return res.status(404).json({ success: false, message: "Food not found" });

    res.json({ success: true, message: "Food item deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getCateItemById = async (req, res) => {
  try {
    const cateItem = await CateItem.findById(req.params.id).populate('category', 'name');

    if (!cateItem)
      return res.status(404).json({ success: false, message: "Food not found" });

    res.json({ success: true, data: cateItem });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


module.exports = {
  getAllCateItems,
  createCateItem,
  updateCateItem,
  deleteCateItem,
  getCateItemById
};
