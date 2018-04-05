var cheerio = require("cheerio");
var request = require("request");
var mongojs = require("mongojs");
var express = require("express");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");

//initialize express
var app = express();

var Times = require("./model.js");

var newArticle;

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
  console.log("We're connected");
});

app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static("public"));

mongoose.connect("mongodb://localhost/laTimesdb");

//Main route
app.get("/", function(req,res){
    res.send("Hello World");
});

app.get("/all",function(req,res){
   Times.find(function(err,articles){
       if(err) return console.error(err);
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
    console.log("TEEEEESSSTTT" + newArticle);
});

//Listen to port
app.listen(3000,function(){
    console.log("App running on port 3000");
});
