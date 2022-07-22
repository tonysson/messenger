import React from 'react';

const Friends = ({ friend, userInfo : user }) => {
	// console.log(userInfo.id);
	// console.log(friend.messageInfo.senderId);
	console.log(friend);
	return (
		<div className='friend'>
			<div className='friend-image'>
				<div className='image'>
					<img src={`./image/${friend?.userInfo.image}`} alt='active-friend' />
				</div>
			</div>

			<div className='friend-name-seen'>
				<div className='friend-name'>
					<h4>{friend && friend?.userInfo?.userName}</h4>
					{/* <div className='msg-time'>
						{friend &&
						friend.messageInfo &&
						friend.messageInfo.receiverId === friend.userInfo._id ? (
							<span>{friend?.messageInfo?.text?.slice(0, 10)} </span>
						) : (
							<span>{friend && friend?.userInfo?.userName + ' '}</span>
						)}
						{friend && friend.messageInfo && friend.messageInfo.text ? (
							<span>{friend?.messageInfo?.text.slice(0, 10)}</span>
						) : friend?.messageInfo?.image ? (
							<span>Send a message</span>
						) : (
							<span>Connect You</span>
						)}
					</div> */}
				</div>
			</div>
		</div>
	);
};

export default Friends;
