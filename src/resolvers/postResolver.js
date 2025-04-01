const Post = require('../model/post');
const User = require('../model/user');

const PostsResolver = {
  Query: {
    posts: async (_, __, context) => {
      // Uncomment for authentication
      // if (!context.user) throw new Error('Unauthorized');
      try {
        const posts = await Post.find({}).populate('user');
        console.log(posts);
        return {
          success: true,
          total: posts.length,
          posts,
        };
      } catch (error) {
        throw new Error('Failed to fetch posts');
      }
    },
    post: async (_, { id }, context) => {
      // Uncomment for authentication
      // if (!context.user) throw new Error('Unauthorized');
      try {
        if (!id) throw new Error('No id provided');
        const post = await Post.findById(id).populate('user');
        if (!post) throw new Error('No post found');
        return post;
      } catch (error) {
        throw error;
      }
    },
  },
  Mutation: {
    addPost: async (_, { title, description, image, userId }) => {
      try {
        console.log('addPost input:', { title, description, image, userId });
        const user = await User.findById(userId);
        if (!user) throw new Error('User not found');
        const newPost = new Post({
          title,
          description,
          image,
          user: user._id,
        });
        const savedPost = await newPost.save();
        user.posts.push(savedPost._id);
        await user.save();
        await savedPost.populate('user');
        console.log('Post created:', savedPost);
        return savedPost;
      } catch (error) {
        console.error('Error creating post:', error);
        throw new Error('Error creating post');
      }
    },
    updatePost: async (_, args, context) => {
      // Uncomment for authentication
      // if (!context.user) throw new Error('Unauthorized');
      try {
        const { id, ...updateData } = args;
        if (!id) throw new Error('No id provided');
        const post = await Post.findById(id);
        if (!post) throw new Error('No post found');
        const updatedPost = await Post.findByIdAndUpdate(id, updateData, {
          new: true,
          runValidators: true,
        });
        return updatedPost;
      } catch (error) {
        throw error;
      }
    },
    deletePost: async (_, { id }, context) => {
      // Uncomment for authentication
      // if (!context.user) throw new Error('Unauthorized');
      try {
        if (!id) throw new Error('No id provided');
        const post = await Post.findById(id);
        if (!post) throw new Error('No post found');
        const deletedPost = await Post.findByIdAndDelete(id);
        return {
          success: true,
          message: 'Post deleted successfully',
          id: deletedPost?._id,
        };
      } catch (error) {
        throw error;
      }
    },
    // uploadImage: async (_, { file }) => {
    //   // Placeholder: Implement file upload logic here
    //   return { url: 'http://example.com/image.jpg' };
    // },
  },
};

module.exports = PostsResolver;