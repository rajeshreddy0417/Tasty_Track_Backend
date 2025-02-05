const express=require('express');
const dotEnv=require('dotenv');//for .env
const mongoose=require('mongoose');
const vendorRoutes=require('./routes/vendorRoutes')
const bodyParser=require('body-parser')
const firmRoutes=require('./routes/firmRoutes')
const productRoutes=require("./routes/productRoutes")
const path=require('path')
const cors=require("cors")

const app=express()

const PORT=process.env.PORT || 4000;
dotEnv.config();//helps to access the data in .env file
app.use(cors());
if (!process.env.MONGO_URI) {
    console.error("Error: MONGO_URI is not defined in .env file");
    process.exit(1);
}
mongoose.connect(process.env.MONGO_URI)
    .then(()=>console.log("MongoDb connected Successfully...!!!"))
    .catch((error)=>console.log("MongoDb connection error : ",error))

    //converting the input feild data in json format using badyParser
    app.use(bodyParser.json())//converted into json

    //to create a http req we have to use a middleware so we are using app.use() method
    app.use('/vendor',vendorRoutes);

    app.use('/firm',firmRoutes);

    app.use('/product',productRoutes);

    app.use('/uploads',express.static('uploads'));


//creating a server
app.listen(PORT,()=>{
    console.log(`Server started and running at ${PORT}`);
})

//creating a route
app.use('/',(req,res)=>[
    res.send("<h1> Welcome to TastyTrack</h1>")
])