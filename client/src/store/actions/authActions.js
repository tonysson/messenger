import axios from 'axios';
import { REGISTER_FAIL, REGISTER_SUCCESS, LOGIN_SUCCESS, LOGIN_FAIL } from './../types/authTypes';

export const userLogin = (data) => {
	return async (dispatch) => {
		// axios config
		const config = {
			headers: {
				'Content-Type': 'application/json',
			},
		};

		try {
			const response = await axios.post(
				'/api/messenger/user-login',
				data,
				config,
			);
			localStorage.setItem('authToken', response.data.token);
			dispatch({
				type: LOGIN_SUCCESS,
				payload: {
					successMessage: response.data.successMessage,
					token: response.data.token,
				},
			});
		} catch (error) {
			dispatch({
				type: LOGIN_FAIL,
				payload: {
					error: error.response.data.error.errorMessage,
				},
			});
		}
	};
};

export const userRegister = (data) => {
	return async (dispatch) => {
		// axios config
		const config = {
			headers: {
				'Content-Type': 'application/json',
			},
		};
		try {
			const response = await axios.post(
				'/api/messenger/user-register',
				data,
				config,
			);
			localStorage.setItem('authToken', response.data.token);
			dispatch({
				type: REGISTER_SUCCESS,
				payload: {
					successMessage: response.data.successMessage,
					token: response.data.token,
				},
			});
		} catch (error) {
			dispatch({
				type: REGISTER_FAIL,
				payload: {
					error: error.response.data.error.errorMessage,
				},
			});
		}
	};
};
