
const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { JWT_SECRET, JWT_EXPIRES_IN } = require('../config/jwt');

const generateToken = (id) => {
    return jwt.sign({ id }, JWT_SECRET, {
        expiresIn: JWT_EXPIRES_IN,
    });
};

const registerUser = asyncHandler(async (req, res) => {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
        res.status(400);
        throw new Error('Please enter all fields: email, password, and role.');
    }

    if (!['job_poster', 'job_applicant'].includes(role)) {
        res.status(400);
        throw new Error('Invalid role specified. Role must be "job_poster" or "job_applicant".');
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(400);
        throw new Error('User already exists with this email.');
    }

    const user = await User.create({
        email,
        password,
        role,
    });

    if (user) {
        res.status(201).json({
            _id: user._id,
            email: user.email,
            role: user.role,
            token: generateToken(user._id),
        });
    } else {
        res.status(400);
        throw new Error('Invalid user data provided.');
    }
});


const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400);
        throw new Error('Please enter both email and password.');
    }

    const user = await User.findOne({ email }).select('+password');

    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user._id,
            email: user.email,
            role: user.role,
            token: generateToken(user._id),
        });
    } else {
        res.status(401);
        throw new Error('Invalid email or password.');
    }
});


const getUserProfile = asyncHandler(async (req, res) => {

    const user = {
        _id: req.user._id,
        email: req.user.email,
        role: req.user.role,
    };
    res.json(user);
});

module.exports = {
    registerUser,
    loginUser,
    getUserProfile,
};
