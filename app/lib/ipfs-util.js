import { Buffer } from 'buffer'
import Multihashes from 'multihashes'
import ipfsAPI from 'ipfs-http-client'

var ipfs = ipfsAPI('localhost', '5001', { protocol: 'http' })

export function ipfsToHex(ipfsHash) {
  let buf = Multihashes.fromB58String(ipfsHash)
  let dig = Multihashes.decode(buf).digest
  let hex = '0x' + Multihashes.toHexString(dig)
  return hex
}

export function hexToIpfs(hex) {
  let dig = Multihashes.fromHexString(hex.substring(2))
  let buf = Multihashes.encode(dig, 'sha2-256')
  let ipfsHash = Multihashes.toB58String(buf)
  return ipfsHash
}

export function save(title, text) {
  const file = `# ${title}

${text}
`
  return ipfs
    .add(Buffer.from(file, 'utf-8'))
    .then(value => ipfs.pin.add(value[0].hash))
    .then(value => {
      console.log('http://localhost:8080/ipfs/' + value[0].hash)
      let hex = ipfsToHex(value[0].hash)
      return hex
    })
}

const withoutTitle = string => string.substring(string.indexOf('\n') + 2)

export function get(hash) {
  return ipfs
    .get(hash)
    .then(value => withoutTitle(value[0].content.toString('utf-8')))
}
