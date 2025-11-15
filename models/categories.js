const mongoose = require("mongoose");
const categorySchema = new mongoose.Schema({
    
    product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "product",
  },
});
module.exports = mongoose.model('Category', categorySchema);