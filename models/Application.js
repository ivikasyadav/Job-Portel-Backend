
const mongoose = require('mongoose');

const ApplicationSchema = mongoose.Schema({
    job: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Job' 
    },
    applicant: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User' 
    },
    status: {
        type: String,
        enum: ['Applied', 'Interview', 'Offer', 'Rejected', 'Accepted'],
        default: 'Applied',
        required: true
    },
    appliedDate: {
        type: Date,
        default: Date.now,
        required: true
    },
    notes: {
        type: String,
        trim: true,
        default: ''
    },
    resumeUrl: {
        type: String,
        default: ''
    },
    coverLetterUrl: {
        type: String,
        default: ''
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

ApplicationSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

const Application = mongoose.model('Application', ApplicationSchema);

module.exports = Application;
