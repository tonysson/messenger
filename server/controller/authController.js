const formidable = require('formidable');
const validator = require('validator');
const User = require('../models/userModel');
const fs = require('fs');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports.userRegister = (req, res) => {
	const form = formidable();
	form.parse(req, async (err, fields, files) => {
		const { userName, email, password, confirmPassword } = fields;
		const { image } = files;
		const error = [];
        // Error when no data is provided
		if (!userName) error.push('Please provide an userName');
		if (!email) error.push('Please provide an email');
		if (email && !validator.isEmail(email))
			error.push('Please provide a valid email');
		if (!password) error.push('Please provide a password');
		if (!confirmPassword) error.push('Please provide a confirm Password');
		if (password && confirmPassword && password !== confirmPassword)
			error.push('Both password do not match');
		if (Object.keys(files).length === 0) error.push('Please provide an image');

		if (error.length > 0) {
			return res.status(400).json({
				error: { errorMessage: error },
			});
		}
		const imageName = files && files.image && files.image.originalFilename;
		const randomNumber = Math.floor(Math.random() * 99999);
		const newImageName = randomNumber + imageName;
		files.image.originalFilename = newImageName;
		const newPath =
			__dirname +
			`../../../client/public/image/${files.image.originalFilename}`;

		try {
            // Check is user have already been registred
			const checkUser = await User.findOne({ email });
			if (checkUser) {
				return res.status(404).json({
					error: {
						errorMessage: ['Email already exists'],
					},
				});
			}
			fs &&
				fs.copyFile(files.image.filepath, newPath, async (error) => {
					if (!error) {
                        // create and save the user
						const newUser = await User.create({
							userName,
							email,
							password: await bcrypt.hash(password, 10),
							image: files.image.originalFilename,
						});

						// create token
						const token = jwt.sign(
							{
								id: newUser._id,
								email: newUser.email,
								userName: newUser.userName,
								image: newUser.image,
								registerTime: newUser.createdAt,
							},
							process.env.SECRET,
							{ expiresIn: process.env.TOKEN_EXP },
						);

						// en ms
						const options = {
							expires: new Date(
								Date.now() + process.env.COOKIE_EXP * 24 * 60 * 60 * 1000,
							)
						};

						return res.status(201).cookie('authToken', token, options).json({
							successMessage: 'Successful registration',
							token,
						});
					}

					return res.status(500).json({
						error: { errorMessage: ['Internal server Error'] },
					});
				});
		} catch (error) {
			res
				.status(500)
				.json({ error: { errorMessage: ['Internal server Error'] } });
		}
	});
};


module.exports.userLogin = async (req, res) => {

	const {email , password} = req.body

	// check for email
	const error = []
	if (!email) error.push('Please provide an email');
	if (!password) error.push('Please provide a password');
	if (email && !validator.isEmail(email))
		error.push('Please provide a valid email');
	if(error.length > 0) {
		return res.status(400).json({
			error : {
				errorMessage : error
			}
		})
	}
	
	try {
		const checkUser = await User.findOne({ email }).select('+password');
		if (!checkUser) {
			return res.status(404).json({
				error: {
					errorMessage: ['No user found'],
				},
			});
		}

		// check for password
		const matchPassword = await bcrypt.compare(password, checkUser.password)
		if (!matchPassword) {
			return res.status(404).json({
				error: {
					errorMessage: ['Wrong password'],
				},
			});
		}

		//create token
		const token = jwt.sign(
			{
				id: checkUser._id,
				email: checkUser.email,
				userName: checkUser.userName,
				image: checkUser.image,
				registerTime: checkUser.createdAt,
			},
			process.env.SECRET,
			{ expiresIn: process.env.TOKEN_EXP },
		);

		// en ms
		const options = {
			expires: new Date(
				Date.now() + process.env.COOKIE_EXP * 24 * 60 * 60 * 1000,
			),
		};
		// Response
		return res.status(200).cookie('authToken', token, options).json({
			successMessage: 'Successful Login',
			token,
		});
	} catch (error) {
		return res.status(500).json({
			error: {
				errorMessage: ['Internal Server error']
			},
		});
	}
}
