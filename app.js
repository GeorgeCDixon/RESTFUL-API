const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");
const { timeLog } = require("console");

const app= express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static("public"));


mongoose.set("strictQuery", false);
mongoose.connect("mongodb://localhost:27017/wikiDB",{useNewUrlParser:true});


const articleSchema={
    title:String,
    content: String
};

const Article = mongoose.model("article", articleSchema);



////////////////////////REQUESTS TARGETTING ALL ARTICLES//////////////////////
app.route("/articles")
.get(function(req, res){
 Article.find(function(err, foundArticles){
  if(!err){
      res.send(foundArticles);
  }
  else{
      console.log("Error Occured");
  }
 });
})
.post(function(req,res){

 const newArticle= new Article({
     title: req.body.title,
     content: req.body.content
 });
 newArticle.save(function(err){
     if(!err){
         res.send("Successfully Posted");
     }else{
       res.send(err);  
     }
});
})

.delete(function(req, res){
 Article.deleteMany(function(err){
     if(!err){
         res.send("Successfully deleted all");
     }else{
         res.send(err);
     }
 });

});

//Starting from here all coded as chained route above

/*
app.get("/articles", function(req, res){
   Article.find(function(err, foundArticles){
    if(!err){
        res.send(foundArticles);
    }
    else{
        console.log("Error Occured");
    }
   });
});

   app.post("/articles", function(req,res){
  
    const newArticle= new Article({
        title: req.body.title,
        content: req.body.content
    });
    newArticle.save(function(err){
        if(!err){
            res.send("Successfully Posted");
        }else{
          res.send(err);  
        }
   });
   });

   app.delete("/articles", function(req, res){
    Article.deleteMany(function(err){
        if(!err){
            res.send("Successfully deleted all");
        }else{
            res.send(err);
        }
    })

   });

   */


   //////////////////REQUESTS TARGETTING SPECIFIC ARTICLE////////////////

   app.route("/articles/:articleTitle")

   .get(function (req, res){
        const title=req.params.articleTitle;

    Article.findOne({title:title }, function(err, foundArticle){
        if(!err){
            if(foundArticle){
                res.send(foundArticle);
            }else{
                res.send("Nothing found as requested");
            }
        }else{
            res.send(err);
        }
    });
   })

   .put(function(req,res){
    const title= req.params.articleTitle;
       Article.findOneAndUpdate({title:title}, 
        {title:req.body.title, content: req.body.content},
        {overwrite:true},
        function(err){
            if(!err){
                res.send("Article Updated");
            }else{
                res.send(err);
            }
        }
       ) 
   })
   .patch(function(req, res){
        const title=req.params.articleTitle;
        Article.findOneAndUpdate(
            {title:title},
            {$set: req.body},
            function(err){
                if(!err){
                    res.send("Successfully Updated");
                }else{
                    res.send(err);
                }
            }
            )
   })
   .delete(function(req, res){
        const title= req.params.articleTitle;
        Article.deleteOne(
            {title: title},
            function(err){
                if(!err){
                    res.send("Deleted the selection");
                }else{
                    res.send(err);
                }
            }
        )
   });
  





app.listen(3000, function(){
    console.log("Server running on port");
});