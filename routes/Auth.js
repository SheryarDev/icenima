const express=require('express')
const router=express.Router();
const bcrypt=require('bcryptjs')
const User=require('../models/User')
const { body, validationResult } = require('express-validator');
const jwt=require('jsonwebtoken');
// const fetchuser=require('../middleware/fetchuser');

const JWT_SECRET="Harryisagoodb$oy"

// ROUTE 1:Create a user using :POST "api/users" .Does't require Auth //no login required
router.post('/signup',[
  
  body('fname','Enter a valid name').isLength({ min: 4 }),
  body('lname','Enter a valid name').isLength({ min: 4 }),
  body('email','Enter a valid Email').isEmail(),
  body('Password','Password must be a atleast 5 characters').isLength({ min: 5 })

],
async (req, res) => {
     // Finds the validation errors in this request and wraps them in an object with handy functions
     let success=true;
     const errors = validationResult(req);
     if (!errors.isEmpty()) {
       return res.status(400).json({success:false, errors: errors.array() });
       
     }
    console.log(req.body)
    //method 1: to save data in database
    //const user=User(req.body);
    //user.save()
   // res.send(req.body)

   //Check whether the user with this Eamil exist Already
   try{
     
   let user= await User.findOne({email:req.body.email})
   if(user){
     return res.status(400).json({success:false,error:"Sorry user with this email already exist"})
   }
    
    //using bcrytjs to encrypt passwrod
    const salt = await bcrypt.genSalt(10);
    secPass= await bcrypt.hash(req.body.Password,salt)
    //method 2:to save user data in database
     user= await User.create({
      fname: req.body.fname,
      lname: req.body.lname,
      email: req.body.email,
      Password: secPass,
    })

    //integrating jwt token
    const data={
      user:{
        id:user.id
      }
    }
    const authtoken=jwt.sign(data,JWT_SECRET);
 
  
    success=true;
   //res.json(user);
    res.json({success,authtoken})

   }
   catch(error){
     success=false;
   console.log(error.message)
   res.status(500).send('Internal server error')
   }
    
  })
  
  // ROUTE 2:Authenticate a user using: POST "/api/users/login",NO login required
  router.post('/login',[

    body('email','Enter a valid Email').isEmail(),
    body('Password','Password cannot be blank').exists(),
  ],
  async (req, res) => {
    let success=true;
            // Finds the validation errors in this request and wraps them in an object with handy functions
     const errors = validationResult(req);
     if (!errors.isEmpty()) {
       return res.status(400).json({success:false, errors: errors.array() });
     }


     const {email,Password}=req.body;
     try {
       let user= await User.findOne({email});
       if(!user){
         return res.status(400).json({success:false,error:"Please try to login with correct Credentials"})
       }
        
       const passwordCompare= await bcrypt.compare(Password,user.Password)
       if(!passwordCompare){
        return res.status(400).json({error:"Please try to login with correct Credentials"})
       }

    //integrating jwt token
    const data={
      user:{
        id:user.id
      }
    }
    const authtoken=jwt.sign(data,JWT_SECRET);
    let success=true;
    res.json({success,authtoken})
  
     } catch (error) {
      success=false;
      console.log(error.message)
      res.status(500).send('Some Error occured')
     }
  })


//Delete user
router.delete('/deleteuser/:id', async (req, res) => {
         
  try{

  
    //  const { img,rating,name, genre,category} = req.body;


        //Find the note to be Delted
        let user= await User.findById(req.params.id);
        if(!user){return res.status(404).send("Not Found")}
       
        //Allow deletion only if user owns this note
        // if(user.user.toString() !== req.user.id){
        //     return res.status(401).send("Not Allowed")
        // }
       
        user=await User.findByIdAndDelete(req.params.id)
        res.json({ "Success": "User hase ben deleted" ,user:user})
 
     }
     catch (error) {
         console.error(error.message);
         res.status(500).send("Internal Server Error");
     }
 })


//========================fetch users=====================================
 router.get('/getusers', async (req, res) => {
  // const {rating, name, genre, category } = req.movies;
  let Userdata = req.user;
  
  try {
    const users = await User.find(req.body);
    console.log(users)
    res.json(users)
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
})

  module.exports=router;