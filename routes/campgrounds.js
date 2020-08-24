var express=require("express");
var  router=express.Router({mergeParams:true});
var mongoose=require("mongoose");
var Campground=require("../models/campground");
var methodOverride= require("method-override");
var bodyParser=require("body-parser");



router.use(methodOverride("_method"));



router.get("/campgrounds",function(req,res){
	mongoose.model("Campground").find({},function(err,allcampgrounds){
		if(err){
			console.log(err);
		}
		else{
			res.render("campgrounds/index",{campgrounds:allcampgrounds});
		}
	})
	
});
router.post("/campgrounds",isLoggedIn,function(req,res){
	var name=req.body.name;
	var image=req.body.image;
	var desc=req.body.description;
	var price=req.body.price;
	var author={
		id:req.user._id,
		username:req.user.username
	},
	newcamp={
		name:name,price:price,image:image,description:desc,author:author
	};
	mongoose.model("Campground").create(newcamp,function(err,newlycamp){
		if(err){
			console.log(err);
		}
		else{
			res.redirect("/campgrounds");
		}
	})
});
router.get("/campgrounds/new",isLoggedIn,function(req,res){
	res.render("campgrounds/new");
});
router.get("/campgrounds/:id",function(req,res){
	mongoose.model("Campground").findById(req.params.id).populate("comments").exec(function(err,foundcamp){
		if(err){
			console.log(err);
		}else{
			res.render("campgrounds/show",{camp:foundcamp});
		}
	})
});

router.get("/campgrounds/:id/edit",checkCampgroundOwnership,function(req,res){
	
			mongoose.model("Campground").findById(req.params.id,function(err,foundground){
				 res.render("campgrounds/edit",{camp:foundground});	
	        })
})

router.post("/campgrounds/:id",checkCampgroundOwnership,function(req,res){
    mongoose.model("Campground").findByIdAndUpdate(req.params.id,req.body.campground,function(err,updatedcamp){
		if(err){
			res.redirect("/campgrounds");
		}else{
			res.redirect("/campgrounds/"+updatedcamp._id);
		}
	})
});

router.delete("/campgrounds/:id",checkCampgroundOwnership,function(req,res){
	mongoose.model("Campground").findByIdAndRemove(req.params.id,function(err){
		if(err){
			res.redirect("/campgrounds");
		}else{
			
			res.redirect("/campgrounds");
		}
	})
});

function isLoggedIn(req,res,next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
};

function checkCampgroundOwnership(req,res,next){
	if(req.isAuthenticated()){
			mongoose.model("Campground").findById(req.params.id,function(err,foundground){
			if(foundground.author.id.equals(req.user._id)){
				 next();
			}
	        else{
				res.redirect("back");
			}
	        })
	}else{
		res.redirect("back");
	}
};


module.exports=router;