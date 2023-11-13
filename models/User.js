const { Schema, model } = require('mongoose');
const thoughtSchema = require('./Thought');

const userSchema = new Schema(
    {
        // unique username
        username: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        // email with email name validation
        email: {
            type: String,
            required: true,
            unique: true,
            match: [/^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/, 'Please fill a valid email address']
        },
        // an array of all a user's thoughts
        thoughts: [
            {
                type: Schema.Types.ObjectId,
                ref: 'thought',
            },
        ],
        // an array of all a user's friends
        friends: [
            {
                type: Schema.Types.ObjectId,
                ref: 'user',
            },
        ],
    }, 
    { // Insert Virtual
        toJSON: {
            virtuals: true,
        },
        id: false,
    }
)
/* 
User:

    username

        String
        Unique
        Required
        Trimmed

    email

        String
        Required
        Unique
        Must match a valid email address (look into Mongoose's matching validation)

    thoughts

        Array of _id values referencing the Thought model

    friends

        Array of _id values referencing the User model (self-reference)
        
    Schema Settings:

        Create a virtual called friendCount that retrieves the length of the user's friends array field on query.
*/
// Virtual made to count a user's friend total.
userSchema
    .virtual('friendCount')
    .get(function () {
        return this.friends ? this.friends.length : 0;
    })

const User = model('user', userSchema);

module.exports = User;