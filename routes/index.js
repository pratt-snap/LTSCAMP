var express=require("express");
var  router=express.Router({mergeParams:true});
var passport=require("passport");
var User=require("../models/user");




router.use(passport.initialize());


router.get("/",function(req,res){
		res.render("landing");
	});


router.get("/register",function(req,res){
	res.render("register");
});

router.post("/register",function(req,res){
	var newUser=new User({username: req.body.username});
	User.register(newUser,req.body.password,function(err,user){
		if(err){
			console.log(err);
		}else{
			passport.authenticate("local")(req,res,function(){
				res.redirect("/campgrounds");
			})
		}
	});
});

//Login Routes
router.get("/login",function(req,res){
	res.render("login");
});


router.post("/login",passport.authenticate("local",{
	successRedirect: "/campgrounds",
	failureRedirect: "/login"
}),function(req,res){
	console.log(req);
});

//LOGOUT ROUTES

router.get("/logout",function(req,res){
	req.logout();
	res.redirect("/campgrounds");
})


module.exports=router;