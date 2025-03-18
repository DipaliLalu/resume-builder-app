const express = require("express");
const User = require('./modals/userModal');
const dbConnect = require('./dbConfig')
const bcryptjs=require('bcryptjs')
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const login=require('./login')
const app = express();
const cors = require('cors');
const informationform = require("./infromationForm");
const PORT = 8080;

app.use(cors());
app.use(express.json())

app.get('/api/home', (req, res) => {
    res.json({ "message": "hello world" })
})

const verifyToken = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    jwt.verify(token, process.env.TOKEN_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Invalid token' });
        }

        req.user = decoded;
        next();
    });
};

const signup = async (req, res) => {
    dbConnect();

    try {
        const { username, email, password } = req.body;

        const existingUser = await User.findOne({
            $or: [{ username }, { email }],
        });

        if (existingUser) {
            if (existingUser.username === username && existingUser.email === email) {
                return res.status(400).json({ message: 'Both username and email already exist' });
            }
            if (existingUser.username === username) {
                return res.status(400).json({ message: 'Username already exists' });
            }
            if (existingUser.email === email) {
                return res.status(400).json({ message: 'Email already exists' });
            }
        }
        
        const newUser = new User({ username, email, password });
        await newUser.save();

        return res.status(201).json({ message: 'User created successfully', user: newUser });

    } catch (error) {
        console.error(error);
       return res.status(500).json({ message: 'Server error', error: error });
    }
}
app.post('/signup', signup);

app.post('/login', login)

app.post('/informationform',informationform)

app.get('/logout', (req, res) => {
    res.clearCookie('token');
    res.json({ message: 'Logged out successfully' });
});

app.listen(PORT, () => {
    console.log(`Your Server started in ${PORT}`);
})
