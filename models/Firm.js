
const mongoose=require("mongoose")
const Product = require('./Product');

const firmSchema=new mongoose.Schema({
    firmname:{
        type:String,
        require: true,
        unique: true
    },
    area:{
        type:String,
        require:true,

    },
    category:{
        type:[
            {
                type:String,
                enum:['Veg','Non-Veg']
            }
        ]
    },
    region:{
        type:[
            {
                type:String,
                enum:['South-Indian','North-Indian','Chinese','Bakery']
            }
        ]
    },
    offer:{
        type:String
    },
    image:{
        type:String
    },
    //relating the firm with the render
    vendor:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'vendor'
        }
    ],
    products:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Product'
        }
    ]
})

const Firm=mongoose.model('Firm',firmSchema);

module.exports=Firm