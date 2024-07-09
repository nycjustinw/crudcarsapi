const mongoose = require('mongoose');

//validation

const carSchema = new mongoose.Schema({
  make: { type: String, required: true },
  model: { type: String, required: true }
});

const Car = mongoose.model('Car', carSchema);

module.exports = Car;