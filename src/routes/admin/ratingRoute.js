const express = require('express');
const ratingRouterAdmin = express.Router();
const controller = require('../../controller/admin/ratingController');


ratingRouterAdmin.post("/list-rating",controller.listRatingAdmin);

ratingRouterAdmin.post("/view-rating",controller.viewRatingAdmin);


module.exports = ratingRouterAdmin;