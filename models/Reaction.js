const { Schema, Types } = require('mongoose');

const reactionSchema = new Schema(
    {
        // Creates an ID for which we can call reactions from
        reactionId: {
            type: Schema.Types.ObjectId,
            default: () => new Types.ObjectId(),
        },
        // The text contained within.
        reactionBody: {
            type: String,
            required: true,
            maxlength: 280,
        },
        // User to attribute the reaction to
        username: {
            type: String,
            required: true,
        },
        // Date it was created and formatted to read better
        createdAt: {
            type: Date,
            default: Date.now,
            // Getter Method
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
        }
    },
    {
        toJSON: {
          getters: true,
        },
        id: false,
      }
)

module.exports = reactionSchema;

/*
reactionId

    Use Mongoose's ObjectId data type
    Default value is set to a new ObjectId

reactionBody

    String
    Required
    280 character maximum

username

    String
    Required

createdAt

    Date
    Set default value to the current timestamp
    Use a getter method to format the timestamp on query

Schema Settings:

    This will not be a model, but rather will be used as the reaction 
    field's subdocument schema in the Thought model.
*/