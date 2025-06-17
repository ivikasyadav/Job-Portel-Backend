const asyncHandler = require('express-async-handler');
const Application = require('../models/Application');
const Job = require('../models/Job');
const User = require('../models/User'); 
const { sendEmail } = require('../utils/emailService'); 

const applyToJob = asyncHandler(async (req, res) => {
    const { jobId } = req.params;
    const { notes, resumeUrl, coverLetterUrl } = req.body;

    if (req.user.role !== 'job_applicant') {
        res.status(403);
        throw new Error('Only job applicants can apply for jobs.');
    }

    const job = await Job.findById(jobId);
    if (!job) {
        res.status(404);
        throw new Error('Job not found.');
    }

    const existingApplication = await Application.findOne({
        job: jobId,
        applicant: req.user._id,
    });

    if (existingApplication) {
        res.status(400);
        throw new Error('You have already applied to this job.');
    }

    const application = await Application.create({
        job: jobId,
        applicant: req.user._id,
        notes,
        resumeUrl,
        coverLetterUrl,
        appliedDate: Date.now(),
        status: 'Applied' 
    });

    const jobPoster = await User.findById(job.user);
    if (jobPoster && jobPoster.email) {
        const subject = `New Application for Your Job: ${job.jobTitle}`;
        const text = `Dear ${jobPoster.email},\n\n` +
            `You have a new application for your job posting: "${job.jobTitle}"\n` +
            `Applicant: ${req.user.email}\n` +
            `View application details in your job poster dashboard.\n\n` +
            `Sincerely,\nJob Portal Team`;
        try {
            await sendEmail(jobPoster.email, subject, text);
            console.log(`Notification email sent to job poster: ${jobPoster.email}`);
        } catch (emailError) {
            console.error(`Failed to send email to job poster: ${emailError.message}`);
            
        }
    }


    res.status(201).json(application);
});

const getMyApplications = asyncHandler(async (req, res) => {
    const { status, sort } = req.query;

    if (req.user.role !== 'job_applicant') {
        res.status(403);
        throw new Error('Only job applicants can view their applications.');
    }

    let query = { applicant: req.user._id };

    if (status) {
        query.status = status;
    }

    let applicationsQuery = Application.find(query).populate('job', 'companyName jobTitle location');

    if (sort) {
        const [field, order] = sort.split('_');
        if (field === 'appliedDate' && ['asc', 'desc'].includes(order)) {
            applicationsQuery = applicationsQuery.sort({ appliedDate: order === 'asc' ? 1 : -1 });
        } else if (field === 'status' && ['asc', 'desc'].includes(order)) { 
            applicationsQuery = applicationsQuery.sort({ status: order === 'asc' ? 1 : -1 });
        }
    } else {
      
        applicationsQuery = applicationsQuery.sort({ appliedDate: -1 });
    }


    const applications = await applicationsQuery;
    res.status(200).json(applications);
});

const getApplicationById = asyncHandler(async (req, res) => {
    const application = await Application.findById(req.params.id)
        .populate('job', 'companyName jobTitle user') 
        .populate('applicant', 'email'); 

    if (!application) {
        res.status(404);
        throw new Error('Application not found.');
    }

    if (req.user.role === 'job_poster') {
        if (application.job.user.toString() !== req.user._id.toString()) {
            res.status(403);
            throw new Error('Not authorized to view this application.');
        }
    } else if (req.user.role === 'job_applicant') {
        if (application.applicant._id.toString() !== req.user._id.toString()) {
            res.status(403);
            throw new Error('Not authorized to view this application.');
        }
    } else {
        res.status(403); 
        throw new Error('Not authorized to view this application.');
    }

    res.status(200).json(application);
});


const updateApplicationStatus = asyncHandler(async (req, res) => {
    const { status } = req.body;
    const { id } = req.params;

    if (req.user.role !== 'job_poster') {
        res.status(403);
        throw new Error('Only job posters can update application statuses.');
    }

    const application = await Application.findById(id).populate('job', 'jobTitle user').populate('applicant', 'email');

    if (!application) {
        res.status(404);
        throw new Error('Application not found.');
    }

    if (application.job.user.toString() !== req.user._id.toString()) {
        res.status(403);
        throw new Error('Not authorized to update this application status.');
    }

    const validStatuses = ['Applied', 'Interview', 'Offer', 'Rejected', 'Accepted'];
    if (!validStatuses.includes(status)) {
        res.status(400);
        throw new Error('Invalid application status.');
    }

    application.status = status;
    application.updatedAt = Date.now(); 
    const updatedApplication = await application.save();

    if (application.applicant && application.applicant.email) {
        const subject = `Your Application Status for ${application.job.jobTitle} Updated!`;
        const text = `Dear ${application.applicant.email},\n\n` +
            `The status of your application for "${application.job.jobTitle}" has been updated to: **${status}**\n` +
            `Please log in to your dashboard for more details.\n\n` +
            `Sincerely,\nJob Portal Team`;
        try {
            await sendEmail(application.applicant.email, subject, text);
            console.log(`Notification email sent to applicant: ${application.applicant.email}`);
        } catch (emailError) {
            console.error(`Failed to send email to applicant: ${emailError.message}`);
        }
    }

    res.status(200).json(updatedApplication);
});


const deleteApplication = asyncHandler(async (req, res) => {
    const application = await Application.findById(req.params.id).populate('job', 'user'); // Populate job's owner

    if (!application) {
        res.status(404);
        throw new Error('Application not found.');
    }

    if (req.user.role === 'job_applicant' && application.applicant.toString() !== req.user._id.toString()) {
        res.status(403);
        throw new Error('Not authorized to delete this application.');
    }

    if (req.user.role === 'job_poster' && application.job.user.toString() !== req.user._id.toString()) {
        res.status(403);
        throw new Error('Not authorized to delete this application.');
    }

    await application.deleteOne();
    res.status(200).json({ message: 'Application removed.' });
});


module.exports = {
    applyToJob,
    getMyApplications,
    updateApplicationStatus,
    getApplicationById,
    deleteApplication
};
