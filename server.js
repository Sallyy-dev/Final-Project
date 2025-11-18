require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();

const connectDB = require("./config/db");
// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
const { globalErrorHandler } = require('./middlewares/errorHandling');
app.use(globalErrorHandler);

const user = require("./routes/user");
const menueCategory = require("./routes/category");
const Item = require("./routes/cateItem");
const order = require("./routes/order")
app.use('/user', user);
app.use("/cate", menueCategory);
app.use("/cateItems", Item);
app.use("/order" ,order )
connectDB();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});