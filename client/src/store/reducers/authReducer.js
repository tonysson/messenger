import tokenDecode from 'jwt-decode';
import { ERROR_CLEAR, REGISTER_FAIL, REGISTER_SUCCESS, SUCCESS_MESSAGE_CLEAR, LOGIN_SUCCESS, LOGIN_FAIL } from './../types/authTypes';
// CREATE INITIAL STATE
const authState = {
	loading: true,
	authenticated: false,
	error: '',
	successMessage: '',
	userInfo: '',
};

// Decode token
const decodToken = (token) => {
	const decodedToken = tokenDecode(token);
	const expTime = new Date(decodedToken.exp * 1000);
	if (new Date() > expTime) return null;
	return decodedToken;
};

// get token from localStorage
// nous permet de garder nos proprietés ds le store mm si on rafraichit la page apres registration
const getToken = localStorage.getItem('authToken');
if (getToken) {
	const getInfo = decodToken(getToken);
	if (getInfo) {
		authState.userInfo = getInfo;
		authState.authenticated = true;
		authState.loading = false;
	}
}

export const authReducer = (state = authState, action) => {
	const { payload, type } = action;

	if (type === REGISTER_SUCCESS || type === LOGIN_SUCCESS) {
		return {
			...state,
			error: '',
			loading: false,
			userInfo: decodToken(payload.token),
			successMessage: payload.successMessage,
			authenticated: true,
		};
	}

	if (type === REGISTER_FAIL || type=== LOGIN_FAIL) {
		return {
			...state,
			error: payload.error,
			authenticated: false,
			userInfo: '',
			loading: true,
		};
	}

    if(type === SUCCESS_MESSAGE_CLEAR){
        return {
            ...state ,
            successMessage : ''
        }
    }

    if (type === ERROR_CLEAR ) {
			return {
				...state,
				error: '' ,
			};
		}

	return state;
};
