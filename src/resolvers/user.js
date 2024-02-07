
import {User} from '../model/user';

export const UsersResolver = {
    Query : {
        users: async () => {
            try {
                const users = await User.find({});
                if (!users) throw new Error('No users found');
                return {
                    success: true,
                    total: users.length,
                    users
                };
            } catch (error) {
                throw error;
            }
        },    

        user: async (_, args) => {
            try {
                if (!args.id) throw new Error('No id provided');
                const user = await User.findById(args.id);
                if (!user) throw new Error('No user found');
                return user;
            } catch (error) {
                throw error;
            }
        }
    },

    Mutation : {
        regUser: async (_, args) => {
            try {
                const user = await User.findOne({email: args.email});
                if (user) throw new Error('User already exists');
                const newUser = await User.create({
                    username: args.username,
                    email: args.email,
                    password: args.password
                })
                return newUser;
            } catch (error) {
                throw error;
            }
        },

        loginUser: async (_,args) => {
            try {
                const user = await User.findOne({email: args.email});
                if (!user) throw new Error('User not found');
                const isValid = await user.isValidPassword(args.password);
                if (!isValid) throw new Error('Invalid password');
                return user;
            } catch (error) {
                throw error;
            }
        },

        updateUser: async (_, args) => {
            try {
                const id = args.id;
                if (!id) throw new Error('No id provided');
                const user = await User.findById(args.id);
                if (!user) throw new Error('User not found');
                const updateUser = await User.findByIdAndUpdate(id, {...args}, {new: true, runValidators: true});
                return updateUser;
            } catch (error) {
                throw error;
            }
        },

        deleteUser: async (_, args) => {
            try {
                const id = args.id;
                if (!id) throw new Error('No id provided');
                const user = await User.findById(args.id);
                if (!user) throw new Error('User not found');
                const deleteUser = await User.findByIdAndDelete(id);
                return {
                    success: true,
                    message: 'User deleted successfully',
                    id: deleteUser?._id
                };
            } catch (error) {
                throw error;
            }
        }
    }
}

