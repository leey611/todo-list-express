const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const todoSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  isDone: {
    type: Boolean,
    default: false
  },
  //make user connect to todo
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    index: true, //index is just to make faster
    required: true
  }
});

module.exports = mongoose.model('Todo', todoSchema);
