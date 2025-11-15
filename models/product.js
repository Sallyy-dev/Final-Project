const mongoose = require("mongoose");
const productSchema = new mongoose.Schema({
   title:{
        required: true,
        type: String ,
        unique : true
    },
   price:{
        required : true,
        type: String ,
        unique : true
    },
    description:{
        required :true,
        type : String
    }
});
module.exports = mongoose.model('Product', productSchema);