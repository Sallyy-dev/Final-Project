require("dotenv").config();
const express = require("express");
const cors = require("cors");
const swaggerUi = require('swagger-ui-express');
const fs = require('fs');
const yaml = require('js-yaml');

const connectDB = require("./config/db");
const { globalErrorHandler } = require('./middlewares/errorHandling');


const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Swagger
const openapiSpec = yaml.load(fs.readFileSync('./data.yaml', 'utf8'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openapiSpec));

// Routes
const user = require("./routes/user");
const menueCategory = require("./routes/category");
const Item = require("./routes/cateItem");
const order = require("./routes/order");

app.use('/user', user);
app.use("/cate", menueCategory);
app.use("/cateItems", Item);
app.use("/order", order);

// Global error handler
app.use(globalErrorHandler);

// Connect DB
connectDB();

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
