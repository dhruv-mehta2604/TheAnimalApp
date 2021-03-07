var express = require("express");
var router  = express.Router();
var Animal = require("../models/animal");
var middleware = require("../middleware");


//INDEX - show all animals
router.get("/", function(req, res){
    // Get all animals from DB
    Animal.find({}, function(err, allAnimals){
       if(err){
           console.log(err);
       } else {
          res.render("animals/index",{animals:allAnimals});
       }
    });
});

//CREATE - add new animal to DB
router.post("/", middleware.isLoggedIn, function(req, res){
    // get data from form and add to animals array
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newAnimal = {name: name, image: image, description: desc, author:author}
    // Create a new animal and save to DB
    Animal.create(newAnimal, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            //redirect back to campgrounds page
            console.log(newlyCreated);
            res.redirect("/animals");
        }
    });
});

//NEW - show form to create new animal
router.get("/new", middleware.isLoggedIn, function(req, res){
   res.render("animals/new"); 
});

// SHOW - shows more info about one animal
router.get("/:id", function(req, res){
    //find the animal with provided ID
    Animal.findById(req.params.id).populate("comments").exec(function(err, foundAnimal){
        if(err){
            console.log(err);
        } else {
            console.log(foundAnimal)
            //render show template with that animal
            res.render("animals/show", {animal: foundAnimal});
        }
    });
});

// EDIT ANIMAL ROUTE
router.get("/:id/edit", middleware.checkAnimalOwnership, function(req, res){
    Animal.findById(req.params.id, function(err, foundAnimal){
        res.render("animals/edit", {animal: foundAnimal});
    });
});

// UPDATE ANIMAL ROUTE
router.put("/:id",middleware.checkAnimalOwnership, function(req, res){
    // find and update the correct animal
    Animal.findByIdAndUpdate(req.params.id, req.body.animal, function(err, updatedAnimal){
       if(err){
           res.redirect("/animals");
       } else {
           //redirect somewhere(show page)
           res.redirect("/animals/" + req.params.id);
       }
    });
});

// DESTROY ANIMAL ROUTE
router.delete("/:id",middleware.checkAnimalOwnership, function(req, res){
   Animal.findByIdAndRemove(req.params.id, function(err){
      if(err){
          res.redirect("/animals");
      } else {
          res.redirect("/animals");
      }
   });
});


module.exports = router;

