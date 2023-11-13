const { User, Thought } = require('../models');

module.exports = {
    async getThoughts(req, res) {
        try {
            const thoughts = await Thought.find();
            res.json(thoughts);
        } catch (err) {
            console.log(err)
            return res.status(500).json(err);
        }
    },
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
    async createThought(req, res) {
        try {
            const thought = await Thought.create(req.body);

            await User.findOneAndUpdate(
                { _id: req.body.userId },
                { $addToSet: { thoughts: req.body } },
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
    async deleteThought(req, res) {
        try {
            const thought = await Thought.findOneAndDelete({ _id: req.params.thoughtId })

            if (!thought) {
                res.status(404).json({ message: 'No thought with this id...' })
            }

            res.json({ message: 'Thought deleted!' })
        } catch (err) {
            console.log(err)
            return res.status(500).json(err)
        }
    }, 
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
    async deleteReaction(req, res) {
        try {
            const thought = await Thought.findOneAndUpdate(
                { _id: req.params.thoughtId },
                { $pull: { reactions: { reactionId: req.params.reactionId } } },
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

/*
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