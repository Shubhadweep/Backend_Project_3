const adminModel = require('../Model/adminModel');
const {validationResult} = require('express-validator');

const getAdditem = (req,res)=>{
    res.render("Admin/addItemform",{
        title:'AddItem Page',
        frontError:[],
        validationData: {}
    })
}

const postGetAddIem = async(req,res)=>{
    try{
        //console.log("The Data collected from the AddItem Form: ",req.body,req.files);

        let error = validationResult(req);
        if(!error.isEmpty()){
           let errorResponse = validationResult(req).array();
            console.log("Error Response: ",errorResponse);

            let formData = {
                productPrice : req.body.itemPrice,
                productDescription : req.body.itemDescription
            };
            res.render("Admin/addItemform",{  // For express-Validation or form validation
                title:'AddItem Page',
                frontError :errorResponse,
                validationData : formData
            })
        }else{
            let addItem = new adminModel({
                item_Name : req.body.itemName,
                item_Category : req.body.itemCategory,
                item_Price : req.body.itemPrice,
                item_FirstImage : req.files.itemImage1[0].originalname,
                item_SecondImage : req.files.itemImage2[0].originalname,
                item_Description : req.body.itemDescription
            })
            let saveData = await addItem.save();
            if(saveData){
                console.log("Admin add product is Successfull");
                res.redirect("/viewProd");
           }
        }
    }catch(error){
        console.log("Failed to add Product in Admin Section ",error);

    }
}

const getAllProd = async(req,res)=>{
    try{
        let adminData = await adminModel.find({});
        console.log("All admin data collected from the Database: ",adminData);
        res.render("Admin/adminAllProd",{
            title:'All Products',
            data:adminData
        })
    }catch(error){
        console.log("Failed to fetch Data from the Database ",error);
    }
}


const viewEditPage = async(req,res)=>{
    try{
        let id = req.params.id;
        //console.log("Id collected from the Params for Edit: ",id);
        let oldData = await adminModel.findOne({_id:id});
        //console.log("Old data collected for Edit: ",oldData);
        res.render("Admin/editPage",{
            title:'Edit Page',
            data:oldData
        })

    }catch(error){
        console.log("Failed to fetch old data ",error);
    }
}

const editDetails = async(req,res)=>{
    try{
        console.log("The Product Details collected form edit form for edit: ",req.files);
        
        let oldData = await adminModel.findOne({_id:req.body.id});
        console.log("The old data fetched for edit: ",oldData);

        oldData.item_Name = req.body.itemName,
        oldData.item_Category = req.body.itemCategory,
        oldData.item_Price = req.body.itemPrice,
        oldData.item_FirstImage = req.files.itemImage1[0].originalname,
        oldData.item_SecondImage = req.files.itemImage2[0].originalname,
        oldData.item_Description = req.body.itemDescription;

        let saveData = await oldData.save();
        if(saveData){
            res.redirect("/viewProd");
        }
    }catch(error){
        console.log("Error in Editing Data: ",error);
    }
}

const cardView = async(req,res)=>{
    try{
        console.log("The Id collected from Params for Single Product View: ",req.params.id);
        let singleProductDetails = await adminModel.findOne({_id:req.params.id});
        console.log("The Collected Single Product details: ",singleProductDetails);
        if(singleProductDetails){
            res.render("Admin/adminCardview",{
                title: 'Card View',  
                data : singleProductDetails
            })
        }
    }catch(error){

    }
}




module.exports ={getAdditem,postGetAddIem,getAllProd,viewEditPage,editDetails,cardView};