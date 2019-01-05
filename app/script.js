import '@babel/polyfill'

import Aragon from '@aragon/client'

import Multihashes from 'multihashes';


import ipfsAPI from 'ipfs-api'
var ipfs = ipfsAPI('localhost', '5001', {protocol: 'http'})

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
      let text = await getText(hash);
      return { hash, text }
    default:
      return state
  }
})

function getValue() {
  // Get current value from the contract by calling the public getter
  return new Promise(resolve => {
    app
      .call('value')
      .first()
      .map(value => hexToIpfs(value))
      .subscribe(resolve)
  })
}

function getText(hash){
  return ipfs.get(hash).then(value => value[0].content.toString('utf-8'));
}

function hexToIpfs(hex) {
  let dig = Multihashes.fromHexString(hex.substring(2));
  let buf = Multihashes.encode(dig, 'sha2-256');
  let ipfsHash = Multihashes.toB58String(buf);
  return ipfsHash;
}
