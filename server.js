var cheerio = require("cheerio");
var request = require("request");
var mongojs = require("mongojs");
var express = require("express");

// Make a request call to grab the HTML body from the site of your choice
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
