const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');
const User = require('./modals/userModal');
const dbConnect = require('./dbConfig')

const login = async (req, res) => {
    dbConnect(); 

    try {
        const { username, password } = req.body;

        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ error: "User does not exist" });
        }

        const validPassword = await bcryptjs.compare(password, user.password);
        if (!validPassword) {
            return res.status(400).json({ error: "Invalid password" });
        }

        const token = jwt.sign(
            { id: user._id, username: user.username }, 
            process.env.TOKEN_SECRET, 
            { expiresIn: '1h' } 
        );

        res.cookie('token', token, {
            httpOnly: true, 
            maxAge: 3600000, // 1 hour 
        });

        res.status(200).json({ message: 'Login successful', user: { id: user._id, username: user.username } });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = login;