const express = require("express");
const router = express.Router();
const {
  getCateTypes,
  searchCateType,
  getItemsByType,
  addCategory,
//   getAllCateItems
} = require("../controllers/category.controller");

router.get("/cate-types", getCateTypes);
router.get("/search", searchCateType);
router.get("/items/:type", getItemsByType);
// router.get("/food", getAllCateItems);

router.post("/categories", addCategory);

module.exports = router;
