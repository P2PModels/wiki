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

const ANY_ADDRESS = '0xffffffffffffffffffffffffffffffffffffffff'

const checkEvent = (receipt, eventName, expectedArgs) => {
  const events = receipt.logs.filter(x => x.event === eventName)
  assert.equal(events.length, 1, `should have emitted ${eventName} event`)
  assert.deepEqual(events[0].args, expectedArgs)
}

contract('WikiApp', accounts => {
  let APP_MANAGER_ROLE, EDIT_ROLE, CREATE_ROLE, PROTECT_ROLE
  let daoFact, wikiBase, wiki

  const firstAccount = accounts[0]
  const secondAccount = accounts[1]

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
    const daoReceipt = await daoFact.newDAO(firstAccount)
    const dao = Kernel.at(
      daoReceipt.logs.filter(l => l.event === 'DeployDAO')[0].args.dao
    )
    const acl = ACL.at(await dao.acl())

    await acl.createPermission(
      firstAccount,
      dao.address,
      APP_MANAGER_ROLE,
      firstAccount,
      {
        from: firstAccount,
      }
    )

    const receipt = await dao.newAppInstance(
      '0x1234',
      wikiBase.address,
      '0x',
      false,
      { from: firstAccount }
    )
    wiki = WikiApp.at(
      receipt.logs.filter(l => l.event === 'NewAppProxy')[0].args.proxy
    )

    await acl.createPermission(
      ANY_ADDRESS,
      wiki.address,
      EDIT_ROLE,
      firstAccount,
      {
        from: firstAccount,
      }
    )
    await acl.createPermission(
      ANY_ADDRESS,
      wiki.address,
      CREATE_ROLE,
      firstAccount,
      {
        from: firstAccount,
      }
    )
    await acl.createPermission(
      ANY_ADDRESS,
      wiki.address,
      PROTECT_ROLE,
      firstAccount,
      {
        from: firstAccount,
      }
    )
  })

  it('should store a value', async () => {
    wiki.initialize()
    const main = web3.fromUtf8('Main')
    const value = '0x01'
    const receipt = await wiki.edit(main, value)
    assert.equal((await wiki.pages(main))[0], value)
    checkEvent(receipt, 'Edit', {
      entity: firstAccount,
      page: main + '0'.repeat(56),
      value: value,
    })
  })

  it('should create a new page and remove it', async () => {
    wiki.initialize()
    const test = web3.fromUtf8('Test')
    const value = '0x02'
    const receipt = await wiki.create(test, value)
    assert.equal((await wiki.pages(test))[0], value)
    checkEvent(receipt, 'Create', {
      entity: firstAccount,
      page: test + '0'.repeat(56),
      value: value,
    })
    // assert.equal(web3.toUtf8(await wiki.pageNames(0)), 'Test')
    const receipt2 = await wiki.remove(test)
    assert.equal((await wiki.pages(test))[0], '0x')
    checkEvent(receipt2, 'Remove', {
      entity: firstAccount,
      page: test + '0'.repeat(56),
    })
    // assert.equal(web3.toUtf8(await wiki.pageNames(0)), '')
  })

  it('should store and remove the page names', async () => {
    wiki.initialize()
    for (let i = 1; i <= 3; i++) {
      await wiki.create(web3.fromUtf8('Test ' + i), '0x03')
    }
    for (let i = 0; i < 3; i++) {
      // assert.equal(web3.toUtf8(await wiki.pageNames(i)), 'Test ' + (i + 1))
    }
    await wiki.remove(web3.fromUtf8('Test 2'))
  })

  it('should protect and unprotect properly a page', async () => {
    wiki.initialize()
    const protectedPage = web3.fromUtf8('Protected')
    const value = '0x03'
    await wiki.create(protectedPage, value)
    const receipt = await wiki.protect(protectedPage)
    assert.equal(
      (await wiki.pages(protectedPage))[1],
      await wiki.PROTECT_ROLE()
    )
    checkEvent(receipt, 'ChangePermissions', {
      entity: firstAccount,
      page: protectedPage + '0'.repeat(46),
      isProtected: true,
    })
    await assertRevert(async () =>
      wiki.edit(protectedPage, '0x04', { from: secondAccount })
    )
    // TODO
    // await assertRevert(async () =>
    //   wiki.editProtected(protectedPage, '0x04', { from: holder })
    // )
    assert.equal((await wiki.pages(protectedPage))[0], '0x03')
    const receipt2 = await wiki.unprotect(protectedPage)
    checkEvent(receipt2, 'ChangePermissions', {
      entity: firstAccount,
      page: protectedPage + '0'.repeat(46),
      isProtected: false,
    })
    await wiki.edit(protectedPage, '0x04', { from: secondAccount })
    assert.equal((await wiki.pages(protectedPage))[0], '0x04')
  })

  it('should be edited when editProtected called', async () => {
    wiki.initialize()
    const protectedPage = web3.fromUtf8('Protected')
    const value = '0x05'
    await wiki.create(protectedPage, value)
    const receipt = await wiki.editProtected(protectedPage, value, {
      from: firstAccount,
    })
    checkEvent(receipt, 'Edit', {
      entity: firstAccount,
      page: protectedPage + '0'.repeat(46),
      value: value,
    })
  })

  it('should not delete a protected page', async () => {
    wiki.initialize()
    const protectedPage = web3.fromUtf8('Protected')
    const value = '0x06'
    await wiki.create(protectedPage, value)
    await wiki.protect(protectedPage)
    await assertRevert(async () =>
      wiki.remove(protectedPage, { from: firstAccount })
    )
  })
})
