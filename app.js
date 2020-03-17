//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require('lodash');
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

mongoose.connect("mongodb+srv://Blog:Pamnanichotu!8@blog-8uwpu.mongodb.net/test?retryWrites=true&w=majority", {useNewUrlParser: true});

const postsSchema = new mongoose.Schema ({
  title: {
    type: String,
    required: [true, "Please check your data entry, no title specified!"]
  },
  content: {
    type: String,
    required: [true, "Please check your data entry, no content specified!"]
  }
});

const Post = mongoose.model("Post", postsSchema);

const userSchema = new mongoose.Schema ({
  email: String,
  password: String
});

const secret = "Thisisourlittlesecret.";
userSchema.plugin(encrypt, { secret : secret, encryptedFields: ["password"]});

const User = mongoose.model("User", userSchema);


const homeStartingContent = new Post({
  title: "Home",
  content: "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing."
});
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

defaultPosts = [homeStartingContent];

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
let port = process.env.PORT;
if (port == null || port == "") {
	port = 3000;
}
app.listen(port, function() {
	console.log("Server started successfully.");
});

// app.listen(4000, function() {
//   console.log("Server started on port 4000");
// });

app.get("/", function(req, res){
  Post.find({}, function(err, posts){
    if (posts.length === 0){
      Post.insertMany(defaultPosts, function(err){
        if (err){
          console.log(err);
        } else {
          console.log("Default Posts added");
        }
      });
    }
    if (err){
      console.log(err);
    } else {
      res.render('home', {posts: posts});
    }
  });
});

app.get("/blog", function(req, res){
  Post.find({}, function(err, posts){
    if (posts.length === 0){
      Post.insertMany(defaultPosts, function(err){
        if (err){
          console.log(err);
        } else {
          console.log("Default Posts added");
        }
      });
    }
    if (err){
      console.log(err);
    } else {
      res.render('blog', {posts: posts});
    }
  });
});

app.get("/about", function(req, res){
  res.render('about', {aboutContent: aboutContent});
});

app.get("/login", function(req, res){
  res.render('login');
});
app.get("/register", function(req, res){
  res.render('register');
});
app.get("/contact", function(req, res){
  res.render('contact', {contactContent: contactContent});
});


app.post("/register",function(req,res){
  const newUser = new User({
    email: req.body.username,
    password: req.body.password
  });
  newUser.save(function(err){
    if (err) {
      console.log(err);
    } else{
      res.redirect("/blog");
    }
  });
});

app.post("/login",function(req,res){
  const username=req.body.username;
  const password=req.body.password;

  User.findOne({email: username}, function(err, foundUser){
    if(err) {
      console.log(err);
    }
    else{
      if(foundUser){
        if (foundUser.password=== password){
          res.redirect("/blog");
        }
      }
    }
  });
});



app.get("/compose", function(req, res){
  res.render('compose');
});

app.post("/compose", function(req, res) {
  const title = req.body.postTitle;
  const content = req.body.postBody;

  const newPost = new Post({
    title: title,
    content: content
  });
  newPost.save();
  console.log("added");
  res.redirect("/");
});

app.get('/posts/:id', function(req, res) {
  Post.findOne({_id: req.params.id}, function(err, post){
      if (err){
        console.log(err);
      } else {
        res.render('post', {postName: post.title, postBody: post.content} );
      }
  });
});
