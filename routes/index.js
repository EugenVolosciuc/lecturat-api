const routes = require('express').Router();

const searchOpenLibraryRoutes = require('./api/open-library');
const apiUsersRoutes = require('./api/users');

const backOfficeUserRoutes = require('./backoffice/users');

routes.use('/search', searchOpenLibraryRoutes);
routes.use('/api', apiUsersRoutes);

routes.use('/admin', backOfficeUserRoutes);

module.exports = routes;