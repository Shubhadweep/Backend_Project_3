const authModel = require('../Model/authModel');
const adminModel = require('../Model/adminModel');
const bcrypt = require('bcryptjs');
const nodeMailer = require('nodemailer');

const transporter = nodeMailer.createTransport({
    host:'smtp',
    port:465,
    secure:false,
    requireTLS:true,
    service:'gmail',
    auth:{
        user:'rohanslife1202@gmail.com',
        pass: 'ifyq bscp rxrh xdsv'
    }
})

const getSignup = (req,res)=>{
    let sameMail = req.flash("error");
    console.log("The Error Sms for same Mail id: ",sameMail);
    let showError = (sameMail.length > 0 ? sameMail[0] : null);

    res.render("userAuth/registration",{
        title:'Signup Page',
        data:showError
    })
}

const postSignup = async(req,res)=>{
    try{
        console.log("The Email Collected from Signup form: ",req.body);
        let existMail = await authModel.findOne({user_Email:req.body.email});
        if(existMail){
            console.log("SomeOne has already Registered with this Mail Id");
            req.flash("error","Some one has Already registered with this MailId")
            res.redirect("/userSignup");
        }else{
            let hashPassword = await bcrypt.hash(req.body.password,12);
            console.log("The generated Hash Password is: ",hashPassword);
            let userData = new authModel({
                user_Email:req.body.email,
                user_Password:hashPassword
            })
            let saveData = await userData.save();
            if(saveData){
                console.log("The data is saved successfully into the database");

                let mailDetails ={
                    from:'rohanslife1202@gmail.com',
                    to: req.body.email,
                    subject:"Email Verification Mail",
                    text: "Welcome User" +'\n\n'+ 
                    "You have successfully Submitted Your Detials"+'\n\n'+
                    "Please Verify Your Account by clicking the Link below:"+ '\n\n'+
                    "http://"+
                    req.headers.host+
                    "/mail_Confirmation/"+req.body.email+
                    "\n\n Thank You"
                    
                }
                transporter.sendMail(mailDetails,function(error,info){
                    if(error){
                        console.log("Error in sending Mail: ",error);
                        res.redirect("/userSignup");
                    }else{
                        console.log("Your Account Verification mail has been sent to Your Mail Id");
                        res.redirect("/SuccessPage");
                    }
                })
            }
        }
    }catch(error){
        console.log("Failed to save data into the database ",error);
    }
}

const emailVerification = async(req,res)=>{
    try{
        let email = req.params.mail;
        let userData = await authModel.findOne({user_Email:email});
        console.log("The user's details whose mail verification process is conducting: ",userData);
        if(userData.isVerified){
            console.log("The user is already Verified");
            res.send("Your Profile is Already verified");
        }else{
            userData.isVerified = true;
           let savedata =  await userData.save();
           if(savedata){
            console.log("Your Profile Verification Process is Successfully completed");
            res.redirect("/userLogin");
           }
        }
    }catch(error){
        console.log("Failed to Verify User profile ",error);
    }
}

const getLogin = (req,res)=>{

    let mailSms = req.flash("mailError");
    console.log("The Error Sms collected for Wrong Email for Login: ",mailSms);
    let showSms = (mailSms.length > 0 ? mailSms[0] : null);

    let passwordSms = req.flash("passwordError");
    console.log("The Error sms Collected for Wrong Password for Login: ",passwordSms);
    let showSms2 = (passwordSms.length > 0 ? passwordSms[0] : null);

    res.render("userAuth/login",{
        title:'Login Page',
        mailData : showSms,
        passData : showSms2
    })
}

const postLogin = async(req,res)=>{
    try{
        //console.log("The user Value collected from the Login form: ",req.body);
        let existMail = await authModel.findOne({user_Email:req.body.email});
        console.log("The user details who is trying to Login: ",existMail);
        if(!existMail){
            console.log("Incorrect Mail Id");
            req.flash("mailError","Incorrect Mail-Id");
            res.redirect("/userLogin")
        }else{
            let comparePassword = await bcrypt.compare(req.body.password,existMail.user_Password);
            if(comparePassword){
                req.session.userIsLogin = true;
                req.session.user = existMail;
                await req.session.save((error)=>{
                    if(error){
                        console.log("Session data saving error: ",error);
                    }else{
                        console.log("Session data Saved Successfully");
                        console.log("login Successfull");
                        res.redirect("/allProd");
                    }
                })         
            }else{
                console.log("Wrong Password");
                req.flash("passwordError","Wrong Password");
                res.redirect("/userLogin");
            }

        }
    }catch(error){
        console.log("Failed to Login ",error);
    }
}

const successPage = (req,res)=>{
    res.render("userAuth/success",{
        title:'Successfull Signup'
    })
}

const logout = async(req,res)=>{
    try{
        await req.session.destroy();
        res.redirect("/userLogin");
    }catch(error){
       console.log("Failed to Log out", error);
    }
}

const allProduct = async(req,res)=>{
    try{
        let alldata = await adminModel.find({});
        console.log("All data fetched from admin portion: ",alldata);
        let filterProducts = alldata.filter((arr)=>{
            return arr.isDeleted===false

        })
        res.render("userAuth/showitem",{
            title:'all Items',
            data: filterProducts
        })


    }catch(error){
        console.log("Failed to fetch data from admin Products: ".error);
    }
}

const softDelete = async (req,res)=>{
    try{
        let prodId=req.params.id
        //console.log("The id collected for Soft Delete: ",prodId);
        let softDeleteProd = await adminModel.findById(prodId)
        //console.log("The Soft deleted product Details: ",softDeleteProd);
        
        softDeleteProd.isDeleted = true;

        let saveData = await softDeleteProd.save();
        if(saveData){
            console.log("Soft Delete Work Done");
            res.redirect("/allProd");
        }


    }catch(error){
        console.log("Error in Soft delete Process",error);
    }
}





module.exports = {getSignup,postSignup,emailVerification,getLogin,successPage,logout,postLogin,allProduct,softDelete};