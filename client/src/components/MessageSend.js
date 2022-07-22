import React from 'react';
import {
	FaPlusCircle,
	FaFileImage,
	FaGift,
	FaPaperPlane,
} from 'react-icons/fa';

import { emojis } from './../utils';

const MessageSend = ({
	newMessage,
	inputHandler,
	sendMessage,
	sendEmojis,
	sendImage,
}) => {


	const sendMessageWithKey = e => {
		e.keyCode === 13 && sendMessage(e)
	}

	return (
		<div className='message-send-section'>
			<input type='checkbox' id='emoji' />
			<div className='file hover-attachment'>
				<div className='add-attachment'>Add Attachment</div>
				<FaPlusCircle />
			</div>

			<div className='file hover-image'>
				<div className='add-image'>Add Image</div>
				<input
					type='file'
					id='pic'
					placeholder='Aa'
					className='form-control'
					onChange={sendImage}
				/>

				<label htmlFor='pic'>
					{' '}
					<FaFileImage />{' '}
				</label>
			</div>

			<div className='file hover-gift'>
				<div className='add-gift'>Add gift</div>
				<FaGift />
			</div>

			<div className='message-type'>
				<input
					type='text'
					name='message'
					id='message'
					placeholder='Aa'
					className='form-control'
					onChange={inputHandler}
					value={newMessage}
					onKeyDown={sendMessageWithKey}
				/>

				<div className='file hover-gift'>
					<label htmlFor='emoji'>
						{' '}
						<FaPaperPlane />{' '}
					</label>
				</div>
			</div>

			<div onClick={sendMessage} className='file'>
				❤
			</div>
			<div className='emoji-section'>
				<div className='emoji'>
					{emojis.map((emoji, index) => (
						<span onClick={() => sendEmojis(emoji)} key={index}>
							{emoji}
						</span>
					))}
				</div>
			</div>
		</div>
	);
};

export default MessageSend;
