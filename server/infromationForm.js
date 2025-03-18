const dbConnect = require("./dbConfig");
const UserInfo = require("./modals/infromtionFormModal");

const informationform = async (req, res) => {
    dbConnect();

    try {
        const { firstname,lastname,email,dob,address,selfDescription,education,experience,skills,websiteUrl,githubUrl,linkedinUrl} = req.body;

        const existingUser = await UserInfo.findOne({email});

        if (existingUser) {
            if (existingUser.email === email) {
                return res.status(400).json({ message: 'Email already exists' });
            }
        }
        
        const newUser = new UserInfo({ firstname,lastname,email,dob,address,selfDescription,education,experience,skills,websiteUrl,githubUrl,linkedinUrl});
        await newUser.save();

        return res.status(201).json({ message: 'Form submitted successfully', user: newUser });

    } catch (error) {
        console.error(error);
       return res.status(500).json({ message: 'Server error', error: error });
    }
}


module.exports = informationform;