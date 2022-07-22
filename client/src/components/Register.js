import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { userRegister } from './../store/actions/authActions';
import { useAlert } from 'react-alert';
import { SUCCESS_MESSAGE_CLEAR, ERROR_CLEAR } from './../store/types/authTypes';

const Register = () => {
	const dispatch = useDispatch();
	const alert = useAlert();
	// replce history method
	const navigate = useNavigate();
	// access all our properties in the reducers
	const {  authenticated, error, successMessage } =
		useSelector((state) => state.auth);

	const [state, setState] = useState({
		userName: '',
		email: '',
		password: '',
		confirmPassword: '',
		image: '',
	});

	const [loadImage, setLoadImage] = useState();

	// Handle all the input
	const inputHandler = (e) => {
		setState({ ...state, [e.target.name]: e.target.value });
	};

	// Load a file and set it into a state
	const fileHandler = (e) => {
		if (e.target.files.length !== 0) {
			setState({
				...state,
				[e.target.name]: e.target.files[0],
			});
		}
		const reader = new FileReader();
		reader.onload = () => {
			setLoadImage(reader.result);
		};
		reader.readAsDataURL(e.target.files[0]);
	};

	// Register an user
	const register = (e) => {
		e.preventDefault();
		const { userName, email, password, confirmPassword, image } = state;
		const formData = new FormData();
		formData.append('userName', userName);
		formData.append('email', email);
		formData.append('password', password);
		formData.append('confirmPassword', confirmPassword);
		formData.append('image', image);
		dispatch(userRegister(formData));
	};

	useEffect(() => {
		if (authenticated) navigate('/');
		if (successMessage) {
			alert.success(successMessage);
			dispatch({type : SUCCESS_MESSAGE_CLEAR})
		}

		if (error) {
			error.map((err) => alert.error(err));
			dispatch({type : ERROR_CLEAR})
		}
	}, [successMessage, alert, error, authenticated, navigate, dispatch]);

	return (
		<div className='register'>
			<div className='card'>
				<div className='card-header'>
					<h3>Register</h3>
					<div className='card-body'>
						<form onSubmit={register}>
							<div className='form-group'>
								<label htmlFor='username'>User Name</label>
								<input
									onChange={inputHandler}
									name='userName'
									value={state.userName}
									type='text'
									className='	form-control'
									placeholder='User Name'
									id='username'
								/>
							</div>
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
									className='form-control'
									placeholder='Password'
									id='password'
								/>
							</div>
							<div className='form-group'>
								<label htmlFor='confirmPassword'>Confirm Password</label>
								<input
									onChange={inputHandler}
									name='confirmPassword'
									value={state.confirmPassword}
									type='password'
									className='form-control'
									placeholder='Confirm Password'
									id='confirm-password'
								/>
							</div>
							<div className='form-group'>
								<div className='file-image'>
									<div className='image'>
										{loadImage ? <img src={loadImage} alt='profile' /> : ''}
									</div>
									<div className='file'>
										<label htmlFor='image'>Select Image</label>
										<input
											type='file'
											onChange={fileHandler}
											name='image'
											className='form-control'
											id='image'
										/>
									</div>
								</div>
							</div>
							<div className='form-group'>
								<button type='submit' value='register' className='btn'>
									Register
								</button>
							</div>

							<div className='form-group'>
								<span>
									<Link to='/messenger/login'>Login your account</Link>
								</span>
							</div>
						</form>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Register;
