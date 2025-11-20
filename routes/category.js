const express = require("express");
const router = express.Router();
const {
  getCateTypes,
  searchCateType,
  getItemsByType,
  addCategory,
} = require("../controllers/category.controller");

router.get("/cate-types", getCateTypes);
router.get("/search", searchCateType);
router.get("/items/:type", getItemsByType);

router.post("/categories", addCategory);

module.exports = router;
