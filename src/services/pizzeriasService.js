import Pizzeria from '../models/pizzeria.js'

const ROUTE = 'pizzerias'

class pizzeriasService {

    create(pizzeria) {
        return Pizzeria.create(pizzeria);
    }

    transform(pizzeria) {
        pizzeria.href = `${process.env.BASE_URL}/${ROUTE}/${pizzeria._id}`;
        pizzeria.lightspeed = `[${pizzeria.planet}]@(${pizzeria.coord.lat};${pizzeria.coord.lon})`;

        delete pizzeria._id;
        delete pizzeria.__v;
        return pizzeria;
    }
}

export default new pizzeriasService();