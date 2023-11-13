const { User, Thought } = require('../models');

module.exports = {
    // Gets all thoughts from the DB
    async getThoughts(req, res) {
        try {
            const thoughts = await Thought.find();
            res.json(thoughts);
        } catch (err) {
            console.log(err)
            return res.status(500).json(err);
        }
    },
    // Gets a single thought from the DB based on an id query
    async getSingleThought(req, res) {
        try {
            const thought = await Thought.findOne({ _id: req.params.thoughtId })
                .select('-__v')

            if (!thought) {
                return res.status(404).json({ message: 'No thought with that Id...' })
            }

            res.json(thought);
        } catch (err) {
            console.log(err)
            return res.status(500).json(err);
        }
    },
    // Creates a new thought and adds it to the user's thoughts array
    async createThought(req, res) {
        try {
            const thought = await Thought.create(req.body);

            await User.findOneAndUpdate(
                { username: req.body.username },
                { $addToSet: { thoughts: thought._id } },
                { runValidators: true, new: true }
            )

            res.json({
                thought,
                message: 'Thought added to User'
            });
        } catch (err) {
            console.log(err)
            return res.status(500).json(err)
        }
    },
    // Updates a user's thought
    async updateThought(req, res) {
        try {
            const thought = await Thought.findOneAndUpdate(
                { _id: req.params.thoughtId },
                { $set: req.body },
                { runValidators: true, new: true }
            )

            if (!thought) {
                res.status(404).json({ message: 'No thought with this id...' })
            }

            res.json(thought)
        } catch (err) {
            console.log(err)
            return res.status(500).json(err)
        }
    },
    // Deletes a user's thought and removes it from the user's thoughts array
    async deleteThought(req, res) {
        try {
            const thought = await Thought.findOne({ _id: req.params.thoughtId });
    
            if (!thought) {
                return res.status(404).json({ message: 'No thought with this id...' });
            }
    
            const userId = thought.username;
    
            const deletedThought = await Thought.findOneAndDelete({ _id: req.params.thoughtId });
    
            if (!deletedThought) {
                return res.status(404).json({ message: 'No thought with this id...' });
            }
    
            const updatedUser = await User.findOneAndUpdate(
                { username: userId },
                { $pull: { thoughts: req.params.thoughtId } },
                { new: true }
            );
    
            if (!updatedUser) {
                return res.status(404).json({ message: 'No user associated with this thought...' });
            }
    
            res.json({ message: 'Thought deleted and removed from user!' });
        } catch (err) {
            console.log(err)
            return res.status(500).json(err)
        }
    }, 
    // Creates a new reaction and applies it to a thoughts reactions array
    async createReaction(req, res) {
        try {
            const thought = await Thought.findOneAndUpdate(
                { _id: req.params.thoughtId },
                { $addToSet: { reactions: req.body } },
                { runValidators: true, new: true }
            )

            if (!thought) {
                return res.status(404).json({ message: 'No thought with this id...' })
            }

            res.json(thought);
        } catch (err) {
            console.log(err)
            return res.status(500).json(err)
        }
    },
    // deletes a reaction
    async deleteReaction(req, res) {
        try {
            const thought = await Thought.findOneAndUpdate(
                { _id: req.params.thoughtId },
                { $pull: { reactions: { reactionId: req.body.reactionId } } },
                { runValidators: true, new: true }
            )

            if (!thought) {
                return res.status(404).json({ message: 'No thought with this id...' })
            }

            res.json(thought)
        } catch (err) {
            console.log(err)
            return res.status(500).json(err)
        }
    }
}

/* This is the structure for the thoughtRoutes
/api/thoughts

    GET to get all thoughts

    GET to get a single thought by its _id

    POST to create a new thought (don't forget to push the created thought's _id to the associated user's thoughts array field)

    // example data
    {
    "thoughtText": "Here's a cool thought...",
    "username": "lernantino",
    "userId": "5edff358a0fcb779aa7b118b"
    }

    PUT to update a thought by its _id

    DELETE to remove a thought by its _id

/api/thoughts/:thoughtId/reactions

    POST to create a reaction stored in a single thought's reactions array field

    DELETE to pull and remove a reaction by the reaction's reactionId value
*/