const mongoose=require('mongoose')
const {Schema}=mongoose;
const AdminSchema=new Schema({

    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    admin:{
        type:Boolean,
        default:true
    },
    date:{
        type:Date,
        default:Date.now
    }
})

const Admin=mongoose.model("Admin",AdminSchema);

module.exports=Admin;