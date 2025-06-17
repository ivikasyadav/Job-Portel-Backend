const express = require('express');
const {
    applyToJob,
    getMyApplications,
    updateApplicationStatus,
    getApplicationById,
    deleteApplication
} = require('../controllers/applicationController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

const router = express.Router();


router.post('/apply/:jobId', protect, authorizeRoles('job_applicant'), applyToJob);


router.get('/my-applications', protect, authorizeRoles('job_applicant'), getMyApplications);


router.get('/:id', protect, getApplicationById);


router.put('/:id/status', protect, authorizeRoles('job_poster'), updateApplicationStatus);


router.delete('/:id', protect, deleteApplication);

module.exports = router;
