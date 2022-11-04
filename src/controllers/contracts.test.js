const contractsController = require('./contracts')

describe('Contract controller', () => {
  const contract = {
    id: 1,
    terms: 'bla bla bla',
    status: 'terminated',
    ClientId: 1,
    ContractorId: 5
  }

  const mockRequest = () => {
    return {
      app: {},
      params: {},
      profile: {
        id: 1
      }
    }
  }
  const mockResponse = () => {
    const res = {}
    res.status = jest.fn().mockReturnValue(res)
    res.json = jest.fn().mockReturnValue(res)
    res.end = jest.fn()
    return res
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('get should', () => {
    test('return the contract', async () => {
      const req = mockRequest()
      const res = mockResponse()

      req.app.get = jest.fn().mockReturnValue({
        Contract: {
          findOne: jest.fn().mockReturnValue(contract)
        }
      })
      req.params.id = 1

      // arrange and act
      await contractsController.get(req, res)

      // assert
      expect(res.json).toHaveBeenCalledWith(contract)
    })

    test('return 400 if id is not part of params', async () => {
      const req = mockRequest()
      const res = mockResponse()

      req.app.get = jest.fn().mockReturnValue({
        Contract: {
          findOne: jest.fn().mockReturnValue(contract)
        }
      })

      // arrange and act
      await contractsController.get(req, res)

      // assert
      expect(res.status).toHaveBeenCalledWith(400)
    })

    test('return 404 if contract id does not exist', async () => {
      const req = mockRequest()
      const res = mockResponse()

      req.app.get = jest.fn().mockReturnValue({
        Contract: {
          findOne: jest.fn().mockReturnValue(null)
        }
      })
      req.params.id = 1

      // arrange and act
      await contractsController.get(req, res)

      // assert
      expect(res.status).toHaveBeenCalledWith(404)
    })

    test('return 403 if contract id does not belong to client or contractor', async () => {
      const req = mockRequest()
      const res = mockResponse()

      contract.ClientId = 2
      req.app.get = jest.fn().mockReturnValue({
        Contract: {
          findOne: jest.fn().mockReturnValue(contract)
        }
      })
      req.params.id = 1

      // arrange and act
      await contractsController.get(req, res)

      // assert
      expect(res.status).toHaveBeenCalledWith(403)
    })
  })
})
