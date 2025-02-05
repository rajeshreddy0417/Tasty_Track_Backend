
const { response } = require("express");
const Firm=require("../models/Firm")
const Vendor=require("../models/Vendor")
const multer=require("multer")//for image
const path=require('path');



const storage=multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,'uploads/');
    },
    filename:function(req,file,cb){
        cb(null,Date.now()+path.extname(file.originalname));
    }
});

const upload=multer({storage:storage});


const addFirm=async(req,res)=>{

    try{
        const {firmname,area,category,region,offer}=req.body

        //Use req.file.filename for the uploaded image
        const image=req.file? req.file.filename:undefined;
        //Find the vendor by ID
        const vendor=await Vendor.findById(req.vendorId);

        if(!vendor){
            return res.status(404).json({message:"Vendor not found"});
        }
        if(vendor.firm.length > 0){
            return res.status(400).json({message:"Vendor can have only one firm"})
        }
        const firm=new Firm({
            firmname,area,category,region,offer,image,vendor:vendor._id
        })
        const savedFirm=await firm.save();
        const firmId=savedFirm._id;
        // console.log("this is the firmId for check - ",firmId);
        vendor.firm.push(savedFirm);
        await vendor.save();
        console.log(firmId);
        
        return res.status(200).json({message:"Firm added successfully",firmId});
    }catch(error){
        console.error(error);
        return res.status(500).json({message:"Internal server error"});
    }
}

const deleteFirmById=async(req,res)=>{
    try{
        const firmId=req.params.firmId;
        const deletedfirm=await Firm.findByIdAndDelete(firmId);

        if(!deletedfirm){
            return res.status(404).json({error:"No firm found"});
        }
    }catch(error){
        console.error(error);
        res.status(500).json({ error: "Internal server error" }); 
    }
}

module.exports={addFirm:[upload.single('image'),addFirm],deleteFirmById}