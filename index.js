const connectToMonog = require("./db")
const express = require('express')
const bodyParser = require("body-parser");
connectToMonog();
const app = express()
const port = process.env.PORT || 5000





//in order to use req.body we have to use this middleware
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

 //Available Routes
app.use('/api/users',require('./routes/auth'))
 app.use('/api/movies',require('./routes/movies'))
   app.use('/api/genres',require('./routes/genre'))

    
//static files

app.use(express.static(path.join(__dirname,"./client/build")));
const mypath=path.join(__dirname,"./client/build/index.html")
console.log(mypath)
  
// Available Routes
app.get("*",(req,res)=>{  
  res.sendFile(path.join(__dirname,"./client/build/index.html"),function(err){
    res.status(500).send(err);
  })
})

app.listen(port, () => {
  console.log(`car backend listening on port ${port}`)
})