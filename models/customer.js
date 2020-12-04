import mongoose from 'mongoose';
import { PLANET_NAMES } from '../helpers/constants';

const customerSchema = mongoose.Schema({

    name: { type:String, required:true },
    email: { type:String, required:true, unique:true},
    // planet: { type:String, ref:'PLANETS_NAMES', required:true},
    planet: { type:String, enum:PLANET_NAMES, required:true},
    coord: {
        lat: { type:Number, required:true, min:-1000, max:1000 },
        lon: { type:Number, required:true, min:-1000, max:1000 }
    },
    phone: { type:Number, required:true },
    birthday: { type:Date, required:true },
    referalCode: String
}, {
    collection:'customers'
});

export default mongoose.model('Customer', customerSchema)