var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var TimesSchema = new Schema({

    title: {
        type: String,
    },
    link: {
        type: String,
    }

});

var Times = mongoose.model("article", TimesSchema);

module.exports = Times;