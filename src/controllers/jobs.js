const { Op } = require('sequelize')
const { Contract, sequelize } = require('../model')

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

async function pay (req, res) {
  const { Job, Profile } = req.app.get('models')
  const { jobId } = req.params

  if (!jobId) return res.status(400).end()

  const job = await Job.findOne({
    where: {
      id: jobId,
      paid: {
        [Op.not]: true
      }
    },
    include: {
      model: Contract,
      where: {
        ClientId: req.profile.id
      }
    }
  })

  if (!job) return res.status(404).end()

  const client = await Profile.findOne({
    where: {
      id: job.Contract.ClientId
    }
  })

  const contractor = await Profile.findOne({
    where: {
      id: job.Contract.ContractorId
    }
  })

  if (!client || !contractor) return res.status(404).end()

  if (client.balance < job.price) return res.status(409).end()

  const t = await sequelize.transaction()

  try {
    // update Client balance
    await client.update({
      balance: client.balance - job.price
    })

    // update Contractor balance
    await contractor.update({
      balance: contractor.balance + job.price
    })

    // update job paid status
    await job.update(
      {
        paid: true,
        paymentDate: new Date()
      }
    )
  } catch (error) {
    await t.rollback()
    return res.status(500).end()
  }

  res.json(job)
}

module.exports = {
  listUpdaid,
  pay
}
