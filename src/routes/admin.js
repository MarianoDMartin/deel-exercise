const express = require('express')
const router = express.Router()
const adminController = require('../controllers/admin')

/**
 * @returns the profession that earned the most money
 */
router.get('/best-profession', adminController.bestProfession)

module.exports = router
