const { Op } = require('sequelize')
const { Contract } = require('../model')

async function deposit (req, res) {
  const { Profile, Job } = req.app.get('models')
  const { userId } = req.params
  const { amount } = req.body

  if (!userId || !amount) return res.status(400).end()

  const jobsToPay = await Job.findAll({
    include: {
      model: Contract,
      where: {
        ClientId: userId
      }
    },
    where: {
      paid: {
        [Op.not]: true
      }
    }
  })
  const totalToPay = jobsToPay.reduce((acc, current) => {
    return acc + current.price
  }, 0)

  if (amount > (totalToPay / 4)) return res.status(409).end()

  const client = await Profile.findOne({
    where: {
      id: userId
    }
  })
  if (!client) return res.status(404).end()
  await client.update(
    {
      balance: client.balance + amount
    }
  )

  res.json(client)
}

module.exports = {
  deposit
}
