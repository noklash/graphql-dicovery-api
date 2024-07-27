const Post  = require('../model/post') ;
const User = require('../model/user');

 const PostsResolver = {
    Query: {
        posts: async (_, __, context) => {
            // if (!context.user) {
            //     throw new Error('Unauthorized')
            // }
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
            
        },

        post: async (_, { id }, context) => {
            // if (!context.user){
            //     throw new Error('Unauthorized')
            // }
            try {
                if (!id) throw new Error('No id provided');
                const post = await Post.findById(id).populate('user');  
                if (!post) throw new Error('No post found');
                return post;
            } catch (error) {
                throw error;
            }
        }
    },

    Mutation: {
        // addPost: async (_, args, context) => {
        //     // if (!context.user){
        //     //     throw new Error('Unauthorized')
        //     // }
        //     try {
        //         const existingPost = await Post.findOne({ title: args.title });
        //         if (existingPost) throw new Error('Post already exists');
        //         const newPost = await Post.create(args);
        //         return newPost;
        //     } catch (error) {
        //         throw error;
        //     }
        // },

        addPost: async (_, { title, description, image, userId }) => {
            try {
              // Log input parameters
              console.log('addPost input:', { title, description, image, userId });
      
              const user = await User.findById(userId);
              if (!user) {
                throw new Error('User not found');
              }
      
              const newPost = new Post({
                title,
                description,
                image,
                user: user._id,
              });
      
              // Save the new post to the database
              const savedPost = await newPost.save();
      
              // Add the post ID to the user's posts array and save the user
              user.posts.push(savedPost._id);
              await user.save();
      
              // Populate the user field in the saved post before returning it
              await savedPost.populate('user');
      
              // Log the saved post
              console.log('Post created:', savedPost);
      
              return savedPost;
            } catch (error) {
              console.error('Error creating post:', error);
              throw new Error('Error creating post');
            }
          },

        updatePost: async (_, args, context) => {
            // if (!context.user){
            //     throw new Error('Unauthorized')
            // }
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
            // if (!context.user){
            //     throw new Error('Unauthorized')
            // }
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