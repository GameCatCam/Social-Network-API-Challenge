const { Schema, model } = require('mongoose');
const reactionSchema = require('./Reaction');

const thoughtSchema = new Schema(
    {
        // The text contained within the post
        thoughtText: {
            type: String,
            required: true,
            minlength: 1,
            maxlength: 280,
        },
        // Date it was created (formatted with getter)
        createdAt: {
            type: Date,
            default: Date.now,
            // Getter method
            get: function (createdAt) {
                const options = {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: 'numeric',
                    hour12: true,
                };
                return createdAt.toLocaleString('en-US', options);
            },
        },
        // user the thought is attributed to
        username: {
            type: String,
            required: true
        },
        reactions: [reactionSchema]
    }, 
    { // Insert Virtual
        toJSON: {
            virtuals: true,
            getters: true,
        },
        id: false,
    }
)
/*
thoughtText

    String
    Required
    Must be between 1 and 280 characters

createdAt

    Date
    Set default value to the current timestamp
    Use a getter method to format the timestamp on query

username (The user that created this thought)

    String
    Required

reactions (These are like replies)

    Array of nested documents created with the reactionSchema

Schema Settings:

    Create a virtual called reactionCount that retrieves the length of the
    thought's reactions array field on query.
*/
// Virtual that displays the total amount of reactions on a thought
thoughtSchema
    .virtual('reactionCount')
    .get(function () {
        return this.reactions.length
    })

const Thought = model('thought', thoughtSchema);

module.exports = Thought;