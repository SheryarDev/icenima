const express = require('express')
const app=express();
const router = express.Router();
const Movie = require('../models/Movies')
const bodyParser = require("body-parser");
const multer = require("multer");
const path=require("path")
app.use((express.static(path.join(__dirname,"../../frontend/public/images"))))

const imagefolder=path.join(__dirname,"../../frontend/public/images")
console.log(imagefolder)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // cb(null, "uploads");  
    cb(null,imagefolder );  
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }, 
});
  
const upload = multer({ storage: storage });
   

// ROUTE 1:Create a user using :POST "api/movie" .Does't require Auth //no login required


router.post("/addmovie", upload.single("testImage"), async(req, res) => {

  try {
    let imagepath=(req.file) ? "images/"+req.file.filename : null;
    console.log("imagpath",imagepath)

    var myData = new Movie({
        name:req.body.name,
        img:imagepath,
        genre:req.body.genre,
        category:req.body.category,
        rating:req.body.rating,
      })
    console.log("mydata",myData)
    // myData.save()
  
    const saveddata = await myData.save()
    res.json(saveddata);
    // res.send("item saved to database");
    
  } catch (error) {
    res.status(400).send("unable to save to database");
  }
});



//Route 2:Delete an existing note using:delete "/api/movies/deletemovie" :Login required
router.delete('/deletemovie/:id', async (req, res) => {

  try {


    const { img, rating, name, genre, category } = req.body;


    //Find the note to be Delted
    let movie = await Movie.findById(req.params.id);
    if (!movie) { return res.status(404).send("Not Found") }

    //Allow deletion only if user owns this note
    // if(movie.user.toString() !== req.user.id){
    //     return res.status(401).send("Not Allowed")
    // }

    movie = await Movie.findByIdAndDelete(req.params.id)
    res.json({ "Success": "Movie hase ben deleted", movie: movie })

  }
  catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
})

//ROUTE 3: to fetch all movies


// router.get('/getmovies', async (req, res) => {

//   try {
//     const movies = await Movie.find({  })
//     res.json(movies)
//   } catch (error) {
//     console.error(error.message);
//     res.status(500).send("Internal Server Error");
//   }
// })


router.get('/getmovies', async (req, res) => {

  try {
    // let {page ,limit}=req.query

    let movies =await Movie.find({})
 
    res.json(movies);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
})

router.get('/getmoviespagination', async (req, res) => {

  try {
    // let {page ,limit}=req.query

    let page= Number(req.query.page) || 1;
    let  limit=Number(req.query.limit) || 8;
    let skip = (page-1) *limit;

    let movies =await Movie.find({}).skip(skip).limit(limit);
 
    res.json(movies);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
})


//============================================fetch movies by genres============================

router.get('/getbygenres/:genres', async (req, res) => {

  
  try {
    const movies = await Movie.find().where({genre:req.params.genres});
    res.json(movies)
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
})



//====================fetch by ratings=================================================================

router.get('/getAllrating/:rating', async (req, res) => {

  try {
    const movies = await Movie.find({}).where({ rating:req.params.rating});
    res.json(movies)
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }  
})



//==============================fetch movies by category================================================

//==============fetch bollywood category================
router.get('/getcategory/bollywood', async (req, res) => {
  // const {rating, name, genre, category } = req.body; 
  try {
    const movies = await Movie.find({ movies: req.movies }).where({ category:"bollwood" });
    res.json(movies)
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
})


//==============fetch Hollywood category================
router.get('/getcategory/hollywood', async (req, res) => {
  try {
    const movies = await Movie.find({ movies: req.movies }).where({ category:"Hollwood" });
    res.json(movies)
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
})

//TODO : fetch by all paramter api genre,rating,cetegory,pagination
// router.get('/getmovies', async (req, res) => {

//   try {
//     let genre=req.query.genre;
//        let rating=req.query.rating;
//      let category=req.query.category;
//        let page= Number(req.query.page) || 1;
//     let  limit=Number(req.query.limit) ||15;
//     let skip = (page-1) *limit;

//     let movies;
//  if(genre || rating || category){
//   // const movies = await Movie.find({$or:[{genre:{$in:genre}},{rating:{$in:rating}},{category:{$in:category}}]}).//skip(skip).limit(limit);
//    movies = await Movie.find({$or:[{genre},{rating},{category}]}).skip(skip).limit(limit);
//  }else{
//   movies = await Movie.find({}).skip(skip).limit(limit);
//  }

//   res.json(movies)
// } catch (error) {
//   console.error(error.message);
//   res.status(500).send("Internal Server Error");
// }
// })
module.exports = router;