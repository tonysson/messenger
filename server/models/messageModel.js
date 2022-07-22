const { model, Schema } = require('mongoose');

const messageSchema = new Schema(
	{
		senderName: {
			type: String,
			required: true,
		},
		senderId: {
			type: String,
			required: true
		},
		receiverId: {
			type: String,
			required: true
		},
		message: {
			text : {
                type : String,
                default : ''
            },

            image : {
                type : String,
                default : ''
            }
		},
        status : {
            type : String ,
            default : 'inactive'
        }
	},
	{ timestamps: true },
);

module.exports = model('message', messageSchema);
