const mongoose = require('mongoose');

//schematic for car that tracks make models and prices
const carSchema = new mongoose.Schema({
  make: { type: String, required: true },
  model: { type: String, required: true },
  trim: {type: String, required: true},
  color: {type: String, required: true},
  cost: {type: Number, required: true}
});

const Car = mongoose.model('Car', carSchema);

module.exports = Car;
