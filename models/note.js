var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var NoteSchema = new Schema({
  title: String,
  body: String,
  _articleId:{
      type: Schema.Types.ObjectId,
      ref: "article",
  }
});

var Note = mongoose.model("Note", NoteSchema);

module.exports = Note;