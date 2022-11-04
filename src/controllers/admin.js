const { Op } = require('sequelize')
const { Contract, Profile, sequelize } = require('../model')

async function bestProfession (req, res) {
  const { Job } = req.app.get('models')
  const { start, end } = req.query

  if (!start || !end) return res.status(400).end()

  const sumJobsPaid = await Job.findAll({
    include: {
      model: Contract,
      include: {
        model: Profile,
        as: 'Contractor'
      }
    },
    where: {
      paid: true,
      paymentDate: {
        [Op.between]: [start, end]
      }
    },
    attributes: [
      [sequelize.fn('sum', sequelize.col('price')), 'total_amount']
    ],
    group: 'Contract.Contractor.profession',
    order: [['total_amount', 'DESC']]
  })

  if (!sumJobsPaid.length) return res.status(404).end()

  res.json({
    profession: sumJobsPaid[0].Contract.Contractor.profession,
    total: sumJobsPaid[0].dataValues.total_amount
  })
}

async function bestClients (req, res) {
  const { Job } = req.app.get('models')
  const { start, end } = req.query

  if (!start || !end) return res.status(400).end()

  let { limit } = req.query
  if (!limit) limit = 2

  const sumJobsPaid = await Job.findAll({
    include: {
      model: Contract,
      include: {
        model: Profile,
        as: 'Client'
      }
    },
    where: {
      paid: true,
      paymentDate: {
        [Op.between]: [start, end]
      }
    },
    attributes: [
      [sequelize.fn('sum', sequelize.col('price')), 'total_amount']
    ],
    group: 'Contract.Client.id',
    order: [['total_amount', 'DESC']],
    limit
  })

  if (sumJobsPaid.length === 0) return res.status(404).end()

  const response = sumJobsPaid.map(e => {
    return {
      id: e.Contract.Client.id,
      fullname: e.Contract.Client.firstName + ' ' + e.Contract.Client.lastName,
      paid: e.dataValues.total_amount
    }
  })
  res.json(response)
}

module.exports = {
  bestProfession,
  bestClients
}
