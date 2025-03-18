const mongoose = require('mongoose');

const informationFormSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: [true, 'Please provide a first name'],
    },
    lastname: {
        type: String,
        required: [true, 'Please provide a last name'],
    },
    dob: {
        type: Date,
        required: [true, 'Please provide a date of birth'],
        validate: {
            validator: function (v) {
                return /^\d{4}-\d{2}-\d{2}$/.test(v.toISOString().split('T')[0]);
            },
            message: 'Invalid date format. Use YYYY-MM-DD.'
        }
    },
    email: {
        type: String,
        required: [true, 'Please provide an email'],
        unique: true,
    },
    address: {
        type: String,
        required: [true, 'Please provide an address'],
    },
    selfDescription: {
        type: String,
        required: [true, 'Please provide a self-description'],
    },
    education: [{
        degree: { type: String },
        institution: { type: String },
        startYear: { type: String },
        endYear: { type: String }
    }],
    experience: [{
        jobTitle: { type: String},
        company: { type: String},
        startDate: { type: String},
        isCurrent: { type: Boolean, default: false }
    }],
    skills: {
        type: [String],
    },
    websiteUrl: {
        type: String,
    },
    githubUrl: {
        type: String,
    },
    linkedinUrl: {
        type: String,
    },
}, { timestamps: true });

const UserInfo = mongoose.models.informationforms || mongoose.model("informationforms", informationFormSchema);
module.exports = UserInfo;
