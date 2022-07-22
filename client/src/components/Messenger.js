import React, { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import { FaEllipsisH, FaEdit, FaSistrix } from 'react-icons/fa';
import toast, { Toaster } from 'react-hot-toast';
import useSound from 'use-sound';
import ActiveFriend from './ActiveFriend';
import Friends from './Friends';
import RightSide from './RightSide';
import { useDispatch, useSelector } from 'react-redux';
import {
	getFriends,
	messageSender,
	getMessage,
	sendMessageWithImage,
} from './../store/actions/messengerAction';
import notification from '../audio/notification.mp3';
import sending from '../audio/sending.mp3';
const Messenger = () => {
	// LOAD audio
	const [notificationSound] = useSound(notification);
	const [sendingSound] = useSound(sending);
	// REF
	const scrollRef = useRef();
	const socket = useRef();
	// dispatch
	const dispatch = useDispatch();
	// useSelector
	const { friends, messages } = useSelector((state) => state.messenger);
	const { userInfo } = useSelector((state) => state.auth);
	//State
	const [currentFriend, setCurrentFriend] = useState('');
	const [newMessage, setNewMessage] = useState('');
	const [activeUser, setActiveUser] = useState([]);
	const [socketMessage, setSocketMessage] = useState('');
	const [typingMessage, setTypingMessage] = useState();

	// Functions
	const inputHandler = (e) => {
		setNewMessage(e.target.value);
		socket.current.emit('typingMessage', {
			senderId: userInfo.id,
			receiverId: currentFriend._id,
			message: e.target.value,
		});
	};

	const sendMessage = (e) => {
		e.preventDefault();
		sendingSound();
		const data = {
			senderName: userInfo.userName,
			receiverId: currentFriend._id,
			message: newMessage ? newMessage : '❤',
		};
		socket.current.emit('sendMessage', {
			senderId: userInfo.id,
			senderName: userInfo.userName,
			receiverId: currentFriend._id,
			time: new Date(),
			message: {
				text: newMessage ? newMessage : '❤',
				image: '',
			},
		});
		socket.current.emit('typingMessage', {
			senderId: userInfo.id,
			receiverId: currentFriend._id,
			message: '',
		});
		dispatch(messageSender(data));
		setNewMessage('');
	};

	const sendEmojis = (emojis) => {
		socket.current.emit('typingMessage', {
			senderId: userInfo.id,
			receiverId: currentFriend._id,
			message: `${newMessage}` + emojis,
		});
		setNewMessage(`${newMessage}` + emojis);
	};

	const sendImage = (e) => {
		if (e.target.files.length !== 0) {
			sendingSound();
			const imageName = e.target.files[0].name;
			const newImageName = Date.now() + imageName;
			const formData = new FormData();
			formData.append('senderName', userInfo.userName);
			formData.append('imageName', newImageName);
			formData.append('receiverId', currentFriend._id);
			formData.append('image', e.target.files[0]);
			// socket
			socket.current.emit('sendMessage', {
				senderId: userInfo.id,
				senderName: userInfo.userName,
				receiverId: currentFriend._id,
				time: new Date(),
				message: {
					text: '',
					image: newImageName,
				},
			});
			dispatch(sendMessageWithImage(formData));
		}
	};

	useEffect(() => {
		dispatch(getFriends());
	}, [dispatch]);

	useEffect(() => {
		dispatch(getMessage(currentFriend._id));
	}, [currentFriend?._id, dispatch]);

	useEffect(() => {
		friends &&
			friends.length > 0 &&
			setCurrentFriend(Object.values(friends)[0].userInfo);
	}, [friends]);

	// Allow automatic scrool when sending message
	useEffect(() => {
		scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
	}, [messages]);

	//Socket
	useEffect(() => {
		socket.current = io('ws://localhost:8800');
		socket.current.on('getMessage', (data) => {
			setSocketMessage(data);
		});
		socket.current.on('getTypingMessage', (data) => {
			setTypingMessage(data);
		});
	}, []);

	useEffect(() => {
		if (socketMessage && currentFriend) {
			if (
				socketMessage.senderId === currentFriend._id &&
				socketMessage.receiverId === userInfo.id
			) {
				dispatch({
					type: 'SOCKET_MESSAGE',
					payload: {
						message: socketMessage,
					},
				});
			}
		}
	}, [socketMessage, dispatch, currentFriend, userInfo?.id]);

	useEffect(() => {
		socket.current.emit('addUser', userInfo.id, userInfo);
	}, [userInfo]);

	useEffect(() => {
		socket.current.on('getUser', (users) => {
			const filteredActiveUser = users.filter(
				(user) => user.userId !== userInfo.id,
			);
			setActiveUser(filteredActiveUser);
		});
	}, [userInfo]);

	useEffect(() => {
		if (
			socketMessage &&
			socketMessage.senderId !== currentFriend._id &&
			socketMessage.receiverId === userInfo.id
		) {
			notificationSound();
			toast.success(`${socketMessage.senderName} send a new message`);
		}
	}, [socketMessage, dispatch, currentFriend, userInfo?.id, notificationSound]);

	return (
		<div className='messenger'>
			<Toaster
				position={'top-right'}
				reverseOrder={false}
				toastOptions={{ style: { fontSize: '18px' } }}
			/>
			<div className='row'>
				<div className='col-3'>
					<div className='left-side'>
						<div className='top'>
							<div className='image-name'>
								<div className='image'>
									<img
										src={`./image/${userInfo && userInfo.image}`}
										alt='profile'
									/>
								</div>
								<div className='name'>
									<h3> Hi {userInfo && userInfo.userName} </h3>
								</div>
							</div>

							<div className='icons'>
								<div className='icon'>
									<FaEllipsisH />
								</div>
								<div className='icon'>
									<FaEdit />
								</div>
							</div>
						</div>

						<div className='friend-search'>
							<div className='search'>
								<button>
									{' '}
									<FaSistrix />{' '}
								</button>
								<input
									type='text'
									placeholder='Search'
									className='form-control'
								/>
							</div>
						</div>
						<div className='active-friends'>
							{activeUser && activeUser.length > 0
								? activeUser.map((activeFriend) => (
										<ActiveFriend
											key={activeFriend.userId}
											activeFriend={activeFriend}
											setCurrentFriend={setCurrentFriend}
										/>
								  ))
								: 'No active Friend'}
						</div>
						<div className='friends'>
							{friends && friends.length > 0
								? friends.map((friend) => (
										<div
											onClick={() => setCurrentFriend(friend?.userInfo)}
											className={
												currentFriend._id === friend?.userInfo._id
													? 'hover-friend active'
													: 'hover-friend'
											}
											key={friend._id}
										>
											<Friends 
											userInfo={userInfo} 
											friend={friend} />
										</div>
								  ))
								: 'No friend'}
						</div>
					</div>
				</div>
				{currentFriend ? (
					<RightSide
						currentFriend={currentFriend}
						inputHandler={inputHandler}
						newMessage={newMessage}
						sendMessage={sendMessage}
						scrollRef={scrollRef}
						sendEmojis={sendEmojis}
						sendImage={sendImage}
						activeUser={activeUser}
						typingMessage={typingMessage}
					/>
				) : (
					'Please select your friend'
				)}
			</div>
		</div>
	);
};

export default Messenger;
