/* global artifacts contract before beforeEach it web3 assert */
const { assertRevert } = require('@aragon/test-helpers/assertThrow')
// const timetravel = require('@aragon/test-helpers/timeTravel')(web3)
// const getBlock = require('@aragon/test-helpers/block')(web3)
// const getBlockNumber = require('@aragon/test-helpers/blockNumber')(web3)

// const { encodeCallScript } = require('@aragon/test-helpers/evmScript')
// const ExecutionTarget = artifacts.require('ExecutionTarget')

const WikiApp = artifacts.require('WikiApp.sol')
const DAOFactory = artifacts.require(
  '@aragon/core/contracts/factory/DAOFactory'
)
const EVMScriptRegistryFactory = artifacts.require(
  '@aragon/core/contracts/factory/EVMScriptRegistryFactory'
)
const ACL = artifacts.require('@aragon/core/contracts/acl/ACL')
const Kernel = artifacts.require('@aragon/core/contracts/kernel/Kernel')

const getContract = name => artifacts.require(name)

const ANY_ADDR = '0xffffffffffffffffffffffffffffffffffffffff'

contract('WikiApp', accounts => {
  let APP_MANAGER_ROLE, EDIT_ROLE, CREATE_ROLE, PROTECT_ROLE
  let daoFact, wikiBase, wiki

  const root = accounts[0]
  const holder = accounts[1]

  before(async () => {
    const kernelBase = await getContract('Kernel').new(true) // petrify immediately
    const aclBase = await getContract('ACL').new()
    const regFact = await EVMScriptRegistryFactory.new()
    daoFact = await DAOFactory.new(
      kernelBase.address,
      aclBase.address,
      regFact.address
    )
    wikiBase = await WikiApp.new()

    // Setup constants
    APP_MANAGER_ROLE = await kernelBase.APP_MANAGER_ROLE()
    EDIT_ROLE = await wikiBase.EDIT_ROLE()
    CREATE_ROLE = await wikiBase.CREATE_ROLE()
    PROTECT_ROLE = await wikiBase.PROTECT_ROLE()
  })

  beforeEach(async () => {
    const r = await daoFact.newDAO(root)
    const dao = Kernel.at(
      r.logs.filter(l => l.event === 'DeployDAO')[0].args.dao
    )
    const acl = ACL.at(await dao.acl())

    await acl.createPermission(root, dao.address, APP_MANAGER_ROLE, root, {
      from: root,
    })

    const receipt = await dao.newAppInstance(
      '0x1234',
      wikiBase.address,
      '0x',
      false,
      { from: root }
    )
    wiki = WikiApp.at(
      receipt.logs.filter(l => l.event === 'NewAppProxy')[0].args.proxy
    )

    await acl.createPermission(ANY_ADDR, wiki.address, EDIT_ROLE, root, {
      from: root,
    })
    await acl.createPermission(ANY_ADDR, wiki.address, CREATE_ROLE, root, {
      from: root,
    })
    await acl.createPermission(ANY_ADDR, wiki.address, PROTECT_ROLE, root, {
      from: root,
    })
  })

  it('should store a value', async () => {
    wiki.initialize()
    const main = web3.fromUtf8('Main')
    const value = '0x01'
    await wiki.edit(main, value)
    assert.equal(await wiki.pages(main), value)
  })

  it('should create a new page and delete it', async () => {
    wiki.initialize()
    const test = web3.fromUtf8('Test')
    const value = '0x02'
    await wiki.create(test, value)
    assert.equal(await wiki.pages(test), value)
    await wiki.deletePage(test)
    assert.equal(await wiki.pages(test), '0x')
  })

  it('should protect and unprotect properly a page', async () => {
    wiki.initialize()
    const protectedPage = web3.fromUtf8('Protected')
    const value = '0x03'
    await wiki.create(protectedPage, value)
    await wiki.protect(protectedPage)
    await assertRevert(async () => {
      return wiki.edit(protectedPage, '0x04', { from: holder })
    })
    // await assertRevert(async () =>
    // await wiki.editProtected(protectedPage, '0x04', {from: holder})
    // )
    assert.equal(await wiki.pages(protectedPage), '0x03')
    await wiki.unprotect(protectedPage)
    await wiki.edit(protectedPage, '0x04', { from: holder })
    assert.equal(await wiki.pages(protectedPage), '0x04')
  })
})
