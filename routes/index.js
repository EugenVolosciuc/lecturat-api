const routes = require('express').Router();

const searchOpenLibraryRoutes = require('./api/open-library');
const searchWikipediaRoutes = require('./api/wikipedia');
const apiUsersRoutes = require('./api/users');

const backOfficeUserRoutes = require('./backoffice/users');

routes.use('/search', searchOpenLibraryRoutes);
routes.use('/search', searchWikipediaRoutes);
routes.use('/api', apiUsersRoutes);

routes.use('/admin', backOfficeUserRoutes);

module.exports = routes;