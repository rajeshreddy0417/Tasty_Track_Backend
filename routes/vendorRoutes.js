
const vendorController=require('../controllers/vendorController');
const express=require('express')

const router=express.Router();
router.post('/register',vendorController.venderRegister);
router.post('/login',vendorController.venderLogin);
router.get('/all-vendors',vendorController.getAllVendors);
router.get('/single-vendor/:vendorId',vendorController.getVendorById);

module.exports=router;
