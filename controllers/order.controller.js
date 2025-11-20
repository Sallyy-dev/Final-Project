const Order = require('../models/order');
const cateItem = require('../models/cateItem');


// Create Order 
const createOrder = async (req, res) => {
  console.log("Order request body:", req.body);

  const { items, status, date, deliveryInfo } = req.body;

  // Validate items
  if (!items || !items.length) {
    return res.status(400).json({ message: 'items required' });
  }

  // Validate delivery info
if (
  !deliveryInfo ||
  !deliveryInfo.first_name ||
  !deliveryInfo.last_name ||
  !deliveryInfo.phone_number ||
  !deliveryInfo.address
) {
  return res.status(400).json({ message: 'deliveryInfo incomplete' });
}


  try {
    for (const item of items) {
      if (!item.cateItem || !item.quantity || !item.size) {
        return res
          .status(400)
          .json({ message: 'Each item must include cateItem, quantity, and size' });
      }

      if (item.quantity <= 0) {
        return res.status(400).json({ message: 'Quantity must be > 0' });
      }
    }

    // calculate total price from DB only
    let totalPrice = 0;

    for (let item of items) {
      const product = await cateItem.findById(item.cateItem);
      if (!product) {
        return res
          .status(404)
          .json({ message: `Product not found: ${item.cateItem}` });
      }

      item.price = product.price;    
      item.name = product.name;      
      totalPrice += product.price * item.quantity;
    }

    const order = new Order({
      customer: req.user.id,
      items,
      totalPrice,
      status: status || 'pending',
      deliveryInfo,
      paymentMethod: "cash",    
      paymentStatus: "unpaid",
      currency: 'EGP',
      date: date || new Date()
    });

    const newOrder = await order.save();

    res.status(201).json({
      message: "Order placed with Cash",
      order: newOrder
    });

  } catch (err) {
    console.error("Error creating order:", err);
    res.status(500).json({ message: err.message });
  }
};



//  Get All Orders
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("customer", "name email")
      .populate("items.cateItem", "name price image");

    if (!orders.length) {
      return res.status(404).json({ message: "No orders found" });
    }

    res.json(orders);
  } catch (err) {
    console.error("Error fetching orders:", err);
    res.status(500).json({ message: err.message });
  }
};




// Get My Orders (Customer)
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ customer: req.user.id })
      .populate("items.cateItem", "name price image");

    if (!orders.length) {
      return res.status(404).json({ message: 'No orders found' });
    }

    res.json(orders);
  } catch (err) {
    console.error('Error fetching orders:', err);
    res.status(500).json({ message: 'Server error while fetching orders' });
  }
};


// Update Order Status
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const validStatuses = ["pending", "preparing", "on-the-way", "delivered", "canceled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid order status" });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    )
      .populate("customer", "name email")
      .populate("items.cateItem", "name price");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json({ message: "Order status updated", order });

  } catch (err) {
    console.error("Error updating order:", err);
    res.status(500).json({ message: "Server error while updating order" });
  }
};


// Cancel Order
const cancelOrder = async (req, res) => {
  try {
    const { reason } = req.body;
    const { id } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    const isOwner = order.customer.toString() === userId;
    const isAdmin = userRole === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ success: false, message: "Not authorized to cancel this order" });
    }

    const cannotCancelStates = ['delivered', 'canceled'];
    if (cannotCancelStates.includes(order.status)) {
      return res.status(400).json({ success: false, message: "Cannot cancel order in its current state" });
    }

    order.status = 'canceled';
    order.cancellationReason = reason || 'No reason provided';
    order.cancelledAt = new Date();
    order.cancelledBy = userId;

    await order.save();

    res.json({
      success: true,
      message: 'Order canceled successfully',
      data: order
    });

  } catch (err) {
    console.error('Error cancelling order:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};



module.exports = {
  createOrder,
  getAllOrders,
  getMyOrders,
  updateOrderStatus,
  cancelOrder
};
