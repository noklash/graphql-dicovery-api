import { Schema, model } from 'mongoose';

const PostSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true } // Change type to ObjectId and add ref to User model
});

const Post = model('Post', PostSchema); 

export default Post; 
