import React from 'react';
import { FaPhoneAlt, FaVideo, FaRocketchat } from 'react-icons/fa';
import FriendInfo from './FriendInfo';
import Messages from './Messages';
import MessageSend from './MessageSend';

const RightSide = ({
	currentFriend,
	newMessage,
	inputHandler,
	sendMessage,
	scrollRef,
	sendEmojis,
	sendImage,
	activeUser,
	typingMessage,
}) => {
	return (
		<div className='col-9'>
			<div className='right-side'>
				<input type='checkbox' id='dot' />
				<div className='row'>
					<div className='col-8'>
						<div className='message-send-show'>
							<div className='header'>
								<div className='image-name'>
									<div className='image'>
										<img
											src={`./image/${currentFriend.image}`}
											alt={currentFriend.userName}
										/>
										{activeUser &&
											activeUser.length > 0 &&
											activeUser.some(
												(active) => active.userId === currentFriend._id,
											) && <div className='active-icon'></div>}
									</div>

									<div className='name'>
										<h3> {currentFriend && currentFriend.userName} </h3>
									</div>
								</div>
								<div className='icons'>
									<div className='icon'>
										<FaPhoneAlt />
									</div>

									<div className='icon'>
										<FaVideo />
									</div>

									<div className='icon'>
										{/* <FaRocketchat /> */}
										<label htmlFor='dot'>
											{' '}
											<FaRocketchat />{' '}
										</label>
									</div>
								</div>
							</div>
							<Messages
								currentFriend={currentFriend}
								scrollRef={scrollRef}
								typingMessage={typingMessage}
							/>
							<MessageSend
								inputHandler={inputHandler}
								newMessage={newMessage}
								sendMessage={sendMessage}
								sendEmojis={sendEmojis}
								sendImage={sendImage}
							/>
						</div>
					</div>
					<div className='col-4'>
						<FriendInfo activeUser={activeUser} currentFriend={currentFriend} />
					</div>
				</div>
			</div>
		</div>
	);
};

export default RightSide;
