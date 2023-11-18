const express = require('express');
const router = express.Router();
const Post = require("../models/Post");
const User = require("../models/User");
const { ensureAuthenticated, forwardAuthenticated } = require("../config/auth");



router.get("/" , ensureAuthenticated ,(req,res) => {
    Post.find()
        .populate("userId")
        .then((result) => {
            res.render("second/home" ,{posts: result.reverse() , curr_user: req.user});
        })
        .catch((err) => {
            res.send(err);
        });
});


router.get("/create" ,ensureAuthenticated, (req,res) => {
    res.render("second/create");
});


router.get('/storyDetail/:id' ,ensureAuthenticated, async(req,res) => {
    const id = req.params.id;
    Post.findById(id)
        .populate("userId")
        .then((result) => {
            res.render("second/details" , {details: result , curr_user: req.user});
        })
        .catch((err) => {
            res.send(err);
            console.log(err);
        });
});


router.get("/portfolio" ,ensureAuthenticated, async(req,res) => {
    User.findById(req.user)
    .populate("Posts")
    .then(result => {
      console.log("Portfolio is working properly");
      res.render('second/portfolio' , {user: result , curr_user: req.user});
    })
    .catch(err => {
      console.log(err);
    })
});


router.get("/portfolio/:id" , ensureAuthenticated , (req,res) => {
    const id = req.params.id;
    User.findById(id)
        .populate("Posts")
        .then((result) => {
            res.render("second/portfolio" , {user: result , curr_user: req.user});
        })
        .catch((err) => {
            res.send(err);
            console.log(err);
        });
})


router.post("/create"  , ensureAuthenticated, async(req,res) => {
    const { userId } = req.body;

    console.log(req.body);

    const newPost = new Post({
        name: req.body.name,
        about: req.body.about,
        description: req.body.description,
        userId: req.user,
    });

    await newPost.save()
        .then((r) => {console.log("the post is saved")})
        .catch((err) => res.send({msg: "ur post is not saved" , err}));
                                                                        
    
    try{
        const postOwner = await User.findById(newPost.userId);

        postOwner.Posts.push(newPost);
      
        await postOwner.save()
            .then((r) => {console.log("post is pushed into user data")})
            .catch((err) => {console.log(err)});
        
    }catch(err) {
        console.log(err);
    }
    res.redirect("/home");
});


router.post("/delete/:id" , ensureAuthenticated ,(req,res) => {
    const id = req.params.id;
    Post.findByIdAndDelete(id)
        .then((result) => {
            console.log("post is deleted");
            res.redirect('/home');
        })
        .catch((err) => {
            res.send(err);
        });
});



module.exports = router;