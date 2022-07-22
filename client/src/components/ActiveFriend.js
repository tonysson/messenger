import React from 'react';

const ActiveFriend = ({ activeFriend, setCurrentFriend }) => {
	return (
		<div
			onClick={() => setCurrentFriend({
				_id: activeFriend.userInfo.id,
				email: activeFriend.userInfo.email,
				image: activeFriend.userInfo.image,
				userName: activeFriend.userInfo.userName,
			})}
			className='active-friend'
		>
			<div className='image-active-icon'>
				<div className='image'>
					<img
						src={`./image/${activeFriend.userInfo.image}`}
						alt={activeFriend.userInfo.id}
					/>
					<div className='active-icon'></div>
				</div>
			</div>
		</div>
	);
};

export default ActiveFriend;
