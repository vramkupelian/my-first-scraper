var cheerio = require("cheerio");
var request = require("request");
var mongojs = require("mongojs");
var express = require("express");

//initialize express
var app = express();

//database configuration
var databaseURL = "scraper";
var collections = ["scrapedData"];

var db = mongojs(databaseURL,collections);
db.on("error", function(error){
    console.log("Database Error: ", error);
});

//Main route
app.get("/", function(req,res){
    res.send("Hello World");
});

app.get("/all",function(req,res){
    db.scrapedData.find({},function(error, found){
        if(error){
            console.log(error);
        }
        else{
            res.json(found);
        }
    });
});

app.get("/scrape", function(req,res){
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
        });
    console.log(results);
    });

    res.send("Scrape Complete");
});

//Listen to port
app.listen(3000,function(){
    console.log("App running on port 3000");
});
