import React from 'react'
import { ipfs } from '../lib/ipfs-util'
import { SafeLink } from '@aragon/ui'

class IpfsIsConnected extends React.Component {
  constructor(props) {
    super(props)
    this.state = { connected: true }
  }

  componentDidMount() {
    const checkPeers = () => {
      try {
        ipfs.swarm
          .peers()
          .then(peers => {
            console.log(peers.length + ' IPFS peers')
            this.setState({ connected: true, peers: peers.length })
          })
          .catch(e => this.setState({ connected: false }))
      } catch (e) {
        this.setState({ connected: false })
      }
    }
    this.interval = setInterval(checkPeers, 5000)
  }

  componentWillUnmount() {
    clearInterval(this.interval)
  }

  render() {
    return !this.state.connected ? (
      <div style={{ color: 'red' }}>
        ⚠ Warning: IPFS daemon is not running or is not available in your
        computer. Please{' '}
        <SafeLink href="https://dist.ipfs.io/#go-ipfs" target="_blank">
          <strong>install it</strong>
        </SafeLink>{' '}
        and run <strong>ipfs daemon</strong> on your console.
      </div>
    ) : this.state.peers === 0 ? (
      <div style={{ color: 'red' }}>
        ⚠ Warning: IPFS is not connected to any peer. The content of your edits
        is not going to be propagated. Please, check your internet connection.
      </div>
    ) : null
  }
}

export default IpfsIsConnected
