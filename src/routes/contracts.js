const express = require('express')
const router = express.Router()
const contractsController = require('../controllers/contracts')
const { getProfile } = require('../middlewares/getProfile')

/**
 * @returns contract by id
 */
router.get('/:id', getProfile, contractsController.get)

module.exports = router
