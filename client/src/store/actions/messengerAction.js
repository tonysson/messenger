import axios from 'axios';
import { FRIEND_GET_SUCCESS, GET_MESSAGES_SUCCESS, SEND_MESSAGES_SUCCESS } from './../types/messengerTypes';

export const getFriends = () => async (dispatch) => {
	try {
		const { data } = await axios.get('/api/messenger/get-friends');
		dispatch({
			type: FRIEND_GET_SUCCESS,
			payload: {
				friends: data.friends,
			},
		});
	} catch (error) {
		console.log(error.data);
	}
};

export const messageSender = (values) => async (dispatch) => {
	try {
		const {data}  = await axios.post('/api/messenger/send-message', values);
		dispatch({
			type: SEND_MESSAGES_SUCCESS,
			payload: {
				message: data.message,
			},
		});
		
	} catch (error) {
		throw new Error('Something went wrong' || error);
	}
};

export const getMessage = (id) => async (dispatch) => {
	try {
		const { data } = await axios.get(`/api/messenger/get-message/${id}`);
		dispatch({
			type: GET_MESSAGES_SUCCESS,
			payload: {
				messages: data.message,
			},
		});
	} catch (error) {console.log(error.data);}
};

export const sendMessageWithImage = values => async dispatch => {
	try {
		const { data } = await axios.post('/api/messenger/send-image-message', values);
		dispatch({
			type: SEND_MESSAGES_SUCCESS,
			payload: {
				message: data.message,
			},
		});
	} catch (error) {
		console.log(error.data)
	}
}
