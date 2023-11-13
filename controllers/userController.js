const { User } = require('../models');

module.exports = {
    async getUser(req, res) {
        try {
            const users = await User.find();

            res.json(users)
        } catch (err) {
            console.log(err);
            return res.status(500).json(err)
        }
    },
    async getSingleUser(req, res) { // populate with friend and thought data
        try {
            const user = await User.findOne({ _id: req.params.userId })
            .populate({
                path: 'friends',
                select: 'username',
            })
            .populate({
                path: 'thoughts',
                select: 'thoughtText reactions',
            })

            if (!user) {
                return res.status(404).json({ message: 'No user with that ID' })
            }

            res.json(user)
        } catch (err) {
            console.log(err);
            return res.status(500).json(err)
        }
    },
    async createUser(req, res) {
        try {
            const user = await User.create(req.body);
            res.json(user)
        } catch (err) {
            console.log(err)
            return res.status(500).json(err)
        }
    },
    async deleteUser(req, res) {
        try {
            const user = await User.findOneAndRemove({ _id: req.params.userId });

            if (!user) {
                return res.status(404).json({ message: 'User does not exist!' })
            }

            // Remove associated thoughts!

            res.json({ message: 'User successfully deleted!' })
        } catch (err) {
            console.log(err)
            res.status(500).json(err)
        }
    },
    async updateUser(req, res) {
        try {
            const user = await User.findOneAndUpdate(
                { _id: req.params.userId },
                { $set: req.body },
                { runValidators: true, new: true }
            );

            if (!user) {
                return res.status(404).json({ message: 'User does not exist' });
            }

            res.json(user)
        } catch (err) {
            res.status(500).json(err)
        }
    },
    async addFriend(req, res) {
        try {
            const user = await User.findOneAndUpdate(
                { _id: req.params.userId },
                { $addToSet: { friends: req.params.friendId } },
                { new: true }
            )

            if (!user) {
                return res.status(404).json({ message: 'User does not exist' })
            }

            res.json(user)
        } catch (err) {
            console.log(err)
            res.status(500).json(err)
        }
    },
    async deleteFriend(req, res) {
        try {
            const user = await User.findOneAndUpdate(
                { _id: req.params.userId },
                { $pull: { friends: { _id: req.params.friendId } } },
                { new: true }
            )

            if (!user) {
                return res.status(404).json({ message: 'User does not exist' })
            }

            res.json(user)
        } catch (err) {
            console.log(err)
            res.status(500).json(err)
        }
    }
}

/*
/api/users

    GET all users

    GET a single user by its _id and populated thought and friend data

    POST a new user:

    PUT to update a user by its _id

    DELETE to remove user by its _id

    BONUS: Remove a user's associated thoughts when deleted.
*/

/* 
/api/users/:userId/friends/:friendId

    POST to add a new friend to a user's friend list

    DELETE to remove a friend from a user's friend list
*/