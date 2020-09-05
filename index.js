const express = require("express");
const app = express();
const mongoose = require("mongoose");
const PORT = process.env.PORT || 7000;
const cors = require("cors");
const bodyParser = require("body-parser");
const config = require("./config/config");

// ROUTES IMPORT
const userRoutes = require('./routes/userRoutes')
const questionRoutes = require('./routes/questionRoutes');
const replyRoutes = require('./routes/replyRoutes')

// INITIALIZED MODELS
const Question = require('./models/question');
require('./models/reply');
require('./models/user')

app.set("view engine", "ejs");
app.use(express.static(__dirname+"/public"));

app.use(cors());
mongoose
  .connect(process.env.database || config.database, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  })
  .then(
    () => {
      console.log("Connected to database");
    },
    err => {
      console.log(err);
      console.log("Connection Failed");
    }
  );
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//ROUTES INITIALIZATION
app.use('/user',userRoutes);
app.use('/question',questionRoutes);
app.use('/reply',replyRoutes);

app.get('/', (req, res)=>{
  res.render("landing");
});

app.get('/question', (req,res)=>{
  Question.find({}, (err, questions)=>{
    if(err){
      console.log(err);
    }else{
      res.render("posts", {questions: questions});
    }
  })
 
});


app.listen(PORT, () => {
  console.log("Server is listening at port " + PORT);
});
