//import env db key
require('dotenv').config()

const helmet = require('helmet');
const Joi = require('joi');
const cors = require('cors');

const Car = require('./car')
const express = require('express');
const app = express();
const port = 3000;

app.use(helmet());
app.use(express.json());
app.use(cors());

//mongoose connection
const mongoose = require('mongoose');
  try{
    mongoose.connect(process.env.MONGODB_URI, { 
      useNewUrlParser: true, 
      useUnifiedTopology: true 
      });
      console.log('Connected to db successfully');
  }
  catch (error){
    console.error('Could not connect to MongoDB...');
  }

app.get('/', (req, res) => {
  res.send('Server Running');
});

//HELPER FUNCTIONS

//input validation
function validateCar(car) {
  const schema = Joi.object({
    //at least something was put in ¯\_(ツ)_/¯
    make: Joi.string().min(1).required(),
    model: Joi.string().min(1).required(),
    trim: Joi.string().min(1).required(),
    color: Joi.string().min(1).required(),
    cost: Joi.number().min(1).required(),
  });

  return schema.validate(car);
}

//RATE LIMITER TO PREVENT DDoS
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
