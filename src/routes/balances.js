const express = require('express')
const router = express.Router()
const balancesController = require('../controllers/balances')

/**
 * Deposits money into the the the balance of a client
 */
router.post('/deposit/:userId', balancesController.deposit)

module.exports = router
