
const  User  = require('../model/user');

const handleUserNotFoundError = (id) => {
    throw new Error(`User with id ${id} not found`);
};

const UsersResolver = {
    Query: {
        users: async () => {
        
            try {
                const users = await User.find({});
                return {
                    success: true,
                    total: users.length,
                    users
                };
            } catch (error) {
                throw new Error('Failed to fetch users');
            }
        },

        user: async (_, { id }) => {
            try {
                if (!id) throw new Error('No id provided');
                const user = await User.findById(id);
                if (!user) handleUserNotFoundError(id);
                return user;
            } catch (error) {
                throw error;
            }
        }
    },

    Mutation: {
        regUser: async (_, args) => {
            try {
                const existingUser = await User.findOne({ email: args.email });
                if (existingUser) {
                    throw new Error('User already exists');
                } else {
                    const newUser = await User.create({
                        username: args.username,
                        email: args.email,
                        password: args.password
                    });
                    return newUser;
                }
            } catch (error) {
                throw error;
            }
        },

        loginUser: async (_, { email, password }) => {
            try {
                const user = await User.findOne({ email });
                if (!user) throw new Error('User not found');
                const isValid = await user.isValidPassword(password);
                if (!isValid) throw new Error('Invalid password');
                return user;
            } catch (error) {
                throw error;
            }
        },

        updateUser: async (_, { id, ...updateData }, context) => {
            if (!context.user){
                throw new Error('Unauthorized')
            }
            try {
                if (!id) throw new Error('No id provided');
                const user = await User.findById(id);
                if (!user) handleUserNotFoundError(id);
                const updatedUser = await User.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
                return updatedUser;
            } catch (error) {
                throw error;
            }
        },

        deleteUser: async (_, { id }, context) => {
            if (!context.user){
                throw new Error('Unauthorized')
            }
            try {
                if (!id) throw new Error('No id provided');
                const user = await User.findById(id);
                if (!user) handleUserNotFoundError(id);
                const deletedUser = await User.findByIdAndDelete(id);
                return {
                    success: true,
                    message: 'User deleted successfully',
                    id: deletedUser?._id
                };
            } catch (error) {
                throw error;
            }
        }
    }
};

module.exports =  UsersResolver;
