require('dotenv').config();
const express = require('express');
const server = express();
const mongoose = require('mongoose');
const Path = require('path');
const Port = process.env.PORT || 5900;
//Session:
const session = require('express-session');
const mongodb_session = require('connect-mongodb-session')(session);

//flash:
const flash = require('connect-flash');

const authModel = require('./Model/authModel');
const adminRouter = require('./Router/adminRouter');
const userRouter = require("./Router/authRouter");
server.set('view engine','ejs');
server.set('views','View');
server.use(express.urlencoded({extended:true}));
//flash-use:
server.use(flash());
server.use(express.static(Path.join(__dirname,'Public')));
server.use(express.static(Path.join(__dirname,'Uploads')));

//Session work:
const session_Storage = new mongodb_session({
    uri:process.env.DB_URL,
    collection:'Authentication_Session'
})
server.use(session({
    secret:'project-secret-key',
    resave:false,
    saveUninitialized:false,
    store:session_Storage
}))

server.use(async(req,res,next)=>{
    if(!req.session.user){
        return next();
    }else{
        let userValue = await authModel.findById(req.session.user._id);
        if(userValue){
         req.user = userValue;
         next();   
        }else{
            console.log("User not found");
        }
    }
})

server.use(adminRouter,userRouter);
mongoose.connect(process.env.DB_URL)
.then(()=>{
    console.log("The Database Connection is Successfull");
    server.listen(Port,()=>{
        console.log(`The Server is Running at ${Port}`);
    })
}).catch((error)=>{
    console.log("Failed To Connect With the Database",error);
})
