const express = require('express')
const router = express.Router()
const contractsController = require('../controllers/contracts')
const { getProfile } = require('../middlewares/getProfile')

/**
 * @returns contract by id
 */
router.get('/:id', getProfile, contractsController.get)

/**
 * @returns a list of non terminated contracts belonging to a user
 */
router.get('/', getProfile, contractsController.list)

module.exports = router
