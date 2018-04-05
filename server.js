var cheerio = require("cheerio");
var request = require("request");
var mongojs = require("mongojs");
var express = require("express");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");

//initialize express
var app = express();

var Times = require("./models/times.js");
var Note = require("./models/Note.js");

var newArticle;

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("We're connected");
});

app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static("public"));

mongoose.Promise = Promise;
mongoose.connect("mongodb://localhost/laTimesdb");

//Main route
app.get("/", function(req,res){
    res.send("Hello World");
    res.render("index.html");
});

app.get("/articles",function(req,res){
   Times.find({})
   .then(function(dbArticle){
       res.json(dbArticle);
   })
   .catch(function(err){
       res.json(err);
   })
});

app.get("/scrape", function(req,res){
    //scrape portion
    request("http://www.latimes.com/", function(error, response, html) {

    var $ = cheerio.load(html);
    var results = [];
    
        $("h5").each(function(i, element) {   
            var title = $(element).text();
            var link = $(element).children().attr('href');
            results.push({
                title: title,
                link:link,
            });
            
            newArticle = new Times ({title: title, link:link});
            
            newArticle.save(function(err,newArticle){
                if(err) return console.error(err);
            });

            console.log("THIS IS A NEW ARTICLE: " + newArticle);
        })
       
    });
    res.send("Scrape Complete");
});

app.get("articles/:id",function(req,res){
    Times.findOne({_id: req.params.id})
    .populate("note")
    .then(function(dbArticle){
        res.json(dbArticle);
    })
    .catch(function(err){
        res.json(err);
    })
});

app.post("articles/:id",function(req,res){
    Note.create(req.body)
        .then(function(dbNote){
            return Times.findOneAndUpdate({_id:req.params.id}, {note:dbNote._id},{new:true});
        })
        .then(function(dbArticle){
            res.json(dbArticle);
        })
        .catch(function(err){
            res.json(err);
        });
});

app.post("/submit", function(req,res){
    Note.create(req.body)
    .then(function(dbNote){
        return Times.findOneAndUpdate({}, { $push: { notes: dbNote._id } }, { new: true });
    })
    .then(function(dbUser){
        res.json(dbUser);
    })
    .catch(function(err){
        res.json(err);
    })
})

app.get("/notes", function(req,res){
    Note.find({})
    //all notes
        .then(function(dbNote){
            res.json(dbNote);
        })
        .catch(function(err){
            res.json(err);
        });
})




//Listen to port
app.listen(3000,function(){
    console.log("App running on port 3000");
});
