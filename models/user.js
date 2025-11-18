const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
userName:{
    type: String,
    required: true
},
email:{
    type: String,
    required: true,
     unique: true
},
password:{
    type: String,
    required: true
},
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user"
  }

});

userSchema.pre('save', function(next) {
  if (this.confirmPassword && this.password !== this.confirmPassword) {
    throw new Error('Passwords do not match');
  }
  next();
});

module.exports = mongoose.model("User" , userSchema)
