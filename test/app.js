//const { assertRevert } = require('@aragon/test-helpers/assertThrow')
//const timetravel = require('@aragon/test-helpers/timeTravel')(web3)
//const getBlock = require('@aragon/test-helpers/block')(web3)
//const getBlockNumber = require('@aragon/test-helpers/blockNumber')(web3)

//const { encodeCallScript } = require('@aragon/test-helpers/evmScript')
//const ExecutionTarget = artifacts.require('ExecutionTarget')


const WikiApp = artifacts.require('WikiApp.sol')
const DAOFactory = artifacts.require('@aragon/core/contracts/factory/DAOFactory')
const EVMScriptRegistryFactory = artifacts.require('@aragon/core/contracts/factory/EVMScriptRegistryFactory')
const ACL = artifacts.require('@aragon/core/contracts/acl/ACL')
const Kernel = artifacts.require('@aragon/core/contracts/kernel/Kernel')

const getContract = name => artifacts.require(name)

const n = '0x00'
const ANY_ADDR = '0xffffffffffffffffffffffffffffffffffffffff'

contract('WikiApp', (accounts) => {

  let APP_MANAGER_ROLE, EDIT_ROLE, CREATE_ROLE, PROTECT_ROLE;
  let daoFact, wikiBase, wiki;

  const root = accounts[0]
  const holder = accounts[1]

  before(async () => {
      const kernelBase = await getContract('Kernel').new(true) // petrify immediately
      const aclBase = await getContract('ACL').new()
      const regFact = await EVMScriptRegistryFactory.new()
      daoFact = await DAOFactory.new(kernelBase.address, aclBase.address, regFact.address)
      wikiBase = await WikiApp.new()

      // Setup constants
      APP_MANAGER_ROLE = await kernelBase.APP_MANAGER_ROLE()
      EDIT_ROLE = await wikiBase.EDIT_ROLE()
      CREATE_ROLE = await wikiBase.CREATE_ROLE()
      PROTECT_ROLE = await wikiBase.PROTECT_ROLE()
  })

  beforeEach(async () => {
      const r = await daoFact.newDAO(root)
      const dao = Kernel.at(r.logs.filter(l => l.event == 'DeployDAO')[0].args.dao)
      const acl = ACL.at(await dao.acl())

      await acl.createPermission(root, dao.address, APP_MANAGER_ROLE, root, { from: root })

      const receipt = await dao.newAppInstance('0x1234', wikiBase.address, '0x', false, { from: root })
      wiki = WikiApp.at(receipt.logs.filter(l => l.event == 'NewAppProxy')[0].args.proxy)

      await acl.createPermission(ANY_ADDR, wiki.address, EDIT_ROLE, root, { from: root })
      await acl.createPermission(ANY_ADDR, wiki.address, CREATE_ROLE, root, { from: root })
      await acl.createPermission(ANY_ADDR, wiki.address, PROTECT_ROLE, root, { from: root })

  })

  it('should store a value', async () => {
    wiki.initialize();
    const main = web3.fromUtf8("Main")
    const value = n
    await wiki.edit(main, value);
    assert(await wiki.pages(main), value)
  })
})
