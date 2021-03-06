var express=require("express");
var app=express();
var bodyParser=require("body-parser");
var mongoose=require("mongoose");
var passport=require("passport");
var LocalStrategy= require("passport-local");
var Campground=require("./models/campground");
var Comment=require("./models/comment.js");
var User=require("./models/user.js");
var seedDB=require("./seed");


var campgroundRoutes=require("./routes/campgrounds");
var commentRoutes=require("./routes/comments");
var indexRoutes=require("./routes/index");

app.use(express.static(__dirname+"/public"));
app.use(bodyParser.urlencoded({extended: true}));
mongoose.connect("mongodb+srv://Pratt:Sanap007@cluster0.aj8jx.mongodb.net/<dbname>?retryWrites=true&w=majority",{
	useNewUrlParser:true,
	useCreateIndex:true
});
app.set("view engine","ejs");
// seedDB();


app.use(require("express-session")({
	secret:"bluh blah bluh",
	resave: false,
	saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use(function(req,res,next){
	res.locals.currentUser=req.user;
	next();
});


app.use(campgroundRoutes);
app.use(commentRoutes);
app.use(indexRoutes);
	

var port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log("Server Has Started!");
});
