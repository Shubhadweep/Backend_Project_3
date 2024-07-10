const express = require('express');
const route = express.Router();
const {getAdditem,postGetAddIem,getAllProd,viewEditPage,editDetails,cardView} = require('../Controller/adminController');
// Express-Validator:
const {body} = require("express-validator");
//Multer Set Up:
const multer = require('multer');
const Path = require('path');
const filestorage = multer.diskStorage({
    destination:(req,file,callback)=>{
        callback(null,Path.join(__dirname,'..','Uploads','AdminImages'),(error,data)=>{
            if(error) throw error
        });
    },
    filename:(req,file,callback)=>{
        callback(null,file.originalname,(error,data)=>{
            if(error) throw error
        });
    }
});

const fileFilter = (req,file,callback)=>{
    if(
        file.mimetype.includes("jpg")||
        file.mimetype.includes("png")||
        file.mimetype.includes("jpeg")||
        file.mimetype.includes("webp")
    )
    {
        callback(null,true);
    }else{
        callback(null,false);
    }
}
const upload = multer({
    storage:filestorage,
    fileFilter:fileFilter,
    limits:{fieldNameSize:1024*1024*5}
})

const upload_type = upload.fields([
    {name:'itemImage1',maxCount:1},
    {name:'itemImage2',maxCount:1}
])

route.get("/AddItem",getAdditem);
route.post("/postAdditem",upload_type,[
    body('itemPrice',"Product Price is a Required Field").notEmpty(),
    body('itemDescription',"Product description is a required field").notEmpty(),
    body('itemDescription',"Product description text limit Should be within 10 to 100 Characters").isLength({min:10,max:100})
], postGetAddIem);
route.get("/viewProd",getAllProd);
route.get("/viewEditPage/:id",viewEditPage);
route.get("/adminCardView/:id",cardView);
route.post("/editDetails",upload_type,editDetails);
module.exports = route;