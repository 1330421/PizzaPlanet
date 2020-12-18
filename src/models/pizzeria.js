import mongoose from "mongoose";
import { COORD, MONSTER_ANCESTORS, PIZZA_TOPPINGS, PLANET_NAMES } from "../utils/constants.js";

const pizzeriaSchema = mongoose.Schema({
  planet: {
    type: String,
    // ref: "PLANETS_NAME",
    enum: PLANET_NAMES,
    required: true,
  },
  coord: {
    lat: { type: Number, min: COORD.MIN, max: COORD.MAX, required: true },
    lon: { type: Number, min: COORD.MIN, max: COORD.MAX, required: true },
  },
  chef: {
    name: { type: String, required: true },
    ancestor: {
      type: String,
      // ref: "MONSTER_ANCESTORS",
      enum: MONSTER_ANCESTORS,
      required: true,
    },
    speciality: {
      type: String,
      // ref: "PIZZA_TOPPINGS",
      enum: PIZZA_TOPPINGS,
      required: true,
    },
  },
},{
  collection:'pizzerias',
  id:false

});
pizzeriaSchema.virtual('orders', {
  ref: 'Order',
  localField: '_id',
  foreignField: 'pizzeria',
  justOne: false
});

export default mongoose.model('Pizzeria', pizzeriaSchema);
