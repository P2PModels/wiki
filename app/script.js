import '@babel/polyfill'

import Aragon from '@aragon/client'
import {get as ipfsGet, hexToIpfs, strToHex} from './ipfs-util'

const app = new Aragon()

const initialState = {
  hash: null,
  text: ""
}
app.store(async (state, event) => {
  if (state === null) state = initialState

  switch (event.event) {
    case 'Edit':
      let hash = await getValue();
      let text = await ipfsGet(hash);
      return { hash, text }
    default:
      return state
  }
})

function getValue() {
  // Get current value from the contract by calling the public getter
  return new Promise((resolve, reject) => {
    app
      .call('pages', strToHex('Main'))
      .first()
      .map(value => hexToIpfs(value))
      .subscribe(resolve, reject)
  })
}
