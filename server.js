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
    model: Joi.string().min(1).required()
  });

  return schema.validate(car);
}

//RATE LIMITER TO PREVENT DDoS
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});

app.use(limiter)

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

// ENDPOINTS BEGIN HERE

//POST
app.post('/cars', async (req,res)=> {
  const { error } = validateCar(req.body)
  if(error)
    return  res.status(400).send(error.details[0].message);

  try {
      let car = new Car({ make: req.body.make, model: req.body.model });
      car = await car.save();
      res.send(car);
    } catch (err) {
      res.status(400).send(err.message);
    }
})

//GET
app.get('/cars', async (req,res)=>{
  const cars = await Car.find();
  res.send(cars);    
})

//GET SINGLE
app.get('/cars/:id', async (req,res)=>{
    //improvement of this could be to check if id is validated
    try {
        const car = await Car.findById(req.params.id);
        if (!car) return res.status(404).send('Car not found');
        res.send(car);
      } catch (err) {
        res.status(500).send('Something went wrong');
      }
})

//PUT
app.put('/cars/:id', async (req, res) => {
  try{
    const car = await Car.findByIdAndUpdate(req.params.id, { make: req.body.make, model: req.body.model }, { new: true });
    if (!car) return res.status(404).send('Car not found');
    res.send(car);
  } catch (error) {
    console.error('error updating car occurred');
  }

});

//DELETE
app.delete('/cars/:id', async (req, res) => {

  const car = await Car.findByIdAndDelete(req.params.id);
  if (!car) return res.status(404).send('Car not found');
  res.status(204).send();
});

