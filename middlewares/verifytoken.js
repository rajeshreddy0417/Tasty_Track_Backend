
const Vendor=require("../models/Vendor");
const jwt=require('jsonwebtoken')
const dotEnv=require("dotenv")

dotEnv.config();

const secretkey=process.env.WhatIsYourName;

const verifyToken=async(req,res,next)=>{
    const token=req.headers.token;//passing token to the header...header will pass the req along with the token for verification

    if(!token){
        return res.status(401).json({error:"Token is required"});

    }
    try{
        //verifying the vendor id
        const decoded=jwt.verify(token,secretkey);
        const vendor=await Vendor.findById(decoded.vendorId);

        if(!vendor){
            return res.status(404).json({error: "vendor not found"});
        }

        req.vendorId=vendor._id;
        //if vendor id accepts 
        next()
    }
    catch(error){
        console.error(error);
        return res.status(500).json({error:"Invalid Token"});

    }
}

module.exports=verifyToken
