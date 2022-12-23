const mongoose = require('mongoose');
const { stringify } = require('querystring');
// import mongoose from 'mongoose';
const { Schema } = mongoose;

//creating schema for Notes
const MovieSchema = new Schema({
    id:{
     type:mongoose.Schema.Types.ObjectId,
     ref:'genre',
    },
    img:{
      type:String,
     
    },
    rating:{
      type:Number,
      
    },
    name:{
        type:String,
    
  
    },
    genre:{
      type:String,
      required: true
    },
       
    category: {
       type:String,
       default:"General"
    },
    // description:   {
    //    type: String,
    //     required:true,
    // },
  
    // date:{
    //     type:Date,
    //     default:Date.now
    // }
  
  });
  

  const Movie=mongoose.model('movie',MovieSchema)
  module.exports = Movie;

