
const express = require('express');
const {
    createJob,
    getJobs,
    getJobById,
    updateJob,
    deleteJob,
    getJobApplicants
} = require('../controllers/jobController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

const router = express.Router();

router.route('/')
    .post(protect, authorizeRoles('job_poster'), createJob) 
    .get(protect, getJobs); 

router.route('/:id')
    .get(protect, getJobById) 
    .put(protect, authorizeRoles('job_poster'), updateJob) 
    .delete(protect, authorizeRoles('job_poster'), deleteJob); 


router.get('/:id/applicants', protect, authorizeRoles('job_poster'), getJobApplicants);

module.exports = router;
