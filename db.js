const mongoose=require('mongoose')

connectMongo=()=>{
    mongoose.connect('mongodb+srv://guptammanish04:manish@cluster0.teks8rk.mongodb.net/?retryWrites=true&w=majority')
    .then(()=>console.log("Mongo Database Connected"))
    .catch((err)=>console.log(err))
}

module.exports=connectMongo;