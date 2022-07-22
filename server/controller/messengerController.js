const formidable = require('formidable');
const User = require('../models/userModel');
const Message = require('../models/messageModel');
const fs = require('fs');

const getLastMessage = async (myId, friendId) => {
	const lastMessage = await Message.findOne({
		$or: [
			{
				$and: [{ senderId: { $eq: myId } }, { receiverId: { $eq: friendId } }],
			},
			{
				$and: [{ senderId: { $eq: friendId } }, { receiverId: { $eq: myId } }],
			},
		],
	}).sort({ updatedAt: -1 });

	return lastMessage;
};

module.exports.getFriends = async (req, res) => {
	const myId = req.myId;
	let friendsMessages = [];

	try {
		const users = await User.find({
			_id: {
				$ne: myId,
			},
		});
		// const filteredData =
		// 	users && users.length > 0 && users.filter((user) => user.id !== myId);
		for (let i = 0; i < users.length; i++) {
			let lastMessages = await getLastMessage(myId, users[i].id);
			friendsMessages = [
				...friendsMessages,
				{
					userInfo: users[i],
					messageInfo: lastMessages,
				},
			];

		}

		return res.status(200).json({ success: true, friends: friendsMessages });
	} catch (error) {
		res
			.status(500)
			.json({ error: { errorMessage: ['Internal server Error'] } });
	}
};

module.exports.messageSender = async (req, res) => {
	const senderId = req.myId;
	const { senderName, receiverId, message } = req.body;
	try {
		const messageData = await Message.create({
			senderId,
			senderName,
			receiverId,
			message: {
				text: message,
				image: '',
			},
		});
		res.status(201).json({
			success: true,
			message: messageData,
		});
	} catch (error) {
		res.status(500).json({
			error: {
				errorMessage: 'Internal Server Error',
			},
		});
	}
};

module.exports.getMessage = async (req, res) => {
	const myId = req.myId;
	const friendId = req.params.id;

	try {
		let messages = await Message.find({
			$or: [
				{
					$and: [
						{ senderId: { $eq: myId } },
						{ receiverId: { $eq: friendId } },
					],
				},
				{
					$and: [
						{ senderId: { $eq: friendId } },
						{ receiverId: { $eq: myId } },
					],
				},
			],
		});
		// messages = messages.filter(
		// 	(message) =>
		// 		(message.senderId === myId && message.receiverId === friendId) ||
		// 		(message.receiverId === myId && message.senderId === friendId),
		// );
		res.status(200).json({
			success: true,
			message: messages,
		});
	} catch (error) {
		res.status(500).json({
			error: {
				errorMessage: 'Internal Server Error',
			},
		});
	}
};

module.exports.sendMessageWithImage = async (req, res) => {
	const senderId = req.myId;
	const form = formidable();
	form.parse(req, (err, fields, files) => {
		if (err)
			res.status(500).json({ error: { errorMessage: 'Form Parse Error' } });
		const { senderName, receiverId, imageName } = fields;
		const newPath = __dirname + `../../../client/public/image/${imageName}`;
		files.image.originalFilename = imageName;

		try {
			fs &&
				fs.copyFile(files.image.filepath, newPath, async (err) => {
					if (err)
						res
							.status(500)
							.json({ error: { errorMessage: 'Image upload failed' } });
					const messageData = await Message.create({
						senderId,
						senderName,
						receiverId,
						message: {
							text: '',
							image: files.image.originalFilename,
						},
					});
					res.status(201).json({
						success: true,
						message: messageData,
					});
				});
		} catch (error) {
			res
				.status(500)
				.json({ error: { errorMessage: 'Internal Server Error' } });
		}
	});
};
