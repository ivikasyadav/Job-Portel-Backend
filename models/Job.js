
const mongoose = require('mongoose');

const JobSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User' 
    },
    companyName: {
        type: String,
        required: [true, 'Company name is required'],
        trim: true
    },
    jobTitle: {
        type: String,
        required: [true, 'Job title is required'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Job description is required']
    },
    location: {
        type: String,
        trim: true,
        default: 'Remote' 
    },
    salaryRange: {
        type: String,
        trim: true,
        default: 'Competitive' 
    },
    requirements: {
        type: [String], 
        default: []
    },
    responsibilities: {
        type: [String], 
        default: []
    },
    applicationDeadline: {
        type: Date,
        default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) 
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

JobSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

const Job = mongoose.model('Job', JobSchema);

module.exports = Job;
