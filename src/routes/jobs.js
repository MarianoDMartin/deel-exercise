const express = require('express')
const router = express.Router()
const jobsController = require('../controllers/jobs')
const { getProfile } = require('../middlewares/getProfile')

/**
 * @returns unpaid jobs for a profile
 */
router.get('/unpaid', getProfile, jobsController.listUpdaid)

module.exports = router
