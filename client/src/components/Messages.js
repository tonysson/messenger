import React from 'react';
import { useSelector } from 'react-redux';
import moment from 'moment'
const Message = ({ currentFriend, scrollRef, typingMessage }) => {
	// useSelector
	const { messages } = useSelector((state) => state.messenger);
	const { userInfo } = useSelector((state) => state.auth);
	return (
		<>
			<div className='message-show'>
				{messages && messages.length > 0
					? messages.map((message) =>
							message.senderId === userInfo.id ? (
								<div className='my-message' key={message._id} ref={scrollRef}>
									<div className='image-message'>
										<div className='my-text'>
											<p className='message-text'>
												{message.message.text === '' ? (
													<img
														src={`./image/${message.message.image}`}
														alt={message._id}
													/>
												) : (
													message.message.text
												)}
											</p>
										</div>
									</div>
									<div className='time'>
										{moment(message?.createdAt).startOf('mini').fromNow()}
									</div>
								</div>
							) : (
								<div key={message._id} ref={scrollRef} className='fd-message'>
									<div className='image-message-time'>
										<img
											src={`./image/${currentFriend.image}`}
											alt={currentFriend.userName}
										/>
										<div className='message-time'>
											<div className='fd-text'>
												<p className='message-text'>
													{message.message.text === '' ? (
														<img
															src={`./image/${message.message.image}`}
															alt={message._id}
														/>
													) : (
														message.message.text
													)}
												</p>
											</div>
											<div className='time'>
												{moment(message?.createdAt).startOf('mini').fromNow()}
											</div>
										</div>
									</div>
								</div>
							),
					  )
					: 'No Conversation yet'}
			</div>
			{typingMessage &&
				typingMessage.message &&
				typingMessage.senderId === currentFriend._id && (
					<div className='typing-message' key={currentFriend._id}>
						<div className='fd-message'>
							<div className='image-message-time'>
								<div className='message-time'>
									<div className='fd-text'>
										<p className='time'>
											{`${currentFriend.userName} is writing...`}
										</p>
									</div>
								</div>
							</div>
						</div>
					</div>
				)}
		</>
	);
};

export default Message;
