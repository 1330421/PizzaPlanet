import mongoose from "mongoose";

const pizzeraiSchema = mongoose.Schema({
  pizzeria: {
    type: mongoose.Schema.Types.String,
    ref: "PLANETS_NAME",
    required: true,
  },
  coord: {
    lat: { type: Number, min: -1000, max: 1000, required: true },
    lon: { type: Number, min: -1000, max: 1000, required: true },
  },
  chef: {
    name: { type: String, required: true },
    ancestor: {
      type: mongoose.Schema.Types.String,
      ref: "MONSTER_ANCESTORS",
      required: true,
    },
    speciality: {
      type: mongoose.Schema.Types.String,
      ref: "PIZZA_TOPPINGS",
      required: true,
    },
  },
  collection:'pizzeria',
});

export default mongoose.model("Pizzeria", pizzeraiSchema);
