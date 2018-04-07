var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var TimesSchema = new Schema({
    title: {
        type: String,
        unique: true,
    },
    link: {
        type: String,
        unique: true,
    },
    notes: [{type:Schema.Types.ObjectId, ref:"Note"}],

});

var Times = mongoose.model("article", TimesSchema);

module.exports = Times;