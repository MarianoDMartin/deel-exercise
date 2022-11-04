const { Op } = require('sequelize')
const { Contract } = require('../model')

async function listUpdaid (req, res) {
  const { Job } = req.app.get('models')

  const jobs = await Job.findAll({
    include: {
      model: Contract,
      where: {
        [Op.or]: [
          { ContractorId: req.profile.id },
          { ClientId: req.profile.id }
        ],
        status: 'in_progress'
      }
    },
    where: {
      paid: {
        [Op.not]: true
      }
    }
  })

  res.json(jobs)
}

module.exports = {
  listUpdaid
}
