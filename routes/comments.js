var express=require("express");
var  router=express.Router({mergeParams:true});
var Campground=require("../models/campground");
var Comment=require("../models/comment");
var mongoose=require("mongoose");
var methodOverride= require("method-override");



router.use(methodOverride("_method"));

router.get("/campgrounds/:id/comments/new",isLoggedIn,function(req,res){
	mongoose.model("Campground").findById(req.params.id,function(err,foundground){
		if(err){
			console.log(err);
		}
		res.render("comments/new",{camp:foundground});
	})
});
router.post("/campgrounds/:id/comments",isLoggedIn,function(req,res){
	mongoose.model("Campground").findById(req.params.id,function(err,foundground){
		if(err){
			console.log(err);
		}
		else{
			mongoose.model("Comment").create(req.body.comment,function(err,comment){
				comment.author.id=req.user._id;
				comment.author.username=req.user.username;
				comment.save();
				foundground.comments.push(comment);
				foundground.save();
				res.redirect("/campgrounds/"+foundground._id);
			});
		}
	})
});

router.get("/campgrounds/:id/comments/:comment_id/edit",checkCommentOwnership,function(req,res){
	mongoose.model("Comment").findById(req.params.comment_id,function(err,comment){
		if(err){
			res.redirect("back");
		}else{
		
		   	res.render("comments/edit",{campground_id:req.params.id,comment:comment});	
		}
	});
})

router.put("/campgrounds/:id/comments/:comment_id",checkCommentOwnership,function(req,res){
	mongoose.model("Comment").findByIdAndUpdate(req.params.comment_id,req.body.comment,function(err,updatedcomment){
		if(err){
			res.redirect("back");
		}else{
		   	res.redirect("/campgrounds/"+req.params.id);
		}
	});
})

router.delete("/campgrounds/:id/comments/:comment_id",checkCommentOwnership,function(req,res){
	mongoose.model("Comment").findByIdAndRemove(req.params.comment_id,function(err){
		if(err){
			res.redirect("back");
		}else{
		   res.redirect("/campgrounds/"+req.params.id);
		}
	});
});


function isLoggedIn(req,res,next){
	if(req.isAuthenticated()){
		return next();
	}
	req.flash("error","Please login");
	res.redirect("/login");
};

function checkCommentOwnership(req,res,next){
	if(req.isAuthenticated()){
			mongoose.model("Comment").findById(req.params.comment_id,function(err,comment){
			if(comment.author.id.equals(req.user._id)){
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
