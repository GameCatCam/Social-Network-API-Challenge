const { User, Thought } = require('../models');

// All logic for routes featured in /routes/api/userRoutes.js
module.exports = {
    // gets all users and displays them in json
    async getUser(req, res) {
        try {
            const users = await User.find();

            res.json(users)
        } catch (err) {
            console.log(err);
            return res.status(500).json(err)
        }
    },
    // gets a single user and displays them in json with their friend and thought data
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
    // Creates a new user
    async createUser(req, res) {
        try {
            const user = await User.create(req.body);
            res.json(user)
        } catch (err) {
            console.log(err)
            return res.status(500).json(err)
        }
    },
    // Deletes a user
    async deleteUser(req, res) {
        try {
            const user = await User.findOneAndRemove({ _id: req.params.userId });

            if (!user) {
                return res.status(404).json({ message: 'User does not exist!' })
            }

            // Remove associated thoughts!
            await Thought.deleteMany({ username: user.username });

            res.json({ message: 'User and thoughts successfully deleted!' })
        } catch (err) {
            console.log(err)
            res.status(500).json(err)
        }
    },
    // Updates a user's information
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
    // Adds a friend to a user and the friend's friend list
    async addFriend(req, res) {
        try {
            const user = await User.findOneAndUpdate(
                { _id: req.params.userId },
                { $addToSet: { friends: req.params.friendId } },
                { new: true }
            )

            await User.findOneAndUpdate(
                { _id: req.params.friendId },
                { $addToSet: { friends: req.params.userId } },
                { new: true }
            )

            if (!user) {
                return res.status(404).json({ message: 'User does not exist' })
            }

            res.json({
                user,
                message: "Friend added to user and friend's lists."
            })
        } catch (err) {
            console.log(err)
            res.status(500).json(err)
        }
    },
    // Deletes a friend from a user and a friends friend list
    async deleteFriend(req, res) {
        try {
            const user = await User.findOneAndUpdate(
                { _id: req.params.userId },
                { $pull: { friends: req.params.friendId } },
                { new: true }
            )

            await User.findOneAndUpdate(
                { _id: req.params.friendId },
                { $pull: { friends: req.params.userId } },
                { new: true }
            )

            if (!user) {
                return res.status(404).json({ message: 'User does not exist' })
            }

            res.json({
                user,
                message: "Friend removed from user and friend's lists."
            })
        } catch (err) {
            console.log(err)
            res.status(500).json(err)
        }
    }
}

/* This is the structure for the userRoutes
/api/users

    GET all users

    GET a single user by its _id and populated thought and friend data

    POST a new user:

    PUT to update a user by its _id

    DELETE to remove user by its _id

    BONUS: Remove a user's associated thoughts when deleted.

/api/users/:userId/friends/:friendId

    POST to add a new friend to a user's friend list

    DELETE to remove a friend from a user's friend list
*/