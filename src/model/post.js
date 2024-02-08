const  { Schema, model } = require('mongoose');

const PostSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true } 
});

const Post = model('Post', PostSchema); 

module.exports = Post; 
