const express = require('express')
const router = express.Router()
const jobsController = require('../controllers/jobs')
const { getProfile } = require('../middlewares/getProfile')

/**
 * @returns unpaid jobs for a profile
 */
router.get('/unpaid', getProfile, jobsController.listUpdaid)

/**
 * pay for a job
 */
router.post('/:job_id/pay', getProfile, jobsController.pay)

module.exports = router
