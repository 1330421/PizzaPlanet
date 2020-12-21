// Fichier : customersService.js
/* Auteurs
 Jordan Côté - JC
 Louis-Philippe Brunet - LB
 Kevin St-Pierre - KS
 */
// Date : 2020-12-05
// But : Fichier de service pour la gestion des clients dans la base de données

// Modules
import dayjs from 'dayjs';

// Modèles
import Customer from '../models/customer.js';

// Services
import ordersService from './ordersService.js';

class CustomersServices {

    //--------------------
    // JC - Créer une nouvelle instance de customer dans la BD
    //--------------------
    create(customer) {
        return Customer.create(customer);
    }

    //--------------------
    // LB - Renvoie les client selon les paramètres URL
    //--------------------
    retrieveAll(options) {
        let retrieveQuery;
        let countQuery;

        const criteria = {
            'planet': options.planet
        }
        if (options.planet) {
            retrieveQuery = Customer.find(criteria);
            countQuery = Customer.countDocuments(criteria);
        } else {
            retrieveQuery = Customer.find();
            countQuery = Customer.countDocuments();
        }
        retrieveQuery.limit(options.limit).skip(options.skip).sort('birthday');
        return Promise.all([retrieveQuery, countQuery])
    }

    //--------------------
    // KS - Retrouve un client à partir de son id
    //--------------------
    retrieveById(idCustomer, options) {
        const retrieveQuery = Customer.findById(idCustomer);
        if (options.isOrdersEmbed) retrieveQuery.populate('orders');
        return retrieveQuery;
    }

    //--------------------
    // LB - Retrouve le client dans la base de donnée et le met à jour
    //--------------------
    update(idCustomer, customerMod) {
        const filter = { _id: idCustomer };
        return Customer.findOneAndUpdate(filter, customerMod, { new: true });
    }

    //--------------------
    // KS - Transforme les données du client pour le corps de la réponse
    //--------------------
    transform(customer, options = {}) {
        customer.href = `${process.env.BASE_URL}/customers/${customer._id}`;
        customer.phone = `[${customer.phone.substring(0, 4)}]${customer.phone.substring(4, 8)}-${customer.phone.substring(8, 14)}@${customer.phone.substring(14, 16)}`;
        customer.age = this.calculateAge(customer.birthday);
        customer.lightspeed = `[${customer.planet}]@(${customer.coord.lat};${customer.coord.lon})`;

        if (options.isOrdersEmbed) customer.orders = customer.orders.map(o => ordersService.transform(o, { isCustomerEmbed: false }));

        delete customer._id;
        delete customer.__v;
        return customer;
    }

    //--------------------
    // KS - Calcule l'âge du client
    //--------------------
    calculateAge(birthday) {
        const today = dayjs(Date.now());
        return today.diff(birthday, 'year');
    }



    //--------------------
    // LB - Vérifie si le courrie existe dans la base de donnée
    //--------------------
    async emailValidation(customer) {
        
            if (Customer.findOne({ email: customer.email,name:customer.name })) {
                return true;
            }
            else{
                if (Customer.findOne({email:customer.email})) {
                    return false;
                }
            }
        
        
        return true;
    }
}

export default new CustomersServices();