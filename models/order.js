const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [
    {
    categoryItem: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
      name: { type: String, required: true },
      price: { type: Number, required: true },
      quantity: { type: Number, required: true },
    }
  ],
  totalPrice: { type: Number, required: true },
  status: { 
  type: String,
  enum: ['pending', 'preparing', 'on-the-way', 'delivered', 'canceled'], 
  default: 'pending' 
},
  date: { type: Date, default: Date.now },
  cancellationReason: { type: String, default: '' },  
  cancelledAt: { type: Date }, 
  cancelledBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  deliveryInfo: {
    first_name: { type: String, required: true },
    last_name:  { type: String, required: true },
    phone_number: { type: String, required: true },
    email: { type: String },
    address: { type: String, required: true },
    city: { type: String, default: 'Cairo' },
  },
})
module.exports = mongoose.model('Order', orderSchema);