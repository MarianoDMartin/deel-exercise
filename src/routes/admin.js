const express = require('express')
const router = express.Router()
const adminController = require('../controllers/admin')

/**
 * @returns the profession that earned the most money
 */
router.get('/best-profession', adminController.bestProfession)

/**
 * @returns the clients the paid the most for jobs
 */
router.get('/best-clients', adminController.bestClients)

module.exports = router
