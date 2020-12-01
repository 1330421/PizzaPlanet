import express from 'express';

import database from './helpers/database.js';
import errors from './helpers/errors.js';

import customersServices from './routes/customersRoutes.js';
import ordersRoutes from './routes/ordersRoutes.js';
import pizzeriasRoutes from './routes/pizzeriasRoutes.js';

const app = express();

database(app);

app.use(express.json());

app.use('/pizzerias', pizzeriasRoutes);
app.use('/orders',ordersRoutes);
app.use('/customers',customersServices);

//Route global pour la gestion des erreurs
app.use('*', errors);

export default app;