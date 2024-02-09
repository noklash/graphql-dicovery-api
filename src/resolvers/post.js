const  Post  = require('../model/post') ;

 const PostsResolver = {
    Query: {
        posts: async (_, __, context) => {
            if (!context.user) {
                throw new Error('Unauthorized')
            }else{
                try {
                    const posts = await Post.find({});
                    return {
                        success: true,
                        total: posts.length,
                        posts
                    };
                } catch (error) {
                    throw new Error('Failed to fetch posts');
                }
            }
            
        },

        post: async (_, { id }, context) => {
            if (!context.user){
                throw new Error('Unauthorized')
            }
            try {
                if (!id) throw new Error('No id provided');
                const post = await Post.findById(id);
                if (!post) throw new Error('No post found');
                return post;
            } catch (error) {
                throw error;
            }
        }
    },

    Mutation: {
        addPost: async (_, args, context) => {
            if (!context.user){
                throw new Error('Unauthorized')
            }
            try {
                const existingPost = await Post.findOne({ title: args.title });
                if (existingPost) throw new Error('Post already exists');
                const newPost = await Post.create(args);
                return newPost;
            } catch (error) {
                throw error;
            }
        },

        updatePost: async (_, args, context) => {
            if (!context.user){
                throw new Error('Unauthorized')
            }
            try {
                const { id, ...updateData } = args;
                if (!id) throw new Error('No id provided');
                const post = await Post.findById(id);
                if (!post) throw new Error('No post found');
                const updatedPost = await Post.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
                return updatedPost;
            } catch (error) {
                throw error;
            }
        },

        deletePost: async (_, { id }, context) => {
            if (!context.user){
                throw new Error('Unauthorized')
            }
            try {
                if (!id) throw new Error('No id provided');
                const post = await Post.findById(id);
                if (!post) throw new Error('No post found');
                const deletedPost = await Post.findByIdAndDelete(id);
                return {
                    success: true,
                    message: 'Post deleted successfully',
                    id: deletedPost?._id
                };
            } catch (error) {
                throw error;
            }
        }
    }
};

module.exports = PostsResolver;