
const asyncHandler = require('express-async-handler');
const Job = require('../models/Job');
const User = require('../models/User'); 
const Application = require('../models/Application');

const createJob = asyncHandler(async (req, res) => {
    const { companyName, jobTitle, description, location, salaryRange, requirements, responsibilities, applicationDeadline } = req.body;

   
    if (!companyName || !jobTitle || !description) {
        res.status(400);
        throw new Error('Please include company name, job title, and description.');
    }

    
    if (req.user.role !== 'job_poster') {
        res.status(403);
        throw new Error('Only job posters can create job listings.');
    }

    const job = await Job.create({
        user: req.user._id, 
        companyName,
        jobTitle,
        description,
        location,
        salaryRange,
        requirements,
        responsibilities,
        applicationDeadline,
    });

    res.status(201).json(job);
});

const getJobs = asyncHandler(async (req, res) => {
    const { search, location, sort } = req.query;
    let query = {};

  
    if (search) {
        query.$or = [
            { companyName: { $regex: search, $options: 'i' } },
            { jobTitle: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } },
        ];
    }

    
    if (location) {
        query.location = { $regex: location, $options: 'i' };
    }

    if (req.user.role === 'job_poster') {
        query.user = req.user._id;
    }

    let jobsQuery = Job.find(query);

    if (sort) {
        const [field, order] = sort.split('_');
        if (field && order && ['asc', 'desc'].includes(order)) {
            jobsQuery = jobsQuery.sort({ [field]: order === 'asc' ? 1 : -1 });
        }
    } else {

        jobsQuery = jobsQuery.sort({ createdAt: -1 });
    }

    const jobs = await jobsQuery.populate('user', 'email'); 
    res.status(200).json(jobs);
});

const getJobById = asyncHandler(async (req, res) => {
    const job = await Job.findById(req.params.id).populate('user', 'email role');

    if (!job) {
        res.status(404);
        throw new Error('Job not found.');
    }

    if (req.user.role === 'job_poster' && job.user._id.toString() !== req.user._id.toString()) {
        res.status(403);
        throw new Error('Not authorized to view this job.');
    }

    res.status(200).json(job);
});

const updateJob = asyncHandler(async (req, res) => {
    const { companyName, jobTitle, description, location, salaryRange, requirements, responsibilities, applicationDeadline } = req.body;

    let job = await Job.findById(req.params.id);

    if (!job) {
        res.status(404);
        throw new Error('Job not found.');
    }

    if (job.user.toString() !== req.user._id.toString()) {
        res.status(403); 
        throw new Error('Not authorized to update this job posting.');
    }
    if (req.user.role !== 'job_poster') {
        res.status(403);
        throw new Error('Only job posters can update job listings.');
    }

    job.companyName = companyName || job.companyName;
    job.jobTitle = jobTitle || job.jobTitle;
    job.description = description || job.description;
    job.location = location || job.location;
    job.salaryRange = salaryRange || job.salaryRange;
    job.requirements = requirements || job.requirements;
    job.responsibilities = responsibilities || job.responsibilities;
    job.applicationDeadline = applicationDeadline || job.applicationDeadline;
    job.updatedAt = Date.now(); 

    const updatedJob = await job.save();

    res.status(200).json(updatedJob);
});


const deleteJob = asyncHandler(async (req, res) => {
    const job = await Job.findById(req.params.id);

    if (!job) {
        res.status(404);
        throw new Error('Job not found.');
    }

    if (job.user.toString() !== req.user._id.toString()) {
        res.status(403); // Forbidden
        throw new Error('Not authorized to delete this job posting.');
    }

    if (req.user.role !== 'job_poster') {
        res.status(403);
        throw new Error('Only job posters can delete job listings.');
    }

    await Application.deleteMany({ job: req.params.id });

    await job.deleteOne();

    res.status(200).json({ message: 'Job posting and associated applications removed.' });
});


const getJobApplicants = asyncHandler(async (req, res) => {
    const { status, sort } = req.query;

    const job = await Job.findById(req.params.id);

    if (!job) {
        res.status(404);
        throw new Error('Job not found.');
    }

    if (job.user.toString() !== req.user._id.toString()) {
        res.status(403);
        throw new Error('Not authorized to view applicants for this job.');
    }

    let query = { job: req.params.id };

    if (status) {
        query.status = status;
    }

    let applicationsQuery = Application.find(query).populate('applicant', 'email'); // Populate applicant's email

    if (sort) {
        const [field, order] = sort.split('_');
        if (field === 'appliedDate' && ['asc', 'desc'].includes(order)) {
            applicationsQuery = applicationsQuery.sort({ appliedDate: order === 'asc' ? 1 : -1 });
        }
    } else {
     
        applicationsQuery = applicationsQuery.sort({ appliedDate: -1 });
    }

    const applications = await applicationsQuery;
    res.status(200).json(applications);
});


module.exports = {
    createJob,
    getJobs,
    getJobById,
    updateJob,
    deleteJob,
    getJobApplicants,
};
