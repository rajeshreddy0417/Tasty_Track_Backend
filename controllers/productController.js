
const Product=require("../models/Product");
const multer=require("multer")
const Firm=require("../models/Firm")
const path=require('path')
const mongoose=require("mongoose")



const storage=multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,'uploads/');
    },
    filename:function(req,file,cb){
        cb(null,Date.now()+path.extname(file.originalname));
    }
});

const upload=multer({storage:storage});

const addProduct = async (req, res) => {
    try {
        const { productName, price, category, bestSeller, description } = req.body;
        const image = req.file ? req.file.filename : undefined;
        const firmId = req.params.firmId;


        // Check if the firm exists
        const firm = await Firm.findById(firmId);
        if (!firm) {
            console.error("Firm not found");
            return res.status(404).json({ error: "No firm found" });
        }

        // Create a new product
        const product = new Product({
            productName,
            price,
            category,
            bestSeller,
            description,
            image,
            firm: firm._id, 
        });

        const savedProduct = await product.save();

        // Update the firm document with the new product reference
        const updatedFirm = await Firm.findByIdAndUpdate(
            firmId,
            { $push: { products: savedProduct._id } }, // Push the product ID to the products array
            { new: true } // Return the updated firm
        );

        if (!updatedFirm) {
            return res.status(500).json({ error: "Failed to update firm with product" });
        }

        res.status(200).json(savedProduct);
    } catch (error) {
        console.error("Error in addProduct:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};


//adding products based on firm
const getProductByFirm = async (req, res) => {
    try {
        const firmId = req.params.firmId; 
        console.log("Firm ID:", firmId); // Debug log

        if (!mongoose.Types.ObjectId.isValid(firmId)) {
            return res.status(400).json({ error: "Invalid firm ID" });
        }

        const firm = await Firm.findById(firmId);
        console.log("Firm Data:", firm); // Debug log

        if (!firm) {
            return res.status(404).json({ error: "No firm found" }); // Corrected error handling and status code
        }

        const restaurantName = firm.firmname;
        const products = await Product.find({ firm: firmId });
        console.log("Products:", products); // Debug log


        // Return restaurant details along with products
        res.status(200).json({
            restaurantName,   
            products          
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" }); 
    }
};

//delete product based on their id
const deleteProductById=async(req,res)=>{
    try{
        const productId=req.params.productId;
        const deletedProduct=await Product.findByIdAndDelete(productId);

        if(!deletedProduct){
            return res.status(404).json({error:"No product found"});
        }
    }catch(error){
        console.error(error);
        res.status(500).json({ error: "Internal server error" }); 
    }
}


module.exports={addProduct:[upload.single('image'),addProduct],getProductByFirm,deleteProductById};
