import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { userLogin } from './../store/actions/authActions';
import { useDispatch, useSelector } from 'react-redux';

import { useAlert } from 'react-alert';
import { SUCCESS_MESSAGE_CLEAR, ERROR_CLEAR } from './../store/types/authTypes';

const Login = () => {
	const dispatch = useDispatch();
	const alert = useAlert();
	const navigate = useNavigate();
	// access all our properties in the reducers
	const { authenticated, error, successMessage } =
		useSelector((state) => state.auth);

	const [state, setState] = useState({
		email: '',
		password: '',
	});

	const inputHandler = (e) => {
		setState({
			...state,
			[e.target.name]: e.target.value,
		});
	};

	const login = (e) => {
		e.preventDefault();
		dispatch(userLogin(state));
	};

	useEffect(() => {
		if (authenticated) navigate('/');
		if (successMessage) {
			alert.success(successMessage);
			dispatch({ type: SUCCESS_MESSAGE_CLEAR });
		}

		if (error) {
			error.map((err) => alert.error(err));
			dispatch({ type: ERROR_CLEAR });
		}
	}, [successMessage, alert, error, authenticated, navigate, dispatch]);

	return (
		<div className='login'>
			<div className='card'>
				<div className='card-header'>
					<h3>Login</h3>
				</div>
				<div className='card-body'>
					<form onSubmit={login}>
						<div className='form-group'>
							<label htmlFor='email'>Email</label>
							<input
								onChange={inputHandler}
								name='email'
								value={state.email}
								type='email'
								className='form-control'
								placeholder='Email'
								id='email'
							/>
						</div>
						<div className='form-group'>
							<label htmlFor='password'>Password</label>
							<input
								onChange={inputHandler}
								name='password'
								value={state.password}
								type='password'
								className='	form-control'
								placeholder='Password'
								id='password'
							/>
						</div>
						<div className='form-group'>
							<button type='submit' value='login' className='btn'>
								Login
							</button>
						</div>

						<div className='form-group'>
							<span>
								<Link to='/messenger/register'>Register your account</Link>
							</span>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
};

export default Login;
