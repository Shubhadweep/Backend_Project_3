const express = require('express');
const route = express.Router();
const {getSignup,postSignup,emailVerification,getLogin,postLogin,successPage,allProduct,logout,softDelete} = require('../Controller/authController');

route.get('/userSignup',getSignup);
route.post('/postSignup',postSignup);
route.get('/mail_Confirmation/:mail',emailVerification);

route.get('/userLogin',getLogin);
route.post('/loginPost',postLogin);

route.get("/SuccessPage",successPage);

route.get("/allProd",allProduct);
route.post("/Logout",logout);

route.get("/softDelete/:id",softDelete);

module.exports = route;