async function get (req, res) {
  const { Contract } = req.app.get('models')
  const { id } = req.params

  if (!id) return res.status(400).end()

  const contract = await Contract.findOne({ where: { id } })
  if (!contract) return res.status(404).end()
  if (contract.ContractorId !== req.profile.id && contract.ClientId !== req.profile.id) {
    console.log('here')
    return res.status(403).end()
  }

  res.json(contract)
}

module.exports = {
  get
}
