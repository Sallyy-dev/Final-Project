const express = require("express");
const cors = require("cors");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());


app.use('/user', require('./routes/user'));       
app.use('/cate', require('./routes/category'));   
app.use('/cateItems', require('./routes/cateItem')); 
app.use('/order', require('./routes/order'));    



module.exports = app;
