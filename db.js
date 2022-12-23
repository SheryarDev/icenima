const mongoose =require('mongoose');
//const mongoURI="mongodb://localhost:27017/"
//mongodb://0.0.0.0:27017/icenima
//mongodb+srv://sheryar:<password>@cluster0.jqctapw.mongodb.net/?retryWrites=true&w=majority

//|| "mongodb://0.0.0.0:27017/icenima"
require('dotenv').config()
const MONGO_URL=process.env.DATABASE
 async function connectToMonog(){

 await mongoose.connect("mongodb://0.0.0.0:27017/icenima", {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {  
    console.log("database connected");
  })
  .catch(err => {
    console.log("Could not connect", err);
  });


    }




module.exports=connectToMonog