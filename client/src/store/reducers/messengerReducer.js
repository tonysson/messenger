// Initailize state
import { FRIEND_GET_SUCCESS, GET_MESSAGES_SUCCESS, SOCKET_MESSAGE } from './../types/messengerTypes';
import { SEND_MESSAGES_SUCCESS } from './../types/messengerTypes';
const messengerState = {
	friends: [],
	messages : []
};

export const messengerReducer = (state = messengerState, action) => {
	const { type, payload } = action;

    if (type === FRIEND_GET_SUCCESS ) {
			return {
				...state,
                friends : payload.friends
			};
		}

	if(type === GET_MESSAGES_SUCCESS){
		return {
			...state,
			messages : payload.messages
		}
	}

	if (type === SEND_MESSAGES_SUCCESS) {
		return {
			...state,
			messages: [...state.messages, payload.message],
		};
	}


	if (type === SOCKET_MESSAGE){
		return {
			...state,
			messages: [...state.messages, payload.message],
		};
	} 
	
	return state;
};
