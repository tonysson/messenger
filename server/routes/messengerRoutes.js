const router = require('express').Router()
const {
	getFriends,
	messageSender,
	getMessage,
	sendMessageWithImage,
} = require('../controller/messengerController');
const { authMiddleware } = require('../middleware/authMiddleware');


router.get('/get-friends', authMiddleware, getFriends);
router.post('/send-message',authMiddleware,messageSender);
router.get('/get-message/:id', authMiddleware, getMessage);
router.post('/send-image-message', authMiddleware, sendMessageWithImage );


module.exports = router